/* Meaningful motion for the site's learning, problem, game and teacher screens. */
(() => {
  'use strict';
  if(window.JPKinetic)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)'),root=document.documentElement;
  const path=(()=>{try{return decodeURIComponent(location.pathname)}catch{return location.pathname}})();
  const kind=path.includes('/수업창고/')?'teacher':path.includes('/주제탐구/gallery/')?'exhibition':path.includes('/주제탐구/')?'research':path.includes('/수능문제/')||path.includes('/AI킬러문제/')?'problem':path.includes('/games/')||path.includes('/보스전/')||/게임|세계시장|\/live\//.test(path)?'game':/\/미적분1\/|\/기하\/|\/경제수학\//.test(path)?'lab':'entrance';
  const theme=path.includes('/기하/')?'space':path.includes('/경제수학/')?'economy':path.includes('/미적분1/')?'motion':kind==='teacher'?'teacher':'inquiry';
  root.dataset.jpKinetic=kind;root.dataset.jpKineticTheme=theme;
  const PANEL='.tab-panel,.tab-pane,[data-panel],[data-page],section.ch,.scene,.slide,.chapter,.deck-slide,.main-panel,.calc-section,.skill-section,.game-panel,.daily-play,.daily-result,#page-theory,#page-lab,#page-game';
  const BLOCK='.theory-section,.lesson-block,.step-block,.concept-box,.theorem-box,.prob,.problem-card,.question-card,.q-card,.lab,.lab-card,.graph-card,.lab-graph-card,.visual-card,.eq-box,.ex-card,.resource-card,.route-card,.experience-card,.game-card,.summary-card,.request-card,.curator-section,.term-card,.practice-card,.card,.box,.function-ticket,.decision-step,.strategy-card,.result-summary';
  const VALUE='output,[data-readout],.chip-value,.readout-box,.lab-readout,.metric-value,.stat-value,.score-value,.allocation-value,.result-number,.decision-result strong,.overview-card strong,.stats strong,[data-countup],[data-r]';
  const GRAPH='.lab svg,.lab canvas,.lab-card svg,.graph-card svg,.graph-card canvas,.lab-graph-card svg,.lab-graph-card canvas,.visual-card svg,.fig svg,.plot svg,svg.plot,svg[id*="lab" i],canvas[id*="lab" i],.figure-surface canvas,.ex-canvas,.math-canvas';
  const INPUT_AREA='.lab,.lab-card,.lab-panel,.lab-box,.lab-area,.graph-card,.widget,.demo,.lab-grid,.panel,[data-page="lab"],[data-panel="lab"],.tab-panel,.scene,section.ch,.chapter';
  const activeAnimations=new Set(),valueTexts=new WeakMap(),panels=new WeakMap(),seen=new WeakSet(),lastPulse=new WeakMap(),stepCounts=new WeakMap();
  let observer,intersection,closed=false,pending=0,queue=new Set(),before=null,beforeAt=-1000,ghost=null;
  const quiet=()=>media.matches||document.body?.classList.contains('reduced-motion');
  const visible=node=>node?.isConnected&&!node.hidden&&!!node.getClientRects().length&&node.getBoundingClientRect().width>0;
  const own=node=>node?.nodeType===1&&(node.matches('[data-jp-kinetic-own]')||node.closest('[data-jp-kinetic-own],.studio-frame,.motion-stage,.katex,.MathJax,script,style'));
  function animate(node,keyframes,options={}){
    if(closed||quiet()||document.hidden||!node?.animate||!visible(node))return null;
    const a=node.animate(keyframes,{duration:kind==='teacher'?300:580,easing:'cubic-bezier(.19,1,.28,1)',...options});activeAnimations.add(a);
    a.finished.then(()=>{activeAnimations.delete(a);a.cancel()},()=>activeAnimations.delete(a));return a;
  }
  function clearGhost(){ghost?.remove();ghost=null;before=null}
  function settle(){for(const a of activeAnimations)a.cancel();activeAnimations.clear();clearGhost()}
  function reveal(node,index=0){
    if(!visible(node)||own(node)||kind==='exhibition')return;
    animate(node,kind==='teacher'||node.matches(PANEL)?[{opacity:.6},{opacity:1}]:[{opacity:.45,transform:'translateY(11px)'},{opacity:1,transform:'translateY(0)'}],{delay:Math.min(index,3)*55});
  }
  function trace(svg){
    if(quiet()||!visible(svg)||svg.closest('.studio-frame,.motion-stage,.hero-poster,.card-art,.room-art')||kind==='exhibition'||kind==='game')return;
    const paths=[...svg.querySelectorAll('path,polyline')].filter(p=>{const s=getComputedStyle(p);return s.stroke!=='none'&&parseFloat(s.strokeWidth)>=1.45&&(s.fill==='none'||s.fill==='rgba(0, 0, 0, 0)')&&s.strokeDasharray==='none'}).slice(0,5);
    paths.forEach((p,i)=>{let length;try{length=p.getTotalLength()}catch{return}if(length<35||!Number.isFinite(length))return;animate(p,[{strokeDasharray:String(length),strokeDashoffset:String(length),opacity:.55},{strokeDasharray:String(length),strokeDashoffset:'0',opacity:1}],{duration:kind==='teacher'?550:950,delay:i*60})});
  }
  function enter(node,index=0){
    if(seen.has(node)||own(node))return;seen.add(node);node.dataset.jpKineticEnter='';
    if(intersection)intersection.observe(node);else if(visible(node)){reveal(node,index);if(node.tagName.toLowerCase()==='svg')trace(node)}
  }
  function pulseValue(node){
    if(!visible(node)||own(node))return;const text=node.textContent.trim();if(text.length>140)return;const old=valueTexts.get(node);valueTexts.set(node,text);if(old===undefined||old===text||!text)return;
    const now=performance.now();if(now-(lastPulse.get(node)||0)<180)return;lastPulse.set(node,now);
    animate(node,[{backgroundColor:'rgba(184,149,73,.20)'},{backgroundColor:'rgba(184,149,73,0)'}],{duration:650});
  }
  function stepChanged(node){
    const stack=node?.closest?.('#stepLines');if(!stack)return;
    const lines=[...stack.querySelectorAll('.step-line:not(.pending)')],previous=stepCounts.get(stack);stepCounts.set(stack,lines.length);
    if(previous!==undefined&&lines.length>previous)animate(lines.at(-1),[{opacity:.25,transform:'translateX(-9px)'},{opacity:1,transform:'translateX(0)'}],{duration:620});
  }
  function panelChanged(panel){
    if(own(panel))return;const on=visible(panel)&&getComputedStyle(panel).display!=='none';if(panels.get(panel)===on)return;panels.set(panel,on);if(!on)return;
    reveal(panel);const beats=panel.querySelectorAll('.eq,.eq-box,.formula,.condition,.statement,.prob,.lab,.ex-card,.fig,.question,.step-question');[...beats].slice(0,5).forEach((node,i)=>reveal(node,i+1));panel.querySelectorAll(GRAPH).forEach(trace);
  }
  function scan(scope){
    if(!scope?.querySelectorAll||own(scope))return;
    const ranges=scope.matches?.('input[type="range"]')?[scope]:scope.querySelectorAll('input[type="range"]');
    ranges.forEach(input=>{if(input.hasAttribute('aria-label')||input.hasAttribute('aria-labelledby')||input.labels?.length||own(input))return;const parent=input.parentElement,label=input.closest('label')||(parent?.querySelectorAll('input[type="range"]').length===1?parent.querySelector(':scope > label'):null)||input.closest('.decision-step')?.querySelector('.step-label b');if(!label)return;const copy=label.cloneNode(true);copy.querySelectorAll('input,output,select,textarea,button,b[id],strong[id],.range-value,.katex-mathml').forEach(n=>n.remove());const name=copy.textContent.replace(/\s+/g,' ').trim();if(name&&name.length<100)input.setAttribute('aria-label',name)});
    if(kind!=='exhibition'){if(scope.matches?.(BLOCK)&&!scope.parentElement?.closest('[data-jp-kinetic-enter]'))enter(scope);scope.querySelectorAll(BLOCK).forEach((node,i)=>{if(node.parentElement?.closest('[data-jp-kinetic-enter]'))return;enter(node,i)})}
    scope.querySelectorAll(VALUE).forEach(node=>{if(!valueTexts.has(node))valueTexts.set(node,node.textContent.trim())});
    scope.querySelectorAll(PANEL).forEach(node=>{if(!panels.has(node))panels.set(node,visible(node)&&getComputedStyle(node).display!=='none')});
    scope.querySelectorAll('#stepLines').forEach(stepChanged);
    if(kind==='lab'||kind==='problem'||kind==='teacher')scope.querySelectorAll(GRAPH).forEach(node=>{if(node.tagName.toLowerCase()==='svg')enter(node)});
  }
  function queueScan(scope){if(closed||!scope?.isConnected)return;queue.add(scope);if(pending)return;pending=setTimeout(()=>{pending=0;if(document.hidden){queue.clear();return}const roots=[...queue];queue.clear();for(const node of roots.slice(0,12))scan(node)},90)}
  function relatedGraph(input){
    const scope=input.closest(INPUT_AREA)||document.querySelector('.tab-panel.active,[data-page="lab"].active,section.ch.on,.scene.is-on')||document;
    return [...scope.querySelectorAll(GRAPH)].find(node=>visible(node)&&!node.closest('.studio-frame,.motion-stage'))||null;
  }
  function snapshot(graph){
    if(!graph)return null;const rect=graph.getBoundingClientRect();if(rect.width<120||rect.height<65||rect.bottom<70||rect.top>innerHeight)return null;
    for(const a of activeAnimations)if(a.effect?.target&&graph.contains(a.effect.target))a.cancel();
    let copy;
    if(graph.tagName.toLowerCase()==='svg'){
      copy=graph.cloneNode(true);copy.removeAttribute('id');copy.setAttribute('aria-hidden','true');const prefix='jp-before-'+Math.round(performance.now())+'-',ids=new Map;
      const originals=graph.querySelectorAll('path,polyline,polygon,circle,ellipse,rect,line'),copies=copy.querySelectorAll('path,polyline,polygon,circle,ellipse,rect,line');originals.forEach((n,i)=>{const s=getComputedStyle(n);for(const property of['fill','stroke','strokeWidth','strokeDasharray','opacity','fillOpacity','strokeOpacity'])copies[i].style[property]=s[property]});
      copy.querySelectorAll('[id]').forEach(n=>{ids.set(n.id,prefix+n.id);n.id=prefix+n.id});
      copy.querySelectorAll('script,foreignObject,text,title,desc').forEach(n=>n.remove());
      copy.querySelectorAll('*').forEach(n=>{for(const a of[...n.attributes]){if(a.name.startsWith('on'))n.removeAttribute(a.name);else if(a.value.includes('#')){let value=a.value.replace(/url\(\s*(['"]?)#([^'"\)\s]+)\1\s*\)/g,(all,quote,id)=>ids.has(id)?'url(#'+ids.get(id)+')':all);if((a.name==='href'||a.name==='xlink:href')&&ids.has(value.slice(1)))value='#'+ids.get(value.slice(1));if(value!==a.value)n.setAttribute(a.name,value)}}});
    }else{
      copy=document.createElement('canvas');const scale=Math.min(1,960/graph.width,600/graph.height);copy.width=Math.max(1,Math.round(graph.width*scale));copy.height=Math.max(1,Math.round(graph.height*scale));try{copy.getContext('2d').drawImage(graph,0,0,copy.width,copy.height)}catch{return null}
    }
    return{copy,rect,shape:shapeKey(graph)};
  }
  function shapeKey(graph){return graph.tagName.toLowerCase()==='svg'?[...graph.querySelectorAll('path,polyline,polygon,circle,ellipse,rect,line')].map(n=>['d','points','cx','cy','r','rx','ry','x','y','x1','x2','y1','y2','width','height'].map(k=>n.getAttribute(k)||'').join(',')).join('|'):null}
  function presentBefore(capture){
    if(!capture||quiet()||document.hidden)return;clearGhost();const {copy,rect}=capture,layer=document.createElement('div');layer.className='jp-condition-before';layer.dataset.jpKineticOwn='';layer.setAttribute('aria-hidden','true');Object.assign(layer.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});if(copy.tagName.toLowerCase()==='svg'){copy.removeAttribute('width');copy.removeAttribute('height')}layer.append(copy);const label=document.createElement('span');label.textContent='이전 조건';layer.append(label);document.body.append(layer);ghost=layer;
    const a=animate(layer,[{opacity:.23},{opacity:0}],{duration:900,easing:'cubic-bezier(.4,0,.2,1)'});if(a)a.finished.then(()=>{if(ghost===layer)clearGhost()},()=>layer.remove());else clearGhost();
  }
  function observe(){
    intersection=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;intersection.unobserve(e.target);reveal(e.target);if(e.target.tagName.toLowerCase()==='svg')trace(e.target)}},{threshold:.08,rootMargin:'0px 0px -12px 0px'});
    observer=new MutationObserver(records=>{
      for(const record of records){let node=record.target.nodeType===1?record.target:record.target.parentElement;if(!node||own(node))continue;
        if(record.type==='attributes'){if(node===document.body){root.dataset.jpKineticReduced=String(quiet());if(quiet())settle()}if(node.matches(PANEL))panelChanged(node);continue}
        if(node.closest('svg'))continue;
        const readout=node.closest(VALUE);if(readout)pulseValue(readout);
        if(record.type==='childList'){
          stepChanged(node);
          for(const added of record.addedNodes)if(added.nodeType===1&&!own(added)){if(added.matches?.(VALUE))pulseValue(added);queueScan(added)}
          for(const removed of record.removedNodes)if(removed.nodeType===1){intersection.unobserve(removed);removed.querySelectorAll?.('[data-jp-kinetic-enter]').forEach(n=>intersection.unobserve(n))}
        }
      }
    });observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','hidden','open','aria-selected','aria-hidden']});scan(document.body);
  }
  function start(){
    observe();function conditionChanged(event){
      const input=event.type==='click'?event.target.closest('button'):event.target;
      if(!input||quiet()||kind==='game'||own(input)||input.closest('[data-page="game"],.game-panel,.arena,.boss-container'))return;
      if(event.type==='input'&&!input.matches('input[type="range"],input[type="number"]'))return;
      if(event.type==='click'&&!input.matches('.a-chip,.fn-chip,.func-chip,.chips button,.step-btn,.param-btn,.fn-btn,.a-btn,button[data-fn],button[data-a],button[data-mode],button[data-step]'))return;
      const now=performance.now();if(now-beforeAt<220)return;beforeAt=now;const graph=relatedGraph(input);before=snapshot(graph);if(!before)return;const captured=before,hadFocus=document.activeElement===input,buttonText=input.tagName==='BUTTON'?input.textContent:null,buttonClass=input.classList[0];
      requestAnimationFrame(()=>{if(closed){clearGhost();return}const after=graph.isConnected?graph:graph.id?document.getElementById(graph.id):relatedGraph(input.isConnected?input:document.body);if(!after||!visible(after)){clearGhost();return}const changed=captured.shape===null||captured.shape!==shapeKey(after);if(changed){captured.rect=after.getBoundingClientRect();presentBefore(captured);if(after.tagName.toLowerCase()==='svg')trace(after)}else clearGhost();
        if(!input.isConnected&&hadFocus&&buttonText&&document.activeElement===document.body){const replacement=input.id?document.getElementById(input.id):[...document.querySelectorAll('button')].find(b=>b.classList.contains(buttonClass)&&b.textContent===buttonText);replacement?.focus({preventScroll:true})}
      });
    }
    document.addEventListener('input',conditionChanged,true);document.addEventListener('click',conditionChanged,true);
    function followLabHash(){const key=location.hash.slice(1);if(!['lab','theory','train','game'].includes(key))return;const button=document.querySelector('button[data-tab="'+key+'"],button[data-page="'+key+'"]');if(button&&!button.classList.contains('active')&&button.getAttribute('aria-selected')!=='true')button.click()}
    window.addEventListener('hashchange',followLabHash);setTimeout(followLabHash,0);
    document.addEventListener('toggle',event=>{if(event.target.tagName==='DETAILS'&&event.target.open)reveal(event.target)},true);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){settle();clearTimeout(pending);pending=0;queue.clear()}});media.addEventListener('change',()=>{settle();root.dataset.jpKineticReduced=String(quiet())});
    window.addEventListener('scroll',clearGhost,{passive:true});window.addEventListener('resize',clearGhost,{passive:true});window.addEventListener('pagehide',()=>{closed=true;settle();observer.disconnect();intersection.disconnect();clearTimeout(pending);pending=0;queue.clear()});window.addEventListener('pageshow',event=>{if(event.persisted){closed=false;observe()}});
    root.dataset.jpKineticReady='true';root.dataset.jpKineticReduced=String(quiet());
  }
  window.JPKinetic={version:'20261104-2',kind,refresh:()=>queueScan(document.body)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
