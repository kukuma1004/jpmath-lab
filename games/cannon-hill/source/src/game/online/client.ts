import type { Battle } from '../combat/battle';
import { OnlineError, type Control, type OnlineRoom, type OnlineState, type Profile, type RankMode, type ReplayCommand, type RoomPreview } from './protocol';
import type { FirebaseFriend } from './firebaseFriend';

const base = import.meta.env.VITE_WARUREU_ONLINE_URL as string | undefined;
const firebaseFriend = !base && import.meta.env.VITE_WARUREU_FIREBASE_DUELS === '1';
const storageKey = firebaseFriend ? 'jpml.warureu.friend.v1' : 'jpml.warureu.online.v1';
export const onlineEnabled = !!base || firebaseFriend;

function loadToken(): string {
  try { return localStorage.getItem(storageKey) ?? ''; } catch { return ''; }
}

export class OnlineClient {
  private token = loadToken();
  private running = false;
  private timer = 0;
  private epoch = 0;
  private log: ReplayCommand[] = [];
  private index = 0;
  private lastInput = '';
  private commands = Promise.resolve();
  private friend?: FirebaseFriend;
  readonly groups = firebaseFriend;
  state: OnlineState | null = null;
  error = '';

  constructor(private readonly changed: () => void) {}

  get authenticated(): boolean { return !!this.token; }
  get room(): OnlineRoom | null { return this.state?.room ?? null; }

  start(): void {
    if (this.running) return;
    this.running = true;
    void this.poll(++this.epoch);
  }

  stop(): void {
    this.running = false;
    this.epoch++;
    window.clearTimeout(this.timer);
    this.friend?.close();
  }

  private setToken(token: string): void {
    this.token = token;
    try {
      if (token) localStorage.setItem(storageKey,token);
      else localStorage.removeItem(storageKey);
    } catch { /* The current browser session still works. */ }
  }

  private setState(state: OnlineState | null): void {
    if (state?.room?.code !== this.room?.code) {
      this.log = [];
      this.index = 0;
      this.lastInput = '';
    }
    this.state = state;
    if (state?.room) {
      for (const command of state.room.commands) this.log.push(command);
    }
  }

  private async request<T>(action: string, body?: object): Promise<T> {
    if (firebaseFriend) {
      if (!this.friend) {
        const {FirebaseFriend} = await import('./firebaseFriend');
        this.friend ??= new FirebaseFriend(this.syncFriendRoom);
      }
      return this.friend.request(action,body) as Promise<T>;
    }
    const headers = new Headers();
    if (this.token) headers.set('Authorization','Bearer '+this.token);
    if (body) headers.set('Content-Type','application/json');
    let response: Response;
    try {
      response = await fetch(base!.replace(/\/$/,'')+'/'+action,{
        method:body?'POST':'GET',headers,body:body?JSON.stringify(body):undefined,
        cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(6_000),
      });
    } catch { throw new Error('서버 연결이 끊겼어요. 다시 연결하는 중이에요.'); }
    const data = await response.json().catch(() => null);
    if (!response.ok || data === null) throw new OnlineError(response.status,data?.error ?? '온라인 서버에 접속하지 못했어요.');
    return data as T;
  }

  private syncFriendRoom = (): void => {
    const room=this.room;
    if(!this.running||!this.token||!room||!this.friend)return;
    try {
      const state=this.friend.roomState(room.code,this.log.length);
      if(!state)return;
      this.error='';
      this.setState(state);
    } catch(error) {
      this.error=error instanceof Error?error.message:'온라인 연결을 확인해 주세요.';
    }
    this.changed();
  };

  private async poll(epoch: number): Promise<void> {
    if (!this.running || epoch !== this.epoch) return;
    if (this.token) {
      try {
        const room = this.room;
        const params = new URLSearchParams(room ? {code:room.code,cursor:String(this.log.length)} : {});
        const cached = room ? this.friend?.roomState(room.code,this.log.length) : null;
        const state = cached ?? await this.request<OnlineState>('state?'+params);
        if (epoch !== this.epoch) return;
        this.error = '';
        this.setState(state);
      } catch (error) {
        if (epoch !== this.epoch) return;
        this.error = error instanceof Error ? error.message : '온라인 서버에 접속하지 못했어요.';
        if (error instanceof OnlineError && error.status === 401) {
          this.setToken('');
          this.setState(null);
        }
      }
    }
    this.changed();
    if (this.running && epoch === this.epoch) {
      this.timer=window.setTimeout(() => void this.poll(epoch),!firebaseFriend&&this.room?.config&&!this.room.done?90:500);
    }
  }

  private refresh(): void {
    window.clearTimeout(this.timer);
    if (this.running) void this.poll(++this.epoch);
  }

  async auth(register: boolean, body: {id:string;password:string;nickname:string}): Promise<void> {
    const {token} = await this.request<{token:string}>(register?'register':'login',body);
    this.setState(null);
    this.error = '';
    this.setToken(token);
    this.refresh();
  }

  async logout(): Promise<void> {
    await this.request('logout',{});
    this.setToken('');
    this.setState(null);
    this.refresh();
  }

  async lobby(action: 'create'|'join'|'queue', body: object): Promise<void> {
    await this.request(action,body);
    this.refresh();
  }

  inspectRoom(code:string):Promise<RoomPreview> { return this.request('inspect-room',{code}); }

  async leave(): Promise<void> {
    if (this.room || this.state?.queued) await this.request('leave',{code:this.room?.code??null});
    this.setState(this.state ? {...this.state,room:null,queued:false} : null);
    this.refresh();
  }

  rankings(mode:RankMode='duel'): Promise<Profile[]> { return this.request(mode==='teams'?'team-ranking':'ranking'); }

  reportRanked(winner:-1|0|1):void { this.friend?.reportRanked(winner); }

  send(turn: number, control: Control, onError?: () => void): boolean {
    const room = this.room;
    if (!room || this.error || !room.opponentConnected) return false;
    if (this.friend) {
      // Firebase preserves the order of writes on this connection. A key release
      // or fire input can reach the host without waiting for the previous ACK.
      void this.friend.command(room.code,turn,control).catch(error=>{
        onError?.();
        if (!(error instanceof OnlineError && error.status === 409) && this.room?.code===room.code) this.refresh();
      });
      return true;
    }
    this.commands = this.commands.then(async () => {
      if (this.room?.code !== room.code) return;
      try { await this.request('command',{code:room.code,turn,control}); }
      catch (error) {
        onError?.();
        if (!(error instanceof OnlineError && error.status === 409)) this.refresh();
      }
    });
    return true;
  }

  input(turn: number, move: -1|0|1, aim: -1|0|1): void {
    const key = `${this.room?.opponentConnected}:${turn}:${move}:${aim}`;
    if (key===this.lastInput) return;
    this.lastInput=key;
    this.send(turn,{kind:'input',move,aim});
  }

  prepare(b: Battle): void {
    b.recording=false;
    this.index = 0;
    this.advance(b, (this.room?.step ?? 0) + 1);
    if (b.stepNo > 120 && b.winner === null) b.drainEvents();
    if (b.stepNo > 120 && b.winner !== null) {
      const events=b.drainEvents();
      b.events.push(...events.filter(e=>e.type==='gameOver'));
    }
  }

  advance(b: Battle, maxSteps = 2, budgetMs = Infinity): void {
    const room=this.room;
    if (!room) return;
    const deadline=performance.now()+budgetMs;
    for (let i=0; i<=maxSteps; i++) {
      while (this.index<this.log.length && this.log[this.index]!.s<=b.stepNo) {
        const {c,a}=this.log[this.index++]!;
        b.applyCommand(c,a);
      }
      if (i===maxSteps || b.stepNo>=room.step || b.winner!==null || (i>0&&performance.now()>=deadline)) return;
      b.step();
    }
  }
}
