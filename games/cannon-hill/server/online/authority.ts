import { createHash, randomBytes, randomInt, scrypt, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { Battle, defaultConfig } from '../../source/src/game/combat/battle';
import { DT } from '../../source/src/game/config/constants';
import { CHARACTERS } from '../../source/src/game/data/characters';
import { MAPS } from '../../source/src/game/data/maps';
import { RECONNECT_MS, STARTING_RATING, type MatchKind, type OnlineRoom, type OnlineState, type Profile, type RatingChange } from '../../source/src/game/online/protocol';

const passwordKey = promisify(scrypt);
const names = new Set(CHARACTERS.map(c => c.id));
const mapIds = new Set(MAPS.map(m => m.id));
const codeAlphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const connectedFor = 4_000;
const roomLifetime = 15 * 60_000;
const sessionLifetime = 7 * 24 * 60 * 60_000;
const sign = (value: unknown): value is -1 | 0 | 1 => value === -1 || value === 0 || value === 1;
const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

interface Account extends Profile {
  id: string;
  salt: string;
  password: string;
}

interface Room {
  code: string;
  kind: MatchKind;
  accounts: string[];
  picks: string[];
  map: string;
  created: number;
  battle: Battle | null;
  accumulator: number;
  charge: Map<number, number>;
  doneAt: number | null;
  ratings: [RatingChange, RatingChange] | null;
}

export class RequestError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

function profile({nickname, rating, wins, losses, draws}: Account): Profile {
  return {nickname, rating, wins, losses, draws};
}

export class OnlineAuthority {
  private readonly accounts = new Map<string, Account>();
  private readonly sessions = new Map<string, {id: string; expires: number}>();
  private readonly seen = new Map<string, number>();
  private readonly rooms = new Map<string, Room>();
  private readonly memberships = new Map<string, string>();
  private readonly queue = new Map<string, {char: string; expiry: number}>();
  private readonly file: string;
  private lastTick = Date.now();

  constructor(directory: string) {
    mkdirSync(directory, {recursive:true, mode:0o700});
    this.file = join(directory, 'accounts.json');
    if (existsSync(this.file)) {
      const data: Account[] = JSON.parse(readFileSync(this.file, 'utf8'));
      for (const account of data) this.accounts.set(account.id, account);
    }
  }

  private save(changes: Account[]): void {
    const records = new Map(this.accounts);
    for (const account of changes) records.set(account.id, account);
    const temporary = this.file + '.tmp';
    writeFileSync(temporary, JSON.stringify([...records.values()]), {mode:0o600});
    renameSync(temporary, this.file);
    for (const account of changes) this.accounts.set(account.id, account);
  }

  async authenticate(body: Record<string, unknown>, register: boolean): Promise<{token: string}> {
    const id = typeof body.id === 'string' ? body.id.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const nickname = typeof body.nickname === 'string' ? body.nickname.trim().normalize() : '';
    if (!/^[a-z0-9_]{3,20}$/.test(id) || password.length < 8 || password.length > 80) {
      throw new RequestError(400, '아이디는 영문·숫자·밑줄 3~20자, 비밀번호는 8~80자예요.');
    }
    if (register) {
      if (!/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{2,12}$/.test(nickname)) {
        throw new RequestError(400, '닉네임은 한글·영문·숫자 등 2~12자로 입력해 주세요.');
      }
      const salt = randomBytes(16).toString('hex');
      const digest = (await passwordKey(password, salt, 64) as Buffer).toString('hex');
      if (this.accounts.has(id)) throw new RequestError(409, '이미 사용 중인 아이디예요.');
      if ([...this.accounts.values()].some(value => value.nickname.toLowerCase() === nickname.toLowerCase())) {
        throw new RequestError(409, '이미 사용 중인 닉네임이에요.');
      }
      this.save([{id,nickname,salt,password:digest,rating:STARTING_RATING,wins:0,losses:0,draws:0}]);
    } else {
      const account = this.accounts.get(id);
      const digest = await passwordKey(password, account?.salt ?? 'warureu-invalid-account', 64) as Buffer;
      if (!account || !timingSafeEqual(digest, Buffer.from(account.password, 'hex'))) {
        throw new RequestError(401, '아이디 또는 비밀번호를 확인해 주세요.');
      }
    }
    const token = randomBytes(32).toString('hex');
    this.sessions.set(tokenHash(token), {id, expires:Date.now()+sessionLifetime});
    return {token};
  }

  who(token: string): string {
    const session = /^[a-f0-9]{64}$/.test(token) ? this.sessions.get(tokenHash(token)) : undefined;
    if (!session || session.expires <= Date.now()) throw new RequestError(401, '다시 로그인해 주세요.');
    this.seen.set(session.id, Date.now());
    return session.id;
  }

  signOut(token: string): void {
    this.sessions.delete(tokenHash(token));
  }

  state(id: string, code: string | null, cursor: number): OnlineState {
    const room = this.roomOf(id);
    return {profile:profile(this.accounts.get(id)!),queued:this.queue.has(id),room:room ? this.view(room,id,room.code===code ? cursor : 0) : null};
  }

  rankings(): Profile[] {
    return [...this.accounts.values()].filter(a => a.wins + a.losses + a.draws > 0)
      .sort((a,b) => b.rating-a.rating || b.wins-a.wins || a.nickname.localeCompare(b.nickname,'ko'))
      .slice(0,50).map(profile);
  }

  private roomOf(id: string): Room | undefined {
    return this.rooms.get(this.memberships.get(id) ?? '');
  }

  private available(id: string): void {
    const room = this.roomOf(id);
    if (room && room.doneAt === null) throw new RequestError(409,'이미 참가한 방이 있어요.');
    this.memberships.delete(id);
    this.queue.delete(id);
  }

  private create(kind: MatchKind, id: string, char: string, map: string): Room {
    let code: string;
    do {
      code = Array.from({length:6}, () => codeAlphabet[randomInt(codeAlphabet.length)]!).join('');
    } while (this.rooms.has(code));
    const room: Room = {
      code,kind,accounts:[id],picks:[char],map,created:Date.now(),battle:null,accumulator:0,charge:new Map(),doneAt:null,ratings:null,
    };
    this.rooms.set(code,room);
    this.memberships.set(id,code);
    return room;
  }

  private start(room: Room, id: string, char: string): void {
    room.accounts.push(id);
    room.picks.push(char);
    room.battle = new Battle(defaultConfig({
      chars:room.picks, mapId:room.map, seed:randomInt(1,2**31), controllers:['human','human'], turnTime:25, turnLimit:0,
    }));
    this.memberships.set(id,room.code);
  }

  lobby(id: string, action: string, body: Record<string, unknown>): void {
    const char = typeof body.char === 'string' && names.has(body.char) ? body.char : null;
    if (!char) throw new RequestError(400,'플레이할 장수를 골라 주세요.');
    const existing = this.roomOf(id);
    if (action === 'create') {
      this.available(id);
      if (typeof body.map !== 'string' || !mapIds.has(body.map)) throw new RequestError(400,'전장을 골라 주세요.');
      this.create('friendly',id,char,body.map);
    } else if (action === 'join') {
      const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
      if (existing?.code === code) return;
      const room = this.rooms.get(code);
      if (!room || room.kind !== 'friendly' || room.battle) throw new RequestError(404,'참가할 수 있는 방을 찾지 못했어요.');
      this.available(id);
      this.start(room,id,char);
    } else {
      if (this.queue.has(id) || existing?.kind === 'ranked' && existing.doneAt === null) return;
      this.available(id);
      const now = Date.now();
      const waiting = [...this.queue].find(([who,pick]) => who !== id && pick.expiry > now && this.isConnected(who,now));
      if (!waiting) {
        this.queue.set(id,{char,expiry:now+roomLifetime});
        return;
      }
      const [opponent,pick] = waiting;
      this.queue.delete(opponent);
      const room = this.create('ranked',opponent,pick.char,MAPS[randomInt(MAPS.length)]!.id);
      this.start(room,id,char);
    }
  }

  leave(id: string, code: unknown): void {
    if (code === null && this.queue.delete(id)) return;
    const room = this.roomOf(id);
    if (!room || room.code !== code) throw new RequestError(409,'이미 방이 바뀌었어요.');
    if (!room.battle) this.rooms.delete(room.code);
    else if (room.doneAt === null) {
      room.battle.forfeit(room.accounts.indexOf(id));
      this.finish(room, Date.now());
    }
    this.memberships.delete(id);
  }

  command(id: string, body: Record<string, unknown>): void {
    const room = this.roomOf(id);
    const b = room?.battle;
    const control = body.control as Record<string, unknown> | undefined;
    if (!room || !b || room.code !== body.code || b.current !== room.accounts.indexOf(id) ||
      b.turnNo !== body.turn || !b.isPlayerPhase() || !this.isConnected(room.accounts[1-b.current]!,Date.now())) {
      throw new RequestError(409,'지금은 조작할 수 없는 차례예요.');
    }
    switch (control?.kind) {
      case 'input':
        if (!sign(control.move) || !sign(control.aim)) break;
        b.setMove(control.move);
        b.setAim(control.aim);
        return;
      case 'fire':
        if (b.phase === 'CHARGE') {
          const sampled = typeof control.step === 'number' ? room.charge.get(control.step) : undefined;
          b.fireNow(sampled ?? b.cur.power);
          room.charge.clear();
        } else {
          room.charge.clear();
          b.setCharge(true);
          room.charge.set(b.stepNo,0);
        }
        return;
      case 'cancel': b.cancelCharge(); return;
      case 'flip': if (b.phase !== 'CHARGE') b.setAngle(180-b.cur.angle); return;
      case 'slot':
        if (control.slot !== 0 && control.slot !== 1 && control.slot !== 2) break;
        b.selectWeapon(control.slot);
        return;
    }
    throw new RequestError(400,'조작값을 확인해 주세요.');
  }

  private isConnected(id: string, now: number): boolean {
    return now - (this.seen.get(id) ?? 0) < connectedFor;
  }

  tick(now = Date.now()): void {
    const dt = Math.max(0, Math.min(.25, (now-this.lastTick)/1000));
    this.lastTick = now;
    for (const [code,room] of this.rooms) {
      const b = room.battle;
      if (room.doneAt !== null || !b) {
        if (now-(room.doneAt ?? room.created) >= roomLifetime) this.expire(code,room);
        continue;
      }
      const missing = room.accounts.map(id => now-(this.seen.get(id) ?? now));
      if (missing[0]! >= RECONNECT_MS && missing[1]! >= RECONNECT_MS) {
        this.expire(code,room);
        continue;
      }
      if (missing[0]! >= RECONNECT_MS && this.isConnected(room.accounts[1]!,now)) b.forfeit(0);
      if (missing[1]! >= RECONNECT_MS && this.isConnected(room.accounts[0]!,now)) b.forfeit(1);
      if (b.phase !== 'GAME_OVER' && b.isPlayerPhase() && missing.some(ms => ms >= connectedFor)) {
        b.setMove(0);
        b.setAim(0);
        b.cancelCharge();
        room.accumulator = 0;
        continue;
      }
      room.accumulator += dt;
      while (room.accumulator >= DT && b.phase !== 'GAME_OVER') {
        b.step();
        if (b.phase === 'CHARGE') {
          room.charge.set(b.stepNo,b.cur.power);
          room.charge.delete(b.stepNo-30);
        }
        room.accumulator -= DT;
      }
      b.drainEvents();
      if (b.winner !== null) this.finish(room,now);
    }
    for (const [id,pick] of this.queue) if (pick.expiry <= now) this.queue.delete(id);
    for (const [key,session] of this.sessions) if (session.expires <= now) this.sessions.delete(key);
  }

  private expire(code: string, room: Room): void {
    for (const id of room.accounts) if (this.memberships.get(id) === code) this.memberships.delete(id);
    this.rooms.delete(code);
  }

  private finish(room: Room, now: number): void {
    if (room.doneAt !== null || !room.battle || room.battle.winner === null) return;
    if (room.kind === 'ranked') {
      const [a,b] = room.accounts.map(id => this.accounts.get(id)!) as [Account,Account];
      const winner = room.battle.winner;
      const score = winner === -1 ? .5 : Number(winner === 0);
      const expected = 1 / (1 + 10 ** ((b.rating-a.rating)/400));
      const delta = Math.round(32*(score-expected));
      const next = (account:Account, index:number, points:number) => ({
        ...account, rating:account.rating+points, wins:account.wins+Number(winner===index),
        losses:account.losses+Number(winner===1-index),draws:account.draws+Number(winner===-1),
      });
      this.save([next(a,0,delta),next(b,1,-delta)]);
      room.ratings = [{before:a.rating,after:a.rating+delta,opponent:b.rating},{before:b.rating,after:b.rating-delta,opponent:a.rating}];
    }
    room.doneAt = now;
  }

  private view(room: Room, id: string, cursor: number): OnlineRoom {
    const b = room.battle;
    const you = room.accounts[0] === id ? 0 : 1;
    const length = b?.log.length ?? 0;
    return {code:room.code,kind:room.kind,you,names:room.accounts.map(a=>this.accounts.get(a)!.nickname),
      config:b?.cfg ?? null,turn:b?.turnNo ?? 0,step:b?.stepNo ?? 0,cursor:length,commands:b?.log.slice(Math.min(length,cursor)) ?? [],
      opponentConnected:!!room.accounts[1-you] && this.isConnected(room.accounts[1-you]!,Date.now()),
      done:room.doneAt !== null,rating:room.ratings?.[you] ?? null};
  }
}
