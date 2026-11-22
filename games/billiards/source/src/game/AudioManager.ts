import type { PhysicsEvent } from '../physics/types';

/** Synthesized, replaceable impact palette. No downloads or third-party audio. */
export class AudioManager {
  enabled = false;
  private context: AudioContext | null = null;
  private noise: AudioBuffer | null = null;
  private master: GainNode | null = null;
  private voices = 0;
  private rolling: { source: AudioBufferSourceNode; gain: GainNode; filter: BiquadFilterNode } | null = null;

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
    const cushion = event.type === 'cushion', pocket = event.type === 'pocket';
    const gain = c.createGain();
    const filter = c.createBiquadFilter();
    const source = c.createBufferSource();
    const oscillator = c.createOscillator();
    const volume = Math.min(.6, .04 + event.speed * .13) * (cushion ? .6 : pocket ? .8 : 1);
    filter.type = 'bandpass';
    filter.frequency.value = pocket ? 260 : cushion ? 420 : event.type === 'shot' ? 1350 : 2400 + event.speed * 180;
    filter.Q.value = .7;
    source.buffer = this.noise;
    source.connect(filter);
    filter.connect(gain);
    oscillator.frequency.setValueAtTime(pocket ? 210 : cushion ? 160 : 900, now);
    oscillator.frequency.exponentialRampToValueAtTime(pocket ? 45 : cushion ? 65 : 350, now + .035);
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

  feedback(kind:'score'|'win'):void {
    if(!this.enabled||!this.context||!this.master)return;
    const c=this.context,notes=kind==='win'?[440,554.37,659.25]:[523.25,659.25];
    for(let i=0;i<notes.length;i++){
      const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.11;o.type='sine';o.frequency.value=notes[i];
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.24);
      o.connect(g);g.connect(this.master);o.start(t);o.stop(t+.25);o.onended=()=>{o.disconnect();g.disconnect();};
    }
  }

  updateRolling(speed:number,paused:boolean):void {
    if(!this.context||!this.master)return;
    const c=this.context;
    if(!this.rolling){
      const buffer=c.createBuffer(1,c.sampleRate,c.sampleRate),data=buffer.getChannelData(0);let seed=41;
      for(let i=0;i<data.length;i++){seed=Math.imul(seed,1664525)+1013904223|0;data[i]=seed/2147483648;}
      const source=c.createBufferSource(),gain=c.createGain(),filter=c.createBiquadFilter();source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=170;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(this.master);source.start();this.rolling={source,gain,filter};
    }
    this.rolling.gain.gain.setTargetAtTime(this.enabled&&!paused?Math.min(.025,Math.max(0,speed)*.008):0,c.currentTime,.04);
  }

  dispose():void {this.rolling?.source.stop();this.rolling?.source.disconnect();this.rolling?.gain.disconnect();this.rolling?.filter.disconnect();this.rolling=null;void this.context?.close();this.context=null;this.master=null;}
}
