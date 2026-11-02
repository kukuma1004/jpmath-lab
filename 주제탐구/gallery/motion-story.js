import {animate,stagger} from 'animejs';
import {motionFrameFor} from './motion-frames.js';
import {STAGE_NAMES} from './motion-designs.js';
import {SceneFlow} from './motion-effects.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ZOOM=new Set(['zoom','dimension','sphere-slice','surface']);
const BUILD=new Set(['riemann','volume','rolle','newton','space-points','reflection']);
const TURN=new Set(['projection','rotation','dot','cone-cut','cone-discriminant','ellipsoid']);

export class MotionStory{
  constructor(host,work,{motion=true,onPlaybackChange=()=>{}}={}){
    this.host=host;this.work=work;this.enabled=motion;this.phase=-1;this.animations=[];this.destroyed=false;this.paused=false;this.onPlaybackChange=onPlaybackChange;
    this.caption=host.closest('.motion-theater')?.querySelector('.scene-live-caption');
    this.visible=typeof IntersectionObserver!=='function';this.presented=-1;
    this.visibilityHandler=()=>{if(document.hidden)this.finish();else this.present()};
    document.addEventListener('visibilitychange',this.visibilityHandler);
    if(typeof IntersectionObserver==='function'){this.observer=new IntersectionObserver(entries=>{this.visible=!!entries[0]?.isIntersecting;if(this.visible)this.present();else this.finish()},{threshold:.08});this.observer.observe(host)}
    host.dataset.renderer='motion-svg';
  }
  get playing(){return this.enabled&&!this.paused}
  present(){if(this.destroyed||!this.visible||!this.playing||document.hidden||this.phase<0)return;if(this.presented!==this.phase)this.setPhase(this.phase,{replay:true});else this.flow?.start()}
  finish(){
    this.flow?.stop();
    this.animations.forEach(animation=>{animation.pause();animation.revert()});this.animations=[];
    this.host.querySelectorAll('[data-outgoing]').forEach(node=>node.remove());
    this.host.querySelectorAll('[data-draw]').forEach(node=>{node.style.removeProperty('stroke-dasharray');node.style.removeProperty('stroke-dashoffset')});
    this.host.classList.remove('is-playing');
  }
  setMotion(on){if(on===this.enabled)return;this.enabled=on;if(!on)this.finish();else this.present();this.onPlaybackChange(this.playing)}
  setPlaying(on){this.paused=!on;if(on)this.present();else this.finish();this.onPlaybackChange(this.playing)}
  setPhase(value,{replay=false}={}){
    if(this.destroyed)return;
    const phase=Math.max(0,Math.min(6,Math.trunc(value)));
    if(phase===this.phase&&!replay)return;
    this.finish();
    this.flow?.dispose();this.flow=null;
    const old=this.host.querySelector('.motion-frame'),previous=this.phase,direction=phase>=previous?1:-1;
    const frame=motionFrameFor(this.work,phase),fresh=document.createElement('div');fresh.className='motion-frame';
    fresh.innerHTML='<div class="motion-stage-copy"><p class="motion-kicker"><span>'+String(phase+1).padStart(2,'0')+'</span> '+STAGE_NAMES[phase]+'</p><h3>'+esc(frame.headline)+'</h3><div class="motion-focus"><span></span><p>'+esc(frame.focus)+'</p></div><small>전시 해설 · 예시 모형</small></div><div class="motion-camera"><div class="motion-illustration">'+frame.svg+'</div></div>';
    this.phase=phase;this.host.dataset.phase=String(phase);this.host.dataset.family=frame.family;this.host.setAttribute('aria-label',frame.headline+' '+frame.focus+'에 대한 전시 해설용 도해');
    if(old){old.setAttribute('data-outgoing','');old.setAttribute('aria-hidden','true');if(!this.enabled)old.remove()}
    this.host.append(fresh);
    this.flow=new SceneFlow(fresh.querySelector('svg'),{compact:matchMedia('(max-width: 780px)').matches});
    const heading=this.caption;
    if(heading)heading.textContent=frame.annotation;
    if(!this.playing||document.hidden||!this.visible)return;
    this.presented=phase;
    this.host.classList.add('is-playing');
    this.flow.start();
    const run=(target,options)=>{if(!target||target.length===0)return;const animation=animate(target,options);this.animations.push(animation);return animation};
    let morphs=0;
    if(old&&!replay){
      fresh.querySelectorAll('[data-morph]').forEach(node=>{
        const origin=old.querySelector('[data-morph="'+node.dataset.morph+'"]');if(!origin||origin.tagName!==node.tagName)return;
        const attrs={};for(const key of ['d','cx','cy','r','rx','ry','x','y','width','height']){
          const from=origin.getAttribute(key),to=node.getAttribute(key);if(from===null||to===null||from===to)continue;
          if(key==='d'&&(from.replace(/[-+\d.e]+/gi,'')!==to.replace(/[-+\d.e]+/gi,'')||(from.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).length!==(to.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).length))continue;
          attrs[key]=[from,to];
        }
        if(Object.keys(attrs).length){run(node,{...attrs,duration:1250,ease:'inOut(3)'});morphs++}
      });
    }
    this.host.dataset.morphs=String(morphs);
    if(old)run(old,{opacity:[1,0],translateX:[0,-direction*50],duration:240,ease:'in(2)',onComplete:()=>old.remove()});
    run(fresh,{opacity:[0,1],translateX:[direction*34,0],duration:560,ease:'out(3)'});
    run(fresh.querySelector('.motion-stage-copy h3'),{opacity:[0,1],translateY:[18,0],duration:650,delay:100,ease:'out(4)'});
    const illustration=fresh.querySelector('.motion-illustration');
    if(ZOOM.has(frame.family))run(illustration,{scale:[phase===0?1.23:direction>0?1.13:.91,1],duration:1150,ease:'out(4)'});
    else if(TURN.has(frame.family))run(illustration,{rotate:[direction*-4,0],scale:[.94,1],duration:1100,ease:'out(4)'});
    const groups=fresh.querySelectorAll('[data-stage-group]');
    run(groups,{opacity:[0,1],translateY:[BUILD.has(frame.family)?24:10,0],delay:stagger(BUILD.has(frame.family)?45:28,{start:160}),duration:680,ease:'out(3)'});
    const strokes=fresh.querySelectorAll('.primary[data-draw],.secondary[data-draw]');
    strokes.forEach(node=>{node.style.strokeDasharray='1';node.style.strokeDashoffset='1'});
    run(strokes,{strokeDashoffset:[1,0],delay:stagger(35,{start:200}),duration:950,ease:'inOut(3)'});
    run(fresh.querySelectorAll('.node[data-pop]'),{opacity:[0,1],scale:[.2,1],delay:stagger(45,{start:420}),duration:560,ease:'out(3)'});
    run(fresh.querySelectorAll('[data-label]'),{opacity:[0,1],delay:stagger(18,{start:530}),duration:480,ease:'out(2)'});
    run(fresh.querySelectorAll('.wash[data-rise],.positive-fill,.negative-fill'),{opacity:[0,1],scaleY:[.15,1],delay:stagger(30,{start:240}),duration:880,ease:'out(3)'});
  }
  replay(){if(!this.enabled)return;this.paused=false;this.onPlaybackChange(this.playing);this.setPhase(this.phase,{replay:true})}
  dispose(){this.destroyed=true;this.finish();this.flow?.dispose();this.flow=null;this.observer?.disconnect();document.removeEventListener('visibilitychange',this.visibilityHandler);this.host.replaceChildren()}
}
