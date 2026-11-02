// Visual treatment and arc-length sampling; the mathematical coordinates stay unchanged.
export function enhanceMotionSVG(svg,{id,light}){
  const scope='math-scene-'+id;
  const css=svg.match(/<style>([\s\S]*?)<\/style>/)?.[1]||'';
  const scoped=css.replace(/([^{}]+)\{/g,(_,selectors)=>selectors.split(',').map(s=>'#'+scope+' '+s.trim()).join(',')+'{');
  const extra='#'+scope+' .primary{stroke:#e1e6cb;stroke-width:2}#'+scope+' .secondary{stroke:#afc1a5;stroke-width:1.4;opacity:.82}#'+scope+' .ghost{stroke:#b5c5b0;opacity:.28;stroke-width:1}#'+scope+' .wash,#'+scope+' .positive-fill,#'+scope+' .plane-wash{fill:#b5c99e;fill-opacity:.18}#'+scope+' .node{fill:#e9ebd8;stroke:#a7bc9b;stroke-width:1.2}#'+scope+' .label,#'+scope+' .warning-label{font-size:17px;paint-order:stroke;stroke:#203f35;stroke-width:3px;stroke-linejoin:round}#'+scope+' .label,#'+scope+' .tiny,#'+scope+' .metric{fill:#d6dfc6}#'+scope+' .axis{stroke:#bccab1;opacity:.22}#'+scope+' .guide{stroke:#bccab1;opacity:.58}';
  svg=svg.replace(/<text([^>]*)>([^<]*)<\/text>/g,(all,attrs,text)=>text.length>22?'<text'+attrs.replace('class="','class="long-label ')+'>'+text+'</text>':all);
  return svg.replace('<svg ','<svg id="'+scope+'" ').replace('<style>'+css+'</style>','<style>'+scoped+extra+'</style>');
}

function polyline(d){
  if(/[^\d\s.,+eE\-mMlLzZ]/.test(d)||((d.match(/[mM]/g)||[]).length!==1))return null;
  const values=d.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number)||[];
  if(values.length<4||values.length%2)return null;
  const pts=[];for(let i=0;i<values.length;i+=2)pts.push([values[i],values[i+1]]);
  if(/[zZ]\s*$/.test(d))pts.push([...pts[0]]);
  return pts;
}
export function routeForShape({type,attrs}){
  let points;
  if(type==='path')points=polyline(attrs.d||'');
  else if(type==='circle'||type==='ellipse'){
    // Rotated ellipses are left to the original SVG renderer.
    if(attrs.transform)return null;
    const cx=+attrs.cx,cy=+attrs.cy,rx=+(attrs.rx??attrs.r),ry=+(attrs.ry??attrs.r);
    if(![cx,cy,rx,ry].every(Number.isFinite)||rx<=0||ry<=0)return null;
    points=Array.from({length:97},(_,i)=>{const a=i/96*Math.PI*2;return[cx+rx*Math.cos(a),cy+ry*Math.sin(a)]});
  }
  if(!points?.length||points.some(p=>!p.every(Number.isFinite)||p[0]<10||p[0]>750||p[1]<15||p[1]>410))return null;
  const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances.at(-1)+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
  const length=distances.at(-1);return length>=95?{points,distances,length}:null;
}
export function pointOnRoute(route,progress){
  const d=Math.max(0,Math.min(1,progress))*route.length;let lo=1,hi=route.distances.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(route.distances[mid]<d)lo=mid+1;else hi=mid}
  const a=route.points[lo-1],b=route.points[lo],span=route.distances[lo]-route.distances[lo-1],t=span?(d-route.distances[lo-1])/span:0;
  return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
}
export function selectMotionRoutes(shapes,limit=2){return shapes.map(routeForShape).filter(Boolean).sort((a,b)=>b.length-a.length).slice(0,limit)}

export class SceneFlow{
  constructor(svg,{compact=false}={}){
    this.svg=svg;this.raf=0;this.destroyed=false;this.elapsed=0;this.compact=compact;
    const shapes=selector=>[...svg.querySelectorAll(selector)].filter(n=>!n.closest('[transform]')).map(n=>({type:n.tagName.toLowerCase(),attrs:Object.fromEntries([...n.attributes].map(a=>[a.name,a.value]))}));
    this.routes=selectMotionRoutes(shapes('path.primary,circle.primary,ellipse.primary'),compact?1:2);if(!this.routes.length)this.routes=selectMotionRoutes(shapes('path.secondary,ellipse.secondary'),1);this.nodes=[];this.pulses=[];
    this.group=document.createElementNS('http://www.w3.org/2000/svg','g');this.group.setAttribute('aria-hidden','true');this.group.setAttribute('data-scene-flow','');this.group.style.opacity='0';svg.append(this.group);
    const node=(name,cls)=>{const n=document.createElementNS(svg.namespaceURI,name);n.setAttribute('class',cls);this.group.append(n);return n};
    for(const route of this.routes){const trail=node('path','motion-flow-trail'),halo=node('circle','motion-beacon-halo'),core=node('circle','motion-beacon-core');halo.setAttribute('r',compact?'15':'18');core.setAttribute('r',compact?'4.8':'4.2');this.nodes.push({route,trail,halo,core})}
    if(!this.nodes.length){const points=[...svg.querySelectorAll('circle.node')].filter(n=>!n.closest('[transform]'));for(const point of points.slice(0,compact?3:5)){const pulse=node('circle','motion-beacon-halo');pulse.setAttribute('cx',point.getAttribute('cx'));pulse.setAttribute('cy',point.getAttribute('cy'));pulse.setAttribute('r','12');this.pulses.push(pulse)}}
  }
  start(){
    if(this.raf||this.destroyed||(!this.nodes.length&&!this.pulses.length))return;this.last=0;this.lastDraw=0;
    const tick=time=>{if(this.destroyed)return;this.elapsed+=this.last?Math.min(time-this.last,100):0;this.last=time;
      if(time-this.lastDraw>=33){this.lastDraw=time;this.draw(this.elapsed)}
      this.raf=requestAnimationFrame(tick);
    };this.raf=requestAnimationFrame(tick);
  }
  draw(time){
    this.group.style.opacity=String(Math.min(1,Math.max(0,(time-1100)/650)));
    this.pulses.forEach((node,i)=>{const wave=(Math.sin(time/1500-i*.9)+1)/2;node.setAttribute('r',(10+wave*7).toFixed(2));node.style.opacity=(.1+wave*.25).toFixed(2)});
    this.nodes.forEach(({route,trail,halo,core},i)=>{
      const progress=((time-1100)/(this.compact?6200:7800)+i*.39)%1;if(progress<0)return;
      const p=pointOnRoute(route,progress),fade=Math.min(1,progress*12,(1-progress)*12);
      for(const node of[halo,core]){node.setAttribute('cx',p[0].toFixed(2));node.setAttribute('cy',p[1].toFixed(2));node.style.opacity=String(fade)}
      const pts=Array.from({length:10},(_,j)=>pointOnRoute(route,Math.max(0,progress-.13)+Math.min(.13,progress)*j/9));trail.setAttribute('d',pts.map((p,j)=>(j?'L':'M')+p.map(x=>x.toFixed(2)).join(' ')).join(''));trail.style.opacity=String(fade);
    });
  }
  stop(){cancelAnimationFrame(this.raf);this.raf=0;this.last=0;this.group.style.opacity='0'}
  dispose(){this.stop();this.destroyed=true;this.group.remove()}
}
