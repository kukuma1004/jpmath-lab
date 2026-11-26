import { GAME_SUBTITLE, GAME_TITLE, MOVE_BUDGET, WIND_MAX } from '../config/constants';
import { CHARACTERS, character } from '../data/characters';
import { MAPS, mapDef } from '../data/maps';
import { weapon } from '../data/weapons';
import type { Battle } from '../combat/battle';
import { ULTIMATE_RECHARGE_TURNS, ULTIMATE_TURN } from '../combat/battle';
import type { AimHint } from '../combat/aimAdvisor';
import type { Difficulty, Team, WeaponSlot } from '../combat/types';
import { input, type Hold } from '../input/input';
import type { Settings } from '../settings';
import { audio } from '../audio/audio';

export type Mode = 'ai' | 'local';

export function playerLabel(mode: Mode, team: Team, freeForAll: boolean): string {
  if (mode === 'local') return `${team + 1}P`;
  if (team === 0) return '나';
  return freeForAll ? `AI ${team}` : 'AI';
}

export interface UIHooks {
  /** chars는 장수 순서([1팀, 2팀, 1팀, 2팀]) 그대로 */
  startBattle(mode: Mode, chars: string[], mapId: string, freeForAll: boolean): void;
  quickBattle(): void;
  targetRange(): void;
  toTitle(): void;
  rematch(): void;
  rechar(): void;
  resume(): void;
  restart(): void;
  pause(): void;
  weapon(slot: WeaponSlot): void;
  flip(): void;
  camera(): void;
  recenter(): void;
  settingsChanged(s: Settings): void;
}

const DIFF_LABEL: Record<Difficulty, string> = { easy: '쉬움', normal: '보통', hard: '어려움' };
const RANDOM_CHARACTER = 'random';

function josa(word: string, a: string, b: string): string {
  const ch = word.charCodeAt(word.length - 1);
  if (ch < 0xac00 || ch > 0xd7a3) return word + b;
  return word + ((ch - 0xac00) % 28 ? a : b);
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
}

function h(html: string): HTMLElement {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild as HTMLElement;
}

export class UI {
  root: HTMLElement;
  portraits: Record<string, { normal: string; happy: string; hurt: string; flip: string; bust: string; bustFlip: string }> = {};
  mapThumbs: Record<string, string> = {};
  mode: Mode = 'ai';
  private screens = new Map<string, HTMLElement>();
  private step = 0;
  /** 장수 순서대로 고른 것([1팀 첫째, 2팀 첫째, 1팀 둘째, 2팀 둘째]) */
  private picks: string[];
  private mapPick: string;
  private hudCache = new Map<string, string>();
  private bannerT = 0;
  private toastT = 0;

  constructor(root: HTMLElement, public settings: Settings, private hooks: UIHooks) {
    this.root = root;
    this.picks = [...settings.lastChars];
    this.mapPick = settings.lastMap;
    this.build();
    root.addEventListener('contextmenu', (e) => e.preventDefault());
    // 첫 터치·클릭에서 소리를 연다
    const unlock = () => audio.unlock();
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    root.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (b && !b.dataset.hold) audio.click();
    });
  }

  private add(name: string, el: HTMLElement): HTMLElement {
    el.dataset.s = name;
    this.screens.set(name, el);
    this.root.appendChild(el);
    return el;
  }

  show(name: string, on = true): void {
    this.screens.get(name)?.classList.toggle('on', on);
  }

  only(...names: string[]): void {
    for (const [k, el] of this.screens) el.classList.toggle('on', names.includes(k));
  }

  isOn(name: string): boolean {
    return !!this.screens.get(name)?.classList.contains('on');
  }

  // ───────── 만들기 ─────────

  private build(): void {
    this.add('loading', h(`<section class="screen loading on"><div style="text-align:center"><b>${GAME_TITLE}</b><div class="bar"><i></i></div></div></section>`));
    this.buildTitle();
    this.buildChars();
    this.buildMaps();
    this.buildHud();
    this.buildPause();
    this.buildResult();
    this.buildSettings();
    this.buildHowto();
  }

  private buildTitle(): void {
    const letters = [...GAME_TITLE].map((c) => `<span>${c}</span>`).join('');
    const el = this.add('title', h(`
      <section class="screen title">
        <div class="title-wrap">
          <div class="logo" aria-label="${GAME_TITLE}">${letters}<i class="seal">한판</i></div>
          <div class="subtitle">${GAME_SUBTITLE}</div>
          <div class="menu">
            <button class="btn primary quick" data-act="quick">바로 한 판<small>쉬운 AI · 내가 먼저 발사</small></button>
            <button class="btn jade target-entry" data-act="target">표적 10발<small>각도와 힘으로 누적 순위 도전</small></button>
            <button class="btn" data-act="ai">AI와 겨루기<small>장수·전장 고르기</small></button>
            <button class="btn jade" data-act="local">함께 하기<small>한 기기로 2~4명</small></button>
            <button class="btn" data-act="howto">게임 방법</button>
            <button class="btn" data-act="settings">설정</button>
          </div>
          <div class="foot"><a href="../">← JP Math Lab 게임 목록</a><span>PC 키보드 · 마우스 · 모바일 터치</span></div>
        </div>
      </section>`));
    el.addEventListener('click', (e) => {
      const act = (e.target as HTMLElement).closest('button')?.dataset.act;
      if (act === 'ai' || act === 'local') this.openChars(act);
      else if (act === 'quick') this.hooks.quickBattle();
      else if (act === 'target') this.hooks.targetRange();
      else if (act === 'howto') this.show('howto');
      else if (act === 'settings') this.openSettings();
    });
  }

  showTitle(): void {
    this.only('title');
  }

  // 장수 고르기
  private buildChars(): void {
    const el = this.add('chars', h(`
      <section class="screen sel roster">
        <div class="sel-head"><h2>장수 고르기</h2><span class="who">1P</span><p class="hint"></p></div>
        <div class="sel-body">
          <div class="grid" role="listbox" aria-label="장수"></div>
          <div class="detail"></div>
        </div>
        <div class="sel-foot">
          <button class="btn ghost" data-act="back">← 뒤로</button>
          <span class="chip-label">대전</span>
          <div class="chips size"><button data-size="1">1:1</button><button data-size="2">2:2</button><button data-size="ffa">1:1:1:1</button></div>
          <span class="chip-label ai-only">AI 실력</span>
          <div class="chips ai-only diff">${(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => `<button data-d="${d}">${DIFF_LABEL[d]}</button>`).join('')}</div>
          <span class="grow"></span>
          <button class="btn ghost" data-act="random" aria-pressed="false">아무나</button>
          <button class="btn primary" data-act="next">이 장수로 →</button>
        </div>
      </section>`));
    el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const card = t.closest<HTMLElement>('.card');
      if (card?.dataset.id) {
        this.picks[this.slotOf(this.step)] = card.dataset.id;
        audio.select();
        this.renderChars();
        return;
      }
      const size = t.closest<HTMLElement>('[data-size]')?.dataset.size;
      if (size) {
        this.settings.teamSize = size === 'ffa' ? 'ffa' : size === '2' ? 2 : 1;
        this.hooks.settingsChanged(this.settings);
        this.step = 0;
        this.renderChars();
        return;
      }
      const d = t.closest<HTMLElement>('[data-d]')?.dataset.d as Difficulty | undefined;
      if (d) {
        this.settings.difficulty = d;
        this.hooks.settingsChanged(this.settings);
        this.renderChars();
        return;
      }
      const act = t.closest('button')?.dataset.act;
      if (act === 'back') {
        if (this.step > 0) { this.step--; this.renderChars(); }
        else this.showTitle();
      } else if (act === 'random') {
        this.picks[this.slotOf(this.step)] = RANDOM_CHARACTER;
        audio.select();
        this.renderChars();
      } else if (act === 'next') {
        if (this.step < this.steps - 1) { this.step++; this.renderChars(); }
        else this.openMaps();
      }
    });
    el.addEventListener('dblclick', (e) => {
      if ((e.target as HTMLElement).closest('.card')) el.querySelector<HTMLButtonElement>('[data-act=next]')?.click();
    });
  }

  openChars(mode: Mode): void {
    this.mode = mode;
    this.step = 0;
    this.renderChars();
    this.only('chars');
  }

  /** 고르는 차례 수(1:1은 2번, 2:2는 4번) */
  private get steps(): number {
    return this.settings.teamSize === 1 ? 2 : 4;
  }

  /** 고르는 차례 → 장수 순서 자리. 2:2는 1팀 둘을 먼저, 그다음 2팀 둘을 고른다 */
  private slotOf(step: number): number {
    return this.settings.teamSize === 2 ? [0, 2, 1, 3][step]! : step;
  }

  private stepLabel(step: number): { who: string; title: string; hint: string; team: Team } {
    if (this.settings.teamSize === 'ffa') {
      const team = step as Team;
      const who = playerLabel(this.mode, team, true);
      return { who, title: `${who} 장수 고르기`, hint: '개인전 · 장수 넷이 각자 싸워 마지막 한 명이 이깁니다.', team };
    }
    const team = (this.slotOf(step) % 2) as 0 | 1;
    const ai = this.mode === 'ai';
    if (this.settings.teamSize === 1) {
      if (step === 0) return { who: ai ? '나' : '1P', title: '장수 고르기', hint: '나와 함께 싸울 장수를 고르세요. 두 번 누르면 바로 넘어갑니다.', team };
      return ai
        ? { who: 'AI 상대', title: '상대 장수 고르기', hint: 'AI가 맡을 장수를 고르세요. 같은 장수끼리도 됩니다.', team }
        : { who: '2P', title: '2P 장수 고르기', hint: '2P가 고를 차례입니다. 기기를 넘겨 주세요.', team };
    }
    const nth = this.slotOf(step) < 2 ? '첫째' : '둘째';
    if (team === 0) return { who: ai ? `내 편 ${nth}` : `1P ${nth}`, title: ai ? `내 편 ${nth} 장수` : `1P ${nth} 장수`, hint: ai ? '내 편 장수 둘을 고르세요. 둘 다 내가 번갈아 조종합니다.' : '1P 편 장수 둘을 고르세요. 둘 다 1P가 조종합니다.', team };
    return ai
      ? { who: `AI ${nth}`, title: `상대 편 ${nth} 장수`, hint: 'AI가 맡을 장수 둘을 고르세요.', team }
      : { who: `2P ${nth}`, title: `2P ${nth} 장수`, hint: '2P 편 장수 둘을 고르세요. 기기를 넘겨 주세요.', team };
  }

  private renderChars(): void {
    const el = this.screens.get('chars')!;
    const step = Math.min(this.step, this.steps - 1);
    this.step = step;
    const lab = this.stepLabel(step);
    const who = el.querySelector<HTMLElement>('.who')!;
    who.textContent = lab.who;
    who.dataset.team = String(lab.team + 1);
    el.querySelector('h2')!.textContent = lab.title;
    el.querySelector('.hint')!.textContent = lab.hint;
    el.querySelectorAll<HTMLElement>('.ai-only').forEach((x) => (x.style.display = this.mode === 'ai' ? '' : 'none'));
    el.querySelectorAll<HTMLElement>('.diff button').forEach((b) => b.classList.toggle('on', b.dataset.d === this.settings.difficulty));
    el.querySelectorAll<HTMLElement>('.size button').forEach((b) => b.classList.toggle('on', b.dataset.size === String(this.settings.teamSize)));
    const grid = el.querySelector('.grid')!;
    const slot = this.slotOf(step);
    const random = this.picks[slot] === RANDOM_CHARACTER;
    el.querySelector('[data-act=random]')!.setAttribute('aria-pressed', String(random));
    const next = el.querySelector<HTMLButtonElement>('[data-act=next]')!;
    next.textContent = step === this.steps - 1 ? '전장 고르기 →' : random ? '랜덤 장수로 →' : '이 장수로 →';
    grid.innerHTML = CHARACTERS.map((c) => {
      const on = this.picks[slot] === c.id;
      // 앞에서 고른 장수 표시
      const tags = Array.from({ length: step }, (_, k) => k)
        .filter((k) => this.picks[this.slotOf(k)] === c.id)
        .map((k) => { const l = this.stepLabel(k); return `<span class="tag p${l.team + 1}">${l.who}</span>`; })
        .slice(0, 1).join('');
      return `<button class="card${on ? ' on' : ''}" data-id="${c.id}" role="option" aria-selected="${on}">${tags}<img alt="" src="${this.portraits[c.id]?.[lab.team === 1 ? 'flip' : 'normal'] ?? ''}"><b>${c.name}</b><em>${c.role}</em></button>`;
    }).join('');
    const detail = el.querySelector('.detail')!;
    if (random) {
      detail.innerHTML = '<div class="detail-top random-detail"><strong aria-hidden="true">?</strong><div><h3>랜덤 장수</h3><p>싸움이 시작될 때 뽑힌 장수를 알려줍니다.</p></div></div>';
      return;
    }
    const c = character(this.picks[slot]!);
    const nw = weapon(c.normal), sw = weapon(c.special), ult = weapon(c.ultimate);
    const pip = (n: number) => `<span class="pips">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`;
    detail.innerHTML = `
      <div class="detail-top"><img alt="" src="${this.portraits[c.id]?.happy ?? ''}"><div><h3>${c.name}</h3><span class="role">${c.role}</span><p>${esc(c.blurb)}</p></div></div>
      <div class="stats">
        <span>체력</span><strong>${c.hp}</strong><span>화력</span>${pip(c.stats.power)}<span>폭발 범위</span>${pip(c.stats.range)}<span>정확도</span>${pip(c.stats.accuracy)}<span>방어</span>${pip(c.stats.defense)}<span>기동</span>${pip(c.stats.mobility)}
      </div>
      <div class="weap">
        <div class="trait"><b><span class="tr">특기</span>${c.trait.name}</b><p>${esc(c.trait.desc)}</p></div>
        <div><b><span>1번 · ${esc(nw.use)}</span>${nw.name}</b><p>${esc(nw.desc)}</p></div>
        <div><b><span class="sp">2번 · ${esc(sw.use)}</span>${sw.name}</b><p>${esc(sw.desc)} 두 탄 모두 매 차례 자유롭게 고릅니다.</p></div>
        <div class="ultimate-detail"><b><span>궁극기</span>${ult.name}</b><p>${esc(ult.desc)} 자기 ${ULTIMATE_TURN}번째 차례에 열리고, 발사 후 자기 차례가 ${ULTIMATE_RECHARGE_TURNS}번 돌아오면 다시 쓸 수 있습니다.</p></div>
      </div>`;
  }

  // 전장 고르기
  private buildMaps(): void {
    const el = this.add('maps', h(`
      <section class="screen sel">
        <div class="sel-head"><h2>전장 고르기</h2><p>시작 위치는 매판 무작위 · 양 팀은 같은 높이의 좌우 대칭 배치입니다.</p></div>
        <div class="sel-body">
          <div class="grid maps"></div>
          <div class="detail"></div>
        </div>
        <div class="sel-foot">
          <button class="btn ghost" data-act="back">← 장수 다시</button>
          <span class="grow"></span>
          <button class="btn primary" data-act="go">싸움 시작!</button>
        </div>
      </section>`));
    el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const card = t.closest<HTMLElement>('.card');
      if (card?.dataset.id) {
        this.mapPick = card.dataset.id;
        audio.select();
        this.renderMaps();
        return;
      }
      const tt = t.closest<HTMLElement>('[data-tt]')?.dataset.tt;
      if (tt) { this.settings.turnTime = Number(tt); this.hooks.settingsChanged(this.settings); this.renderMaps(); return; }
      const tl = t.closest<HTMLElement>('[data-tl]')?.dataset.tl;
      if (tl) { this.settings.turnLimit = Number(tl); this.hooks.settingsChanged(this.settings); this.renderMaps(); return; }
      const act = t.closest('button')?.dataset.act;
      if (act === 'back') { this.step = this.steps - 1; this.renderChars(); this.only('chars'); }
      else if (act === 'go') this.go();
    });
    el.addEventListener('dblclick', (e) => { if ((e.target as HTMLElement).closest('.card')) this.go(); });
  }

  private go(): void {
    let mapId = this.mapPick;
    if (mapId === 'random') mapId = MAPS[Math.floor(Math.random() * MAPS.length)]!.id;
    const picks = this.picks.slice(0, this.steps);
    const pool = CHARACTERS.filter(c => !picks.includes(c.id));
    const chars = picks.map(id => {
      if (id !== RANDOM_CHARACTER) return id;
      const [draw] = pool.splice(Math.floor(Math.random() * pool.length), 1);
      return draw!.id;
    });
    this.hooks.startBattle(this.mode, chars, mapId, this.settings.teamSize === 'ffa');
  }

  openMaps(): void {
    this.renderMaps();
    this.only('maps');
  }

  private renderMaps(): void {
    const el = this.screens.get('maps')!;
    const freeForAll = this.settings.teamSize === 'ffa';
    el.querySelector('.sel-head p')!.textContent = freeForAll
      ? '네 자리를 무작위로 배정합니다. 마지막까지 살아남으세요.'
      : '시작 위치는 매판 무작위 · 양 팀은 같은 높이의 좌우 대칭 배치입니다.';
    const grid = el.querySelector('.grid')!;
    grid.innerHTML = MAPS.map((m) => `<button class="card mapcard${this.mapPick === m.id ? ' on' : ''}" data-id="${m.id}"><img alt="" src="${this.mapThumbs[m.id] ?? ''}"><b>${m.name}</b><em>${m.features}</em></button>`).join('')
      + `<button class="card mapcard rand${this.mapPick === 'random' ? ' on' : ''}" data-id="random"><b>?</b><em>아무 전장이나</em></button>`;
    const d = this.mapPick === 'random' ? null : mapDef(this.mapPick);
    const chips = (attr: string, vals: number[], cur: number, unit: string) => `<div class="chips">${vals.map((v) => `<button data-${attr}="${v}" class="${v === cur ? 'on' : ''}">${v === 0 ? '끝장전' : `${v}${unit}`}</button>`).join('')}</div>`;
    el.querySelector('.detail')!.innerHTML = `
      ${d ? `<img alt="" src="${this.mapThumbs[d.id] ?? ''}" style="width:100%;border-radius:14px;aspect-ratio:2/1;object-fit:cover">` : ''}
      <div><h3>${d ? d.name : '아무 전장이나'}</h3><p>${d ? esc(d.desc) : `${MAPS.length}개 전장 가운데 하나를 골라 싸움 시작 때 이름을 보여줍니다.`}</p>${d ? `<p style="margin-top:6px;color:var(--gold-2)">${d.features}</p>` : ''}</div>
      <div class="stats" style="grid-template-columns:auto 1fr;align-content:start">
        <span>턴 시간</span>${chips('tt', [20, 30, 45], this.settings.turnTime, '초')}
        <span>승부 방식</span>${chips('tl', [0, 20, 30, 40], this.settings.turnLimit, '턴')}
      </div><p>${freeForAll ? '끝장전은 장수 한 명만 남을 때까지 계속합니다.' : '끝장전은 상대 편이 모두 쓰러질 때까지 계속합니다.'}</p>`;
  }

  // ───────── 전투 화면 ─────────

  private buildHud(): void {
    const el = this.add('hud', h(`
      <section class="screen hud">
        <div class="top">
          <div class="team t1"></div>
          <div class="center">
            <div class="turnpill"><div class="timer"><svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="17"/><circle class="fg" cx="20" cy="20" r="17" stroke-dasharray="106.8" stroke-dashoffset="0"/></svg><b>30</b></div><span class="tp">1P 차례</span><span class="tno"></span></div>
            <div class="wind"><span class="lbl">바람</span><div class="arrow"><div class="track"></div><div class="mid"></div><div class="fill"></div></div><span class="v">0</span></div>
            <div class="status"></div>
          </div>
          <div class="team t2"></div>
        </div>
        <div class="battle-window">
          <button class="pausebtn" data-act="pause" aria-label="일시정지">Ⅱ</button>
          <div class="camtools">
            <button class="cambtn" data-act="camera" aria-pressed="false">전체 보기</button>
            <button class="cambtn home" data-act="recenter" aria-label="내 장수로 돌아가기">내 장수로</button>
          </div>
          <div class="banner" role="status"><b></b><div class="map-matchup" hidden></div><span></span></div>
          <div class="toast"></div>
        </div>
        <div class="bottom">
          <div class="pad move"><div class="row"><button class="kbtn" data-hold="left" aria-label="왼쪽으로 이동">◀<small>A</small></button><button class="kbtn" data-hold="right" aria-label="오른쪽으로 이동">▶<small>D</small></button></div><div class="movebar"><i></i></div><div class="lbl">이동</div></div>
          <div class="pad aim"><div class="row"><button class="kbtn" data-hold="aimDown" aria-label="포신 내리기">▼<small>↓</small></button><div class="angle-read"><span class="ang">45°</span><small>각도</small></div><button class="kbtn" data-hold="aimUp" aria-label="포신 올리기">▲<small>↑</small></button><button class="kbtn" data-act="flip" aria-label="방향 바꾸기">⇄<small>←→</small></button></div><div class="lbl angle-hint">각도</div></div>
          <div class="weapons" aria-label="포탄과 궁극기"><button class="wbtn" data-w="0"><kbd>1</kbd><b class="wn0"></b><small class="wu0"></small></button><button class="wbtn" data-w="1"><kbd>2</kbd><b class="wn1"></b><small class="wu1"></small></button><button class="wbtn ult-btn" data-w="2"><kbd>R</kbd><b class="wn2"></b><small class="wu2"></small></button></div>
          <div class="firewrap">
            <div class="power"><div class="ticks"></div><i></i><div class="last" hidden></div><span>힘 0</span></div>
            <button class="fire" data-hold="charge" aria-label="힘 모아 발사">발사<small>Space 꾹</small></button>
          </div>
        </div>
      </section>`));
    // 누르고 있는 단추
    el.querySelectorAll<HTMLElement>('[data-hold]').forEach((b) => {
      const hold = b.dataset.hold as Hold;
      const on = (e: PointerEvent) => {
        e.preventDefault();
        audio.unlock();
        if (b.closest('.bottom.off') || (e.pointerType === 'mouse' && e.button !== 0)) return;
        try { b.setPointerCapture(e.pointerId); } catch { /* 일부 브라우저 */ }
        b.classList.add('held');
        input.set(hold, true);
      };
      const off = (e: PointerEvent) => {
        if (!b.classList.contains('held')) return;
        b.classList.remove('held');
        if (hold === 'charge' && e.type !== 'pointerup') input.cancelCharge();
        else input.set(hold, false);
      };
      b.addEventListener('pointerdown', on);
      b.addEventListener('pointerup', off);
      b.addEventListener('pointercancel', off);
      b.addEventListener('lostpointercapture', off);
    });
    el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const w = t.closest<HTMLElement>('[data-w]')?.dataset.w;
      if (w !== undefined) { this.hooks.weapon(Number(w) as WeaponSlot); return; }
      const act = t.closest<HTMLElement>('[data-act]')?.dataset.act;
      if (act === 'pause') this.hooks.pause();
      else if (act === 'flip') this.hooks.flip();
      else if (act === 'camera') this.hooks.camera();
      else if (act === 'recenter') this.hooks.recenter();
    });
  }

  showHud(b: Battle, names: string[]): void {
    this.hudCache.clear();
    const el = this.screens.get('hud')!;
    const mini = b.fighters.length > 2;
    for (const team of [0, 1] as const) {
      const box = el.querySelector<HTMLElement>(`.team.t${team + 1}`)!;
      box.innerHTML = b.fighters.filter((f) => f.team % 2 === team).map((f) => {
        const c = character(f.charId);
        return `
        <div class="pcard p${team + 1}${mini ? ' mini' : ''}" data-f="${f.idx}" data-team="${f.team + 1}">
          <div class="who"><img alt="" src="${this.portraits[c.id]?.[team === 1 ? 'bustFlip' : 'bust'] ?? ''}"><i>${esc(names[f.idx] ?? '')}</i></div>
          <div><div class="name"><span class="nm">${mini && !b.cfg.freeForAll ? c.name : `${esc(names[f.idx] ?? '')} · ${c.name}`}</span><small class="hpn"></small></div>
          <div class="bar"><b></b><i></i><span></span></div>
          </div>
        </div>`;
      }).join('');
    }
    this.only('hud');
  }

  private set(key: string, val: string, fn: () => void): void {
    if (this.hudCache.get(key) === val) return;
    this.hudCache.set(key, val);
    fn();
  }

  updateHud(b: Battle, opts: { names: string[]; humanTurn: boolean; status: string; aimHint: AimHint|null }): void {
    const el = this.screens.get('hud')!;
    for (const f of b.fighters) {
      const i = f.idx;
      const card = el.querySelector<HTMLElement>(`.pcard[data-f="${i}"]`);
      if (!card) continue;
      const pct = Math.max(0, (f.hp / f.maxHp) * 100);
      this.set(`hp${i}`, `${f.hp}`, () => {
        const bar = card.querySelector<HTMLElement>('.bar')!;
        bar.querySelector<HTMLElement>('i')!.style.width = `${pct}%`;
        bar.querySelector<HTMLElement>('b')!.style.width = `${pct}%`;
        bar.querySelector('span')!.textContent = `${f.hp} / ${f.maxHp}`;
        bar.classList.toggle('low', pct <= 50 && pct > 25);
        bar.classList.toggle('crit', pct <= 25);
        card.querySelector('.hpn')!.textContent = f.alive ? '' : f.deathCause === 'fall' ? '낙사' : '쓰러짐';
        card.classList.toggle('dead', !f.alive);
      });
      this.set(`turn${i}`, `${b.current === i && b.phase !== 'GAME_OVER'}`, () => card.classList.toggle('turn', b.current === i && b.phase !== 'GAME_OVER'));
    }
    // 턴·시간·바람
    const tl = Math.max(0, Math.ceil(b.timeLeft));
    const playerPhase = b.isPlayerPhase() || b.phase === 'TURN_START';
    this.set('time', `${tl}|${playerPhase}`, () => {
      const timer = el.querySelector<HTMLElement>('.timer')!;
      timer.querySelector('b')!.textContent = playerPhase ? `${tl}` : '·';
      const frac = playerPhase ? Math.max(0, b.timeLeft / b.cfg.turnTime) : 0;
      timer.querySelector<SVGCircleElement>('.fg')!.style.strokeDashoffset = `${106.8 * (1 - frac)}`;
      timer.classList.toggle('hurry', playerPhase && tl <= 5);
      if (playerPhase && tl <= 5 && tl > 0 && b.phase !== 'TURN_START') audio.tick();
    });
    this.set('tp', `${b.current}|${b.turnNo}`, () => {
      const tp = el.querySelector<HTMLElement>('.tp')!;
      tp.textContent = b.fighters.length > 2 ? `${opts.names[b.current]} · ${character(b.cur.charId).name}` : `${opts.names[b.current]} 차례`;
      tp.dataset.team = String(b.cur.team + 1);
      el.querySelector('.tno')!.textContent = b.cfg.turnLimit > 0 ? `${Math.max(1, b.turnNo)} / ${b.cfg.turnLimit}턴` : `${Math.max(1, b.turnNo)}턴 · 끝장전`;
    });
    this.set('wind', `${b.wind}`, () => {
      const w = el.querySelector<HTMLElement>('.wind')!;
      const fill = w.querySelector<HTMLElement>('.fill')!;
      const k = (Math.abs(b.wind) / WIND_MAX) * 50;
      fill.style.left = b.wind >= 0 ? '50%' : `${50 - k}%`;
      fill.style.width = `${k}%`;
      w.querySelector('.v')!.textContent = b.wind === 0 ? '잔잔' : `${b.wind > 0 ? '→' : '←'} ${Math.abs(b.wind)}`;
      w.classList.remove('change');
      void w.offsetWidth;
      w.classList.add('change');
    });
    this.set('status', opts.status, () => {
      const s = el.querySelector<HTMLElement>('.status')!;
      s.textContent = opts.status;
      s.title = opts.status;
      s.classList.toggle('on', !!opts.status);
    });
    // 조작판
    const f = b.cur;
    const c = character(f.charId);
    const canAct = opts.humanTurn && b.isPlayerPhase();
    this.set('act', `${canAct}`, () => el.querySelector('.bottom')!.classList.toggle('off', !canAct));
    this.set('wn', c.id, () => {
      el.querySelector('.wn0')!.textContent = weapon(c.normal).name;
      el.querySelector('.wn1')!.textContent = weapon(c.special).name;
      el.querySelector('.wn2')!.textContent = weapon(c.ultimate).name;
      el.querySelector('.wu0')!.textContent = weapon(c.normal).use;
      el.querySelector('.wu1')!.textContent = weapon(c.special).use;
      for (const slot of [0, 1, 2] as const) {
        const w = b.weaponOf(f, slot);
        el.querySelector<HTMLButtonElement>(`[data-w="${slot}"]`)!.title = `${w.use} · ${w.desc}`;
      }
    });
    const ready = b.ultimateReady(f);
    this.set('slot', `${b.current}|${f.slot}|${canAct}|${b.phase}|${f.turnsTaken}|${f.nextUltimateTurn}`, () => {
      for (const slot of [0, 1, 2]) {
        const button = el.querySelector<HTMLButtonElement>(`[data-w="${slot}"]`)!;
        button.classList.toggle('on', f.slot === slot);
        button.disabled = !canAct || b.phase === 'CHARGE' || (slot === 2 && !ready);
        button.setAttribute('aria-pressed', String(f.slot === slot));
        if (slot === 2) button.classList.toggle('ready', ready);
      }
      const until = Math.max(1, f.nextUltimateTurn - f.turnsTaken);
      const waiting = f.nextUltimateTurn === ULTIMATE_TURN ? '궁극기' : '재충전';
      el.querySelector('.wu2')!.textContent = ready ? '궁극기 준비' : `${waiting} · ${until}턴 후`;
    });
    const rel = Math.min(f.angle, 180 - f.angle);
    const launch = b.launchAngle(f);
    const frameAngle = Math.round(Math.min(launch, 180 - launch));
    const angleLabel = Math.abs(launch - f.angle) >= 0.5 ? `발사 ${launch <= 90 ? '→' : '←'}${frameAngle}°` : '몸 기준';
    this.set('ang', `${Math.round(rel)}|${angleLabel}`, () => {
      el.querySelector('.ang')!.textContent = `${Math.round(rel)}°`;
      el.querySelector('.angle-read small')!.textContent = angleLabel;
    });
    const mv = Math.max(0, (f.moveLeft / (MOVE_BUDGET * c.moveMul)) * 100);
    this.set('mv', `${Math.round(mv)}`, () => { el.querySelector<HTMLElement>('.movebar i')!.style.width = `${mv}%`; });
    const pw = b.phase === 'CHARGE' ? f.power : 0;
    this.set('pw', `${pw.toFixed(1)}|${f.lastPower.toFixed(1)}|${b.phase}|${f.stats.shots}`, () => {
      const p = el.querySelector<HTMLElement>('.power')!;
      p.querySelector<HTMLElement>('i')!.style.width = `${pw}%`;
      const last = p.querySelector<HTMLElement>('.last')!;
      last.hidden = f.stats.shots === 0;
      last.style.left = `${f.lastPower}%`;
      p.querySelector('span')!.textContent = b.phase === 'CHARGE' ? `힘 ${pw.toFixed(1)}` : f.stats.shots ? `지난 힘 ${f.lastPower.toFixed(1)}` : '발사 힘';
    });
    this.updateAimHint(el,b,opts.aimHint);
  }

  private updateAimHint(el:HTMLElement,b:Battle,hint:AimHint|null):void {
    this.set('aimhint',`${JSON.stringify(hint)}:${b.current}:${b.cur.slot}`,()=>{
      const angle=el.querySelector<HTMLElement>('.angle-hint')!;
      angle.textContent=hint?.kind==='thinking'?'추천 각도 계산 중…':'각도';
      if(hint?.kind==='blocked'){
        angle.textContent=`${hint.direction>0?'→':'←'} 앞 지형이 막고 있어요`;
      }else if(hint?.kind==='range'){
        angle.textContent=`${hint.direction>0?'→':'←'} 추천 각도 ${hint.angle[0]}~${hint.angle[1]}°`;
      }
    });
    const f=b.cur,relative=f.angle<=90?f.angle:180-f.angle;
    const angleOK=hint?.kind==='range'&&(f.angle<=90?1:-1)===hint.direction&&relative>=hint.angle[0]&&relative<=hint.angle[1];
    this.set('aimhint-match',String(angleOK),()=>{
      el.querySelector('.angle-read')!.classList.toggle('in-hint',angleOK);
    });
  }

  /** 둘러보는 중이면 「내 장수로」 단추를 보인다 */
  setCameraMode(mode: 'auto' | 'enemy' | 'all', free: boolean): void {
    this.set('camera', `${mode}:${free}`, () => {
      const hud = this.screens.get('hud')!;
      hud.classList.toggle('freecam', free || mode === 'enemy');
      const button = hud.querySelector<HTMLButtonElement>('[data-act=camera]')!;
      button.textContent = mode === 'all' && !free ? '따라가기' : '전체 보기';
      button.setAttribute('aria-pressed', String(mode === 'all' && !free));
    });
  }

  battleIntro(b: Battle, names: string[], first: number): void {
    const matchup = this.screens.get('hud')!.querySelector('.map-matchup')!;
    matchup.innerHTML = b.sides.map(team => {
      const fighters = b.fighters.filter(f => f.team === team);
      const roster = fighters.map(f => {
        const portrait = this.portraits[f.charId]?.[team === 1 ? 'bustFlip' : 'bust'] ?? '';
        return `<li><img alt="" src="${portrait}">${esc(character(f.charId).name)}</li>`;
      }).join('');
      return `<div class="map-team" data-team="${team + 1}"><strong>${esc(names[fighters[0]!.idx]!)}</strong><ul>${roster}</ul></div>`;
    }).join('');
    this.banner(mapDef(b.cfg.mapId).name, `${names[first]} 먼저 쏩니다`, 'map-banner');
  }

  banner(text: string, sub = '', cls = ''): void {
    const el = this.screens.get('hud')!.querySelector<HTMLElement>('.banner')!;
    const intro = cls === 'map-banner';
    el.className = `banner ${cls}`;
    el.querySelector('b')!.textContent = text;
    el.querySelector('span')!.textContent = sub;
    el.querySelector<HTMLElement>('.map-matchup')!.hidden = !intro;
    void el.offsetWidth;
    el.classList.add('show');
    window.clearTimeout(this.bannerT);
    this.bannerT = window.setTimeout(() => el.classList.remove('show'), intro ? 2600 : 1700);
  }

  toast(text: string): void {
    const el = this.screens.get('hud')!.querySelector<HTMLElement>('.toast')!;
    el.textContent = text;
    el.classList.add('on');
    window.clearTimeout(this.toastT);
    this.toastT = window.setTimeout(() => el.classList.remove('on'), 1600);
  }

  // ───────── 정지 ─────────

  private buildPause(): void {
    const el = this.add('pause', h(`
      <section class="screen modal">
        <div class="sheet pause-sheet">
          <h2>잠깐 멈춤</h2>
          <button class="btn primary" data-act="resume">계속하기</button>
          <button class="btn" data-act="settings">설정</button>
          <button class="btn" data-act="howto">게임 방법</button>
          <button class="btn" data-act="restart">처음부터 다시</button>
          <button class="btn ghost" data-act="home">처음 화면으로</button>
        </div>
      </section>`));
    el.addEventListener('click', (e) => {
      const act = (e.target as HTMLElement).closest('button')?.dataset.act;
      if (act === 'resume') this.hooks.resume();
      else if (act === 'settings') this.openSettings();
      else if (act === 'howto') this.show('howto');
      else if (act === 'restart') this.hooks.restart();
      else if (act === 'home') this.hooks.toTitle();
    });
  }

  // ───────── 결과 ─────────

  private buildResult(): void {
    const el = this.add('result', h(`<section class="screen result"><div class="res"></div></section>`));
    el.addEventListener('click', (e) => {
      const act = (e.target as HTMLElement).closest('button')?.dataset.act;
      if (act === 'rematch') this.hooks.rematch();
      else if (act === 'rechar') this.hooks.rechar();
      else if (act === 'home') this.hooks.toTitle();
    });
  }

  showResult(b: Battle, names: string[]): void {
    const el = this.screens.get('result')!.querySelector('.res')!;
    const w = b.winner;
    const four = b.fighters.length > 2;
    const freeForAll = b.cfg.freeForAll;
    const shown = w !== null && w !== -1 ? b.fighters.filter((f) => f.team === w) : [];
    let title: string, cls = '';
    if (w === -1 || w === null) title = '무승부';
    else if (this.mode === 'ai') {
      title = w === 0 ? '승리!' : freeForAll ? `${names[shown[0]!.idx]} 승리!` : '패배…';
      if (w !== 0) cls = 'lose';
    }
    else title = `${names[w]} 승리!`;
    const losers = w !== null && w !== -1 ? b.fighters.filter((f) => f.team !== w) : [];
    const ln = !four && losers[0] ? character(losers[0].charId).name : '';
    const why = freeForAll
      ? (b.endReason === 'limit' ? '턴 제한에 도달해 남은 체력 비율로 승부를 가렸습니다.'
        : w !== -1 ? `${names[shown[0]!.idx]} ${character(shown[0]!.charId).name} 생존`
        : b.fighters.every(f => !f.alive) ? '장수가 모두 쓰러졌습니다.' : '가장 높은 남은 체력 비율이 같습니다.')
      : four
      ? (b.endReason === 'fall' ? '상대 편 장수가 모두 낭떠러지로 떨어졌습니다.'
        : b.endReason === 'hp' ? '상대 편 장수가 모두 쓰러졌습니다.'
        : b.endReason === 'limit' ? '정해진 턴을 다 써서, 남은 체력 합이 많은 편이 이겼습니다.'
        : b.fighters.every((f) => !f.alive) ? '두 편이 함께 쓰러졌습니다.' : '두 편의 남은 체력이 똑같습니다.')
      : (b.endReason === 'fall' ? `${josa(ln, '이', '가')} 낭떠러지로 떨어졌습니다.`
        : b.endReason === 'hp' ? `${ln}의 기력이 다했습니다.`
        : b.endReason === 'limit' ? '정해진 턴을 다 써서, 남은 체력이 많은 쪽이 이겼습니다.'
        : b.fighters.every((f) => !f.alive) ? '둘이 함께 쓰러졌습니다.' : '남은 체력이 똑같습니다.');
    const img = shown.map((f) => `<img alt="" src="${this.portraits[f.charId]?.[f.team === 1 ? 'flip' : 'happy'] ?? ''}">`).join('');
    const rows: [string, (i: number) => number, (v: number) => string][] = [
      ['명중률', (i) => (b.fighters[i].stats.shots ? b.fighters[i].stats.hits / b.fighters[i].stats.shots : 0), (v) => `${Math.round(v * 100)}%`],
      ['총 피해량', (i) => b.fighters[i].stats.damageDealt, (v) => `${v}`],
      ['가장 센 한 방', (i) => b.fighters[i].stats.maxHit, (v) => `${v}`],
      ['지형 파괴', (i) => b.fighters[i].stats.cellsDestroyed, (v) => `${Math.round(v * 4 / 100)}㎡`],
      ['쏜 횟수', (i) => b.fighters[i].stats.shots, (v) => `${v}발`],
    ];
    // 표는 편끼리 모아서(1팀 → 2팀)
    const order = [...b.fighters].sort((x, y) => x.team - y.team || x.idx - y.idx).map((f) => f.idx);
    const head = `<tr><th></th>${order.map((i) => `<th class="p${b.fighters[i]!.team + 1}">${four && !freeForAll ? '' : `${esc(names[i] ?? '')} `}${character(b.fighters[i]!.charId).name}</th>`).join('')}</tr>`;
    const body = rows.map(([label, get, fmt]) => {
      const vals = order.map((i) => get(i));
      const top = Math.max(...vals);
      const unique = vals.filter((v) => v === top).length === 1;
      return `<tr><td>${label}</td>${vals.map((v) => `<td class="${unique && v === top && v > 0 ? 'best' : ''}">${fmt(v)}</td>`).join('')}</tr>`;
    }).join('');
    el.innerHTML = `
      <h2 class="${cls}">${title}</h2>
      <div class="why">${esc(why)}</div>
      <div class="who">${img}</div>
      <table class="table${four ? ' four' : ''}">${head}${body}</table>
      <div class="actions">
        <button class="btn primary" data-act="rematch">다시 한 판</button>
        <button class="btn" data-act="rechar">장수 다시 고르기</button>
        <button class="btn ghost" data-act="home">처음 화면으로</button>
      </div>`;
    this.show('result');
  }

  hideResult(): void {
    this.show('result', false);
  }

  // ───────── 설정 ─────────

  private buildSettings(): void {
    const el = this.add('settings', h(`<section class="screen modal"><div class="sheet"></div></section>`));
    el.addEventListener('input', (e) => {
      const t = e.target as HTMLInputElement;
      if (t.name === 'bgm') this.settings.bgm = Number(t.value) / 100;
      if (t.name === 'sfx') this.settings.sfx = Number(t.value) / 100;
      this.hooks.settingsChanged(this.settings);
    });
    el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t === el) { this.show('settings', false); return; }
      const b = t.closest<HTMLElement>('[data-k]');
      if (b) {
        const k = b.dataset.k as keyof Settings;
        const v = b.dataset.v!;
        const s = this.settings as unknown as Record<string, unknown>;
        s[k] = k === 'trajectory' || k === 'aimHints' ? v === '1' : k === 'shake' || k === 'turnTime' || k === 'turnLimit' ? Number(v) : v;
        this.hooks.settingsChanged(this.settings);
        this.renderSettings();
        return;
      }
      if (t.closest('[data-act=close]')) this.show('settings', false);
    });
  }

  openSettings(): void {
    this.renderSettings();
    this.show('settings');
  }

  private renderSettings(): void {
    const s = this.settings;
    const chips = (k: string, opts: [string, string][], cur: string) => `<div class="chips">${opts.map(([v, l]) => `<button data-k="${k}" data-v="${v}" class="${v === cur ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    this.screens.get('settings')!.querySelector('.sheet')!.innerHTML = `
      <h2>설정</h2>
      <div class="row"><label>배경음</label><input type="range" name="bgm" min="0" max="100" value="${Math.round(s.bgm * 100)}" aria-label="배경음 크기"></div>
      <div class="row"><label>효과음</label><input type="range" name="sfx" min="0" max="100" value="${Math.round(s.sfx * 100)}" aria-label="효과음 크기"></div>
      <div class="row"><label>그래픽</label>${chips('quality', [['low', '낮음'], ['medium', '보통'], ['high', '높음']], s.quality)}</div>
      <div class="row"><label>화면 흔들림</label>${chips('shake', [['0', '끔'], ['0.5', '약하게'], ['1', '보통'], ['1.5', '세게']], String(s.shake))}</div>
      <div class="row"><label>예상 궤적</label>${chips('trajectory', [['1', '보이기'], ['0', '숨기기']], s.trajectory ? '1' : '0')}</div>
      <div class="row"><label>조준 도움</label>${chips('aimHints', [['1', '범위 힌트'], ['0', '끄기']], s.aimHints ? '1' : '0')}</div>
      <div class="row"><label>AI 실력</label>${chips('difficulty', [['easy', '쉬움'], ['normal', '보통'], ['hard', '어려움']], s.difficulty)}</div>
      <div class="row"><label>턴 시간</label>${chips('turnTime', [['20', '20초'], ['30', '30초'], ['45', '45초']], String(s.turnTime))}</div>
      <div class="row"><label>승부 방식</label>${chips('turnLimit', [['0', '끝장전'], ['20', '20턴'], ['30', '30턴'], ['40', '40턴']], String(s.turnLimit))}</div>
      <p style="font-size:13px;color:var(--muted)">그래픽을 낮춰도 포탄 궤적과 판정은 똑같습니다. 턴 시간과 전체 턴은 다음 판부터 적용됩니다.</p>
      <div class="actions"><button class="btn primary" data-act="close">닫기</button></div>`;
  }

  // ───────── 게임 방법 ─────────

  private buildHowto(): void {
    const weapons = CHARACTERS.map((c) => `<li><b>${c.name}</b> — 특기 <b>${c.trait.name}</b>: ${esc(c.trait.desc)} (1번: ${weapon(c.normal).name} / 2번: ${weapon(c.special).name})</li>`).join('');
    const el = this.add('howto', h(`
      <section class="screen modal"><div class="sheet">
        <h2>게임 방법</h2>
        <p>바람을 읽고 각도와 힘을 맞춰 상대 장수에게 포탄을 넘기세요. 상대의 체력을 0으로 만들거나, 발밑 땅을 무너뜨려 낭떠러지로 떨어뜨리면 이깁니다.</p>
        <h3>PC</h3>
        <ul>
          <li><kbd>A</kbd> <kbd>D</kbd> 이동(한 턴에 갈 수 있는 거리가 정해져 있어요)</li>
          <li><kbd>←</kbd> <kbd>→</kbd> 포신을 왼쪽·오른쪽으로 돌리기, <kbd>↑</kbd> <kbd>↓</kbd> 포신 올리기·내리기</li>
          <li><kbd>Space</kbd> 꾹 눌러 힘 모으기 → 떼면 발사(힘은 끝까지 차면 다시 줄어듭니다)</li>
          <li><kbd>1</kbd> <kbd>2</kbd> 무기 바꾸기 · <kbd>R</kbd> 궁극기 선택 · <kbd>Esc</kbd> 일시정지</li>
          <li>화면 둘러보기: 마우스로 끌기 또는 <kbd>I</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd>, 휠로 확대 · <kbd>Tab</kbd> 따라가기/상대/전체 보기 · <kbd>C</kbd> 내 장수로 돌아오기</li>
        </ul>
        <h3>휴대폰·태블릿</h3>
        <ul><li>왼쪽 ◀ ▶ 이동, ▲ ▼ 각도, ⇄ 방향 바꾸기, 오른쪽 큰 <b>발사</b> 단추를 누르고 있다가 떼면 발사.</li>
          <li>전장을 끌어서 둘러보고, 두 손가락으로 벌려 확대할 수 있습니다. 「전체 보기」와 「따라가기」로 전환하고, <kbd>Tab</kbd>으로 상대도 볼 수 있습니다.</li></ul>
        <h3>규칙</h3>
        <ul>
          <li>한 턴에 한 번만 쏩니다. 착탄과 추락 판정이 정리되면 빠르게 다음 차례로 넘어갑니다.</li>
          <li>장수마다 자기 ${ULTIMATE_TURN}번째 차례에 궁극기가 열리고, 발사 후 자기 차례가 ${ULTIMATE_RECHARGE_TURNS}번 돌아오면 다시 쓸 수 있어요. 궁극기를 고른 다음 평소처럼 힘을 모아 발사하세요.</li>
          <li>시작 위치는 고지·저지·다리·발판 중 무작위로 고르며, 양 팀은 같은 높이·발판의 좌우 대칭 위치에서 시작합니다. 2:2도 서로 대응하는 두 자리를 대칭으로 놓습니다. 높은 곳에서 떨어지면 큰 피해를 받고, 벼랑 외나무다리의 추락선을 넘으면 체력과 무관하게 탈락합니다.</li>
          <li>바람은 턴마다 바뀝니다. 화면 위 화살표가 방향과 세기(0~10)입니다. 모든 탄의 기본 발사속도·중력·바람 영향은 같습니다.</li>
          <li><b>무당의 추적 부적탄</b>은 가까운 적을 찾아 따라갑니다. 표적에 금빛 조준 표시가 뜨며, 장애물에 먼저 닿으면 막힙니다.</li>
          <li><kbd>Space</kbd>나 「발사」를 누르면 힘이 차고, 떼는 순간 쏩니다. 힘 게이지에는 현재 모은 힘과 지난 발사 힘이 표시됩니다.</li>
          <li><b>굴착대장</b>의 1번 탄은 벽을 뚫고, 채석장의 얇은 발판은 아래까지 끊을 수 있습니다. 2번 탄은 철편 세 발을 펼쳐 명중을 노립니다.</li>
          <li>지지점을 잃은 땅은 덩어리째 무너지고, 바위는 낙석이 되어 굴러갑니다. 깔리거나 높은 곳에서 떨어지면 다칩니다.</li>
          <li><b>1번과 2번 탄은 매 차례 자유롭게 선택</b>합니다. 횟수 제한과 기세 조건이 없고, 발사 뒤에도 고른 탄을 기억합니다. 누르고 모으는 힘은 포탄의 날아갈 거리입니다.</li>
          <li><b>추천 각도</b>는 넓은 시작 범위입니다. 화살표 쪽으로 포신을 돌려 각도를 조절하세요. 설정의 「조준 도움」에서 끌 수 있습니다.</li>
          <li>낮은 둔턱은 걸어서 넘을 수 있습니다. 경사에 서면 몸과 포신이 함께 기울어집니다. 조작부의 큰 숫자는 몸 기준 조준각이고, 그 아래에 경사를 반영한 발사 방향과 각도가 표시됩니다.</li>
          <li><b>독구름</b> 안에서 자기 차례를 맞으면 피해를 입습니다. 구름 밖으로 움직여 피할 수 있으며, 같은 편도 피해를 입습니다.</li>
          <li>장수마다 최대 체력이 다릅니다. 기본은 상대 편이 모두 쓰러져야 끝나는 끝장전입니다. 20·30·40턴 판정전은 제한 턴 뒤 체력 비율로 판정합니다. 함께 쓰러지면 무승부입니다.</li>
          <li><b>2:2</b>는 편마다 장수 둘이 번갈아 쏩니다(편 → 상대 편 → 편의 다른 장수 …). 같은 편도 폭발에 다치니 조심하세요. 한 편이 모두 쓰러지면 끝납니다.</li>
          <li><b>1:1:1:1</b>은 네 장수가 각자 싸우는 개인전입니다. 쓰러진 장수는 차례를 건너뛰고, 끝장전에서는 마지막 한 명이 이깁니다.</li>
        </ul>
        <h3>포탄 속의 수학</h3>
        <div class="mathbox">처음 속도 <code>v</code>, 각도 <code>θ</code>로 쏜 포탄의 위치는<br>
          <code>x(t) = x₀ + v·cosθ·t + ½·w·t²</code><br>
          <code>y(t) = y₀ − v·sinθ·t + ½·g·t²</code><br>
          입니다(화면은 아래쪽이 +y, <code>w</code>는 바람, <code>g</code>는 중력). 바람이 없으면 포물선, 45°에 가까울수록 멀리 갑니다.</div>
        <h3>장수와 무기</h3>
        <ul>${weapons}</ul>
        <div class="actions"><button class="btn primary" data-act="close">알겠어요</button></div>
      </div></section>`));
    el.addEventListener('click', (e) => {
      if (e.target === el || (e.target as HTMLElement).closest('[data-act=close]')) this.show('howto', false);
    });
  }

  hideLoading(): void {
    this.show('loading', false);
  }
}
