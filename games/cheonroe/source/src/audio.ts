import type { GameEvent, HeroId } from './types';

// A tiny original pentatonic score and event-driven arcade sound system.
export class AudioSystem {
  context?: AudioContext;
  master?: GainNode;
  muted = false;
  active = false;
  private beat = 0;
  private clock = 0;
  private lastShot = 0;
  async unlock() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') await this.context.resume();
    this.setActive(true);
  }
  setActive(value: boolean) {
    this.active = value;
    if (this.context && this.master) this.master.gain.setTargetAtTime(value && !this.muted ? 0.22 : 0, this.context.currentTime, 0.035);
  }
  setMuted(value: boolean) { this.muted=value; this.setActive(this.active); }
  reset() { this.clock=0; this.beat=0; }
  private tone(freq:number,duration:number,type:OscillatorType='sine',volume=.2,slide=1) {
    const c=this.context, master=this.master;
    if (!c || !master || !this.active || this.muted) return;
    const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;
    o.type=type; o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*slide),t+duration);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    o.connect(g).connect(master);o.start(t);o.stop(t+duration+.03);
    o.onended=()=>{o.disconnect();g.disconnect();};
  }
  tick(dt:number,time:number) {
    if(!this.active || this.muted) return;
    this.clock-=dt;
    if(this.clock>0) return;
    this.clock+=.23;
    const notes=[293.66,349.23,392,440,523.25,587.33,523.25,440,392,349.23,392,440,293.66,392,440,349.23];
    const n=this.beat++;
    if(n%2===0) this.tone(notes[(n/2|0)%notes.length],.42,'triangle',.105);
    if(n%4===0) {this.tone(time>70?85:68,.27,'sine',.8,.24);this.tone(146.83,.7,'sine',.15);}
    if(n%8===6) this.tone(180,.09,'triangle',.14,.48);
  }
  event(e:GameEvent,hero:HeroId) {
    if(!this.context) return;
    if(e.kind==='shot') {
      if(this.context.currentTime-this.lastShot<.095)return;
      this.lastShot=this.context.currentTime;
      this.tone(hero==='golem'?210:hero==='ryu'?310:680,.065,'triangle',.065,.48);
    }
    if(e.kind==='kill') {this.tone(90,.18,'sawtooth',.16,.25);this.tone(170,.12,'triangle',.17,.2);}
    if(e.kind==='hurt') {this.tone(220,.42,'sawtooth',.22,.15);this.tone(70,.5,'sine',.65,.35);}
    if(e.kind==='pickup') {this.tone(880,.12,'sine',.23);this.tone(1320,.25,'triangle',.12);}
    if(e.kind==='charge') {this.tone(230,.35,'sawtooth',.11,3);this.tone(110,.45,'sine',.5,.25);}
    if(e.kind==='near') {this.tone(160,.12,'sawtooth',.18,.16);this.tone(960,.06,'triangle',.13,.2);}
    if(e.kind==='ultimate') {this.tone(70,1.8,'sine',.8,.3);this.tone(330,.9,'sawtooth',.12,3);this.tone(880,1.4,'triangle',.12,.5);}
    if(e.kind==='boss') {this.tone(55,1.5,'sawtooth',.16);this.tone(58,1.5,'sawtooth',.13);}
    if(e.kind==='victory') [294,349,440,587].forEach((n)=>this.tone(n,1.8,'triangle',.15));
    if(e.kind==='graze') this.tone(2100,.035,'sine',.035,.7);
  }
}
