import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { inquiry3D, makeInquiry3D, inquiryArt, drawInquiry2D } from './scenes-inquiries.js';

const ACCENT=0xe1eea4, LIGHT=0xd6e1c6, GREEN=0x61876b;
const isSpace=kind=>inquiry3D(kind)||['hero','sphere-slice','sphere-vector','distance','slices','hypersphere','projection','vectors','planes','cone','surface'].includes(kind);

export function artSVG(kind,seed=0){
  const illustration=inquiryArt(kind);if(illustration)return illustration;
  const path=(d,extra='')=>'<path d="'+d+'" fill="none" stroke="currentColor" stroke-width="1.3" '+extra+'/>';
  const line=(x1,y1,x2,y2,extra='')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="currentColor" stroke-width="1.1" '+extra+'/>';
  const circle=(x,y,r,extra='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="currentColor" stroke-width="1.1" '+extra+'/>';
  let d='';
  if(['sphere-slice','sphere-vector','slices','hypersphere','hero'].includes(kind)){
    d+=circle(180,136,83);d+='<ellipse cx="180" cy="136" rx="33" ry="83" fill="none" stroke="currentColor" opacity=".4"/>';
    d+='<ellipse cx="180" cy="136" rx="83" ry="27" fill="none" stroke="currentColor" opacity=".5"/>';
    d+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="currentColor" opacity=".12"/>';
    d+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="none" stroke="currentColor" stroke-width="2"/>';
    d+=line(180,136,180,113,'stroke-dasharray="3 4"');d+=line(180,136,250,123);d+=circle(180,136,3,'fill="currentColor"');
    if(kind==='slices'){for(let y=80;y<205;y+=17){const r=Math.sqrt(Math.max(0,83*83-(y-136)**2));d+='<ellipse cx="180" cy="'+y+'" rx="'+r+'" ry="'+r*.25+'" fill="none" stroke="currentColor" opacity=".45"/>';}}
    if(kind==='sphere-vector')d+=line(110,190,237,76,'stroke-width="2"');
  }else if(['distance','planes','projection'].includes(kind)){
    d+=path('M 63 167 L 214 108 L 302 158 L 151 223 Z','fill="currentColor" fill-opacity=".06"');
    d+=line(175,65,175,172,'stroke-dasharray="4 5"');d+=line(175,65,260,180);d+=line(175,172,260,180,'opacity=".5"');d+=path('M175 163 L184 165 L184 174','opacity=".65"');d+=circle(175,65,4,'fill="currentColor"');d+=circle(175,172,3,'fill="currentColor"');
    if(kind==='projection')d+=path('M105 71 L230 84 L247 143 L125 131 Z','fill="currentColor" fill-opacity=".08"');
  }else if(kind==='cone'){
    d+=path('M105 211 L180 56 L255 211');d+='<ellipse cx="180" cy="211" rx="75" ry="20" fill="none" stroke="currentColor" opacity=".6"/>';
    d+=path('M180 56 L129 159 M180 56 L231 159','opacity=".25"');d+='<ellipse cx="180" cy="159" rx="51" ry="16" transform="rotate(-18 180 159)" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"/>';
  }else if(kind==='vectors'){
    d+=line(85,198,282,198,'opacity=".22"');d+=line(85,198,251,198,'stroke-width="2.5"');d+=line(85,198,226,88,'stroke-width="2"');d+=path('M235 191 L251 198 L235 205');d+=path('M212 91 L226 88 L222 103');d+=line(226,88,226,198,'stroke-dasharray="3 5" opacity=".5"');d+=path('M133 198 Q133 180 121 171','opacity=".6"');
  }else if(kind==='conics'){
    d+='<ellipse cx="180" cy="137" rx="116" ry="70" transform="rotate(-14 180 137)" fill="none" stroke="currentColor" stroke-width="1.6"/>';
    d+=circle(110,155,3,'fill="currentColor"');d+=circle(249,120,3,'fill="currentColor"');d+=path('M110 155 L203 70 L249 120','opacity=".4"');
  }else if(kind==='reflection'){
    d+=path('M74 73 Q180 300 286 73','stroke-width="2"');d+=line(96,45,96,110,'opacity=".6"');d+=line(96,110,180,157,'stroke-width="1.5"');d+=line(245,45,245,139,'opacity=".6"');d+=line(245,139,180,157,'stroke-width="1.5"');d+=circle(180,157,4,'fill="currentColor"');d+=line(180,57,180,227,'stroke-dasharray="3 5" opacity=".2"');
  }else if(kind==='surface'){
    for(let i=-3;i<=3;i++){let p='';for(let j=-3;j<=3;j+=.25){const x=180+j*26+i*14,y=150+i*16-(j*j-i*i)*4;p+=(p?' L':'M')+x+' '+y;}d+=path(p,'opacity=".45"');}
    d+=path('M78 179 Q180 83 282 179','stroke-width="2"');
  }else{
    d+=line(49,207,309,207,'opacity=".23"');d+=line(132,43,132,235,'opacity=".23"');
    if(kind==='area')d+=path('M78 207 C113 100 130 80 170 160 S240 258 284 68 L284 207 Z','fill="currentColor" fill-opacity=".11"');
    if(['tangents','derivative','area','antiderivative','asymptote'].includes(kind))d+=path('M61 214 C109 38 147 111 179 164 S251 252 298 54','stroke-width="1.7"');
    else d+=path('M57 194 Q183 240 291 52','stroke-width="1.7"');
    if(kind==='newton'){d+=path('M291 52 L219 207 L219 157 L180 207 L180 192 L167 207','opacity=".65"');}
    else if(kind==='asymptote')d+=line(71,222,291,61,'stroke-dasharray="4 5" opacity=".5"');
    else if(kind==='join')d+=path('M180 171 L296 104','stroke-width="1.6"');
    else if(kind==='zoom'){d+=circle(201,151,49,'opacity=".6"');d+=line(235,187,270,224,'opacity=".6"');d+=line(161,180,245,111,'stroke-dasharray="4 5" opacity=".5"');}
    else d+=line(104,235,281,75,'opacity=".6"');
    d+=circle(206,151,4,'fill="currentColor"');
  }
  return '<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false">'+d+'</svg>';
}

export class SceneView{
  constructor(host,kind,options={}){
    this.host=host;this.kind=kind;this.options=options;this.enabled=options.motion!==false;this.time=0;this.phase=0;this.visible=true;this.destroyed=false;this.raf=0;
    try{if(isSpace(kind)){this.init3D();this.applyPalette();}else this.init2D();}catch(error){this.controls?.dispose();this.renderer?.dispose();this.renderer?.forceContextLoss();this.renderer=null;this.scene=null;this.controls=null;host.replaceChildren();if(isSpace(kind)){host.innerHTML=artSVG(kind);host.dataset.renderer='svg-fallback';this.staticFallback=true;this.enabled=false;}else{this.init2D();host.dataset.renderer='canvas2d-fallback';}console.warn('전시 도해를 대체 화면으로 표시합니다.',error.message);}
    this.resizeObserver=new ResizeObserver(()=>{this.resize();this.draw()});this.resizeObserver.observe(host);
    this.visibility=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;if(this.visible&&this.enabled)this.start()},{rootMargin:'150px'});this.visibility.observe(host);
    this.resize();this.draw();if(this.enabled)this.start();
  }
  init3D(){
    this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(34,1,.1,60);this.camera.position.set(5,3.5,6.5);this.camera.lookAt(0,0,0);
    this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.25:1.6));this.renderer.setClearColor(0,0);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;this.host.append(this.renderer.domElement);this.host.dataset.renderer='webgl';
    this.scene.add(new THREE.HemisphereLight(0xe9edf5,0x1b2634,2.5));const sun=new THREE.DirectionalLight(0xffffff,3.1);sun.position.set(-3,6,4);this.scene.add(sun);const fill=new THREE.DirectionalLight(0xb8c8e4,2);fill.position.set(5,-2,-3);this.scene.add(fill);
    this.group=new THREE.Group();this.scene.add(this.group);this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enablePan=false;this.controls.enableZoom=false;this.controls.enableDamping=true;this.controls.dampingFactor=.065;this.controls.maxPolarAngle=Math.PI*.75;this.controls.minPolarAngle=.3;this.controls.addEventListener('change',()=>{if(!this.raf)this.renderer.render(this.scene,this.camera)});
    this.renderer.domElement.style.touchAction='pan-y';
    this.updates=[];
    if(['hero','sphere-slice','sphere-vector','slices','hypersphere'].includes(this.kind))this.sphere();
    else if(['distance','planes'].includes(this.kind))this.distance();
    else if(this.kind==='projection')this.projection();
    else if(this.kind==='vectors')this.vectors();
    else if(this.kind==='cone')this.cone();
    else if(this.kind==='surface')this.surface();
    else if(inquiry3D(this.kind))makeInquiry3D(this);
  }
  applyPalette(){if(!Number.isFinite(this.options.hue))return;const value={};this.scene.traverse(object=>{for(const material of (Array.isArray(object.material)?object.material:object.material?[object.material]:[])){if(!material.color)continue;material.color.getHSL(value);if(value.s>.08)material.color.setHSL(this.options.hue,Math.min(.62,Math.max(.28,value.s)),value.l)}})}
  material(color=GREEN,opacity=.75){return new THREE.MeshPhysicalMaterial({color,roughness:.33,metalness:.12,transparent:opacity<1,opacity,side:THREE.DoubleSide,depthWrite:opacity>=1,clearcoat:.7})}
  mesh(geometry,color=GREEN,opacity=.75){const m=new THREE.Mesh(geometry,this.material(color,opacity));this.group.add(m);return m}
  line(points,color=ACCENT,opacity=.8,dashed=false){const geom=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const mat=dashed?new THREE.LineDashedMaterial({color,transparent:true,opacity,dashSize:.07,gapSize:.05}):new THREE.LineBasicMaterial({color,transparent:true,opacity});const line=new THREE.Line(geom,mat);if(dashed)line.computeLineDistances();this.group.add(line);return line}
  updateLine(line,points){line.geometry.setFromPoints(points.map(p=>new THREE.Vector3(...p)));if(line.material.isLineDashedMaterial)line.computeLineDistances()}
  sphere(){
    const R=1.65, solid=this.mesh(new THREE.SphereGeometry(R,56,40),0x5d886d,this.kind==='hero'?.38:.28);
    const wire=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(R,24,16)),new THREE.LineBasicMaterial({color:0xc2d6a1,transparent:true,opacity:.14}));this.group.add(wire);
    const plane=this.mesh(new THREE.PlaneGeometry(4.5,3.4),0xabc685,.12);plane.rotation.x=-Math.PI/2;
    const ring=this.mesh(new THREE.TorusGeometry(1,.018,8,128),ACCENT,.95);ring.rotation.x=Math.PI/2;
    const radius=this.line([[0,0,0],[1.4,.5,0]],ACCENT,.7),perp=this.line([[0,0,0],[0,.5,0]],LIGHT,.6,true);
    const equator=this.mesh(new THREE.TorusGeometry(R,.006,4,120),LIGHT,.35);equator.rotation.x=Math.PI/2;
    this.group.rotation.z=-.13;
    if(this.kind==='slices'){
      solid.visible=false;plane.visible=false;ring.visible=false;radius.visible=false;perp.visible=false;
      for(let y=-1.45;y<1.5;y+=.24){const rr=Math.sqrt(R*R-y*y);const disk=this.mesh(new THREE.CylinderGeometry(rr,rr,.027,64),0x92b275,.23);disk.position.y=y;}
    }
    const marker=this.mesh(new THREE.SphereGeometry(.045,14,10),ACCENT,1);
    this.updates.push(t=>{const y=.72*Math.sin(t*.38+this.phase*.8),rr=Math.sqrt(R*R-y*y);plane.position.y=y;ring.position.y=y;ring.scale.set(rr,rr,1);this.updateLine(radius,[[0,0,0],[rr,y,0]]);this.updateLine(perp,[[0,0,0],[0,y,0]]);marker.position.set(rr,y,0);wire.rotation.y=t*.045;this.group.rotation.y=.15+Math.sin(t*.09)*.14;
      if(this.kind==='hypersphere'){const w=.85*Math.sin(t*.4),s=Math.sqrt(1-w*w);solid.scale.setScalar(s);wire.scale.setScalar(s);ring.visible=false;plane.visible=false;radius.visible=false;perp.visible=false;equator.scale.setScalar(s);marker.visible=false;}
      if(this.kind==='sphere-vector'){plane.visible=false;ring.visible=false;perp.visible=false;const ang=t*.25;const p=[R*Math.cos(ang),R*Math.sin(ang),0];this.updateLine(radius,[[0,0,0],p]);marker.position.set(...p);}
    });
  }
  distance(){
    const plane=this.mesh(new THREE.PlaneGeometry(4.1,3.3),0x8fa77e,.25);plane.rotation.x=-Math.PI/2;plane.position.y=-.75;
    const outline=this.line([[-2.05,-.75,-1.65],[2.05,-.75,-1.65],[2.05,-.75,1.65],[-2.05,-.75,1.65],[-2.05,-.75,-1.65]],LIGHT,.35);
    const P=[.2,1.55,.1],H=[.2,-.75,.1];this.line([P,H],ACCENT,.95,true);const node=this.mesh(new THREE.SphereGeometry(.065,16,12),ACCENT,1);node.position.set(...P);const foot=this.mesh(new THREE.SphereGeometry(.035,12,8),LIGHT,1);foot.position.set(...H);
    const point=this.mesh(new THREE.SphereGeometry(.05,12,8),0xd0dcbe,1),diagonal=this.line([P,[1,-.75,1]],LIGHT,.6),base=this.line([H,[1,-.75,1]],LIGHT,.4);
    this.line([[.2,-.56,.1],[.4,-.56,.1],[.4,-.75,.1]],ACCENT,.55);
    this.updates.push(t=>{const Q=[.2+1.3*Math.cos(t*.4),-.75,.1+.9*Math.sin(t*.4)];point.position.set(...Q);this.updateLine(diagonal,[P,Q]);this.updateLine(base,[H,Q]);this.group.rotation.y=-.25+Math.sin(t*.1)*.12});
  }
  projection(){
    const lower=this.mesh(new THREE.PlaneGeometry(3.2,2.1),0xb8cc98,.25);lower.rotation.x=-Math.PI/2;lower.position.y=-1;
    const upper=this.mesh(new THREE.PlaneGeometry(3.2,2.1),0x86a879,.5);upper.position.y=.7;
    const outline=new THREE.LineSegments(new THREE.EdgesGeometry(upper.geometry),new THREE.LineBasicMaterial({color:ACCENT,transparent:true,opacity:.85}));upper.add(outline);
    const links=Array.from({length:4},()=>this.line([[0,0,0],[0,-1,0]],LIGHT,.4,true));
    this.updates.push(t=>{const theta=.35+.7*(.5+.5*Math.sin(t*.35));upper.rotation.x=-Math.PI/2+theta;lower.scale.y=Math.cos(theta);const corners=[[-1.6,-1.05],[1.6,-1.05],[1.6,1.05],[-1.6,1.05]];corners.forEach((c,i)=>{const p=[c[0],.7+c[1]*Math.sin(theta),-c[1]*Math.cos(theta)];this.updateLine(links[i],[p,[p[0],-1,p[2]]])});this.group.rotation.y=-.15});
  }
  vectors(){
    const origin=new THREE.Vector3(-1.4,-.6,0);this.group.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0),origin,2.8,LIGHT,.23,.12));
    const v=new THREE.ArrowHelper(new THREE.Vector3(.6,1,0).normalize(),origin,2.5,ACCENT,.23,.12);this.group.add(v);
    const drop=this.line([[0,1,0],[0,-.6,0]],LIGHT,.5,true),component=this.line([[-1.4,-.6,0],[0,-.6,0]],ACCENT,.7);
    this.updates.push(t=>{const theta=.3+2.5*(.5+.5*Math.sin(t*.35));v.setDirection(new THREE.Vector3(Math.cos(theta),Math.sin(theta),0));const x=-1.4+2.5*Math.cos(theta),y=-.6+2.5*Math.sin(theta);this.updateLine(drop,[[x,y,0],[x,-.6,0]]);this.updateLine(component,[[-1.4,-.6,0],[x,-.6,0]]);this.group.rotation.y=-.2});
  }
  cone(){
    const upper=this.mesh(new THREE.ConeGeometry(1.25,2.25,64,1,true),0x719b75,.28);upper.rotation.z=Math.PI;upper.position.y=1.125;
    const lower=this.mesh(new THREE.ConeGeometry(1.25,2.25,64,1,true),0x719b75,.22);lower.position.y=-1.125;
    const edgeMat=new THREE.LineBasicMaterial({color:LIGHT,transparent:true,opacity:.17});for(const m of [upper,lower]){const edge=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.ConeGeometry(1.25,2.25,24,1,true)),edgeMat);edge.position.copy(m.position);edge.rotation.copy(m.rotation);this.group.add(edge)}
    const pg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0,-2),new THREE.Vector3(2,0,-2),new THREE.Vector3(2,0,2),new THREE.Vector3(-2,0,2)]);pg.setIndex([0,1,2,0,2,3]);pg.computeVertexNormals();const plane=this.mesh(pg,0xc4d498,.12);
    const curves=[];for(let i=0;i<8;i++)curves.push(this.line([[0,0,0],[0,0,0]],ACCENT,.96));
    this.camera.position.set(6.8,3.5,7.8);this.controls.update();
    this.updates.push(t=>{const angle=.18+1.05*(.5+.5*Math.sin(t*.23)),m=Math.tan(angle),b=.32;const p=plane.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,m*p.getX(i)+b);p.needsUpdate=true;plane.geometry.computeVertexNormals();const paths=[];for(const sign of [1,-1]){let points=[];for(let i=0;i<=250;i++){const phi=i/250*Math.PI*2,k=1.25/2.25,den=1-sign*k*m*Math.cos(phi),r=sign*k*b/den;const x=r*Math.cos(phi),z=r*Math.sin(phi),y=m*x+b;if(r>=0&&r<2&&Math.abs(y)<2.23){points.push([x,y,z])}else if(points.length){paths.push(points);points=[]}}if(points.length)paths.push(points)}curves.forEach((l,i)=>{l.visible=!!paths[i]&&paths[i].length>1;if(l.visible)this.updateLine(l,paths[i])});});
  }
  surface(){
    const geo=new THREE.PlaneGeometry(3.8,3.8,40,40),pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getY(i);pos.setXYZ(i,x,.22*(x*x-z*z),z)}geo.computeVertexNormals();this.mesh(geo,0x769e76,.5);
    const mesh=new THREE.LineSegments(new THREE.WireframeGeometry(geo),new THREE.LineBasicMaterial({color:LIGHT,transparent:true,opacity:.16}));this.group.add(mesh);
    const plane=this.mesh(new THREE.PlaneGeometry(4,2.8),0xb9ce91,.11);const slice=this.line([[0,0,0],[1,1,0]],ACCENT,1);const point=this.mesh(new THREE.SphereGeometry(.055,12,8),ACCENT,1);
    this.updates.push(t=>{const z=1.15*Math.sin(t*.3);plane.position.z=z;const pts=[];for(let x=-1.9;x<=1.91;x+=.04)pts.push([x,.22*(x*x-z*z),z]);this.updateLine(slice,pts);const x=.8*Math.cos(t*.4);point.position.set(x,.22*(x*x-z*z),z);this.group.rotation.y=-.25});
  }
  init2D(){this.canvas=document.createElement('canvas');this.host.append(this.canvas);this.ctx=this.canvas.getContext('2d');this.host.dataset.renderer='canvas2d';}
  resize(){const r=this.host.getBoundingClientRect();this.width=Math.max(1,r.width);this.height=Math.max(1,r.height);if(this.renderer){this.renderer.setSize(this.width,this.height,false);this.camera.aspect=this.width/this.height;this.camera.updateProjectionMatrix();}else if(this.canvas){const dpr=Math.min(window.devicePixelRatio||1,2);this.canvas.width=this.width*dpr;this.canvas.height=this.height*dpr;this.ctx.setTransform(dpr,0,0,dpr,0,0);}}
  setPhase(p){this.phase=p;this.draw()}
  setMotion(on){this.enabled=on&&!this.staticFallback;if(this.controls)this.controls.enableDamping=on;if(this.enabled)this.start();else{cancelAnimationFrame(this.raf);this.raf=0;this.draw()}}
  start(){if(this.raf||this.destroyed)return;this.last=0;const tick=ts=>{if(this.destroyed||!this.enabled||!this.visible){this.raf=0;return}this.time+=this.last?Math.min((ts-this.last)/1000,.08):0;this.last=ts;this.draw();this.raf=requestAnimationFrame(tick)};this.raf=requestAnimationFrame(tick)}
  draw(){if(this.destroyed)return;if(this.renderer){this.updates.forEach(f=>f(this.time));this.controls.update();this.renderer.render(this.scene,this.camera)}else if(this.ctx)this.drawCanvas()}
  drawCanvas(){
    const c=this.ctx,W=this.width,H=this.height,s=Math.min(W/500,H/400),cx=W*.49,cy=H*.58,t=this.time,green=this.options.primary||'#ddec9d',pale='#dce2ed';
    c.clearRect(0,0,W,H);c.save();c.translate(cx,cy);c.scale(s,s);c.lineWidth=1;
    c.strokeStyle='#ccddbb17';for(let x=-210;x<=210;x+=35){c.beginPath();c.moveTo(x,-180);c.lineTo(x,140);c.stroke()}for(let y=-175;y<145;y+=35){c.beginPath();c.moveTo(-220,y);c.lineTo(220,y);c.stroke()}
    const path=(pts,color=green,width=2)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=color;c.lineWidth=width;c.stroke()};
    const dot=(x,y,r=4,color=green)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill()};
    path([[-220,35],[220,35]],'#d0dfbf35',1);path([[0,-170],[0,130]],'#d0dfbf35',1);
    if(drawInquiry2D({kind:this.kind,t,phase:this.phase,c,path,dot,green,pale})){c.restore();return}
    const fn=(x)=>this.kind==='join'?(x<.8?x*x:1.6*x-.64):this.kind==='derivative'||this.kind==='tangents'||this.kind==='area'?x*x*x-1.4*x:this.kind==='antiderivative'?-Math.cos(x)*1.2:this.kind==='asymptote'?Math.sqrt(1+x*x):this.kind==='newton'?x*x-1:x*x;
    if(this.kind==='conics'){
      const rr=[];for(let i=0;i<=180;i++){const a=i/180*Math.PI*2;rr.push([Math.cos(a)*155,Math.sin(a)*84-12])}path(rr);dot(-105,-12);dot(105,-12);const a=t*.25;const P=[Math.cos(a)*155,Math.sin(a)*84-12];path([[-105,-12],P,[105,-12]],'#d2e1b67f',1);dot(...P,5);
    }else if(this.kind==='reflection'){
      const pts=[];for(let x=-2.2;x<=2.21;x+=.03)pts.push([x*70,80-x*x*34]);path(pts);const F=[0,80-4900/136],x=(.4+1.35*(.5+.5*Math.sin(t*.4)))*70,y=80-(x/70)**2*34;path([[x,-150],[x,y],F],'#c8db9dab',1.4);dot(...F,5);dot(x,y,4);c.fillStyle=pale;c.font='13px sans-serif';c.fillText('F',12,F[1]+4);
    }else{
      const pts=[];for(let x=-1.8;x<2.4;x+=.025)pts.push([x*86,-fn(x)*28+35]);
      if(this.kind==='area'){c.beginPath();c.moveTo(-1.6*86,85);pts.filter(p=>p[0]>-1.6*86&&p[0]<1.6*86).forEach(p=>c.lineTo(...p));c.lineTo(1.6*86,85);c.closePath();c.fillStyle='#d9eba51a';c.fill();}
      path(pts);
      if(this.kind==='asymptote'){c.setLineDash([5,6]);path([[-210,35+210*28/86],[210,35-210*28/86]],'#ccdcac90',1.2);path([[-210,35-210*28/86],[210,35+210*28/86]],'#ccdcac70',1.2);c.setLineDash([]);}
      else if(this.kind==='newton'){
        let x=1.9;const f=x=>x*x-1,df=x=>2*x;const p=[];for(let i=0;i<4;i++){const next=x-f(x)/df(x);p.push([x*86,35-f(x)*28],[next*86,35],[next*86,35-f(next)*28]);x=next}path(p,'#b7ce927f',1);dot(x*86,35,4);
      }else{
        const a=this.kind==='tangents'?.5:this.kind==='join'?.8:.65,h=.12+1.12*(.5+.5*Math.cos(t*.5+this.phase));const y=fn(a),q=fn(a+h),dy=(fn(a+.001)-fn(a-.001))/.002,m=(q-y)/h;
        const tangent=[[-1.7*86,35-(y+dy*(-1.7-a))*28],[2.3*86,35-(y+dy*(2.3-a))*28]];c.setLineDash([5,6]);path(tangent,'#d2e1bd75',1);c.setLineDash([]);
        path([[-1.7*86,35-(y+m*(-1.7-a))*28],[2.3*86,35-(y+m*(2.3-a))*28]],'#c8dc9cb0',1.4);dot(a*86,35-y*28,4);dot((a+h)*86,35-q*28,5);c.beginPath();c.arc((a+h)*86,35-q*28,12,0,Math.PI*2);c.strokeStyle='#dae9ad55';c.lineWidth=1;c.stroke();
      }
    }
    c.restore();
  }
  dispose(){this.destroyed=true;cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();this.visibility?.disconnect();this.controls?.dispose();if(this.scene)this.scene.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});this.renderer?.dispose();this.renderer?.forceContextLoss();this.host.replaceChildren();}
}
