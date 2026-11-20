import type { GameEvent, GameState, HeroId } from './types';

// Original procedural score and event sounds. Each chapter has its own scale, tempo and drum pattern.
const SCALES=[[293.66,349.23,392,440,523.25,587.33],[329.63,392,440,493.88,587.33,659.25],[220,261.63,293.66,329.63,392,440],[349.23,415.3,466.16,523.25,622.25,698.46],[246.94,293.66,329.63,369.99,440,493.88]];
const TEMPO=[.2,.18,.17,.165,.15];
const MELODY=[0,2,3,4,3,2,1,2,0,2,4,5,4,3,2,3];
const BOSS_MELODY=[0,0,3,0,4,3,1,2,0,0,5,4,3,4,2,1];

export class AudioSystem {
  context?:AudioContext;
  master?:GainNode;
  private sfx?:GainNode;
  private music?:GainNode;
  private noise?:AudioBuffer;
  muted=false;
  active=false;
  private beat=0;
  private clock=0;
  private last:Record<string,number>={};
  async unlock() {
    if(!this.context) {
      this.context=new AudioContext();
      this.master=this.context.createGain();this.master.gain.value=0;
      const comp=this.context.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;
      this.master.connect(comp).connect(this.context.destination);
      this.sfx=this.context.createGain();this.sfx.gain.value=1;this.sfx.connect(this.master);
      this.music=this.context.createGain();this.music.gain.value=.55;this.music.connect(this.master);
      const len=this.context.sampleRate;this.noise=this.context.createBuffer(1,len,this.context.sampleRate);
      const d=this.noise.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    }
    if(this.context.state==='suspended')await this.context.resume();
    this.setActive(true);
  }
  setActive(value:boolean) {
    this.active=value;
    if(this.context&&this.master)this.master.gain.setTargetAtTime(value&&!this.muted?.26:0,this.context.currentTime,.035);
  }
  setMuted(value:boolean){this.muted=value;this.setActive(this.active);}
  reset(){this.clock=0;this.beat=0;}
  private ok(){return !!this.context&&this.active&&!this.muted;}
  private throttle(key:string,gap:number){const t=this.context!.currentTime;if(t-(this.last[key]??-1)<gap)return false;this.last[key]=t;return true;}
  private tone(freq:number,duration:number,type:OscillatorType='sine',volume=.2,slide=1,bus:'sfx'|'music'='sfx',delay=0) {
    if(!this.ok())return;const c=this.context!,o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;
    o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*slide),t+duration);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    o.connect(g).connect(bus==='sfx'?this.sfx!:this.music!);o.start(t);o.stop(t+duration+.03);o.onended=()=>{o.disconnect();g.disconnect();};
  }
  private hiss(duration:number,volume:number,from:number,to:number,type:BiquadFilterType='bandpass',bus:'sfx'|'music'='sfx',delay=0) {
    if(!this.ok()||!this.noise)return;const c=this.context!,src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+delay;
    src.buffer=this.noise;f.type=type;f.frequency.setValueAtTime(from,t);f.frequency.exponentialRampToValueAtTime(Math.max(30,to),t+duration);f.Q.value=1.2;
    g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    src.connect(f).connect(g).connect(bus==='sfx'?this.sfx!:this.music!);src.start(t,Math.random()*.5);src.stop(t+duration+.02);src.onended=()=>{src.disconnect();f.disconnect();g.disconnect();};
  }
  tick(dt:number,s:GameState) {
    if(!this.ok())return;
    this.clock-=dt;if(this.clock>0)return;
    const stage=Math.min(4,s.stage),boss=s.bossActive,scale=SCALES[stage];
    this.clock+=TEMPO[stage]*(boss?.88:1);
    const n=this.beat++,mel=boss?BOSS_MELODY:MELODY;
    if(s.clearTimer>0||s.transition>0){if(n%4===0)this.tone(scale[(n/4|0)%scale.length]*2,.5,'triangle',.06,1,'music');return;}
    if(n%2===0)this.tone(scale[mel[(n/2|0)%mel.length]]*(boss&&n%16>7?2:1),.36,'triangle',.07,1,'music');
    if(n%4===0)this.tone(scale[0]/2,.32,'sawtooth',.05,.98,'music');
    if(n%4===0)this.tone(64,.22,'sine',.5,.35,'music');
    if(n%4===2)this.hiss(.09,.12,2400,1800,'highpass','music');
    if(boss&&n%2===1)this.hiss(.04,.05,7000,6000,'highpass','music');
    if(n%8===6)this.hiss(.14,.18,1400,700,'bandpass','music');
  }
  event(e:GameEvent,hero:HeroId,stage=0) {
    if(!this.ok())return;
    switch(e.kind){
      case 'shot':if(this.throttle('shot',.09))this.tone(hero==='golem'?240:hero==='ryu'?320:720,.05,'triangle',.04,.5);break;
      case 'hit':if(this.throttle('hit',.06))this.tone(1200+Math.random()*300,.025,'square',.018,.6);break;
      case 'kill':if(e.big){this.hiss(.5,.45,900,80,'lowpass');this.tone(70,.4,'sine',.5,.4);}else if(this.throttle('kill',.04)){this.hiss(.18,.22,1800,200,'lowpass');this.tone(140,.12,'triangle',.12,.3);}break;
      case 'explode':this.hiss(1.6,.6,600,40,'lowpass');this.tone(50,1.4,'sine',.8,.4);break;
      case 'hurt':this.tone(220,.42,'sawtooth',.2,.15);this.tone(70,.5,'sine',.6,.35);this.hiss(.4,.3,1200,100,'lowpass');break;
      case 'graze':if(this.throttle('graze',.035))this.tone(2300+Math.random()*400,.03,'sine',.035,.8);break;
      case 'perfect':[1318,1760,2637].forEach((f,i)=>this.tone(f,.35,'sine',.1,1,'sfx',i*.04));this.hiss(.3,.15,4000,9000,'highpass');break;
      case 'dash':this.hiss(.18,.22,600,3200,'bandpass');break;
      case 'pickup':if(e.big){this.tone(880,.12,'sine',.18);this.tone(1320,.22,'triangle',.1,1,'sfx',.05);}else if(this.throttle('coin',.05))this.tone(1760+Math.random()*200,.05,'sine',.04);break;
      case 'charge':this.tone(230,.3,'sawtooth',.1,3);this.tone(110,.4,'sine',.45,.25);break;
      case 'near':if(this.throttle('near',.08)){this.hiss(.08,.25,3000,800,'bandpass');this.tone(160,.1,'square',.08,.3);}break;
      case 'ultimate':this.tone(60,2.2,'sine',.8,.3);this.tone(330,1,'sawtooth',.1,3);this.tone(880,1.5,'triangle',.1,.5);this.hiss(1.5,.3,300,6000,'bandpass');break;
      case 'strike':this.hiss(.35,.5,5000,300,'lowpass');this.tone(55,.3,'sine',.5,.5);break;
      case 'bloom':if(this.throttle('bloom',.1))this.tone([1047,1175,1319,1568][Math.floor(Math.random()*4)],.4,'sine',.08);break;
      case 'cancel':if(this.throttle('cancel',.2))for(let i=0;i<5;i++)this.tone(1500+i*220,.12,'sine',.05,1,'sfx',i*.03);break;
      case 'phase':this.hiss(.8,.4,1500,60,'lowpass');this.tone(98,.8,'sawtooth',.12,.5);break;
      case 'attack':this.tone(587,.18,'triangle',.06);this.tone(880,.25,'triangle',.05,1,'sfx',.08);break;
      case 'warning':for(let i=0;i<4;i++){this.tone(440,.35,'square',.07,1,'sfx',i*.7);this.tone(415,.35,'square',.07,1,'sfx',i*.7+.35);}break;
      case 'boss':this.tone(55,1.5,'sawtooth',.14);this.tone(58,1.5,'sawtooth',.12);break;
      case 'stage':[0,2,4].forEach((k,i)=>this.tone(SCALES[Math.min(4,stage)][k]*2,.6,'triangle',.08,1,'sfx',i*.12));break;
      case 'stageclear':case 'victory':[0,2,4,5].forEach((k,i)=>this.tone(SCALES[Math.min(4,stage)][k]*2,1.2,'triangle',.11,1,'sfx',i*.14));break;
      case 'extend':[0,2,4].forEach((k,i)=>this.tone(SCALES[0][k]*4,.3,'sine',.1,1,'sfx',i*.07));break;
    }
  }
}
