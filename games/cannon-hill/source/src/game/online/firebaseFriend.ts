import { initializeApp } from '@firebase/app';
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, type Auth } from '@firebase/auth';
import { connectDatabaseEmulator, get, getDatabase, onDisconnect, onValue, push, ref, remove, runTransaction, serverTimestamp, set, update, type Database, type Unsubscribe } from '@firebase/database';
import { Battle, defaultConfig } from '../combat/battle';
import { DT } from '../config/constants';
import { CHARACTERS } from '../data/characters';
import { MAPS } from '../data/maps';
import { firebaseProject } from './firebaseConfig';
import { DUEL_ACCOUNT_DOMAIN, FRIEND_BRANCH, OnlineError, RECONNECT_MS, ROOM_DURATION_MS, STARTING_RATING, type Control, type OnlineRoom, type OnlineState, type ReplayCommand } from './protocol';

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const activeKey = 'jpml.warureu.friend.room.';
const leasePeriod = 8_000;
const invalidLogin = { 'auth/email-already-in-use':'이미 사용 중인 아이디예요.',
  'auth/invalid-credential':'아이디 또는 비밀번호를 확인해 주세요.',
  'auth/too-many-requests':'요청이 많아요. 잠시 후 다시 시도해 주세요.' } as Record<string,string>;
const characters = new Set(CHARACTERS.map(c=>c.id));
const maps = new Set(MAPS.map(m=>m.id));

type Name = { uid: string; nickname: string; char: string };
type Info = Name & { map: string; seed: number; created: number };
type Head = { step: number; turn: number; cursor: number; done: boolean; ack: string; writer: string };
type Wire = { head?: Head; log?: Record<string,ReplayCommand> };
type Packet = { turn: number; control: Control | {kind:'leave'} };
type Room = {
  code: string;
  you: 0 | 1;
  info: Info;
  guest: Name | null;
  wire: Wire;
  inbox: Record<string,Packet>;
  presence: Record<string,Record<string,boolean>>;
};

const keyOf = (i:number) => 'c'+String(i).padStart(7,'0');
const readActive = (uid:string) => localStorage.getItem(activeKey+uid);

export class FirebaseFriend {
  private readonly auth: Auth;
  private readonly db: Database;
  private readonly tab = sessionStorage.getItem('jpml.warureu.friend.tab') ?? crypto.randomUUID();
  private readonly gameRef: string = FRIEND_BRANCH;
  private readonly unsubscribers: Unsubscribe[] = [];
  private connected = false;
  private offset = 0;
  private nickname = '';
  private selection: Room | null = null;
  private hostBattle: Battle | null = null;
  private lastTick = 0;
  private remainder = 0;
  private ack = '';
  private sent = 0;
  private currentLease = 0;
  private renewing = false;
  private publishing = false;
  private missingSince = 0;
  private failure = '';

  constructor() {
    sessionStorage.setItem('jpml.warureu.friend.tab',this.tab);
    const emulator = import.meta.env.VITE_WARUREU_FIREBASE_EMULATOR === '1';
    const app = initializeApp(emulator?{...firebaseProject,projectId:'demo-warureu',databaseURL:'http://127.0.0.1:9018?ns=demo-warureu'}:firebaseProject,'warureu-friendly-v1');
    this.auth = getAuth(app);
    this.db = getDatabase(app);
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
      const params=new URLSearchParams(action.slice(6));
      const code=readActive(uid);
      if(code&&!this.selection)await this.enter(code).catch(()=>localStorage.removeItem(activeKey+uid));
      const cursor=this.selection?.code===params.get('code')?Math.max(0,Number(params.get('cursor'))||0):0;
      return this.state(cursor);
    }
    if(action==='logout') {
      this.close();
      await signOut(this.auth);
      this.nickname='';
    } else if(action==='create'||action==='join') {
      const char=String(body?.char);
      if(!characters.has(char))throw new OnlineError(400,'플레이할 장수를 골라 주세요.');
      if(this.selection)throw new OnlineError(409,'이미 참가한 방이 있어요.');
      if(action==='create') {
        const map=String(body?.map);
        if(!maps.has(map))throw new OnlineError(400,'전장을 골라 주세요.');
        const bytes=crypto.getRandomValues(new Uint32Array(7));
        const code=Array.from(bytes.slice(0,6),n=>alphabet[n%alphabet.length]).join('');
        await set(this.at('rooms/'+code+'/info'),{uid,nickname:this.nickname,char,map,seed:bytes[6]!%2147483646+1,created:serverTimestamp()});
        await this.enter(code);
      } else {
        const code=String(body?.code??'').trim().toUpperCase();
        if(!/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/.test(code))throw new OnlineError(400,'방 코드 6자리를 확인해 주세요.');
        try {
          const info:Info|null=(await get(this.at('rooms/'+code+'/info'))).val();
          if(!info)throw new Error();
          if(info.uid!==uid) {
            try { await set(this.at('rooms/'+code+'/guest'),{uid,nickname:this.nickname,char}); }
            catch {
              const guest:Name|null=(await get(this.at('rooms/'+code+'/guest'))).val();
              if(guest?.uid!==uid)throw new Error();
            }
          }
          await this.enter(code);
        } catch { throw new OnlineError(404,'참가할 수 있는 방을 찾지 못했어요.'); }
      }
    } else if(action==='command') {
      const room=this.selection;
      if(!room||room.code!==body?.code||!this.connected||!this.opponent(room))throw new OnlineError(409,'지금은 조작할 수 없어요.');
      const packet={turn:Number(body?.turn),control:body?.control as Control};
      if(room.you===0) this.apply(0,packet);
      else await set(push(this.at('rooms/'+room.code+'/inbox')),packet);
    } else if(action==='leave') {
      await this.leave();
    }
    return {ok:true};
  }

  private async enter(code:string):Promise<void> {
    const root='rooms/'+code+'/';
    const [info,guest]=await Promise.all([get(this.at(root+'info')),get(this.at(root+'guest'))]);
    const data:Info|null=info.val();
    const other:Name|null=guest.val();
    if(!data||!maps.has(data.map)||!characters.has(data.char)||Date.now()-data.created>ROOM_DURATION_MS||
      data.uid!==this.uid&&other?.uid!==this.uid)
      throw new OnlineError(404,'이미 종료된 방이에요.');
    this.close();
    const room:Room={code,you:data.uid===this.uid?0:1,info:data,guest:other,wire:{},inbox:{},presence:{}};
    this.selection=room;
    localStorage.setItem(activeKey+this.uid,code);
    const marker=this.at(root+'presence/'+this.uid+'/'+this.tab);
    const listenError=()=>{this.failure='방 연결을 잃었어요. 다시 입장해 주세요.';};
    this.unsubscribers.push(
      onValue(ref(this.db,'.info/serverTimeOffset'),s=>{this.offset=s.val()??0;}),
      onValue(ref(this.db,'.info/connected'),s=>{
        this.connected=s.val()===true;
        if(this.connected)void onDisconnect(marker).remove().then(()=>this.selection===room?set(marker,true):undefined).catch(listenError);
      }),
      onValue(this.at(root+'guest'),s=>{
        const guest:Name|null=s.val();
        room.guest=guest&&characters.has(guest.char)?guest:null;
      },listenError),
      onValue(this.at(root+'wire'),s=>{room.wire=s.val()??{};},listenError),
      onValue(this.at(root+'presence'),s=>{room.presence=s.val()??{};},listenError),
    );
    if(room.you===0)this.unsubscribers.push(onValue(this.at(root+'inbox'),s=>{room.inbox=s.val()??{};},listenError));
  }

  close():void {
    const room=this.selection;
    if(room&&this.auth.currentUser) {
      const marker=this.at('rooms/'+room.code+'/presence/'+this.uid+'/'+this.tab);
      void remove(marker).catch(()=>{});
      if(room.you===0&&this.connected)void runTransaction(this.at('rooms/'+room.code+'/leader'),data=>data?.key===this.tab?null:undefined).catch(()=>{});
    }
    for(const stop of this.unsubscribers.splice(0))stop();
    this.selection=null;
    this.hostBattle=null;
    this.connected=false;
    this.currentLease=0;
    this.failure='';
    this.publishing=false;
    this.renewing=false;
    this.missingSince=0;
  }

  private config(room:Room) {
    const {map,seed,char}=room.info;
    return room.guest ? defaultConfig({mapId:map,seed,chars:[char,room.guest.char],controllers:['human','human'],turnTime:25,turnLimit:0}) : null;
  }

  private opponent(room:Room):boolean {
    const uid=room.you===0?room.guest?.uid:room.info.uid;
    return this.connected&&!!uid&&Object.keys(room.presence[uid]??{}).length>0;
  }

  private state(cursor:number):OnlineState {
    const room=this.selection;
    if(!room) return {profile:this.profile(),queued:false,room:null};
    if(this.failure)throw new Error(this.failure);
    const config=this.config(room);
    if(room.you===0&&config) this.drive(room,config);
    const head=room.wire.head;
    const log=room.wire.log??{};
    const commands:ReplayCommand[]=[];
    for(let i=cursor;i<(head?.cursor??0);i++) {
      const command=log[keyOf(i)];
      if(!command)break;
      commands.push({...command,a:Array.isArray(command.a)?command.a:[]});
    }
    const view:OnlineRoom={code:room.code,kind:'friendly',you:room.you,names:[room.info.nickname,...(room.guest?[room.guest.nickname]:[])],
      config,turn:head?.turn??1,step:head?.step??0,cursor:head?.cursor??0,commands,
      opponentConnected:this.opponent(room),done:head?.done??false,rating:null};
    return {profile:this.profile(),queued:false,room:view};
  }

  private profile() {
    return {nickname:this.nickname,rating:STARTING_RATING,wins:0,losses:0,draws:0};
  }

  private lease(room:Room,now:number):boolean {
    if(this.currentLease<now+leasePeriod/2&&!this.renewing){
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

  private drive(room:Room,config:ReturnType<typeof defaultConfig>):void {
    if(!this.connected||room.wire.head?.done)return;
    const now=Date.now()+this.offset;
    if(!this.lease(room,now))return;
    if(!this.hostBattle) {
      const b=new Battle(config);
      this.ack=room.wire.head?.ack??'';
      this.sent=room.wire.head?.cursor??0;
      this.lastTick=performance.now();
      this.remainder=0;
      for(let i=0;i<this.sent;i++) {
        const command=room.wire.log?.[keyOf(i)];
        if(!command)return;
        while(b.stepNo<command.s)b.step();
        b.applyCommand(command.c,Array.isArray(command.a)?command.a:[]);
      }
      while(b.stepNo<(room.wire.head?.step??0))b.step();
      this.hostBattle=b;
    }
    const b=this.hostBattle;
    for(const [key,packet] of Object.entries(room.inbox).sort(([a],[b])=>a<b?-1:1)) {
      if(key<=this.ack)continue;
      this.apply(1,packet);
      this.ack=key;
    }
    const active=this.opponent(room);
    if(active)this.missingSince=0;
    else if(!this.missingSince)this.missingSince=now;
    const dt=Math.min(.25,(performance.now()-this.lastTick)/1000);
    this.lastTick=performance.now();
    if(!active&&now-this.missingSince>=RECONNECT_MS) b.forfeit(1);
    else if(!active&&b.isPlayerPhase()) {
      b.setMove(0); b.setAim(0); b.cancelCharge();
    } else {
      this.remainder+=dt;
      while(this.remainder>=DT&&b.winner===null) {
        b.step();
        this.remainder-=DT;
      }
    }
    b.drainEvents();
    if(b.stepNo!==room.wire.head?.step||b.log.length!==this.sent||this.ack!==(room.wire.head?.ack??''))this.publish(room);
  }

  private apply(player:number,packet:Packet):void {
    const b=this.hostBattle;
    if(!b||b.winner!==null)return;
    const c=packet.control;
    if(c.kind==='leave') {b.forfeit(player);return;}
    if(b.current!==player||b.turnNo!==packet.turn||!b.isPlayerPhase())return;
    switch(c.kind){
      case 'input': b.setMove(c.move); b.setAim(c.aim); break;
      case 'slot': b.selectWeapon(c.slot); break;
      case 'fire': b.setCharge(b.phase!=='CHARGE'); break;
      case 'cancel': b.cancelCharge(); break;
      case 'flip': if(b.phase!=='CHARGE')b.setAngle(180-b.cur.angle); break;
    }
  }

  private publish(room:Room):void {
    const b=this.hostBattle;
    if(!b||this.publishing)return;
    this.publishing=true;
    const previousAck=room.wire.head?.ack??'';
    const cursor=b.log.length;
    const patch:Record<string,unknown>={'wire/head':{
      step:b.stepNo,turn:b.turnNo,cursor,done:b.winner!==null,ack:this.ack,writer:this.tab,
    }};
    for(let i=this.sent;i<cursor;i++)patch['wire/log/'+keyOf(i)]=b.log[i];
    if(this.ack!==previousAck)for(const key of Object.keys(room.inbox))if(key<=this.ack)patch['inbox/'+key]=null;
    void update(this.at('rooms/'+room.code),patch).then(()=>{if(this.selection===room)this.sent=cursor;})
      .catch(()=>{if(this.selection===room)this.hostBattle=null;})
      .finally(()=>{if(this.selection===room)this.publishing=false;});
  }

  private async leave():Promise<void> {
    const room=this.selection;
    if(room&&this.connected) {
      if(!room.guest) await remove(this.at('rooms/'+room.code));
      else if(!room.wire.head?.done) {
        if(room.you===1) await set(push(this.at('rooms/'+room.code+'/inbox')),{turn:0,control:{kind:'leave'}});
        else if(this.hostBattle) {
          this.hostBattle.forfeit(0);
          const until=performance.now()+3000;
          while(!room.wire.head?.done&&performance.now()<until) {
            this.publish(room);
            await new Promise(resolve=>setTimeout(resolve,80));
          }
        }
      }
    }
    localStorage.removeItem(activeKey+this.uid);
    this.close();
  }
}
