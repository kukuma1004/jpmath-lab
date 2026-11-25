import {audio} from '../audio/audio';
import {BANDS, FLOOR_HEIGHT, MAX_POWER, MAX_SCORE, MAX_SHOT_SCORE, MAX_SLOPE, MIN_SLOPE, ROUNDS, SLOPE_SCALE, WALL_SPAN, angleDegrees, formatTenths, heightAt, isCenter, scoreShot, summarize, type TargetAim, type TargetResult, type TargetShot} from './course';
import {deleteScore, loadBoard, publishScore, type RecordRow} from './ranking';
import {drawCliff, drawBarricade} from './rangeArt';
import './range.css';

const WIDTH = 1152;
const HEIGHT = 640;
const MUZZLE_X = 87;
const LINE_Y = 380;
const NEAR_TARGET_X = 840;
const FAR_TARGET_X = 1010;
const SCALE_Y = 0.38;
const BEST_KEY = 'jpml.warureu.target.best.v2';
const NICKNAME_KEY = 'jpml.warureu.target.nickname.v1';
const OWNER_KEY = 'jpml.warureu.target.owner.v2';
const NUDGES: Record<string, readonly [keyof TargetAim, number]> = {
  ArrowUp: ['slope', 1], ArrowDown: ['slope', -1], KeyQ: ['power', -1], KeyE: ['power', 1],
};

function readLocal(key: string): string {
  try { return localStorage.getItem(key) ?? ''; } catch { return ''; }
}

function writeLocal(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* Play still works in a blocked-storage browser. */ }
}

function personalBest(): TargetResult | null {
  try {
    const stored = JSON.parse(readLocal(BEST_KEY));
    if (Array.isArray(stored)) return summarize(stored);
  } catch { /* A damaged local record is ignored. */ }
  return null;
}

function shotFeedback(shot: TargetShot): string {
  if (shot.stop === 'wall') return '엄폐물에 막혔어요 · +0.0점';
  if (shot.stop === 'floor') return '표적에 닿기 전에 떨어졌어요 · +0.0점';
  const where = shot.distanceTenths === 0 ? '표적 중심' :
    `중심보다 ${formatTenths(shot.distanceTenths)} ${shot.offset < 0 ? '아래' : '위'}`;
  return `${where} · +${formatTenths(shot.points)}점`;
}

function showShot(token: HTMLElement, shot: TargetShot, index: number): void {
  token.textContent = formatTenths(shot.points);
  token.dataset.hit = !shot.points ? 'miss' : isCenter(shot) ? 'center' : shot.points >= 500 ? 'inner' : 'outer';
  token.removeAttribute('aria-current');
  token.title = shotFeedback(shot);
  token.setAttribute('aria-label', `${index + 1}번째 · ${token.title}`);
}
type Phase = 'ready' | 'flight' | 'feedback' | 'result';

interface RenderShot {
  shot: TargetShot;
  start: number;
  flightMs: number;
  wind: number;
}

export class TargetRange {
  private readonly root = document.createElement('section');
  private readonly rockTexture = new Image();
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
  private phase: Phase = 'ready';
  private aims: TargetAim[] = [];
  private recent: TargetShot[] = [];
  private aim: TargetAim = {power:500, slope:100};
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
          <div class="target-title"><h1>표적 10발</h1><p>기록 도전</p></div>
          <button class="btn target-board" type="button" data-action="board">누적 순위</button>
        </header>
        <div class="target-scoreboard">
          <span><small>이번 발</small><strong data-round></strong></span>
          <span><small>거리 · 높이</small><strong data-distance></strong></span>
          <span><small>바람</small><strong data-wind></strong></span>
          <span><small>합계</small><strong data-score></strong></span>
        </div>
        <div class="target-field">
          <canvas width="${WIDTH * 2}" height="${HEIGHT * 2}" aria-label="높낮이가 있는 표적과 엄폐물을 넘겨 쏘는 사격장"></canvas>
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
          <ol class="target-shots" aria-label="10발 득점" data-shots></ol>
          <div class="target-aim-controls">
            <div class="target-adjust">
              <label for="target-slope">각도 <output data-slope></output></label>
              <button class="btn ghost" type="button" data-nudge="slope:-1" aria-label="각도 낮추기">−</button>
              <input id="target-slope" type="range" min="${MIN_SLOPE}" max="${MAX_SLOPE}" step="1" aria-label="발사 각도">
              <button class="btn ghost" type="button" data-nudge="slope:1" aria-label="각도 높이기">+</button>
            </div>
            <div class="target-adjust">
              <label for="target-power">힘 <output data-power></output></label>
              <button class="btn ghost" type="button" data-nudge="power:-1" aria-label="발사 힘 0.1 줄이기">−</button>
              <input id="target-power" type="range" min="0" max="${MAX_POWER}" step="1" aria-label="발사 힘">
              <button class="btn ghost" type="button" data-nudge="power:1" aria-label="발사 힘 0.1 높이기">+</button>
            </div>
          </div>
          <button class="fire target-fire" data-action="fire" type="button">발사<small>Space</small></button>
        </div>
        <p class="target-tip">방향키 ↑↓ 각도 · Q/E 힘 0.1 · Space 발사 <span>엄폐물을 넘겨 표적 중심을 맞히세요.</span></p>
      </div>
      <dialog class="target-dialog" aria-labelledby="target-rank-title">
        <header><div><h2 id="target-rank-title">누적 순위</h2><p>같은 코스 · 브라우저별 최고 기록</p></div><button class="btn ghost" type="button" data-action="dismiss">닫기</button></header>
        <form class="target-submit" hidden>
          <label for="target-nickname">공개 별명</label>
          <input id="target-nickname" name="nickname" maxlength="12" required autocomplete="off" spellcheck="false" placeholder="별명 1~12자">
          <button class="btn primary" type="submit">기록 등록</button>
        </form>
        <p class="target-online-status">합계 점수순 · 동점이면 중앙 명중(80.0점 이상) 횟수순 · 둘 다 같으면 공동 순위</p>
        <p class="target-online-status" data-online role="status" aria-live="polite"></p>
        <ol class="target-ranking" data-ranking aria-label="상위 50위"></ol>
        <div class="target-board-actions"><button class="btn ghost" type="button" data-action="reload">새로고침</button><button class="btn ghost" type="button" data-action="remove" hidden>내 등록 삭제</button></div>
      </dialog>`;
    container.appendChild(this.root);
    const canvas = this.select<HTMLCanvasElement>('canvas');
    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(2, 2);
    this.canvasSize = new ResizeObserver(([entry]) => {
      if (!entry?.contentRect.width) return;
      const { width, height } = entry.contentRect;
      this.objectAspect = Math.max(1, Math.min(2.6, height * WIDTH / (width * HEIGHT)));
      this.needsPaint = true;
    });
    this.canvasSize.observe(canvas);
    this.board = this.select('dialog');
    const { signal } = this.controls;
    this.portrait.addEventListener('load', () => { this.needsPaint = true; }, { signal });
    this.rockTexture.addEventListener('load', () => {
      this.rampartImage = undefined;
      this.needsPaint = true;
    }, {signal});
    this.rockTexture.src = new URL('art/bg_quarry.png', document.baseURI).href;
    if (portrait) this.portrait.src = portrait;
    for (const field of ['slope', 'power'] as const) {
      this.select<HTMLInputElement>(`#target-${field}`).addEventListener('input', event => {
        this.adjust(field, (event.currentTarget as HTMLInputElement).valueAsNumber);
      }, {signal});
    }
    window.addEventListener('keydown', event => {
      if (this.board.open || this.phase !== 'ready' ||
          (event.target instanceof HTMLElement && event.target.closest('button:not(.target-fire)') && event.code === 'Space') ||
          (event.target instanceof HTMLInputElement && event.code.startsWith('Arrow'))) return;
      const nudge = NUDGES[event.code];
      if (!nudge && event.code !== 'Space') return;
      event.preventDefault();
      if (nudge) this.adjust(nudge[0], this.aim[nudge[0]] + nudge[1] * (event.shiftKey ? 10 : 1));
      else if (!event.repeat) this.fire();
    }, {signal});
    this.root.addEventListener('click', event => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
      const action = button?.dataset.action;
      const nudge = button?.dataset.nudge?.split(':');
      if (nudge) {
        const field = nudge[0] as keyof TargetAim;
        this.adjust(field, this.aim[field] + Number(nudge[1]));
      }
      if (action === 'fire') this.fire();
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

  private get target() { return ROUNDS[Math.min(ROUNDS.length - 1, this.recent.length)]!; }
  private get score() { return this.recent.reduce((total, shot) => total + shot.points, 0); }

  private reset(): void {
    this.phase = 'ready';
    this.aim = {power:500, slope:100};
    this.aims = [];
    this.recent = [];
    this.result = null;
    this.trajectory = null;
    this.needsPaint = true;
    this.select('.target-finish').hidden = true;
    this.select('[data-feedback]').textContent = '포신을 움직이고 힘을 맞춘 뒤 발사하세요.';
    this.refreshHud();
    this.select<HTMLButtonElement>('.target-fire').focus({preventScroll:true});
  }

  private refreshHud(): void {
    this.select('[data-round]').textContent = `${Math.min(ROUNDS.length, this.recent.length + 1)} / ${ROUNDS.length}`;
    const height = this.target.height;
    this.select('[data-distance]').textContent = `${this.target.distance} · ${height > 0 ? '+' : ''}${height}`;
    this.select('[data-wind]').textContent = this.target.wind === 0 ? '잔잔' : `${this.target.wind > 0 ? '밀어줌 →' : '맞바람 ←'} ${Math.abs(this.target.wind)}`;
    this.select('[data-score]').textContent = `${formatTenths(this.score)}점`;
    this.root.querySelectorAll<HTMLButtonElement | HTMLInputElement>('.target-fire, .target-adjust button, .target-adjust input')
      .forEach(control => { control.disabled = this.phase !== 'ready'; });
    this.paintAim();
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
  }

  private adjust(field: keyof TargetAim, value: number): void {
    if (this.phase !== 'ready' || !Number.isFinite(value)) return;
    this.aim[field] = Math.round(field === 'power' ? Math.max(0, Math.min(MAX_POWER, value)) : Math.max(MIN_SLOPE, Math.min(MAX_SLOPE, value)));
    this.paintAim();
    this.needsPaint = true;
  }

  private paintAim(): void {
    const angle = `${angleDegrees(this.aim.slope).toFixed(1)}°`;
    const power = formatTenths(this.aim.power);
    for (const [field, label] of [['slope', angle], ['power', power]] as const) {
      this.select(`[data-${field}]`).textContent = label;
      const slider = this.select<HTMLInputElement>(`#target-${field}`);
      slider.valueAsNumber = this.aim[field];
      slider.setAttribute('aria-valuetext', label);
    }
  }

  private fire(): void {
    if (this.phase !== 'ready' || this.board.open) return;
    const now = performance.now();
    const shot = scoreShot(this.target, this.aim);
    this.aims.push({...this.aim});
    const flightMs = 260 + (shot.impactX / this.target.distance) * (550 + shot.power);
    this.trajectory = {shot, start:now, wind:this.target.wind, flightMs};
    this.phase = 'flight';
    this.select('[data-feedback]').textContent = '비행 중';
    this.refreshHud();
    audio.fire('ball');
  }

  private finish(): void {
    this.phase = 'result';
    this.result = summarize(this.aims)!;
    let best = personalBest();
    if (!best || this.result.rank > best.rank) {
      best = this.result;
      writeLocal(BEST_KEY, JSON.stringify(this.aims));
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
        const feedback = this.select('[data-feedback]');
        feedback.textContent = `지난 발 · ${feedback.textContent}`;
        this.refreshHud();
      }
    }
    if (this.needsPaint || this.trajectory) {
      this.needsPaint = false;
      this.draw(now);
    }
    this.animation = requestAnimationFrame(this.update);
  };

  private rampartImage?: HTMLCanvasElement;
  private sceneryKey = -1;

  private draw(now: number): void {
    const g = this.ctx;
    const activeRound = this.trajectory ? this.aims.length - 1 : this.recent.length;
    const target = ROUNDS[Math.min(ROUNDS.length-1, activeRound)]!;
    const muzzle = MUZZLE_X + (this.objectAspect - 1) * 64;
    const distanceRatio = (target.distance - ROUNDS[0].distance) / (ROUNDS[ROUNDS.length-1]!.distance - ROUNDS[0].distance);
    const nearX = NEAR_TARGET_X + (this.objectAspect - 1) * 48;
    const targetLine = nearX + (FAR_TARGET_X - nearX) * distanceRatio;
    const scaleX = (targetLine - muzzle) / target.distance;
    const targetX = (distance: number) => muzzle + distance * scaleX;
    const targetY = (height: number) => LINE_Y - height * SCALE_Y;
    const x = targetX(target.distance);
    g.clearRect(0, 0, WIDTH, HEIGHT);
    if (!this.rampartImage || this.sceneryKey !== muzzle + activeRound * WIDTH) {
      this.sceneryKey = muzzle + activeRound * WIDTH;
      this.rampartImage = document.createElement('canvas');
      this.rampartImage.width = WIDTH*2;
      this.rampartImage.height = HEIGHT*2;
      const stone = this.rampartImage.getContext('2d')!;
      stone.scale(2,2);
      const floor = targetY(FLOOR_HEIGHT);
      const launch = LINE_Y + 16;
      drawCliff(stone, [[0,launch],[muzzle+50,launch],[muzzle+68,floor+30],[muzzle+116,floor+36],[muzzle+150,floor+92],[muzzle+224,floor+105],[muzzle+270,HEIGHT]], this.rockTexture);
      drawCliff(stone, [[x-310,HEIGHT],[x-255,floor+129],[x-209,floor+120],[x-168,floor+70],[x-119,floor+58],[x-90,floor],[WIDTH,floor]], this.rockTexture);
      if ('wall' in target) {
        drawBarricade(stone, targetX(target.wall.distance), targetY(target.wall.height), WALL_SPAN * scaleX, HEIGHT, this.rockTexture);
      }
    }
    g.drawImage(this.rampartImage,0,0,WIDTH,HEIGHT);
    const elapsed = this.trajectory ? Math.max(0, now - this.trajectory.start) : Infinity;
    const contactAge = this.trajectory ? elapsed - this.trajectory.flightMs : Infinity;
    const boardKick = !this.reducedMotion && this.phase === 'feedback' && (this.trajectory?.shot.points ?? 0) > 0
      ? Math.sin(contactAge / 44) * Math.exp(-contactAge / 135) * .12 : 0;
    drawRangeStand(g, x, targetY(target.height), targetY(FLOOR_HEIGHT), this.objectAspect, boardKick);
    if (this.portrait.complete && this.portrait.naturalWidth) g.drawImage(this.portrait, muzzle-78*this.objectAspect, LINE_Y-77, 96 * this.objectAspect, 96);
    const tangent = this.aim.slope / SLOPE_SCALE;
    const direction = Math.atan2(-tangent * SCALE_Y, scaleX);
    g.save();
    g.translate(targetX(0), LINE_Y);
    g.rotate(direction);
    if (!this.reducedMotion && elapsed < 220 && this.aim.power > 0) {
      const recoil = elapsed < 32 ? elapsed / 32 : (1 - (elapsed - 32) / 188) ** 2;
      g.translate(-10 * recoil, 0);
      if (elapsed < 105) {
        g.save();
        const flash = 1 - elapsed / 105;
        g.globalAlpha = flash;
        g.scale(.45 + flash * .55, .5 + flash * .5);
        g.fillStyle = '#ffae4b';
        g.beginPath(); g.moveTo(0,-5); g.lineTo(16,-12); g.lineTo(13,-5); g.lineTo(38,0);
        g.lineTo(16,4); g.lineTo(20,10); g.lineTo(0,5); g.closePath(); g.fill();
        g.fillStyle = '#fff5bb';
        g.beginPath(); g.moveTo(0,-3); g.lineTo(24,0); g.lineTo(0,3); g.fill();
        g.restore();
      }
    }
    const iron = g.createLinearGradient(0,-8,0,8);
    iron.addColorStop(0,'#273143'); iron.addColorStop(.28,'#838b92'); iron.addColorStop(.5,'#364756'); iron.addColorStop(1,'#172133');
    g.fillStyle = iron; g.strokeStyle = '#332622'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(-31,-5); g.lineTo(-3,-8); g.lineTo(1,-8); g.lineTo(1,8); g.lineTo(-31,6); g.closePath(); g.fill(); g.stroke();
    for (const band of [-25,-6]) { g.fillStyle='#a06f3e'; g.fillRect(band,-8,5,16); g.fillStyle='#ffe4a0'; g.fillRect(band,-7,2,13); }
    g.restore();

    if (!this.trajectory) return;
    const {shot, wind, start, flightMs} = this.trajectory;
    const progress = Math.min(1, (now-start)/flightMs);
    const position = (t: number) => {
      if (shot.power === 0) return {x:muzzle, y:targetY(FLOOR_HEIGHT * Math.max(0,t) ** 2)};
      const x = Math.max(0, t) * shot.impactX;
      return {x:targetX(x), y:targetY(x ? heightAt(x, shot, wind) : 0)};
    };
    if (this.phase === 'flight') {
      if (!this.reducedMotion) {
        // Puffs stay at their emission coordinates while the shell travels ahead.
        g.save();
        for (let i=Math.max(0,Math.floor((progress-.24)*120));i<progress*120;i++) {
          const age=(progress-i/120)/.24;
          const puff=position(i/120);
          const size=1.5+age*(4+2*Math.sin(i));
          g.fillStyle='rgba(102,91,89,'+(Math.max(0,1-age)*.6)+')';
          g.beginPath();
          g.ellipse(puff.x,puff.y-age*(8+Math.sin(i*3.7)*10),size*this.objectAspect,size,0,0,Math.PI*2);
          g.fill();
        }
        g.restore();
        const count = 16;
        let prev = position(progress - .10);
        g.save();
        g.lineCap = 'round';
        for (let i = 1; i <= count; i++) {
          const t = i/count;
          const point = position(progress - .10 * (1 - t));
          g.strokeStyle = t>.65 ? '#ffcc69' : 'rgba(91,76,73,'+(t*.75)+')';
          g.lineWidth = (1-t)*7+2;
          g.beginPath(); g.moveTo(prev.x, prev.y); g.lineTo(point.x, point.y); g.stroke();
          prev = point;
        }
        g.restore();
      }
      const ball = position(progress);
      const behind = position(progress - .008);
      g.save();
      g.translate(ball.x,ball.y);
      g.scale(this.objectAspect,1);
      if (!this.reducedMotion) {
        g.rotate(Math.atan2(ball.y-behind.y,(ball.x-behind.x)/this.objectAspect));
        g.fillStyle='#ffac48'; g.shadowColor='#ff922d'; g.shadowBlur=13;
        g.beginPath(); g.moveTo(-2,-5); g.lineTo(-22,-2); g.lineTo(-14,0); g.lineTo(-26,3); g.lineTo(0,5); g.fill();
      }
      g.shadowBlur=0;
      const shell=g.createRadialGradient(-2,-3,0,0,0,7);
      shell.addColorStop(0,'#fff5ce'); shell.addColorStop(.32,'#968679'); shell.addColorStop(.74,'#33323a'); shell.addColorStop(1,'#191c24');
      g.fillStyle=shell; g.strokeStyle='#ffbd64'; g.lineWidth=1.4;
      g.beginPath(); g.arc(0,0,7,0,Math.PI*2); g.fill(); g.stroke(); g.restore();
    } else if (this.phase === 'feedback') {
      const landingX = targetX(shot.impactX);
      const landingY = Math.max(12, targetY(shot.impactHeight));
      const fade = Math.max(0, 1 - (now - start - flightMs) / 680);
      const center = isCenter(shot);
      const spread = this.reducedMotion ? 12 : 12 + (1-fade)*30;
      g.save();
      g.translate(landingX, landingY);
      if (shot.stop === 'wall' || shot.points > 0) {
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
      }
      g.restore();
      // Pin the actual landing coordinate while the transient burst clears.
      g.save();
      g.translate(landingX, landingY);
      g.fillStyle = center ? '#ffda70' : '#fff2cc';
      g.strokeStyle = '#3e2722';
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(0,0); g.lineTo(-5,-10); g.lineTo(5,-10); g.closePath(); g.fill(); g.stroke();
      g.restore();
    }
  }

  private openBoard(submit: boolean): void {
    this.select('.target-submit').hidden = !submit || !this.result;
    this.select<HTMLInputElement>('#target-nickname').value = readLocal(NICKNAME_KEY);
    if (!this.board.open) this.board.showModal();
    void this.refreshBoard();
  }

  private async refreshBoard(message?: string): Promise<void> {
    const request = ++this.boardRequest;
    this.select('[data-ranking]').replaceChildren();
    this.select('[data-action=remove]').hidden = true;
    this.select('[data-online]').textContent = message ?? '순위를 불러오는 중…';
    try {
      const rows = await loadBoard();
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
    this.select('[data-action=remove]').hidden = !this.onlineOwner;
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
      writeLocal(NICKNAME_KEY,nickname);
      if (this.destroyed) return;
      this.onlineOwner = response.uid;
      this.select('.target-submit').hidden = true;
      await this.refreshBoard(response.kept ? '등록한 최고 기록을 유지했어요.' : '누적 순위에 등록됐어요.');
    } catch (err) { if (!this.destroyed) this.onlineError(err); }
    finally { if (!this.destroyed) this.setBusy(false); }
  }

  private async removeOnline(): Promise<void> {
    if (this.busy) return;
    this.setBusy(true);
    try {
      await deleteScore();
      if (this.destroyed) return;
      writeLocal(OWNER_KEY, '');
      this.onlineOwner = '';
      await this.refreshBoard('등록한 기록을 삭제했어요.');
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
function drawRangeStand(g: CanvasRenderingContext2D, x: number, y: number, floor: number, aspect: number, kick: number): void {
  g.save();
  g.translate(x,y);
  const beam = (x1: number,y1: number,x2: number,y2: number,diameter: number) => {
    g.lineWidth = diameter; g.strokeStyle = '#49362d'; g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
    g.lineWidth = diameter*.38; g.strokeStyle = '#b28c5e'; g.beginPath(); g.moveTo(x1-1,y1-1); g.lineTo(x2-1,y2-1); g.stroke();
  };
  const standBottom = Math.max(5, floor-y);
  const standTop = Math.min(standBottom-3, 23);
  for (const post of [-29,29]) beam(post,standTop,post,standBottom,7);
  if (standBottom - standTop > 10) {
    beam(-29,standTop,29,standBottom,5); beam(29,standTop,-29,standBottom,5);
  }
  beam(-35,standTop,35,standTop,7);
  beam(0,0,0,standTop,7);
  g.save();
  g.transform(1, 0, kick * aspect, 1, -standTop * kick * aspect, 0);
  const rings = [[BANDS[2] * SCALE_Y, '#432c27'], [BANDS[2] * SCALE_Y - 2, '#a84e36'],
    [BANDS[1] * SCALE_Y, '#ffdf9b'], [BANDS[0] * SCALE_Y, '#bb4731']] as const;
  for (const [radius, color] of rings) { g.fillStyle=color; g.beginPath(); g.ellipse(0,0,radius * aspect,radius,0,0,Math.PI*2); g.fill(); }
  g.save(); g.scale(aspect,1);
  const radius = BANDS[2]*SCALE_Y;
  g.save();
  g.beginPath(); g.arc(0,0,radius-4,0,Math.PI*2); g.clip();
  const lacquer = g.createLinearGradient(-radius,-radius,radius,radius);
  lacquer.addColorStop(0,'rgba(255,226,151,.52)'); lacquer.addColorStop(.45,'rgba(255,219,164,.05)'); lacquer.addColorStop(1,'rgba(83,30,21,.46)');
  g.fillStyle=lacquer; g.fillRect(-radius,-radius,radius*2,radius*2);
  for(let i=-3;i<=3;i++) {
    const offset=i*radius*.35;
    g.lineWidth=.85; g.strokeStyle='rgba(70,32,25,.30)';
    g.beginPath(); g.moveTo(offset+6,-radius); g.lineTo(offset,radius*.1); g.lineTo(offset-5,radius); g.stroke();
  }
  g.restore();
  g.strokeStyle='#dfad58'; g.lineWidth=3; g.beginPath(); g.arc(0,0,radius-3,0,Math.PI*2); g.stroke();
  for(let i=0;i<16;i++) {
    const angle=i*Math.PI/8;
    g.fillStyle=i%2?'#6b421c':'#fff1af'; g.beginPath(); g.arc(Math.cos(angle)*(radius-3),Math.sin(angle)*(radius-3),1.4,0,Math.PI*2); g.fill();
  }
  g.restore();
  g.restore();
  g.translate(40*(aspect-1),0);
  beam(40,standTop,40,-53,4);
  g.fillStyle='#953b33'; g.strokeStyle='#d4a158'; g.lineWidth=1.5;
  g.beginPath(); g.moveTo(41,-47); g.lineTo(67,-47); g.lineTo(62,-40); g.lineTo(67,-33); g.lineTo(41,-33); g.closePath(); g.fill(); g.stroke();
  g.fillStyle='#eed18c'; g.beginPath(); g.moveTo(51,-45); g.lineTo(56,-40); g.lineTo(51,-35); g.lineTo(47,-40); g.closePath(); g.fill();
  g.restore();
}
