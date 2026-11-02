export function boundDiagramView(scale,x,y,width,height,contentWidth=width,contentHeight=height){
  const s=Math.min(3,Math.max(1,Number.isFinite(scale)?scale:1)),mx=Math.max(0,(contentWidth*s-width)/2),my=Math.max(0,(contentHeight*s-height)/2);
  return{scale:s,x:Math.max(-mx,Math.min(mx,x||0)),y:Math.max(-my,Math.min(my,y||0))};
}

export class DiagramViewer{
  constructor({host,launch,title,onStep,onTogglePlay=()=>{},getPlaying=()=>true}){
    this.host=host;this.launch=launch;this.onStep=onStep;this.getPlaying=getPlaying;this.caption=host.closest('.motion-theater')?.querySelector('.scene-live-caption');this.isOpen=false;this.view={scale:1,x:0,y:0};this.listeners=[];this.pointers=new Map();
    this.dialog=document.createElement('dialog');this.dialog.className='diagram-dialog';this.dialog.setAttribute('aria-label','탐구 도해 크게 보기');this.dialog.setAttribute('aria-modal','true');
    this.dialog.innerHTML='<div class="diagram-shell"><header class="diagram-header"><div><p>수학 도해 크게 보기</p><h2></h2></div><button type="button" data-viewer-close aria-label="도해 크게 보기 닫기">닫기 <span aria-hidden="true">×</span></button></header><div class="diagram-surface" tabindex="0" aria-label="확대하면 밀어서 도해를 이동할 수 있습니다"><div class="diagram-mount"></div></div><div class="diagram-zoom-tools" role="group" aria-label="도해 확대 축소"><button type="button" data-zoom-out aria-label="도해 축소">−</button><button type="button" data-zoom-reset aria-label="도해 크기와 위치 초기화">100%</button><button type="button" data-zoom-in aria-label="도해 확대">＋</button><p>두 손가락으로 확대 · 밀어서 이동</p></div><nav class="diagram-navigation" aria-label="확대 도해 장 넘기기"><button type="button" data-viewer-previous>← 이전</button><span data-viewer-position aria-live="polite"></span><button type="button" data-viewer-next>다음 →</button></nav></div>';
    this.dialog.querySelector('h2').textContent=title;document.getElementById('main').append(this.dialog);
    const description=document.createElement('p');description.id='diagramDescription';description.className='diagram-description';this.dialog.append(description);this.dialog.setAttribute('aria-describedby','diagramDescription');
    const close=this.dialog.querySelector('[data-viewer-close]'),actions=document.createElement('div');actions.className='diagram-header-actions';close.before(actions);const play=document.createElement('button');play.type='button';play.dataset.viewerPlay='';play.setAttribute('aria-label','도해 애니메이션 재생 또는 일시정지');actions.append(play,close);this.updatePlayback();
    this.surface=this.dialog.querySelector('.diagram-surface');this.mount=this.dialog.querySelector('.diagram-mount');
    const listen=(node,type,fn,options)=>{node.addEventListener(type,fn,options);this.listeners.push(()=>node.removeEventListener(type,fn,options))};
    listen(launch,'click',()=>this.open());listen(this.dialog.querySelector('[data-viewer-close]'),'click',()=>this.close());listen(play,'click',()=>{onTogglePlay();this.updatePlayback()});
    listen(this.dialog,'cancel',e=>{e.preventDefault();this.close()});listen(this.dialog,'close',()=>this.restore());
    listen(this.dialog.querySelector('[data-viewer-previous]'),'click',()=>this.onStep(-1));listen(this.dialog.querySelector('[data-viewer-next]'),'click',()=>this.onStep(1));
    listen(this.dialog.querySelector('[data-zoom-in]'),'click',()=>this.zoom(this.view.scale*1.4));listen(this.dialog.querySelector('[data-zoom-out]'),'click',()=>this.zoom(this.view.scale/1.4));listen(this.dialog.querySelector('[data-zoom-reset]'),'click',()=>this.reset());
    listen(this.surface,'wheel',e=>{if(!this.isOpen)return;e.preventDefault();this.zoom(this.view.scale*Math.exp(-e.deltaY*.002),e.clientX,e.clientY)},{passive:false});
    listen(this.surface,'pointerdown',e=>{if(!this.isOpen||e.button>0)return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});try{this.surface.setPointerCapture(e.pointerId)}catch{}this.rebase()});
    listen(this.surface,'pointermove',e=>{
      if(!this.pointers.has(e.pointerId))return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const points=[...this.pointers.values()];
      if(points.length>=2&&this.gesture?.distance){const [a,b]=points,scale=this.gesture.scale*Math.hypot(a.x-b.x,a.y-b.y)/this.gesture.distance,box=this.surface.getBoundingClientRect(),ratio=Math.min(3,Math.max(1,scale))/this.gesture.scale,mx=(a.x+b.x)/2-box.left-box.width/2,my=(a.y+b.y)/2-box.top-box.height/2;this.apply(scale,mx-(this.gesture.mx-this.gesture.x)*ratio,my-(this.gesture.my-this.gesture.y)*ratio)}
      else if(points.length===1&&this.gesture)this.apply(this.view.scale,this.gesture.x+points[0].x-this.gesture.px,this.gesture.y+points[0].y-this.gesture.py);
    });
    const release=e=>{this.pointers.delete(e.pointerId);this.rebase()};listen(this.surface,'pointerup',release);listen(this.surface,'pointercancel',release);listen(this.surface,'lostpointercapture',release);
    listen(this.dialog,'keydown',e=>{if(e.target.closest('button'))return;if(e.key==='+'||e.key==='='){e.preventDefault();this.zoom(this.view.scale*1.4)}else if(e.key==='-'){e.preventDefault();this.zoom(this.view.scale/1.4)}});
    const resize=()=>{if(this.isOpen)this.apply(this.view.scale,this.view.x,this.view.y)};listen(window,'resize',resize);if(window.visualViewport)listen(window.visualViewport,'resize',resize);
  }
  rebase(){
    const p=[...this.pointers.values()],box=this.surface.getBoundingClientRect();this.gesture=p.length?{...this.view,px:p[0].x,py:p[0].y}:null;
    if(p.length>=2)Object.assign(this.gesture,{distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),mx:(p[0].x+p[1].x)/2-box.left-box.width/2,my:(p[0].y+p[1].y)/2-box.top-box.height/2});
  }
  apply(scale,x,y){
    const camera=this.host.querySelector('.motion-frame:not([data-outgoing]) .motion-camera');if(!camera)return;
    const b=this.surface.getBoundingClientRect(),cw=camera.offsetWidth||b.width||1,ch=camera.offsetHeight||b.height||1;
    this.view=boundDiagramView(scale,x,y,b.width||1,b.height||1,cw,ch);camera.style.transform='translate('+this.view.x+'px,'+this.view.y+'px) scale('+this.view.scale+')';
    this.dialog.querySelector('[data-zoom-reset]').textContent=Math.round(this.view.scale*100)+'%';this.dialog.querySelector('[data-zoom-out]').disabled=this.view.scale<=1;this.dialog.querySelector('[data-zoom-in]').disabled=this.view.scale>=3;this.surface.classList.toggle('is-zoomed',this.view.scale>1);
  }
  zoom(scale,px,py){const b=this.surface.getBoundingClientRect(),x=(px??(b.left+b.width/2))-b.left-b.width/2,y=(py??(b.top+b.height/2))-b.top-b.height/2,s=Math.min(3,Math.max(1,scale)),r=s/this.view.scale;this.apply(s,x-(x-this.view.x)*r,y-(y-this.view.y)*r)}
  reset(){this.view={scale:1,x:0,y:0};if(this.isOpen)this.apply(1,0,0)}
  updatePlayback(){const button=this.dialog.querySelector('[data-viewer-play]');if(!button)return;const playing=this.getPlaying();button.textContent=playing?'Ⅱ':'▷';button.setAttribute('aria-pressed',String(!playing));}
  update(index,label){this.index=index;this.dialog.querySelector('[data-viewer-position]').textContent=String(index+1).padStart(2,'0')+' / 07 · '+label;this.dialog.querySelector('[data-viewer-previous]').disabled=index===0;this.dialog.querySelector('[data-viewer-next]').disabled=index===6;this.dialog.querySelector('.diagram-description').textContent=(this.host.getAttribute('aria-label')||'')+' '+(this.caption?.textContent||'');this.reset()}
  open(){
    if(this.isOpen)return;this.isOpen=true;this.previousFocus=document.activeElement;this.placeholder=document.createElement('div');this.placeholder.className='diagram-placeholder';this.placeholder.style.height=Math.max(1,this.host.getBoundingClientRect().height)+'px';this.host.before(this.placeholder);this.mount.append(this.host);document.body.classList.add('diagram-open');
    if(typeof this.dialog.showModal==='function')this.dialog.showModal();else this.dialog.setAttribute('open','');this.reset();this.updatePlayback();this.dialog.querySelector('[data-viewer-close]').focus();
  }
  restore(focus=true){
    if(!this.isOpen)return;this.isOpen=false;this.host.querySelectorAll('.motion-camera').forEach(node=>node.style.removeProperty('transform'));this.placeholder?.replaceWith(this.host);this.placeholder=null;document.body.classList.remove('diagram-open');this.pointers.clear();this.gesture=null;
    if(focus&&this.previousFocus?.isConnected)this.previousFocus.focus({preventScroll:true});
  }
  close({focus=true}={}){if(!this.isOpen)return;this.restore(focus);if(typeof this.dialog.close==='function')this.dialog.close();else this.dialog.removeAttribute('open')}
  dispose(){this.close({focus:false});this.listeners.forEach(f=>f());this.dialog.remove()}
}
