import {audio} from '../audio/audio';
import {BANDS, CHARGE_MS, MAX_POWER, MAX_SCORE, MAX_SHOT_SCORE, ROUNDS, courseDate, formatTenths, isCenter, koreaDay, scoreShot, shotPosition, summarize, targetFor, type TargetResult, type TargetShot} from './course';
import {deleteScore, loadBoard, publishScore, type RecordRow} from './ranking';
import './range.css';

const WIDTH = 1152;
const HEIGHT = 352;
const MUZZLE_X = 76;
const LINE_Y = 282;
const SCALE = 0.43;
const BEST_KEY = 'jpml.warureu.target.best.v1';
const NICKNAME_KEY = 'jpml.warureu.target.nickname.v1';
const OWNER_KEY = 'jpml.warureu.target.owner.v1';

function readLocal(key: string): string {
  try { return localStorage.getItem(key) ?? ''; } catch { return ''; }
}

function writeLocal(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* Play still works in a blocked-storage browser. */ }
}

function dayBest(day: number): TargetResult | null {
  try {
    const stored = JSON.parse(readLocal(BEST_KEY));
    if (stored?.day === day && Array.isArray(stored.powers)) return summarize(day, stored.powers);
  } catch { /* A damaged local record is ignored. */ }
  return null;
}

function shotFeedback(shot: TargetShot): string {
  const where = shot.distanceTenths === 0 ? '표적 중심' :
    `중심보다 ${formatTenths(shot.distanceTenths)} ${shot.offset < 0 ? '짧음' : '길음'}`;
  return `${where} · +${formatTenths(shot.points)}점`;
}

function showShot(token: HTMLElement, shot: TargetShot, index: number): void {
  token.textContent = formatTenths(shot.points);
  token.dataset.hit = !shot.points ? 'miss' : isCenter(shot) ? 'center' : shot.points >= 500 ? 'inner' : 'outer';
  token.removeAttribute('aria-current');
  token.title = shotFeedback(shot);
  token.setAttribute('aria-label', `${index + 1}번째 · ${token.title}`);
}
type Phase = 'ready' | 'charge' | 'flight' | 'feedback' | 'result';

interface RenderShot {
  shot: TargetShot;
  start: number;
  flightMs: number;
  wind: number;
}

export class TargetRange {
  private readonly root = document.createElement('section');
  private readonly portrait = new Image();
  private readonly controls = new AbortController();
  private readonly ctx: CanvasRenderingContext2D;
  private readonly canvasSize: ResizeObserver;
  private readonly board: HTMLDialogElement;
  private readonly reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private animation = 0;
  private destroyed = false;
  private boardRequest = 0;
  private busy = false;
  private needsPaint = true;
  private objectAspect = 1;
  private renderedPower = -1;
  private phase: Phase = 'ready';
  private day = koreaDay();
  private powers: number[] = [];
  private recent: TargetShot[] = [];
  private chargeStart = 0;
  private pointer: number | null = null;
  private trajectory: RenderShot | null = null;
  private result: TargetResult | null = null;
  private onlineOwner = readLocal(OWNER_KEY);

  constructor(container: HTMLElement, portrait: string, close: () => void) {
    this.root.className = 'target-mode';
    this.root.setAttribute('aria-label', '표적 10발');
    this.root.innerHTML = `
      <div class="target-shell">
        <header class="target-header">
          <button class="btn ghost target-back" type="button" data-action="close">← 돌아가기</button>
          <div class="target-title"><h1>표적 10발</h1><p data-date></p></div>
          <button class="btn target-board" type="button" data-action="board">오늘 순위</button>
        </header>
        <div class="target-scoreboard">
          <span><small>이번 발</small><strong data-round></strong></span>
          <span><small>거리</small><strong data-distance></strong></span>
          <span><small>바람</small><strong data-wind></strong></span>
          <span><small>합계</small><strong data-score></strong></span>
        </div>
        <div class="target-field">
          <canvas width="${WIDTH * 2}" height="${HEIGHT * 2}" aria-label="포신 45도, 거리와 바람이 바뀌는 포격 사격장"></canvas>
          <div class="target-note" data-feedback role="status" aria-live="polite"></div>
          <section class="target-finish" hidden aria-label="도전 결과">
            <p>10발 완료</p><strong data-total></strong><p data-best></p>
            <div class="target-result-actions">
              <button class="btn primary" type="button" data-action="submit">순위에 등록</button>
              <button class="btn" type="button" data-action="retry">다시 도전</button>
            </div>
          </section>
        </div>
        <div class="target-control">
          <div class="target-progress">
            <ol class="target-shots" aria-label="10발 득점" data-shots></ol>
            <div class="target-meter" aria-hidden="true"><i data-fill></i><b data-last-marker></b><span data-power></span></div>
            <div class="target-scale" aria-hidden="true"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
          </div>
          <button class="fire target-fire" data-hold="fire" type="button" aria-label="눌렀다 떼어 발사">발사<small>꾹 눌러 힘 모으기</small></button>
        </div>
        <p class="target-tip">포신 45° 고정 · Space 또는 발사 버튼을 눌렀다 떼세요. <span>중심 100점 · 중심에서 1만큼 멀어지면 1점 감점</span></p>
      </div>
      <dialog class="target-dialog" aria-labelledby="target-rank-title">
        <header><div><h2 id="target-rank-title">오늘의 순위</h2><p data-board-day></p></div><button class="btn ghost" type="button" data-action="dismiss">닫기</button></header>
        <form class="target-submit" hidden>
          <label for="target-nickname">공개 별명</label>
          <input id="target-nickname" name="nickname" maxlength="12" required autocomplete="off" spellcheck="false" placeholder="별명 1~12자">
          <button class="btn primary" type="submit">기록 등록</button>
        </form>
        <p class="target-online-status">합계 점수순 · 동점이면 중앙 명중(80.0점 이상) 횟수순 · 둘 다 같으면 공동 순위</p>
        <p class="target-online-status" data-online role="status" aria-live="polite"></p>
        <ol class="target-ranking" data-ranking aria-label="상위 50위"></ol>
        <div class="target-board-actions"><button class="btn ghost" type="button" data-action="reload">새로고침</button><button class="btn ghost" type="button" data-action="remove" hidden>오늘 내 등록 삭제</button></div>
      </dialog>`;
    container.appendChild(this.root);
    const canvas = this.select<HTMLCanvasElement>('canvas');
    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(2, 2);
    this.canvasSize = new ResizeObserver(([entry]) => {
      if (!entry?.contentRect.width) return;
      const { width, height } = entry.contentRect;
      this.objectAspect = Math.max(1, Math.min(1.75, height * WIDTH / (width * HEIGHT)));
      this.needsPaint = true;
    });
    this.canvasSize.observe(canvas);
    this.board = this.select('dialog');
    const { signal } = this.controls;
    this.portrait.addEventListener('load', () => { this.needsPaint = true; }, { signal });
    if (portrait) this.portrait.src = portrait;
    const fire = this.select<HTMLButtonElement>('.target-fire');
    fire.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0 || !this.startCharge()) return;
      event.preventDefault();
      this.pointer = event.pointerId;
      try { fire.setPointerCapture(event.pointerId); } catch { /* Pointer has already been released. */ }
    }, {signal});
    fire.addEventListener('pointerup', event => {
      if (event.pointerId !== this.pointer) return;
      this.pointer = null;
      this.release();
    }, {signal});
    for (const name of ['pointercancel', 'lostpointercapture'] as const) fire.addEventListener(name, event => {
      if (event.pointerId === this.pointer) this.cancelCharge();
    }, {signal});
    window.addEventListener('keydown', event => {
      if (event.code !== 'Space' || this.board.open || !['ready','charge'].includes(this.phase) ||
          (event.target instanceof HTMLElement && event.target.closest('button:not(.target-fire), input'))) return;
      event.preventDefault();
      if (!event.repeat) this.startCharge();
    }, {signal});
    window.addEventListener('keyup', event => {
      if (event.code !== 'Space' || this.phase !== 'charge' || this.pointer !== null) return;
      event.preventDefault();
      this.release();
    }, {signal});
    window.addEventListener('blur', () => this.cancelCharge(), {signal});
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.cancelCharge(); }, {signal});
    this.root.addEventListener('click', event => {
      const action = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]')?.dataset.action;
      if (action === 'close') close();
      if (action === 'retry') this.reset();
      if (action === 'board' || action === 'submit') this.openBoard(action === 'submit');
      if (action === 'dismiss') this.board.close();
      if (action === 'reload') void this.refreshBoard();
      if (action === 'remove') void this.removeOnline();
    }, {signal});
    this.select('form').addEventListener('submit', event => { event.preventDefault(); void this.submitOnline(); }, {signal});
    this.reset();
    this.animation = requestAnimationFrame(this.update);
  }

  destroy(): void {
    this.destroyed = true;
    this.controls.abort();
    this.canvasSize.disconnect();
    cancelAnimationFrame(this.animation);
    this.root.remove();
  }

  private select<T extends HTMLElement = HTMLElement>(selector: string): T {
    return this.root.querySelector<T>(selector)!;
  }

  private get target() { return targetForRound(this.day, this.recent.length); }
  private get score() { return this.recent.reduce((total, shot) => total + shot.points, 0); }

  private reset(): void {
    this.phase = 'ready';
    this.day = koreaDay();
    this.powers = [];
    this.recent = [];
    this.result = null;
    this.trajectory = null;
    this.needsPaint = true;
    this.select('.target-finish').hidden = true;
    this.select('[data-feedback]').textContent = '힘 게이지를 보고 원하는 순간에 손을 떼세요.';
    this.refreshHud();
    this.select<HTMLButtonElement>('.target-fire').focus({preventScroll:true});
  }

  private refreshHud(): void {
    this.select('[data-date]').textContent = `${courseDate(this.day)} · 한국 시간 기준`;
    this.select('[data-round]').textContent = `${Math.min(ROUNDS.length, this.recent.length + 1)} / ${ROUNDS.length}`;
    this.select('[data-distance]').textContent = `${this.target.distance}`;
    this.select('[data-wind]').textContent = this.target.wind === 0 ? '잔잔' : `${this.target.wind > 0 ? '밀어줌 →' : '맞바람 ←'} ${Math.abs(this.target.wind)}`;
    this.select('[data-score]').textContent = `${formatTenths(this.score)}점`;
    this.select<HTMLButtonElement>('.target-fire').disabled = !['ready','charge'].includes(this.phase);
    this.select('[data-shots]').replaceChildren(...Array.from({length:ROUNDS.length}, (_, index) => {
      const el = document.createElement('li');
      const shot = this.recent[index];
      if (shot) showShot(el, shot, index);
      else {
        el.textContent = String(index + 1);
        if (index === this.recent.length) el.setAttribute('aria-current', 'step');
        el.setAttribute('aria-label', `${index + 1}번째 대기`);
      }
      return el;
    }));
    const marker = this.select('[data-last-marker]');
    const last = this.powers.at(-1);
    marker.hidden = last === undefined;
    if (last !== undefined) marker.style.left = `${last * 100 / MAX_POWER}%`;
  }

  private startCharge(): boolean {
    if (this.phase !== 'ready' || this.board.open) return false;
    if (!this.powers.length && this.day !== koreaDay()) this.reset();
    this.phase = 'charge';
    this.chargeStart = performance.now();
    this.select('.target-fire').classList.add('held');
    return true;
  }

  private power(now: number): number {
    return Math.min(MAX_POWER, Math.max(0, Math.round((now - this.chargeStart) * MAX_POWER / CHARGE_MS)));
  }

  private cancelCharge(): void {
    if (this.phase !== 'charge') return;
    this.pointer = null;
    this.phase = 'ready';
    this.select('.target-fire').classList.remove('held');
  }

  private release(): void {
    if (this.phase !== 'charge') return;
    const now = performance.now();
    const power = this.power(now);
    this.powers.push(power);
    const shot = scoreShot(this.target, power);
    this.trajectory = {shot, start:now, wind:this.target.wind, flightMs:220 + power / MAX_POWER * 2300};
    this.phase = 'flight';
    this.select('.target-fire').classList.remove('held');
    this.select('[data-feedback]').textContent = `힘 ${formatTenths(power)} · 비행 중`;
    this.refreshHud();
    audio.fire('ball');
  }

  private finish(): void {
    this.phase = 'result';
    this.result = summarize(this.day, this.powers)!;
    let best = dayBest(this.day);
    if (!best || this.result.rank > best.rank) {
      best = this.result;
      writeLocal(BEST_KEY, JSON.stringify({day:this.day, powers:this.powers}));
    }
    this.select('[data-total]').textContent = `${formatTenths(this.result.score)} / ${formatTenths(MAX_SCORE)}점`;
    this.select('[data-best]').textContent = `중앙 명중 ${this.result.centers}발 · 내 최고 ${formatTenths(best.score)}점`;
    this.select<HTMLButtonElement>('[data-action=submit]').disabled = this.result.score === 0;
    this.select('.target-finish').hidden = false;
    this.select<HTMLButtonElement>('[data-action=retry]').focus({preventScroll:true});
  }

  private update = (now: number): void => {
    if (this.destroyed) return;
    const throwInfo = this.trajectory;
    if (throwInfo && this.phase === 'flight' && now >= throwInfo.start + throwInfo.flightMs) {
      this.phase = 'feedback';
      this.recent.push(throwInfo.shot);
      const {points} = throwInfo.shot;
      this.select('[data-score]').textContent = `${formatTenths(this.score)}점`;
      const token = this.select('[data-shots]').children[this.recent.length - 1]! as HTMLElement;
      showShot(token, throwInfo.shot, this.recent.length - 1);
      this.select('[data-feedback]').textContent = token.title;
      audio.explode(24 + points / MAX_SHOT_SCORE * 24);
    }
    if (throwInfo && this.phase === 'feedback' && now >= throwInfo.start + throwInfo.flightMs + 680) {
      this.trajectory = null;
      this.needsPaint = true;
      if (this.recent.length === ROUNDS.length) this.finish();
      else {
        this.phase = 'ready';
        this.refreshHud();
      }
    }
    const shownPower = this.phase === 'charge' ? this.power(now) : this.powers.at(-1) ?? 0;
    if (shownPower !== this.renderedPower || this.phase === 'ready' && this.renderedPower < 0) {
      this.renderedPower = shownPower;
      this.select('[data-fill]').style.width = `${shownPower * 100 / MAX_POWER}%`;
      this.select('[data-power]').textContent = `힘 ${formatTenths(shownPower)}`;
    }
    if (this.needsPaint || this.trajectory) {
      this.needsPaint = false;
      this.draw(now);
    }
    this.animation = requestAnimationFrame(this.update);
  };

  private rampartImage?: HTMLCanvasElement;

  private draw(now: number): void {
    const g = this.ctx;
    const activeRound = this.trajectory ? this.powers.length - 1 : this.recent.length;
    const target = targetForRound(this.day, activeRound);
    const targetX = (distance: number) => MUZZLE_X + (this.objectAspect - 1) * 54 + distance * SCALE;
    const x = targetX(target.distance);
    g.clearRect(0, 0, WIDTH, HEIGHT);
    if (!this.rampartImage) {
      this.rampartImage = document.createElement('canvas');
      this.rampartImage.width = WIDTH*2;
      this.rampartImage.height = HEIGHT*2;
      const stone = this.rampartImage.getContext('2d')!;
      stone.scale(2,2);
      drawRampart(stone, 0, LINE_Y+19, 146);
      drawRampart(stone, 146, LINE_Y+48, WIDTH-146);
    }
    g.drawImage(this.rampartImage,0,0,WIDTH,HEIGHT);
    drawRangeStand(g, x, this.objectAspect);
    const colors = ['#b87848','#f2bb6b','#fff0ba'];
    [...BANDS].reverse().forEach((radius, index) => {
      g.fillStyle = colors[index]!;
      g.beginPath(); g.ellipse(x, LINE_Y+7, radius*SCALE, 10-index*3, 0, 0, Math.PI*2); g.fill();
      g.lineWidth = 1.6; g.strokeStyle = '#472f29'; g.stroke();
    });
    if (this.portrait.complete && this.portrait.naturalWidth) g.drawImage(this.portrait, 4, LINE_Y-52, 79 * this.objectAspect, 79);

    if (!this.trajectory) return;
    const {shot, wind, start, flightMs} = this.trajectory;
    const progress = Math.min(1, (now-start)/flightMs);
    if (this.phase === 'flight') {
      if (!this.reducedMotion) {
        const count = 16;
        let prev = shotPosition(shot.power, wind, Math.max(0,progress-.10));
        g.save();
        g.lineCap = 'round';
        for (let i = 1; i <= count; i++) {
          const t = i/count;
          const point = shotPosition(shot.power, wind, Math.max(0,progress-.10*(1-t)));
          g.strokeStyle = t>.65 ? '#ffcc69' : 'rgba(91,76,73,'+(t*.75)+')';
          g.lineWidth = (1-t)*7+2;
          g.beginPath(); g.moveTo(targetX(prev.x),LINE_Y-prev.height*SCALE); g.lineTo(targetX(point.x),LINE_Y-point.height*SCALE); g.stroke();
          prev = point;
        }
        g.restore();
      }
      for (let i = this.reducedMotion ? 1 : 8; i >= 0; i--) {
        const p = shotPosition(shot.power, wind, Math.max(0, progress-i*0.013));
        g.fillStyle = i === 0 ? '#fff4ce' : `rgba(255,161,61,${0.72-i*0.07})`;
        g.beginPath(); g.arc(targetX(p.x), LINE_Y-p.height*SCALE, Math.max(2,6-i*.4), 0, Math.PI*2); g.fill();
      }
    } else if (this.phase === 'feedback') {
      const landingX = targetX(target.distance + shot.offset);
      const fade = Math.max(0, 1 - (now - start - flightMs) / 680);
      const center = isCenter(shot);
      const spread = this.reducedMotion ? 12 : 12 + (1-fade)*30;
      g.save();
      g.translate(landingX, LINE_Y+5);
      g.globalAlpha = fade;
      g.lineWidth = 3;
      g.strokeStyle = center ? '#ffe89a' : '#f1d1a6';
      g.beginPath(); g.ellipse(0, 0, spread, spread*.32, 0, 0, Math.PI*2); g.stroke();
      if (!this.reducedMotion) {
        for (let i=0; i<7; i++) {
          const angle = Math.PI*(1.06+i*.145);
          const reach = spread*(i%2 ? .98 : 1.32);
          g.beginPath();
          g.moveTo(Math.cos(angle)*reach*.62, Math.sin(angle)*reach*.62);
          g.lineTo(Math.cos(angle)*reach, Math.sin(angle)*reach);
          g.stroke();
        }
      }
      g.restore();
      // Pin the actual landing coordinate while the transient burst clears.
      g.save();
      g.translate(landingX, LINE_Y+3);
      g.fillStyle = center ? '#ffda70' : '#fff2cc';
      g.strokeStyle = '#3e2722';
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(0,0); g.lineTo(-5,-10); g.lineTo(5,-10); g.closePath(); g.fill(); g.stroke();
      g.restore();
    }
  }

  private openBoard(submit: boolean): void {
    this.cancelCharge();
    this.select('.target-submit').hidden = !submit || !this.result;
    this.select<HTMLInputElement>('#target-nickname').value = readLocal(NICKNAME_KEY);
    if (!this.board.open) this.board.showModal();
    void this.refreshBoard();
  }

  private async refreshBoard(message?: string): Promise<void> {
    const request = ++this.boardRequest;
    const day = this.day;
    this.select('[data-board-day]').textContent = `${courseDate(day)} · 한국 시간 기준`;
    this.select('[data-ranking]').replaceChildren();
    this.select('[data-action=remove]').hidden = true;
    this.select('[data-online]').textContent = message ?? '순위를 불러오는 중…';
    try {
      const rows = await loadBoard(day);
      if (this.destroyed || request !== this.boardRequest) return;
      this.renderBoard(rows);
      this.select('[data-online]').textContent = message ?? (rows.length ? '' : '아직 등록된 기록이 없어요. 첫 기록에 도전해 보세요!');
    } catch (err) {
      if (!this.destroyed && request === this.boardRequest) this.onlineError(err);
    }
  }

  private renderBoard(rows: RecordRow[]): void {
    let place = 0;
    const entries = rows.map((row, index) => {
      if (!index || row.rank !== rows[index-1]!.rank) place = index+1;
      const item = document.createElement('li');
      const tied = rows[index-1]?.rank === row.rank || rows[index+1]?.rank === row.rank;
      const rank = document.createElement('b'); rank.textContent = tied ? `공동 ${place}위` : `${place}위`;
      const name = document.createElement('span'); name.textContent = row.nickname;
      const score = document.createElement('strong'); score.textContent = `${formatTenths(row.score)}점`;
      const center = document.createElement('small'); center.textContent = `중앙 ${row.centers}`;
      if (row.uid === this.onlineOwner) item.classList.add('is-mine');
      item.append(rank,name,score,center);
      return item;
    });
    this.select('[data-ranking]').replaceChildren(...entries);
    this.select('[data-action=remove]').hidden = readLocal(OWNER_KEY + '.' + this.day) !== this.onlineOwner || !this.onlineOwner;
  }

  private async submitOnline(): Promise<void> {
    if (this.busy || !this.result) return;
    this.setBusy(true);
    const result = this.result;
    const nickname = this.select<HTMLInputElement>('#target-nickname').value.trim();
    this.select('[data-online]').textContent = '별명과 기록을 등록하는 중…';
    try {
      const response = await publishScore(result,nickname);
      writeLocal(OWNER_KEY, response.uid);
      writeLocal(OWNER_KEY + '.' + result.day, response.uid);
      writeLocal(NICKNAME_KEY,nickname);
      if (this.destroyed) return;
      this.onlineOwner = response.uid;
      this.select('.target-submit').hidden = true;
      await this.refreshBoard(response.kept ? '이전에 등록한 더 좋은 기록이 유지됐어요.' : '오늘의 순위에 등록됐어요.');
    } catch (err) { if (!this.destroyed) this.onlineError(err); }
    finally { if (!this.destroyed) this.setBusy(false); }
  }

  private async removeOnline(): Promise<void> {
    if (this.busy) return;
    this.setBusy(true);
    try {
      await deleteScore(this.day);
      if (this.destroyed) return;
      writeLocal(OWNER_KEY + '.' + this.day, '');
      await this.refreshBoard('오늘 등록한 기록을 삭제했어요.');
    } catch (err) { if (!this.destroyed) this.onlineError(err); }
    finally { if (!this.destroyed) this.setBusy(false); }
  }

  private setBusy(busy: boolean): void {
    this.busy = busy;
    for (const selector of ['button[type=submit]','[data-action=remove]','[data-action=reload]']) this.select<HTMLButtonElement>(selector).disabled = busy;
  }

  private onlineError(err: unknown): void {
    this.select('[data-online]').textContent = err instanceof Error ? err.message : '온라인 순위를 처리하지 못했어요.';
  }
}

/** Dressed stone at the firing line, with staggered joints and beveled caps. */
function drawRampart(g: CanvasRenderingContext2D, left: number, top: number, width: number): void {
  const stones = ['#78797c','#77747a','#87868a','#696d75','#8b8988'];
  g.save();
  g.beginPath(); g.rect(left, top, width, HEIGHT-top); g.clip();
  g.fillStyle = '#40424b'; g.fillRect(left,top,width,HEIGHT-top);
  for (let row = 0; top+row*15 < HEIGHT; row++) {
    for (let col = -1; col*38 < width; col++) {
      const sx = left+col*38+(row%2)*19;
      const sy = top+row*15;
      const variation = Math.abs(col*11+row*7);
      g.fillStyle = stones[variation%stones.length]!;
      g.beginPath(); g.moveTo(sx+2,sy+2); g.lineTo(sx+34,sy+1);
      g.lineTo(sx+37,sy+5); g.lineTo(sx+35,sy+13); g.lineTo(sx+5,sy+14); g.lineTo(sx+1,sy+11); g.closePath(); g.fill();
      g.strokeStyle = '#b8b1a17a'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(sx+3,sy+4); g.lineTo(sx+6,sy+2); g.lineTo(sx+33,sy+2); g.stroke();
    }
  }
  g.fillStyle = '#d2b277'; g.fillRect(left,top,width,3);
  g.fillStyle = '#a59372'; g.fillRect(left,top+3,width,3);
  g.restore();
}

function drawRangeStand(g: CanvasRenderingContext2D, x: number, aspect: number): void {
  const y = LINE_Y;
  g.save();
  g.translate(x,y);
  const beam = (x1: number,y1: number,x2: number,y2: number,diameter: number) => {
    g.lineWidth = diameter; g.strokeStyle = '#49362d'; g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
    g.lineWidth = diameter*.38; g.strokeStyle = '#b28c5e'; g.beginPath(); g.moveTo(x1-1,y1-1); g.lineTo(x2-1,y2-1); g.stroke();
  };
  for (const post of [-47,0,47]) beam(post,12,post,48,8);
  beam(-47,44,0,14,5); beam(-47,14,0,44,5); beam(0,44,47,14,5); beam(0,14,47,44,5);
  beam(-58,15,58,15,9); beam(-58,10,58,10,5);
  beam(-10,5,-4,-22,5); beam(10,5,4,-22,5);
  const rings: [number,string][] = [[23,'#4c382b'],[21,'#c19761'],[18,'#f4e1b7'],[14,'#983f30'],[10,'#fff0c6'],[5,'#a54531']];
  for (const [radius, color] of rings) { g.fillStyle=color; g.beginPath(); g.ellipse(0,-28,radius * aspect,radius,0,0,Math.PI*2); g.fill(); }
  beam(36,6,36,-59,4);
  g.fillStyle='#953b33'; g.strokeStyle='#d4a158'; g.lineWidth=1.5;
  g.beginPath(); g.moveTo(38,-57); g.lineTo(65,-57); g.lineTo(60,-49); g.lineTo(65,-41); g.lineTo(38,-41); g.closePath(); g.fill(); g.stroke();
  g.fillStyle='#eed18c'; g.beginPath(); g.moveTo(48,-54); g.lineTo(54,-49); g.lineTo(48,-44); g.lineTo(43,-49); g.closePath(); g.fill();
  g.restore();
}

function targetForRound(day: number, round: number) {
  return targetFor(day, Math.max(0,Math.min(ROUNDS.length-1,round)));
}
