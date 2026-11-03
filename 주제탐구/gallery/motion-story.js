import {animate,stagger} from 'animejs';
import {motionFrameFor} from './motion-frames.js';
import {STAGE_NAMES} from './motion-designs.js';
import {LivingModel} from './living-model.js';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export class MotionStory{
  constructor(host,work,{motion=true,onPlaybackChange=()=>{},onViewChange=()=>{}}={}){
    this.host=host;this.work=work;this.enabled=motion;this.phase=-1;this.animations=[];this.destroyed=false;this.paused=false;this.onPlaybackChange=onPlaybackChange;this.onViewChange=onViewChange;this.view='model';
    this.caption=host.closest('.motion-theater')?.querySelector('.scene-live-caption');
    this.visible=typeof IntersectionObserver!=='function';this.presented=-1;
    this.visibilityHandler=()=>{if(document.hidden)this.finish();else this.present()};
    document.addEventListener('visibilitychange',this.visibilityHandler);
    if(typeof IntersectionObserver==='function'){this.observer=new IntersectionObserver(entries=>{this.visible=!!entries[0]?.isIntersecting;if(this.visible)this.present();else this.finish()},{threshold:.08});this.observer.observe(host)}
    host.dataset.renderer='studio-model';
  }
  get playing(){return this.enabled&&!this.paused}
  present(){if(this.destroyed||!this.visible||!this.playing||document.hidden||this.phase<0)return;if(this.presented!==this.phase)this.setPhase(this.phase,{replay:true});else this.model?.setMotion(this.view==='model')}
  finish(){
    this.model?.setMotion(false);
    this.animations.forEach(animation=>{animation.pause();animation.revert()});this.animations=[];
    this.host.querySelectorAll('[data-outgoing]').forEach(node=>node.remove());
    this.host.querySelectorAll('[data-draw]').forEach(node=>{node.style.removeProperty('stroke-dasharray');node.style.removeProperty('stroke-dashoffset')});
    this.host.classList.remove('is-playing');
  }
  setMotion(on){if(on===this.enabled)return;this.enabled=on;if(!on){this.finish();if(this.model){this.model.phase=this.model.phaseValue=this.phase;this.model.draw()}}else this.present();this.onPlaybackChange(this.playing)}
  setPlaying(on){this.paused=!on;if(on)this.present();else this.finish();this.onPlaybackChange(this.playing)}
  setView(view){
    if(view==='model'&&!this.model)return;this.view=view==='diagram'?'diagram':'model';this.host.dataset.view=this.view;
    const showModel=this.view==='model';this.model?.resize();this.model?.draw();this.model?.setMotion(showModel&&this.visible&&this.playing&&!document.hidden);
    if(this.caption)this.caption.textContent=showModel?'연속 예시 모형 · 수학적 관계를 천천히 살펴봅니다.':this.frame.annotation;
    this.onViewChange(this.view,!!this.model);
  }
  setPhase(value,{replay=false}={}){
    if(this.destroyed)return;
    const phase=Math.max(0,Math.min(6,Math.trunc(value)));
    if(phase===this.phase&&!replay)return;
    this.finish();
    const old=this.host.querySelector('.motion-frame');
    const frame=this.frame=motionFrameFor(this.work,phase),fresh=document.createElement('div');fresh.className='motion-frame';
    fresh.innerHTML='<div class="motion-stage-copy"><p class="motion-kicker"><span>'+String(phase+1).padStart(2,'0')+'</span> '+STAGE_NAMES[phase]+'</p><h3>'+esc(frame.headline)+'</h3><div class="motion-focus"><span></span><p>'+esc(frame.focus)+'</p></div><small>전시 해설 · 예시 모형</small></div><div class="motion-camera"><div class="motion-illustration">'+frame.svg+'</div></div>';
    this.phase=phase;this.host.dataset.phase=String(phase);this.host.dataset.family=frame.family;this.host.setAttribute('aria-label',frame.headline+' '+frame.focus+'에 대한 전시 해설용 도해');
    if(old){old.setAttribute('data-outgoing','');old.setAttribute('aria-hidden','true');if(!this.enabled)old.remove()}
    this.host.append(fresh);
    if(!this.modelTried){
      this.modelTried=true;this.modelHost=document.createElement('div');this.modelHost.className='living-illustration';this.modelHost.setAttribute('aria-hidden','true');fresh.querySelector('.motion-camera').append(this.modelHost);
      try{this.model=new LivingModel(this.modelHost,this.work,frame.family);if(this.model.staticFallback){this.model.dispose();this.model=null}}catch{this.model=null}
      if(!this.model){this.modelHost.remove();this.view='diagram'}
    }else if(this.model)fresh.querySelector('.motion-camera').append(this.modelHost);
    this.model?.resize();this.model?.setPhase(phase);if(this.model&&!this.enabled){this.model.phase=this.model.phaseValue=phase;this.model.draw()}this.setView(this.view);
    if(!this.playing||document.hidden||!this.visible){old?.remove();return}
    this.presented=phase;
    this.host.classList.add('is-playing');
    this.model?.setMotion(this.view==='model');
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
        if(Object.keys(attrs).length){run(node,{...attrs,duration:820,ease:'inOut(3)'});morphs++}
      });
    }
    this.host.dataset.morphs=String(morphs);
    if(old)run(old,{opacity:[1,0],duration:260,ease:'inOut(2)',onComplete:()=>old.remove()});
    // The model itself keeps its position and clock. Only the editorial copy changes around it.
    run(fresh.querySelector('.motion-stage-copy'),{opacity:[0,1],translateY:[12,0],duration:520,delay:40,ease:'out(4)'});
    if(this.view==='diagram'){
      const strokes=fresh.querySelectorAll('.primary[data-draw],.secondary[data-draw]');
      strokes.forEach(node=>{node.style.strokeDasharray='1';node.style.strokeDashoffset='1'});
      run(strokes,{strokeDashoffset:[1,0],delay:stagger(13,{start:40}),duration:760,ease:'inOut(3)'});
      run(fresh.querySelectorAll('[data-label]'),{opacity:[0,1],delay:stagger(9,{start:150}),duration:400,ease:'out(3)'});
    }
  }
  replay(){if(!this.enabled)return;this.paused=false;if(this.model){this.model.time=0;this.model.phase=this.model.phaseValue=this.phase;this.model.draw()}this.onPlaybackChange(this.playing);this.setPhase(this.phase,{replay:true})}
  dispose(){this.destroyed=true;this.finish();this.model?.dispose();this.model=null;this.observer?.disconnect();document.removeEventListener('visibilitychange',this.visibilityHandler);this.host.replaceChildren()}
}
