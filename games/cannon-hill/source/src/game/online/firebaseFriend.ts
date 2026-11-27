import { initializeApp } from '@firebase/app';
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, type Auth } from '@firebase/auth';
import { connectDatabaseEmulator, get, getDatabase, limitToLast, onDisconnect, onValue, orderByChild, push, query, ref, remove, runTransaction, serverTimestamp, set, update, type Database, type DataSnapshot, type Unsubscribe } from '@firebase/database';
import { Battle, defaultConfig } from '../combat/battle';
import type { BattleConfig, Team } from '../combat/types';
import { DT } from '../config/constants';
import { CHARACTERS } from '../data/characters';
import { MAPS } from '../data/maps';
import { firebaseProject } from './firebaseConfig';
import { DUEL_ACCOUNT_DOMAIN, FRIEND_BALANCE_RULESET, FRIEND_BRANCH, FRIEND_FAST_CHARGE_RULESET, FRIEND_MODES, isFriendMode, OnlineError, RECONNECT_MS, ROOM_DURATION_MS, ROOM_LIST_LIMIT, ROOM_WAIT_MS, type Control, type FriendMode, type OnlineRoom, type OnlineState, type Profile, type PublicRoom, type RatingChange, type ReplayCommand } from './protocol';
import { FirebaseRank } from './firebaseRank';
import { confirmedChargePower } from './charge';
import { startingRank } from './rank';

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const activeKey = 'jpml.warureu.friend.room.';
const leasePeriod = 8_000;
const clockPublishMs = 48;
const commandWriteWindow = 4;
const invalidLogin = { 'auth/email-already-in-use':'이미 사용 중인 아이디예요.',
  'auth/invalid-credential':'아이디 또는 비밀번호를 확인해 주세요.',
  'auth/too-many-requests':'요청이 많아요. 잠시 후 다시 시도해 주세요.' } as Record<string,string>;
const characters = new Set(CHARACTERS.map(c=>c.id));
const maps = new Set(MAPS.map(m=>m.id));

type Name = { uid: string; nickname: string; char: string };
type Info = Name & { map: string; seed: number; created: number; listed?: boolean; mode?: FriendMode; ruleset?: number; ranked?: true };
type Head = { step: number; turn: number; cursor: number; done: boolean; ack: string; writer: string };
type Packet = { turn: number; player?: Team; receivedAt?: number; control: Control | {kind:'leave'} };
type Room = {
  code: string;
  you: Team;
  info: Info;
  mode: FriendMode;
  members: (Name | null)[];
  head: Head | null;
  log: DataSnapshot | null;
  config: BattleConfig | null;
  ranks?: number[];
  rating?: RatingChange;
  settling?: boolean;
  settleAgain?: boolean;
  inbox: Record<string,Packet>;
  presence: Record<string,Record<string,boolean>>;
};

const keyOf = (i:number) => 'c'+String(i).padStart(7,'0');
const readActive = (uid:string) => localStorage.getItem(activeKey+uid);
const seatsOf = (mode:FriendMode) => FRIEND_MODES[mode].seats;
const playerPath = (mode:FriendMode, player:number) => mode==='duel'?'guest':'seats/p'+player;
const memberState = (info:Info, mode:FriendMode, guests:DataSnapshot): (Name|null)[] =>
  Array.from({length:seatsOf(mode)},(_,player)=>player===0?info:
    (mode==='duel'?guests:guests.child('p'+player)).val() as Name|null);

export class FirebaseFriend {
  private readonly auth: Auth;
  private readonly db: Database;
  private readonly rank: FirebaseRank;
  private readonly tab = sessionStorage.getItem('jpml.warureu.friend.tab') ?? crypto.randomUUID();
  private readonly gameRef: string = FRIEND_BRANCH;
  private readonly unsubscribers: Unsubscribe[] = [];
  private connected = false;
  private offset = 0;
  private nickname = '';
  private rankProfile: Profile | null = null;
  private rankPollAt = 0;
  private matchingRank = false;
  private transferringRoom: Room | null = null;
  private selection: Room | null = null;
  private openRooms: PublicRoom[] = [];
  private stopListings: Unsubscribe | null = null;
  private hostBattle: Battle | null = null;
  private lastTick = 0;
  private remainder = 0;
  private ack = '';
  private sent = 0;
  private submittedAck = '';
  private submittedTurn = 0;
  private currentLease = 0;
  private lastLeaseAttempt = 0;
  private renewing = false;
  private hostTimer = 0;
  private pendingCommandWrites = 0;
  private submittedDone = false;
  private pendingClockWrites = 0;
  private rejectedWrite = false;
  private lastPublish = 0;
  private readonly missingSince = new Map<number,number>();
  private readonly chargeSamples = new Map<number,number>();
  private chargeReceivedAt: number | null = null;
  private notifyQueued = false;
  private failure = '';

  constructor(private readonly changed: () => void) {
    sessionStorage.setItem('jpml.warureu.friend.tab',this.tab);
    const emulator = import.meta.env.VITE_WARUREU_FIREBASE_EMULATOR === '1';
    const app = initializeApp(emulator?{...firebaseProject,projectId:'demo-warureu',databaseURL:'http://127.0.0.1:9018?ns=demo-warureu'}:firebaseProject,'warureu-friendly-v1');
    this.auth = getAuth(app);
    this.db = getDatabase(app);
    this.rank = new FirebaseRank(this.db);
    if(emulator) {
      connectAuthEmulator(this.auth,'http://127.0.0.1:9196',{disableWarnings:true});
      connectDatabaseEmulator(this.db,'127.0.0.1',9018);
    }
  }

  private get uid(): string {
    const uid=this.auth.currentUser?.uid;
    if(!uid)throw new OnlineError(401,'다시 로그인해 주세요.');
    return uid;
  }

  private at(path: string) { return ref(this.db,this.gameRef+'/'+path); }

  private async authenticate(body: Record<string,unknown>, register:boolean): Promise<{token:string}> {
    const id=typeof body.id==='string'?body.id.trim().toLowerCase():'';
    const password=typeof body.password==='string'?body.password:'';
    const nickname=typeof body.nickname==='string'?body.nickname.trim().normalize():'';
    if(!/^[a-z0-9_]{3,20}$/.test(id)||password.length<8||password.length>80)
      throw new OnlineError(400,'아이디는 영문·숫자·밑줄 3~20자, 비밀번호는 8~80자예요.');
    if(register&&!/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{2,12}$/.test(nickname))
      throw new OnlineError(400,'닉네임은 한글·영문·숫자 등 2~12자로 입력해 주세요.');
    const identity=id+'@'+DUEL_ACCOUNT_DOMAIN;
    try {
      const credentials=register
        ? await createUserWithEmailAndPassword(this.auth,identity,password)
        : await signInWithEmailAndPassword(this.auth,identity,password);
      if(register) {
        try { await set(this.at('profiles/'+credentials.user.uid),nickname); }
        catch (error) { await credentials.user.delete().catch(()=>{}); throw error; }
      }
    } catch (error) {
      const code=(error as {code?: string}).code ?? '';
      throw new OnlineError(400,invalidLogin[code]??'계정을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
    this.nickname=register?nickname:'';
    this.rankProfile=null;
    return {token:this.uid};
  }

  async request(action: string, values?: object): Promise<unknown> {
    const body=values as Record<string,unknown>|undefined;
    await this.auth.authStateReady();
    if(action==='register'||action==='login') return this.authenticate(body??{},action==='register');
    const uid=this.uid;
    if(action.startsWith('state?')) {
      if(!this.nickname) {
        this.nickname=(await get(this.at('profiles/'+uid))).val()??'';
        if(!this.nickname) throw new OnlineError(401,'계정 정보를 불러오지 못했어요. 다시 로그인해 주세요.');
      }
      if(!this.rankProfile)this.rankProfile=await this.rank.profile({uid,nickname:this.nickname});
      const params=new URLSearchParams(action.slice(6));
      const code=readActive(uid);
      if(code&&!this.selection)await this.enter(code).catch(()=>localStorage.removeItem(activeKey+uid));
      if(!this.selection&&!this.stopListings)this.watchListings();
      if(this.selection)this.seekRanked(this.selection);
      const cursor=this.selection?.code===params.get('code')?Math.max(0,Number(params.get('cursor'))||0):0;
      return this.state(cursor);
    }
    if(action==='logout') {
      this.close();
      await signOut(this.auth);
      this.nickname='';
      this.rankProfile=null;
    } else if(action==='ranking') {
      return this.rank.board();
    } else if(action==='create'||action==='join'||action==='queue') {
      const char=String(body?.char);
      if(!characters.has(char))throw new OnlineError(400,'플레이할 장수를 골라 주세요.');
      if(this.selection)throw new OnlineError(409,'이미 참가한 방이 있어요.');
      if(action!=='join') {
        const ranked=action==='queue';
        const choice=ranked?'random':String(body?.map);
        if(choice!=='random'&&!maps.has(choice))throw new OnlineError(400,'전장을 골라 주세요.');
        const bytes=crypto.getRandomValues(new Uint32Array(8));
        const map=choice==='random'?MAPS[bytes[7]!%MAPS.length]!.id:choice;
        const code=Array.from(bytes.slice(0,6),n=>alphabet[n%alphabet.length]).join('');
        const mode=!ranked&&isFriendMode(body?.mode)?body.mode:'duel';
        await set(this.at('rooms/'+code+'/info'),{uid,nickname:this.nickname,char,map,seed:bytes[6]!%2147483646+1,
          created:serverTimestamp(),listed:!ranked&&body?.listed===true,mode,ruleset:FRIEND_FAST_CHARGE_RULESET,...(ranked?{ranked:true}:{})});
        await this.enter(code);
      } else {
        const code=String(body?.code??'').trim().toUpperCase();
        if(!/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/.test(code))throw new OnlineError(400,'방 코드 6자리를 확인해 주세요.');
        try {
          const info:Info|null=(await get(this.at('rooms/'+code+'/info'))).val();
          if(!info||!maps.has(info.map)||info.ranked)throw new Error();
          if(info.uid!==uid) await this.join(code,info,char,body?.listedOnly===true);
          await this.enter(code);
        } catch { throw new OnlineError(404,'참가할 수 있는 방을 찾지 못했어요.'); }
      }
    } else if(action==='leave') {
      await this.leave();
    }
    return {ok:true};
  }

  private seekRanked(room:Room):void {
    if(!room.info.ranked||room.you!==0||room.config||!this.connected||this.matchingRank||performance.now()<this.rankPollAt)return;
    this.rankPollAt=performance.now()+1400;
    this.matchingRank=true;
    void this.matchEarlier(room).catch(()=>{}).finally(()=>{this.matchingRank=false;});
  }

  private async matchEarlier(room:Room):Promise<void> {
    const now=Date.now()+this.offset;
    const waiting=await this.rank.waiting(now);
    for(const {code,created} of waiting) {
      if(this.selection!==room||room.config)return;
      if(created>room.info.created||created===room.info.created&&code>=room.code)continue;
      const info:Info|null=(await get(this.at('rooms/'+code+'/info'))).val();
      if(this.selection!==room||!info?.ranked||info.ruleset!==FRIEND_FAST_CHARGE_RULESET||info.uid===this.uid||room.config)continue;
      try {
        this.transferringRoom=room;
        await update(ref(this.db,this.gameRef),{
          ['rooms/'+room.code]:null,
          ['rankedQueue/'+room.code]:null,
          ['rooms/'+code+'/guest']:{uid:this.uid,nickname:this.nickname,char:room.info.char,ruleset:FRIEND_FAST_CHARGE_RULESET,ranked:true,fastCharge:true},
          ['rankedQueue/'+code]:null,
        });
      } catch { continue; }
      finally {this.transferringRoom=null;}
      await this.enter(code);
      this.notify();
      return;
    }
  }

  reportRanked(winner:-1|0|1):void {
    const room=this.selection;
    if(!room?.info.ranked||!room.head?.done)return;
    void this.rank.confirm(room.code,this.uid,winner).then(()=>this.settleRanked(room)).catch(()=>{});
  }

  private settleRanked(room:Room):void {
    const [host,guest]=room.members;
    if(!host||!guest||room.rating||this.selection!==room)return;
    if(room.settling){room.settleAgain=true;return;}
    room.settling=true;
    void this.rank.settle(room.code,[host,guest]).catch(()=>{}).finally(()=>{
      room.settling=false;
      if(room.settleAgain){room.settleAgain=false;this.settleRanked(room);}
    });
  }

  async command(code:string, turn:number, control:Control):Promise<void> {
    const room=this.selection;
    if(!room || room.code!==code || !this.playConnected(room))throw new OnlineError(409,'지금은 조작할 수 없어요.');
    const packet:Packet={turn,control};
    const timed=control.kind==='startCharge'||control.kind==='releaseCharge';
    if(room.you===0) {
      if(timed)packet.receivedAt=Date.now()+this.offset;
      this.apply(0,packet);
      this.publish(room);
    } else {
      if(room.mode!=='duel') packet.player=room.you;
      await set(push(this.at('rooms/'+code+'/inbox')),timed?{...packet,receivedAt:serverTimestamp()}:packet);
    }
  }

  private async join(code:string,info:Info,char:string,listedOnly:boolean):Promise<void> {
    const mode=info.mode??'duel';
    const root='rooms/'+code+'/';
    const members=this.at(root+(mode==='duel'?'guest':'seats'));
    const guest={uid:this.uid,nickname:this.nickname,char,...(info.ruleset?{ruleset:info.ruleset}:{}),
      ...(info.ruleset===FRIEND_FAST_CHARGE_RULESET?{fastCharge:true}:{}),...(listedOnly?{listedOnly:true}:{})};
    for(let attempt=1;attempt<seatsOf(mode);attempt++) {
      const roster=memberState(info,mode,await get(members));
      if(roster.some(member=>member?.uid===this.uid))return;
      const seat=roster.indexOf(null);
      if(seat<1)break;
      const path=root+playerPath(mode,seat);
      try {
        if(mode==='duel'&&info.listed) await update(ref(this.db,this.gameRef),{[path]:guest,['listings/'+code]:null});
        else await set(this.at(path),guest);
        return;
      } catch {
        // Another guest may have filled this place while we were joining.
      }
    }
    const roster=memberState(info,mode,await get(members));
    if(!roster.some(member=>member?.uid===this.uid))throw new Error('Room is full or closed');
  }

  private watchListings():void {
    const newest=query(this.at('listings'),orderByChild('created'),limitToLast(ROOM_LIST_LIMIT));
    this.stopListings=onValue(newest,snapshot=>{
      const rooms:PublicRoom[]=[];
      snapshot.forEach(item=>{
        const {nickname,map,created,mode}=item.val() as Omit<PublicRoom,'code'>;
        if(maps.has(map))rooms.push({code:item.key!,nickname,map,created,mode:isFriendMode(mode)?mode:undefined});
      });
      this.openRooms=rooms.reverse();
    },()=>{this.openRooms=[];});
  }

  private async enter(code:string):Promise<void> {
    const root='rooms/'+code+'/';
    const data:Info|null=(await get(this.at(root+'info'))).val();
    if(!data||!maps.has(data.map)||!characters.has(data.char)||Date.now()-data.created>ROOM_DURATION_MS)
      throw new OnlineError(404,'이미 종료된 방이에요.');
    const mode=data.mode??'duel';
    const memberRef=this.at(root+(mode==='duel'?'guest':'seats'));
    const members=memberState(data,mode,await get(memberRef));
    const uid=this.uid;
    const you=members.findIndex(member=>member?.uid===uid);
    if(you<0)throw new OnlineError(404,'이미 종료된 방이에요.');
    this.close();
    const room:Room={code,you:you as Team,info:data,mode,members,head:null,log:null,config:null,inbox:{},presence:{}};
    this.selection=room;
    this.setMembers(room,members);
    localStorage.setItem(activeKey+uid,code);
    const marker=this.at(root+'presence/'+uid+'/'+this.tab);
    const listenError=()=>{
      if(this.selection!==room)return;
      this.failure='방 연결을 잃었어요. 다시 입장해 주세요.';
      this.notify();
    };
    this.unsubscribers.push(
      onValue(ref(this.db,'.info/serverTimeOffset'),s=>{this.offset=s.val()??0;}),
      onValue(ref(this.db,'.info/connected'),s=>{
        this.connected=s.val()===true;
        this.notify();
        if(this.connected)void onDisconnect(marker).remove().then(async()=>{
          if(this.selection!==room)return;
          await set(marker,true);
          if(this.selection===room)this.updateListing(room);
        }).catch(listenError);
      }),
      onValue(this.at(root+'info'),s=>{
        if(!s.exists()&&this.selection===room&&this.transferringRoom!==room) {
          localStorage.removeItem(activeKey+uid);
          this.close();
          this.notify();
        }
      },listenError),
      onValue(memberRef,s=>{
        this.setMembers(room,memberState(data,mode,s));
        this.updateListing(room);
        this.notify();
      },listenError),
      onValue(this.at(root+'wire'),s=>{
        room.head=s.child('head').val() as Head|null;
        // Keep the tree and decode new commands only. Clock updates share the log.
        room.log=s.child('log');
        this.notify();
      },listenError),
      onValue(this.at(root+'presence'),s=>{room.presence=s.val()??{};this.notify();},listenError),
    );
    if(room.you===0) {
      this.unsubscribers.push(onValue(this.at(root+'inbox'),s=>{
        room.inbox=s.val()??{};
        // Drive after Firebase has delivered this update's other local events.
        if(Object.keys(room.inbox).some(key=>key>this.ack)){
          queueMicrotask(()=>{if(this.selection===room)this.drive(room);});
        }
      },listenError));
      this.hostTimer=window.setInterval(()=>this.drive(room),1000*DT);
    }
    if(room.info.ranked){
      for(const branch of ['verdicts','withdrawals'])this.unsubscribers.push(onValue(this.at(root+branch),s=>{
        if(s.exists())this.settleRanked(room);
      },listenError));
      this.unsubscribers.push(onValue(this.at('rankedResults/'+code),s=>{
        if(!s.exists()||this.selection!==room)return;
        room.rating=this.rank.change(s.val(),room.you===0?0:1);
        void this.rank.profile({uid,nickname:this.nickname}).then(profile=>{
          if(this.auth.currentUser?.uid===uid){this.rankProfile=profile;this.notify();}
        }).catch(()=>{});
        this.notify();
      },listenError));
    }
  }

  private notify():void {
    if(this.notifyQueued)return;
    this.notifyQueued=true;
    queueMicrotask(()=>{
      this.notifyQueued=false;
      this.changed();
    });
  }

  private setMembers(room:Room,members:(Name|null)[]):void {
    room.members=members.map(member=>member&&characters.has(member.char)?member:null);
    const {map,seed,ruleset}=room.info;
    const chars=room.members.map(member=>member?.char);
    room.config=chars.every((char):char is string=>!!char) ? defaultConfig({
      mapId:map,seed,chars,controllers:chars.map(()=>'human'),turnTime:25,turnLimit:0,
      freeForAll:FRIEND_MODES[room.mode].freeForAll,legacyPoison:ruleset===undefined,legacyBalance:(ruleset??0)<FRIEND_BALANCE_RULESET,
    }) : null;
    if(room.config&&!room.ranks)void Promise.all(room.members.map(player=>this.rank.profile(player!))).then(rows=>{
      if(this.selection===room){room.ranks=rows.map(row=>row.rating);this.notify();}
    }).catch(()=>{});
  }

  private updateListing(room:Room):void {
    if(!this.connected||room.you!==0||!room.info.listed&&!room.info.ranked)return;
    if(room.info.ranked){
      if(!room.config&&!room.head)void this.listRoom(room).then(()=>this.seekRanked(room));
      return;
    }
    if(room.config||room.head)void remove(this.at('listings/'+room.code)).catch(()=>{});
    else void this.listRoom(room);
  }

  private async listRoom(room:Room):Promise<void> {
    const entry=this.at((room.info.ranked?'rankedQueue/':'listings/')+room.code);
    const {nickname,map,created,mode}=room.info;
    if(Date.now()+this.offset-created>=ROOM_WAIT_MS)return;
    try {
      await onDisconnect(entry).remove();
      if(this.selection===room&&!room.config&&!room.head)await set(entry,room.info.ranked?
        {created,ruleset:room.info.ruleset}:{nickname,map,created,...(mode?{mode}:{})});
    } catch {
      // A visitor may have joined while the browser reconnected.
    }
  }

  close():void {
    const room=this.selection;
    if(room&&this.auth.currentUser) {
      const marker=this.at('rooms/'+room.code+'/presence/'+this.uid+'/'+this.tab);
      void remove(marker).catch(()=>{});
      if(room.you===0&&this.connected)void runTransaction(this.at('rooms/'+room.code+'/leader'),data=>data?.key===this.tab?null:undefined).catch(()=>{});
    }
    for(const stop of this.unsubscribers.splice(0))stop();
    window.clearInterval(this.hostTimer);
    this.stopListings?.();
    this.stopListings=null;
    this.openRooms=[];
    this.selection=null;
    this.hostBattle=null;
    this.connected=false;
    this.currentLease=0;
    this.lastLeaseAttempt=0;
    this.failure='';
    this.pendingCommandWrites=0;
    this.pendingClockWrites=0;
    this.ack='';
    this.submittedDone=false;
    this.rejectedWrite=false;
    this.lastPublish=0;
    this.renewing=false;
    this.missingSince.clear();
    this.chargeSamples.clear();
    this.chargeReceivedAt=null;
  }

  private present(room:Room,player:number):boolean {
    const uid=room.members[player]?.uid;
    return !!uid&&Object.keys(room.presence[uid]??{}).length>0;
  }

  private playConnected(room:Room):boolean {
    return this.connected&&(room.mode==='duel'?this.present(room,1-room.you):room.you===0||this.present(room,0));
  }

  roomState(code:string,cursor:number):OnlineState|null {
    if(this.selection?.code!==code)return null;
    this.seekRanked(this.selection);
    return this.state(cursor);
  }

  private state(cursor:number):OnlineState {
    const room=this.selection;
    if(!room) return {profile:this.profile(),queued:false,room:null,
      rooms:this.openRooms.filter(entry=>Date.now()+this.offset-entry.created<ROOM_WAIT_MS)};
    if(this.failure)throw new Error(this.failure);
    const {head,log}=room;
    const commands:ReplayCommand[]=[];
    for(let i=cursor;i<(head?.cursor??0);i++) {
      const command=log?.child(keyOf(i)).val() as ReplayCommand|null;
      if(!command)break;
      commands.push({...command,a:Array.isArray(command.a)?command.a:[]});
    }
    const view:OnlineRoom={code:room.code,kind:room.info.ranked?'ranked':'friendly',you:room.you,names:room.members.flatMap(member=>member?[member.nickname]:[]),
      map:room.info.map,listed:room.info.listed===true,
      mode:room.mode,connectedSeats:room.members.map((_,player)=>this.present(room,player)),
      config:head?room.config:null,turn:head?.turn??1,step:head?.step??0,cursor:head?.cursor??0,commands,
      opponentConnected:this.playConnected(room),done:head?.done??false,rating:room.rating??null,ranks:room.ranks,
      fastCharge:room.info.ruleset===FRIEND_FAST_CHARGE_RULESET};
    return {profile:this.profile(),queued:room.info.ranked===true&&!head,room:view,rooms:[]};
  }

  private profile() {
    return this.rankProfile??startingRank(this.nickname);
  }

  private lease(room:Room,now:number):boolean {
    if(this.currentLease<now+leasePeriod/2&&!this.renewing&&now-this.lastLeaseAttempt>=500){
      this.lastLeaseAttempt=now;
      this.renewing=true;
      void runTransaction(this.at('rooms/'+room.code+'/leader'), current=>
        !current||current.key===this.tab||now-current.at>=leasePeriod ? {key:this.tab,at:serverTimestamp()} : undefined)
        .then(result=>{
          if(this.selection!==room)return;
          const value=result.snapshot.val();
          if(result.committed&&value?.key===this.tab)this.currentLease=value.at+leasePeriod;
          else this.hostBattle=null;
        }).catch(()=>{if(this.selection===room)this.hostBattle=null;})
        .finally(()=>{if(this.selection===room)this.renewing=false;});
    }
    return this.currentLease>now;
  }

  private drive(room:Room):void {
    const {config,head,log}=room;
    if(!this.connected||!config||!log||head?.done||this.submittedDone||this.rejectedWrite)return;
    if(!head&&room.members.some((_,player)=>!this.present(room,player)))return;
    const now=Date.now()+this.offset;
    if(!this.lease(room,now))return;
    if(!this.hostBattle) {
      const b=new Battle(config);
      this.ack=head?.ack??'';
      this.submittedAck=this.ack;
      this.submittedTurn=head?.turn??-1;
      this.sent=head?.cursor??0;
      this.lastTick=performance.now();
      this.remainder=0;
      this.chargeSamples.clear();
      this.chargeReceivedAt=null;
      for(let i=0;i<this.sent;i++) {
        const command=log.child(keyOf(i)).val() as ReplayCommand|null;
        if(!command)return;
        while(b.stepNo<command.s) {
          b.step();
          this.sampleCharge(b);
        }
        b.applyCommand(command.c,Array.isArray(command.a)?command.a:[]);
        this.sampleCharge(b);
      }
      while(b.stepNo<(head?.step??0)) {
        b.step();
        this.sampleCharge(b);
      }
      this.hostBattle=b;
    }
    const b=this.hostBattle;
    for(const [key,packet] of Object.entries(room.inbox).sort(([a],[b])=>a<b?-1:1)) {
      if(key<=this.ack)continue;
      this.apply(packet.player??1,packet);
      this.ack=key;
    }
    for(const f of b.fighters) {
      if(f.idx===0||!f.alive||this.present(room,f.idx)) {
        this.missingSince.delete(f.idx);
      } else {
        const since=this.missingSince.get(f.idx)??now;
        this.missingSince.set(f.idx,since);
        if(now-since>=RECONNECT_MS)b.forfeit(f.idx);
      }
    }
    const dt=Math.min(.25,(performance.now()-this.lastTick)/1000);
    this.lastTick=performance.now();
    const paused=room.mode==='duel'?this.missingSince.has(1):this.missingSince.has(b.current);
    if(paused&&b.isPlayerPhase()) {
      b.setMove(0); b.setAim(0); b.cancelCharge();
      this.sampleCharge(b);
    } else {
      this.remainder+=dt;
      while(this.remainder>=DT&&b.winner===null) {
        b.step();
        this.sampleCharge(b);
        this.remainder-=DT;
      }
    }
    b.drainEvents();
    b.terrain.dirty.length=0;
    this.publish(room);
  }

  private sampleCharge(b:Battle):void {
    if(b.phase==='CHARGE') {
      this.chargeSamples.set(b.stepNo,b.cur.power);
    } else {
      this.chargeSamples.clear();
      this.chargeReceivedAt=null;
    }
  }

  private apply(player:number,packet:Packet):void {
    const b=this.hostBattle;
    if(!b||b.winner!==null)return;
    const c=packet.control;
    if(c.kind==='leave') {b.forfeit(player);this.sampleCharge(b);return;}
    if(b.current!==player||b.turnNo!==packet.turn||!b.isPlayerPhase())return;
    switch(c.kind){
      case 'input': b.setMove(c.move); b.setAim(c.aim); break;
      case 'slot': b.selectWeapon(c.slot); break;
      case 'fire':
        if(b.phase==='CHARGE')b.fireNow(this.chargeSamples.get(c.step)??b.cur.power);
        else b.setCharge(true);
        this.sampleCharge(b);
        break;
      case 'startCharge':
        if(b.phase!=='CHARGE'){
          b.setCharge(true);
          this.chargeReceivedAt=packet.receivedAt??null;
          this.sampleCharge(b);
        }
        break;
      case 'releaseCharge':
        if(b.phase==='CHARGE'){
          const elapsed=this.chargeReceivedAt!==null&&packet.receivedAt!==undefined
            ? packet.receivedAt-this.chargeReceivedAt : b.phaseT*1000;
          b.fireNow(confirmedChargePower(c.holdMs,elapsed));
          this.sampleCharge(b);
        }
        break;
      case 'cancel': b.cancelCharge(); this.sampleCharge(b); break;
      case 'flip': if(b.phase!=='CHARGE')b.setAngle(180-b.cur.angle); break;
    }
  }

  private publish(room:Room):void {
    const b=this.hostBattle;
    if(!b||this.rejectedWrite||this.submittedDone||room.head?.done||!this.connected)return;
    const previousAck=this.submittedAck;
    const cursor=b.log.length;
    const done=b.winner!==null;
    const important=cursor!==this.sent||this.ack!==previousAck||done||b.turnNo!==this.submittedTurn;
    const now=performance.now();
    const interval=b.phase==='AIM'&&!b.input.move&&!b.input.aim?120:clockPublishMs;
    if(!important&&(b.stepNo===room.head?.step||now-this.lastPublish<interval||this.pendingClockWrites>=2))return;
    // This connection sends multi-path updates in order. Reserve this log
    // suffix at submission so the next input can append its own suffix.
    if(important&&this.pendingCommandWrites>=commandWriteWindow)return;
    if(important)this.pendingCommandWrites++;
    else this.pendingClockWrites++;
    this.lastPublish=now;
    const patch:Record<string,unknown>={'wire/head':{
      step:b.stepNo,turn:b.turnNo,cursor,done,ack:this.ack,writer:this.tab,
    }};
    for(let i=this.sent;i<cursor;i++)patch['wire/log/'+keyOf(i)]=b.log[i];
    if(this.ack!==previousAck)for(const key of Object.keys(room.inbox))if(key<=this.ack)patch['inbox/'+key]=null;
    this.sent=cursor;
    this.submittedAck=this.ack;
    this.submittedTurn=b.turnNo;
    this.submittedDone=done;
    void update(this.at('rooms/'+room.code),patch).catch(()=>{
      if(this.selection===room)this.rejectedWrite=true;
    }).finally(()=>{
      if(this.selection!==room)return;
      if(important)this.pendingCommandWrites--;
      else this.pendingClockWrites--;
      if(this.rejectedWrite&&!this.pendingCommandWrites&&!this.pendingClockWrites) {
        this.hostBattle=null;
        this.submittedDone=false;
        this.rejectedWrite=false;
      }
    });
  }

  private async leave():Promise<void> {
    const room=this.selection;
    if(room&&this.connected) {
      if(!room.head) {
        const path='rooms/'+room.code;
        if(room.you!==0)await remove(this.at(path+'/'+playerPath(room.mode,room.you)));
        else if(room.info.ranked)await update(ref(this.db,this.gameRef),{[path]:null,['rankedQueue/'+room.code]:null});
        else if(room.info.listed)await update(ref(this.db,this.gameRef),{[path]:null,['listings/'+room.code]:null});
        else await remove(this.at(path));
      } else if(!room.head.done) {
        if(room.info.ranked){
          await this.rank.withdraw(room.code,this.uid);
          const [host,guest]=room.members;
          if(host&&guest)await this.rank.settle(room.code,[host,guest]);
        }
        if(room.you!==0) await set(push(this.at('rooms/'+room.code+'/inbox')),{
          turn:0,control:{kind:'leave'},...(room.mode==='duel'?{}:{player:room.you}),
        });
        else if(this.hostBattle) {
          this.hostBattle.forfeit(0);
          const until=performance.now()+3000;
          while(!room.head?.done&&performance.now()<until) {
            this.publish(room);
            await new Promise(resolve=>setTimeout(resolve,80));
          }
        }
      }
    }
    localStorage.removeItem(activeKey+this.uid);
    if(room?.info.ranked)this.rankProfile=null;
    this.close();
  }
}
