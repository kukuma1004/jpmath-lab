/**
 * 외부 음원 없이 Web Audio로 만든 소리.
 * 배경음은 우리 장단(굿거리·자진모리)을 단순하게 옮긴 순서기로 돈다.
 * 브라우저 자동 재생 제한 때문에 첫 터치·클릭에서 unlock()을 부른다.
 */
type Wave = OscillatorType;

const SCALE = [43, 45, 48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72, 74, 76]; // 평조(솔라도레미)
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
const note = (i: number) => mtof(SCALE[Math.max(0, Math.min(SCALE.length - 1, i))]!);

interface Song {
  bpm: number; // 점4분음표(한 박) 빠르기
  bars: number;
  drums: string[]; // 마디마다 12칸: D=덩 K=쿵 T=덕 g=기덕 r=더러러 .=쉼
  bass: number[][]; // [칸, 음]
  lead: number[][]; // [마디*12+칸, 음, 길이(칸)]
  pluck: number[][];
  leadWave: Wave;
  leadVol: number;
}

const TITLE: Song = {
  bpm: 56,
  bars: 4,
  drums: ['D..g.KT..r.K', 'D..g.KT..K..', 'D..g.KT..r.K', 'D..T.KT.gK..'],
  bass: [[0, 0], [6, 2]],
  lead: [
    [0, 7, 3], [3, 8, 3], [6, 9, 4], [10, 8, 2],
    [12, 7, 3], [15, 5, 3], [18, 6, 6],
    [24, 9, 3], [27, 10, 3], [30, 9, 2], [32, 8, 2], [34, 7, 2],
    [36, 8, 3], [39, 7, 3], [42, 5, 6],
  ],
  pluck: [[0, 5], [3, 7], [6, 9], [9, 7]],
  leadWave: 'sine',
  leadVol: 0.12,
};

const BATTLE: Song = {
  bpm: 96,
  bars: 4,
  drums: ['D.gK.TD.gK.T', 'D.gK.TK.TK.r', 'D.gK.TD.gK.T', 'D.TD.TK.rK.T'],
  bass: [[0, 0], [3, 0], [6, 2], [9, 3]],
  lead: [
    [0, 9, 2], [2, 10, 1], [3, 11, 3], [6, 10, 2], [8, 9, 1], [9, 7, 3],
    [12, 8, 2], [14, 9, 1], [15, 7, 3], [18, 5, 3], [21, 7, 3],
    [24, 9, 2], [26, 10, 1], [27, 12, 3], [30, 11, 2], [32, 10, 1], [33, 9, 3],
    [36, 10, 3], [39, 9, 2], [41, 7, 1], [42, 9, 6],
  ],
  pluck: [[0, 5], [2, 7], [4, 9], [6, 7], [8, 9], [10, 10]],
  leadWave: 'sawtooth',
  leadVol: 0.05,
};

export class AudioEngine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private bgmGain!: GainNode;
  private sfxGain!: GainNode;
  private noiseBuf!: AudioBuffer;
  private bgmVol = 0.45;
  private sfxVol = 0.8;
  private song: Song | null = null;
  private wanted: 'title' | 'battle' | null = null;
  private timer: number | null = null;
  private nextStep = 0;
  private stepIdx = 0;
  private whistles = new Map<number, { osc: OscillatorNode; g: GainNode }>();
  private chargeOsc: { osc: OscillatorNode; g: GainNode } | null = null;

  unlock(): void {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.9;
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.ratio.value = 4;
        this.master.connect(comp).connect(this.ctx.destination);
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.bgmGain.connect(this.master);
        this.sfxGain.connect(this.master);
        this.setVolumes(this.bgmVol, this.sfxVol);
        const len = this.ctx.sampleRate * 1.5;
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noiseBuf.getChannelData(0);
        let seed = 12345;
        for (let i = 0; i < len; i++) {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          d[i] = (seed / 0x7fffffff) * 2 - 1;
        }
        if (this.wanted) this.playBgm(this.wanted);
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  setVolumes(bgm: number, sfx: number): void {
    this.bgmVol = bgm;
    this.sfxVol = sfx;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.bgmGain.gain.setTargetAtTime(bgm * 0.8, t, 0.05);
    this.sfxGain.gain.setTargetAtTime(sfx, t, 0.05);
  }

  /** 탭이 가려지면 멈추고 돌아오면 다시 낸다 */
  suspend(on: boolean): void {
    if (!this.ctx) return;
    if (on) void this.ctx.suspend();
    else void this.ctx.resume();
  }

  // ───────── 기본 소리 조각 ─────────

  private tone(freq: number, dur: number, wave: Wave, vol: number, opts: { attack?: number; to?: number; delay?: number; dest?: AudioNode; vib?: number; filter?: number } = {}): void {
    const c = this.ctx;
    if (!c) return;
    const t0 = c.currentTime + (opts.delay ?? 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = wave;
    o.frequency.setValueAtTime(freq, t0);
    if (opts.to) o.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), t0 + dur);
    if (opts.vib) {
      const l = c.createOscillator();
      const lg = c.createGain();
      l.frequency.value = 5.2;
      lg.gain.value = freq * opts.vib;
      l.connect(lg).connect(o.frequency);
      l.start(t0);
      l.stop(t0 + dur + 0.05);
    }
    const a = opts.attack ?? 0.005;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let out: AudioNode = g;
    if (opts.filter) {
      const f = c.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = opts.filter;
      g.connect(f);
      out = f;
    }
    o.connect(g);
    out.connect(opts.dest ?? this.sfxGain);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  private noise(dur: number, vol: number, type: BiquadFilterType, f0: number, f1: number, opts: { q?: number; delay?: number; dest?: AudioNode; attack?: number } = {}): void {
    const c = this.ctx;
    if (!c) return;
    const t0 = c.currentTime + (opts.delay ?? 0);
    const s = c.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = true;
    const f = c.createBiquadFilter();
    f.type = type;
    f.Q.value = opts.q ?? 0.8;
    f.frequency.setValueAtTime(f0, t0);
    f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + (opts.attack ?? 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f).connect(g).connect(opts.dest ?? this.sfxGain);
    s.start(t0, Math.random() * 1.2);
    s.stop(t0 + dur + 0.05);
  }

  // ───────── 효과음 ─────────

  click(): void {
    this.tone(980, 0.06, 'triangle', 0.18, { to: 720 });
  }

  hover(): void {
    this.tone(1400, 0.03, 'sine', 0.05);
  }

  select(): void {
    this.tone(note(7), 0.25, 'triangle', 0.2);
    this.tone(note(9), 0.35, 'triangle', 0.16, { delay: 0.07 });
  }

  fire(weaponLook: string): void {
    if (weaponLook === 'arrow') {
      this.tone(320, 0.18, 'triangle', 0.32, { to: 150 });
      this.noise(0.25, 0.22, 'highpass', 3000, 6000);
      return;
    }
    if (weaponLook === 'paper' || weaponLook === 'fox' || weaponLook === 'goblinfire') {
      this.noise(0.35, 0.25, 'bandpass', 800, 3000, { q: 2 });
      this.tone(note(9), 0.3, 'sine', 0.16, { to: note(12) });
      return;
    }
    this.noise(0.45, 0.6, 'lowpass', 2400, 180);
    this.tone(140, 0.32, 'sine', 0.55, { to: 38 });
  }

  explode(size: number): void {
    const big = size >= 60;
    this.noise(big ? 1.4 : 0.8, big ? 0.9 : 0.6, 'lowpass', big ? 2600 : 3200, 120);
    this.tone(big ? 80 : 110, big ? 0.9 : 0.5, 'sine', big ? 0.8 : 0.5, { to: 28 });
    this.noise(0.12, 0.4, 'highpass', 2000, 4000, { delay: 0.02 });
  }

  thunder(): void {
    this.noise(0.18, 0.8, 'highpass', 1800, 5000);
    this.noise(1.4, 0.55, 'lowpass', 900, 60, { delay: 0.05, attack: 0.05 });
    this.tone(60, 1.0, 'sine', 0.4, { to: 30, delay: 0.04 });
  }

  bounce(): void {
    this.tone(260, 0.16, 'sine', 0.3, { to: 520 });
    this.noise(0.08, 0.15, 'bandpass', 600, 400);
  }

  split(): void {
    [9, 11, 12, 14].forEach((n, i) => this.tone(note(n), 0.25, 'triangle', 0.12, { delay: i * 0.04 }));
  }

  fuse(): void {
    this.noise(1.0, 0.18, 'highpass', 4000, 7000, { attack: 0.02 });
  }

  rock(speed: number): void {
    const v = Math.min(0.7, 0.15 + speed / 1200);
    this.noise(0.22, v, 'lowpass', 900, 120);
    this.tone(90, 0.18, 'sine', v * 0.7, { to: 50 });
  }

  rumble(size: number): void {
    const v = Math.min(0.8, 0.25 + size / 4000);
    this.noise(1.2, v, 'lowpass', 500, 60, { attack: 0.06 });
  }

  hit(): void {
    this.tone(200, 0.16, 'square', 0.16, { to: 90, filter: 1800 });
    this.noise(0.1, 0.25, 'bandpass', 1500, 800);
  }

  land(speed: number): void {
    if (speed < 160) return;
    this.noise(0.14, Math.min(0.45, speed / 1500), 'lowpass', 600, 120);
  }

  turn(): void {
    this.tone(note(9), 0.5, 'triangle', 0.16);
    this.tone(note(12), 0.7, 'triangle', 0.13, { delay: 0.12 });
  }

  tick(): void {
    this.tone(1800, 0.04, 'square', 0.05, { filter: 3000 });
  }

  wind(): void {
    this.noise(0.9, 0.12, 'bandpass', 500, 1600, { q: 3, attack: 0.2 });
  }

  victory(): void {
    [5, 7, 9, 10, 12, 14].forEach((n, i) => this.tone(note(n), 0.55, 'triangle', 0.2, { delay: i * 0.1 }));
    this.tone(note(14), 1.4, 'sine', 0.12, { delay: 0.6, vib: 0.01 });
    this.drum('D', 0);
    this.drum('D', 0.6);
  }

  defeat(): void {
    [9, 7, 5, 4, 2].forEach((n, i) => this.tone(note(n), 0.5, 'sine', 0.16, { delay: i * 0.16 }));
  }

  whistleStart(id: number): void {
    const c = this.ctx;
    if (!c || this.whistles.size > 3) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = 1300;
    g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.035, c.currentTime + 0.2);
    o.connect(g).connect(this.sfxGain);
    o.start();
    this.whistles.set(id, { osc: o, g });
  }

  whistleUpdate(id: number, vy: number): void {
    const w = this.whistles.get(id);
    if (!w || !this.ctx) return;
    w.osc.frequency.setTargetAtTime(Math.max(380, 1100 - vy * 0.8), this.ctx.currentTime, 0.05);
  }

  whistleStop(id: number): void {
    const w = this.whistles.get(id);
    if (!w || !this.ctx) return;
    this.whistles.delete(id);
    w.g.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.03);
    w.osc.stop(this.ctx.currentTime + 0.2);
  }

  stopAllWhistles(): void {
    for (const id of [...this.whistles.keys()]) this.whistleStop(id);
  }

  charge(power: number | null): void {
    const c = this.ctx;
    if (!c) return;
    if (power === null) {
      if (this.chargeOsc) {
        this.chargeOsc.g.gain.setTargetAtTime(0.0001, c.currentTime, 0.02);
        this.chargeOsc.osc.stop(c.currentTime + 0.1);
        this.chargeOsc = null;
      }
      return;
    }
    if (!this.chargeOsc) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'triangle';
      g.gain.value = 0.0001;
      g.gain.exponentialRampToValueAtTime(0.07, c.currentTime + 0.05);
      o.connect(g).connect(this.sfxGain);
      o.start();
      this.chargeOsc = { osc: o, g };
    }
    this.chargeOsc.osc.frequency.setTargetAtTime(220 + power * 6, c.currentTime, 0.02);
  }

  // ───────── 배경음 ─────────

  playBgm(which: 'title' | 'battle' | null): void {
    this.wanted = which;
    const song = which === 'title' ? TITLE : which === 'battle' ? BATTLE : null;
    if (song === this.song && this.timer !== null) return;
    this.song = song;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (!song || !this.ctx) return;
    this.stepIdx = 0;
    this.nextStep = this.ctx.currentTime + 0.12;
    this.timer = window.setInterval(() => this.schedule(), 30);
  }

  private drum(k: string, delay: number): void {
    const dest = this.bgmGain;
    switch (k) {
      case 'D': // 덩: 북편+채편
        this.tone(95, 0.35, 'sine', 0.42, { to: 52, delay, dest });
        this.noise(0.09, 0.2, 'bandpass', 2200, 1600, { delay, dest, q: 1.5 });
        break;
      case 'K': // 쿵: 북편
        this.tone(88, 0.3, 'sine', 0.36, { to: 50, delay, dest });
        break;
      case 'T': // 덕: 채편
        this.noise(0.07, 0.22, 'bandpass', 2600, 1900, { delay, dest, q: 2 });
        break;
      case 'g': // 기덕
        this.noise(0.04, 0.12, 'bandpass', 2600, 2000, { delay, dest, q: 2 });
        this.noise(0.06, 0.2, 'bandpass', 2600, 1900, { delay: delay + 0.06, dest, q: 2 });
        break;
      case 'r': // 더러러
        for (let i = 0; i < 3; i++) this.noise(0.04, 0.1 + i * 0.03, 'bandpass', 2400, 1900, { delay: delay + i * 0.045, dest, q: 2 });
        break;
    }
  }

  private schedule(): void {
    const c = this.ctx;
    const s = this.song;
    if (!c || !s) return;
    const stepDur = 60 / s.bpm / 3;
    const total = s.bars * 12;
    while (this.nextStep < c.currentTime + 0.15) {
      const delay = Math.max(0, this.nextStep - c.currentTime);
      const i = this.stepIdx % total;
      const bar = Math.floor(i / 12);
      const st = i % 12;
      const d = s.drums[bar % s.drums.length]![st]!;
      if (d !== '.') this.drum(d, delay);
      for (const [k, n] of s.bass) if (k === st) this.tone(note(n!) / 2, stepDur * 2.6, 'triangle', 0.16, { delay, dest: this.bgmGain });
      for (const [k, n] of s.pluck) {
        if (k === st && (bar % 2 === 0 || st % 4 === 0)) this.tone(note(n! + (bar === 3 ? 1 : 0)), stepDur * 3, 'triangle', 0.06, { delay, dest: this.bgmGain });
      }
      for (const [k, n, len] of s.lead) {
        if (k === i) this.tone(note(n!), stepDur * len! * 1.05, s.leadWave, s.leadVol, { delay, dest: this.bgmGain, attack: 0.04, vib: 0.012, filter: 2200 });
      }
      this.nextStep += stepDur;
      this.stepIdx++;
    }
  }
}

export const audio = new AudioEngine();
