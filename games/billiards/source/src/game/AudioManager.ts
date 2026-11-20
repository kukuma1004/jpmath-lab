import type { PhysicsEvent } from '../physics/types';

/** Synthesized, replaceable impact palette. No downloads or third-party audio. */
export class AudioManager {
  enabled = false;
  private context: AudioContext | null = null;
  private noise: AudioBuffer | null = null;
  private master: GainNode | null = null;
  private voices = 0;

  async setEnabled(value: boolean): Promise<void> {
    this.enabled = value;
    if (!value) { if (this.master) this.master.gain.value = 0; return; }
    try {
      this.context ??= new AudioContext();
      if (!this.master) {
        this.master = this.context.createGain();
        this.master.connect(this.context.destination);
        this.noise = this.context.createBuffer(1, this.context.sampleRate * .06, this.context.sampleRate);
        const samples = this.noise.getChannelData(0);
        let seed = 17;
        for (let i = 0; i < samples.length; i++) { seed = Math.imul(seed, 1664525) + 1013904223 | 0; samples[i] = (seed / 2147483648) * Math.exp(-i / (samples.length / 7)); }
      }
      this.master.gain.value = .5;
      if (this.context.state === 'suspended') await this.context.resume();
    } catch { this.enabled = false; }
  }

  play(event: PhysicsEvent): void {
    if (!this.enabled || !this.context || !this.master || !this.noise || event.type === 'rest' || this.voices > 12) return;
    const c = this.context;
    const now = c.currentTime;
    const cushion = event.type === 'cushion';
    const gain = c.createGain();
    const filter = c.createBiquadFilter();
    const source = c.createBufferSource();
    const oscillator = c.createOscillator();
    const volume = Math.min(.6, .04 + event.speed * .13) * (cushion ? .6 : 1);
    filter.type = 'bandpass';
    filter.frequency.value = cushion ? 420 : event.type === 'shot' ? 1350 : 2400 + event.speed * 180;
    filter.Q.value = .7;
    source.buffer = this.noise;
    source.connect(filter);
    filter.connect(gain);
    oscillator.frequency.setValueAtTime(cushion ? 160 : 900, now);
    oscillator.frequency.exponentialRampToValueAtTime(cushion ? 65 : 350, now + .035);
    oscillator.connect(gain);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .055);
    gain.connect(this.master);
    this.voices++;
    source.start(now);
    oscillator.start(now);
    oscillator.stop(now + .06);
    source.onended = () => { source.disconnect(); oscillator.disconnect(); filter.disconnect(); gain.disconnect(); this.voices--; };
  }
}
