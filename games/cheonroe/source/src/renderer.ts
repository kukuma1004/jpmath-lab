import * as THREE from 'three';
import { ENEMIES, HEIGHT, HEROES, PLAYER_R, GRAZE_R, heroDef, type EnemyKind, type GameEvent, type GameState, type HeroId, type Enemy } from './types';
import { STAGES, type StageDef } from './stages';
import { hitCircles, muzzleOffset, ULT_TIME } from './engine';
import { getAwakening, supportPositions } from './progression';

const H=HEIGHT, TAU=Math.PI*2, S=HEIGHT/900;
const Y=(y:number)=>H-y;
const colorCache=new Map<string,THREE.Color>();
/** Shared colour per hex string: never mutate the returned object. */
const col=(hex:string)=>{let c=colorCache.get(hex);if(!c){c=new THREE.Color(hex);colorCache.set(hex,c);}return c;};
const tmpColor=new THREE.Color();
const WHITE=col('#ffffff');

// ───────────── canvas helpers ─────────────
function canvasTexture(w:number,h:number,draw:(c:CanvasRenderingContext2D)=>void,repeat=false) {
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;draw(canvas.getContext('2d')!);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;
  if(repeat){t.wrapS=THREE.RepeatWrapping;}
  return t;
}
function ellipse(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,fill:string|CanvasGradient,stroke?:string,width=2) {
  c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}
}
function poly(c:CanvasRenderingContext2D,pts:number[][],fill:string|CanvasGradient) {c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();}
function radial(c:CanvasRenderingContext2D,x:number,y:number,r:number,stops:[number,string][]) {const g=c.createRadialGradient(x,y,0,x,y,r);for(const [o,s] of stops)g.addColorStop(o,s);return g;}
function seeded(seed:number){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=Math.imul(a^(a>>>15),a|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
/** A horizontally tileable ridge: integer sine periods across the width. */
function ridge(w:number,base:number,waves:[number,number,number][]) {return (x:number)=>base+waves.reduce((s,[k,a,p])=>s+Math.sin(x/w*TAU*k+p)*a,0);}
function fillRidge(c:CanvasRenderingContext2D,w:number,h:number,f:(x:number)=>number,fill:string|CanvasGradient) {
  c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=8)c.lineTo(x,f(x));c.lineTo(w,h);c.closePath();c.fillStyle=fill;c.fill();
}
/** Draw at x and its wrapped twin so objects crossing the seam stay continuous. */
function wrapDraw(w:number,x:number,draw:(x:number)=>void){draw(x);if(x<260)draw(x+w);if(x>w-260)draw(x-w);}
function pagoda(c:CanvasRenderingContext2D,x:number,y:number,s:number,fill:string,glow?:string) {
  for(let i=0;i<4;i++){const ww=(70-i*12)*s,yy=y-i*34*s;poly(c,[[x-ww,yy],[x+ww,yy],[x+ww*.7,yy-12*s],[x-ww*.7,yy-12*s]],fill);c.fillStyle=fill;c.fillRect(x-ww*.45,yy-34*s,ww*.9,24*s);if(glow){c.fillStyle=glow;c.fillRect(x-ww*.2,yy-28*s,ww*.4,10*s);}}
  poly(c,[[x-4*s,y-150*s],[x+4*s,y-150*s],[x,y-185*s]],fill);
}
function pine(c:CanvasRenderingContext2D,x:number,y:number,s:number,fill:string,snow?:string) {
  c.fillStyle=fill;c.fillRect(x-3*s,y-20*s,6*s,22*s);
  for(let i=0;i<4;i++){const ww=(30-i*6)*s,yy=y-14*s-i*20*s;poly(c,[[x-ww,yy],[x+ww,yy],[x,yy-30*s]],fill);if(snow)poly(c,[[x-ww*.55,yy-12*s],[x+ww*.55,yy-12*s],[x,yy-30*s]],snow);}
}
function cloudBank(c:CanvasRenderingContext2D,w:number,f:(x:number)=>number,r:()=>number,shade:string,light:string,size:number) {
  for(let x=-40;x<w+40;x+=size*.55){const y=f(x),rr=size*(.6+r()*.5);ellipse(c,x,y+rr*.25,rr,rr*.8,shade);}
  for(let x=-40;x<w+40;x+=size*.55){const y=f(x),rr=size*(.5+r()*.45);ellipse(c,x,y,rr,rr*.75,light);}
}

type Layer='far'|'mid'|'near';
function paintLayer(st:StageDef,layer:Layer,w:number,h:number):(c:CanvasRenderingContext2D)=>void {
  const r=seeded(st.name.length*97+(layer==='far'?1:layer==='mid'?2:3)*31);
  return c=>{
    // New terrains reuse the closest procedural style; they always come with a painted background.
    const t0=st.terrain,t=t0==='bamboo'||t0==='night'?'valley':t0==='underworld'?'storm':t0;
    if(layer==='far') {
      if(t==='clouds'){cloudBank(c,w,ridge(w,h*.55,[[2,40,1],[5,22,2],[9,10,.4]]),r,st.mid,st.far,90);return;}
      if(t==='storm'){cloudBank(c,w,ridge(w,h*.5,[[3,50,.3],[7,24,1]]),r,'#1a1430',st.far,110);for(let i=0;i<6;i++){const x=r()*w;wrapDraw(w,x,x=>{c.strokeStyle='#ffe58a33';c.lineWidth=2;c.beginPath();c.moveTo(x,h*.3);for(let k=1;k<6;k++)c.lineTo(x+(r()-.5)*40,h*.3+k*22);c.stroke();});}return;}
      const f=ridge(w,h*.5,t==='snow'?[[3,70,.2],[7,35,1.3],[13,14,2]]:[[2,55,.5],[5,30,1.7],[11,12,.9]]);
      if(t==='snow'){
        c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=6){const y=f(x)-Math.abs(Math.sin(x/w*TAU*9))*60;c.lineTo(x,y);}c.lineTo(w,h);c.closePath();c.fillStyle=st.far;c.fill();
        c.save();c.clip();c.globalAlpha=.85;for(let x=0;x<=w;x+=6){const y=f(x)-Math.abs(Math.sin(x/w*TAU*9))*60;c.fillStyle='#f4f8ff';c.fillRect(x,y,6,26+Math.sin(x*.05)*8);}c.restore();return;
      }
      fillRidge(c,w,h,f,st.far);
      if(t==='forge'){for(let i=0;i<26;i++){const x=r()*w,bw=30+r()*60,bh=60+r()*150;wrapDraw(w,x,x=>{c.fillStyle=st.far;c.fillRect(x,f(x)-bh+20,bw,bh);c.fillStyle=st.light+'aa';for(let k=0;k<6;k++)c.fillRect(x+6+r()*(bw-12),f(x)-bh+30+r()*(bh-30),4,6);});}}
      else for(let i=0;i<3;i++){const x=r()*w;wrapDraw(w,x,x=>pagoda(c,x,f(x)+10,.8,st.far));}
    }else if(layer==='mid') {
      if(t==='clouds'){cloudBank(c,w,ridge(w,h*.6,[[3,35,.8],[8,15,2]]),r,st.near,st.mid,70);for(let i=0;i<3;i++){const x=r()*w,y=h*.3+r()*h*.2;wrapDraw(w,x,x=>{poly(c,[[x-90,y],[x+90,y],[x+40,y+70],[x-30,y+90]],'#6f7f99');ellipse(c,x,y,92,18,'#9fc39a');pagoda(c,x,y-4,.4,'#55627a');});}return;}
      if(t==='storm'){const f=ridge(w,h*.75,[[2,30,.2],[6,14,1]]);cloudBank(c,w,f,r,'#0c0a19',st.mid,64);for(let i=0;i<4;i++){const x=r()*w;wrapDraw(w,x,x=>pagoda(c,x,f(x)-20,.9+r()*.4,'#1b1636','#ffd84a99'));}return;}
      const f=ridge(w,h*.62,[[3,40,.1],[7,22,2.2],[17,8,.3]]);
      fillRidge(c,w,h,f,st.mid);
      if(t==='forge'){for(let i=0;i<10;i++){const x=r()*w,bh=110+r()*120;wrapDraw(w,x,x=>{c.fillStyle=st.mid;c.fillRect(x-40,f(x)-bh,80,bh+20);c.fillRect(x-12,f(x)-bh-90,24,90);c.fillStyle=radial(c,x,f(x)-bh+30,60,[[0,st.accent+'cc'],[1,st.accent+'00']]);c.fillRect(x-60,f(x)-bh-30,120,120);});}}
      else for(let x=10;x<w;x+=46+r()*60)pine(c,x,f(x)+6,.9+r()*.7,st.mid,t==='snow'?'#eef4ff':undefined);
      // A Korean hongsalmun: two red posts, two beams and a row of arrow-like slats between them.
      if(t0==='valley')for(let i=0;i<2;i++){const x=r()*w;wrapDraw(w,x,x=>{const y=f(x);c.fillStyle='#5a2a2a';c.fillRect(x-44,y-104,9,104);c.fillRect(x+35,y-104,9,104);c.fillRect(x-50,y-104,100,6);c.fillRect(x-50,y-80,100,5);for(let k=-36;k<=36;k+=8)c.fillRect(x+k,y-118,2,38);ellipse(c,x,y-92,7,7,'#6e3030');});}
    }else {
      const f=ridge(w,h*.55,[[4,26,.4],[9,12,1.1],[23,5,2]]);
      if(t==='clouds'||t==='storm'){cloudBank(c,w,f,r,t==='storm'?'#06050c':st.mid,st.near,58);if(t==='storm'){c.globalAlpha=.6;for(let x=0;x<w;x+=12){c.fillStyle=st.accent+'55';c.fillRect(x,f(x)-30,10,2);}c.globalAlpha=1;}return;}
      fillRidge(c,w,h,f,st.near);
      if(t==='snow'){c.save();c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=8)c.lineTo(x,f(x));c.lineTo(w,h);c.closePath();c.clip();for(let x=0;x<=w;x+=8){c.fillStyle='#e7eefb';c.fillRect(x,f(x)-2,8,14);}c.restore();}
      if(t==='forge'){c.strokeStyle=st.accent+'88';c.lineWidth=3;for(let x=0;x<w;x+=140){c.beginPath();c.moveTo(x,f(x)+30);c.lineTo(x+70,h);c.stroke();}c.fillStyle=st.accent+'55';for(let x=0;x<w;x+=6)c.fillRect(x,f(x)+2,6,3);}
      for(let i=0;i<7;i++){const x=r()*w,s=1.3+r()*1.2;wrapDraw(w,x,x=>{if(t==='valley'||t==='snow')pine(c,x,f(x)+8,s,st.near,t==='snow'?'#e7eefb':undefined);else{c.fillStyle=st.near;c.fillRect(x-14,f(x)-90*s,28,90*s);c.fillRect(x-20,f(x)-90*s,40,8);}});}
      if(t0==='bamboo')for(let x=0;x<w;x+=18+r()*26){const hh=h*(.5+r()*.5),bw=6+r()*6;c.fillStyle=st.near;c.fillRect(x,h-hh,bw,hh);for(let y=h-hh+20;y<h;y+=40+r()*20)c.fillRect(x-1,y,bw+2,3);}
    }
  };
}

// ───────────── instanced batches with per-instance colour and alpha ─────────────
const VERT=`attribute vec4 iColor;varying vec4 vC;varying vec2 vUv;void main(){vUv=uv;vC=iColor;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.0);}`;
const FRAG=`uniform sampler2D map;varying vec4 vC;varying vec2 vUv;void main(){vec4 t=texture2D(map,vUv);gl_FragColor=vec4(t.rgb*vC.rgb,t.a*vC.a);if(gl_FragColor.a<.003)discard;
#include <colorspace_fragment>
}`;
class Batch {
  readonly mesh:THREE.InstancedMesh;
  private colors:Float32Array;
  private attr:THREE.InstancedBufferAttribute;
  private n=0;
  constructor(scene:THREE.Scene,geo:THREE.PlaneGeometry,tex:THREE.Texture,readonly cap:number,order:number,additive:boolean) {
    const mat=new THREE.ShaderMaterial({uniforms:{map:{value:tex}},vertexShader:VERT,fragmentShader:FRAG,transparent:true,depthTest:false,depthWrite:false,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending});
    const own=geo.clone();this.colors=new Float32Array(cap*4);this.attr=new THREE.InstancedBufferAttribute(this.colors,4);this.attr.setUsage(THREE.DynamicDrawUsage);
    own.setAttribute('iColor',this.attr);this.mesh=new THREE.InstancedMesh(own,mat,cap);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;this.mesh.renderOrder=order;this.mesh.count=0;scene.add(this.mesh);
  }
  /** World coords (y down); angle in world radians. */
  push(x:number,y:number,w:number,h:number,angle:number,c:THREE.Color,a=1) {
    if(this.n>=this.cap)return;
    const m=this.mesh.instanceMatrix.array as Float32Array,o=this.n*16,cs=Math.cos(-angle),sn=Math.sin(-angle);
    m[o]=w*cs;m[o+1]=w*sn;m[o+2]=0;m[o+3]=0;m[o+4]=-h*sn;m[o+5]=h*cs;m[o+6]=0;m[o+7]=0;m[o+8]=0;m[o+9]=0;m[o+10]=1;m[o+11]=0;m[o+12]=x;m[o+13]=Y(y);m[o+14]=0;m[o+15]=1;
    const k=this.n*4;this.colors[k]=c.r;this.colors[k+1]=c.g;this.colors[k+2]=c.b;this.colors[k+3]=a;this.n++;
  }
  end() {this.mesh.count=this.n;this.mesh.instanceMatrix.needsUpdate=true;this.attr.needsUpdate=true;this.n=0;}
}

interface Particle {x:number;y:number;vx:number;vy:number;life:number;max:number;size:number;grow:number;color:THREE.Color;alpha:number;rot:number;vr:number;drag:number;stretch:number;}
interface Bolt {pts:number[][];life:number;max:number;tx:number;ty:number;}
interface Ghost {x:number;y:number;life:number;}
interface Pending {at:number;run:()=>void;}

const FALLBACK:Partial<Record<EnemyKind,[EnemyKind,string]>>={kite:['drone','#ffb6e6'],ember:['drone','#ffb070'],frost:['wing','#a8e6ff'],storm:['drone','#d6b6ff'],
  boss2:['boss1','#b9dcff'],boss3:['boss1','#ffb48a'],boss4:['boss1','#c8ecff'],boss5:['boss1','#e2cfff'],boss6:['boss1','#d8fff0'],boss7:['boss1','#ffd8a0'],boss8:['boss1','#bcd0ff']};

export class GameRenderer {
  readonly renderer:THREE.WebGLRenderer;
  readonly scene=new THREE.Scene();
  readonly camera=new THREE.OrthographicCamera(0,1600,H,0,-10,10);
  private geo=new THREE.PlaneGeometry(1,1);
  private worldW=1600;
  private cam={l:0,r:1600,b:0,t:H};
  private heroTex=new Map<HeroId,THREE.Texture>();
  private enemyTex=new Map<EnemyKind,{tex:THREE.Texture;tint:string}>();
  private bgTex=new Map<string,THREE.Texture>();
  private enemyMeshes=new Map<number,THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>>();
  private hero!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private ghosts:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>[]=[];
  private ghostData:Ghost[]=[];
  private sky!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private bg!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private layers:Record<Layer,THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>>={} as never;
  private fog!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private shade!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private flashQuad!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private fore!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private mandala!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private stageCache=new Map<number,Record<Layer|'sky',THREE.Texture>>();
  private b!:Record<string,Batch>;
  private particles:Record<'spark'|'smoke'|'flash'|'ring'|'petal'|'streak',Particle[]>={spark:[],smoke:[],flash:[],ring:[],petal:[],streak:[]};
  private bolts:Bolt[]=[];
  private later:Pending[]=[];
  private shownStage=-1;
  private scroll=0;
  private shake=0;
  private flash=0;
  private flashColor=new THREE.Color('#ffffff');
  private lightning=0;
  private elapsed=0;
  private lastPlayer={x:0,y:0,vy:0};
  private swings:{x:number;y:number;life:number;max:number;a:number;n:number;s:number}[]=[];
  private wailAt=0;
  private lunge=0;
  private foreTimer=3;
  private foreX=-999;
  private frameTimes:number[]=[];
  reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  showHitboxes=false;
  stabilizeForCapture(){this.flash=0;this.shake=0;this.lightning=0;this.later=[];}
  private texturePaths:string[]=[];

  constructor(private host:HTMLElement) {
    this.renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.setClearColor('#10131c');
    host.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','천뢰 전장');
    this.setup();
    new ResizeObserver(()=>this.resize()).observe(host);this.resize();
  }
  private mesh(tex:THREE.Texture|null,order:number,additive=false) {
    const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending});
    const m=new THREE.Mesh(this.geo,mat);m.renderOrder=order;m.frustumCulled=false;this.scene.add(m);return m;
  }
  private setup() {
    const g=this.geo,s=this.scene;
    const glow=canvasTexture(64,64,c=>{c.fillStyle=radial(c,32,32,32,[[0,'#ffffff'],[.18,'#ffffffee'],[.45,'#ffffff55'],[1,'#ffffff00']]);c.fillRect(0,0,64,64);});
    const soft=canvasTexture(64,64,c=>{c.fillStyle=radial(c,32,32,32,[[0,'#ffffffcc'],[.5,'#ffffff44'],[1,'#ffffff00']]);c.fillRect(0,0,64,64);});
    const smoke=canvasTexture(64,64,c=>{c.fillStyle=radial(c,32,32,32,[[0,'#ffffffaa'],[.6,'#ffffff44'],[1,'#ffffff00']]);c.fillRect(0,0,64,64);});
    const ring=canvasTexture(128,128,c=>{c.strokeStyle='#ffffff';c.lineWidth=5;c.beginPath();c.arc(64,64,56,0,TAU);c.stroke();c.strokeStyle='#ffffff55';c.lineWidth=14;c.stroke();});
    // Bullet cores: the white disc plus its dark outline ends at 28/32 of the half size, which the renderer maps to the hit radius.
    const coreRound=canvasTexture(64,64,c=>{ellipse(c,32,32,26,26,'#ffffff','#1b0f1c',4);});
    const coreRice=canvasTexture(128,64,c=>{ellipse(c,64,32,56,26,'#ffffff','#1b0f1c',4);});
    const coreNeedle=canvasTexture(128,32,c=>{ellipse(c,64,16,60,12,'#ffffff','#1b0f1c',3);});
    const glowRound=canvasTexture(64,64,c=>{c.fillStyle=radial(c,32,32,32,[[0,'#ffffff'],[.42,'#ffffffee'],[.6,'#ffffff77'],[1,'#ffffff00']]);c.fillRect(0,0,64,64);});
    const glowLong=canvasTexture(128,64,c=>{c.scale(2,1);c.fillStyle=radial(c,32,32,32,[[0,'#ffffff'],[.42,'#ffffffee'],[.62,'#ffffff66'],[1,'#ffffff00']]);c.fillRect(0,0,64,64);});
    const streak=canvasTexture(128,16,c=>{const gr=c.createLinearGradient(0,0,128,0);gr.addColorStop(0,'#ffffff00');gr.addColorStop(.7,'#ffffffaa');gr.addColorStop(1,'#ffffff');c.fillStyle=gr;c.fillRect(0,5,128,6);});
    const beamGlow=canvasTexture(16,128,c=>{const gr=c.createLinearGradient(0,0,0,128);gr.addColorStop(0,'#ffffff00');gr.addColorStop(.3,'#ffffff55');gr.addColorStop(.5,'#ffffffff');gr.addColorStop(.7,'#ffffff55');gr.addColorStop(1,'#ffffff00');c.fillStyle=gr;c.fillRect(0,0,16,128);});
    const beamCore=canvasTexture(16,64,c=>{const gr=c.createLinearGradient(0,0,0,64);gr.addColorStop(0,'#ffffff00');gr.addColorStop(.12,'#ffffffff');gr.addColorStop(.88,'#ffffffff');gr.addColorStop(1,'#ffffff00');c.fillStyle=gr;c.fillRect(0,0,16,64);});
    const petal=canvasTexture(64,64,c=>{poly(c,[[4,34],[16,13],[38,9],[60,30],[39,53],[18,50]],'#ffffff');c.strokeStyle='#ffd9e0';c.beginPath();c.moveTo(7,34);c.quadraticCurveTo(32,25,57,29);c.stroke();});
    const petalShot=canvasTexture(96,48,c=>{c.fillStyle=radial(c,40,24,40,[[0,'#ffffff'],[.4,'#ffffffaa'],[1,'#ffffff00']]);c.fillRect(0,0,96,48);poly(c,[[10,24],[40,8],[90,24],[40,40]],'#ffffff');});
    const boltShot=canvasTexture(128,32,c=>{const gr=c.createLinearGradient(0,0,128,0);gr.addColorStop(0,'#ffffff00');gr.addColorStop(.4,'#ffffffaa');gr.addColorStop(1,'#ffffff');c.fillStyle=gr;c.fillRect(0,8,128,16);c.fillStyle='#ffffff';c.fillRect(40,13,88,6);});
    const wave=canvasTexture(96,96,c=>{c.strokeStyle='#ffffff';c.lineCap='round';c.lineWidth=12;c.beginPath();c.arc(20,48,46,-1.05,1.05);c.stroke();c.strokeStyle='#ffffff66';c.lineWidth=26;c.stroke();});
    const coin=canvasTexture(64,64,c=>{ellipse(c,32,32,24,24,'#f2c35a','#5a3d1c',4);ellipse(c,32,32,15,15,'#ffe39a');poly(c,[[32,20],[44,32],[32,44],[20,32]],'#b77b2d');});
    const power=canvasTexture(96,96,c=>{poly(c,[[48,5],[85,26],[85,68],[48,91],[11,68],[11,26]],'#ff8a57');poly(c,[[48,14],[77,30],[77,64],[48,82],[19,64],[19,30]],'#ffe1a0');c.font='bold 40px sans-serif';c.textAlign='center';c.fillStyle='#7a2d1c';c.fillText('힘',48,62);});
    const gauge=canvasTexture(96,96,c=>{ellipse(c,48,48,40,40,radial(c,48,48,42,[[0,'#ffffff'],[.4,'#8fe9ff'],[1,'#2a6fd6']]),'#e6fbff',4);c.font='bold 38px sans-serif';c.textAlign='center';c.fillStyle='#103a6b';c.fillText('필',48,61);});
    const life=canvasTexture(96,96,c=>{poly(c,[[48,8],[88,48],[48,88],[8,48]],'#5ff0a8');poly(c,[[48,22],[74,48],[48,74],[22,48]],'#e8fff2');});
    const flower=canvasTexture(256,256,c=>{c.translate(128,128);for(let i=0;i<8;i++){c.save();c.rotate(i/8*TAU);c.beginPath();c.moveTo(0,10);c.bezierCurveTo(-60,40,-40,110,0,120);c.bezierCurveTo(40,110,60,40,0,10);c.fillStyle='#ffffff55';c.fill();c.strokeStyle='#ffffffcc';c.lineWidth=3;c.stroke();c.restore();}ellipse(c,0,0,22,22,'#ffffffee');});
    const mandala=canvasTexture(1024,1024,c=>{c.translate(512,512);for(let i=0;i<12;i++){c.save();c.rotate(i/12*TAU);c.beginPath();c.moveTo(0,25);c.bezierCurveTo(-180,100,-110,330,0,490);c.bezierCurveTo(110,330,180,100,0,25);c.fillStyle='#ffffff12';c.fill();c.strokeStyle='#ffffffaa';c.lineWidth=4;c.stroke();c.restore();}for(const r of [150,270,300])ellipse(c,0,0,r,r,'#00000000','#ffffff77',3);});
    const coreDot=canvasTexture(64,64,c=>{ellipse(c,32,32,26,26,'#ffffff','#10131c',5);});
    const coreRing=canvasTexture(128,128,c=>{c.strokeStyle='#ffffff';c.lineWidth=6;for(let i=0;i<4;i++){c.beginPath();c.arc(64,64,52,i*TAU/4+.25,i*TAU/4+TAU/4-.25);c.stroke();}});
    const hitRing=canvasTexture(128,128,c=>{c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();c.arc(64,64,61,0,TAU);c.stroke();});
    const arrow=canvasTexture(128,16,c=>{c.fillStyle='#ffffff';c.fillRect(14,7,96,2);poly(c,[[128,8],[106,2],[111,8],[106,14]],'#ffffff');poly(c,[[1,3],[20,7],[20,9],[1,13],[8,8]],'#ffffffcc');});
    // Melee swing: a crescent that opens to the right.
    const slash=canvasTexture(256,256,c=>{c.beginPath();c.arc(70,128,118,-1.2,1.2);c.arc(36,128,104,1.02,-1.02,true);c.closePath();const gr=c.createLinearGradient(0,0,256,0);gr.addColorStop(0,'#ffffff00');gr.addColorStop(.5,'#ffffff88');gr.addColorStop(1,'#ffffff');c.fillStyle=gr;c.fill();});
    this.b={
      streak:new Batch(s,g,streak,90,-5,true),
      weatherBack:new Batch(s,g,soft,160,-9,true),
      petalW:new Batch(s,g,petal,120,-3,false),
      pickups:new Batch(s,g,coin,320,5,false),power:new Batch(s,g,power,40,5,false),gauge:new Batch(s,g,gauge,40,5,false),life:new Batch(s,g,life,20,5,false),
      smoke:new Batch(s,g,smoke,240,7,false),
      shotPetal:new Batch(s,g,petalShot,600,10,true),shotBolt:new Batch(s,g,boltShot,400,10,true),shotWave:new Batch(s,g,wave,300,10,true),shotGlow:new Batch(s,g,glow,400,10,true),
      laserGlow:new Batch(s,g,beamGlow,60,13,true),laserCore:new Batch(s,g,beamCore,60,14,false),
      bGlowRound:new Batch(s,g,glowRound,1500,15,false),bGlowLong:new Batch(s,g,glowLong,1500,15,false),
      bRound:new Batch(s,g,coreRound,1500,16,false),bRice:new Batch(s,g,coreRice,1500,16,false),bNeedle:new Batch(s,g,coreNeedle,1500,16,false),
      spark:new Batch(s,g,glow,900,18,true),flash:new Batch(s,g,glow,120,18,true),ring:new Batch(s,g,ring,90,19,true),petal:new Batch(s,g,petal,400,20,true),
      bloom:new Batch(s,g,flower,40,20,true),bolt:new Batch(s,g,beamGlow,400,21,true),boltCore:new Batch(s,g,beamCore,400,21,true),
      ultBeamGlow:new Batch(s,g,beamGlow,6,20,true),ultBeamCore:new Batch(s,g,beamCore,4,20,true),
      coreGlow:new Batch(s,g,soft,2,23,true),coreRing:new Batch(s,g,coreRing,2,24,true),coreDot:new Batch(s,g,coreDot,2,25,false),grazeRing:new Batch(s,g,hitRing,2,23,true),
      debug:new Batch(s,g,hitRing,900,40,false),
      slash:new Batch(s,g,slash,40,21,true),slashCore:new Batch(s,g,slash,40,22,true),shotArrow:new Batch(s,g,arrow,700,10,true),
    };
    for(const hero of HEROES){
      const support=canvasTexture(128,128,c=>{
        c.lineCap='round';c.lineJoin='round';
        const light=hero.glow,ink='#152033';
        if(hero.id==='rin'){
          for(let i=0;i<7;i++){const a=-1.3+i*.34;c.save();c.translate(34,75);c.rotate(a);poly(c,[[0,0],[57,-19],[78,-9],[83,5],[57,17]],hero.color);c.strokeStyle=light;c.lineWidth=3;c.beginPath();c.moveTo(3,0);c.lineTo(77,0);c.stroke();c.restore();}
          ellipse(c,34,75,9,9,light,ink,3);
        }else if(hero.id==='golem'){
          poly(c,[[20,35],[52,22],[74,32],[72,96],[38,104],[20,84]],'#596c7c');poly(c,[[45,42],[113,42],[119,53],[111,67],[45,67]],hero.color);poly(c,[[43,75],[103,75],[112,86],[103,96],[43,96]],light);
          c.strokeStyle=ink;c.lineWidth=5;c.strokeRect(55,45,48,18);ellipse(c,34,60,10,14,light,hero.color,4);
        }else if(hero.id==='ryu'){
          poly(c,[[16,57],[28,27],[83,28],[107,52],[98,85],[66,103],[24,88]],'#765338');
          for(let i=0;i<4;i++)ellipse(c,30+i*20,45,10,16,hero.color,light,3);
          poly(c,[[38,69],[64,52],[55,72],[82,67],[51,98],[57,78]],light);
        }else if(hero.id==='hanui'){
          c.strokeStyle=hero.color;c.lineWidth=10;c.beginPath();c.moveTo(35,18);c.bezierCurveTo(96,25,98,102,35,110);c.stroke();c.strokeStyle=light;c.lineWidth=3;c.beginPath();c.moveTo(35,18);c.lineTo(53,64);c.lineTo(35,110);c.stroke();
          c.lineWidth=5;c.beginPath();c.moveTo(15,64);c.lineTo(113,64);c.stroke();poly(c,[[120,64],[97,51],[103,64],[97,77]],hero.color);
        }else{
          c.beginPath();c.moveTo(68,10);c.bezierCurveTo(23,42,34,45,20,69);c.bezierCurveTo(11,107,95,124,108,79);c.bezierCurveTo(120,53,75,48,90,28);c.bezierCurveTo(67,41,60,45,68,10);c.fillStyle=hero.color;c.fill();
          ellipse(c,65,77,26,29,light);ellipse(c,56,73,5,7,ink);ellipse(c,77,73,5,7,ink);poly(c,[[58,89],[68,84],[77,89],[73,101],[64,96],[56,102]],hero.color);
        }
      });
      this.b[`support-${hero.id}`]=new Batch(s,g,support,4,9,false);
    }
    const marker=canvasTexture(160,48,c=>{poly(c,[[0,10],[12,0],[148,0],[160,10],[160,38],[148,48],[12,48],[0,38]],'#17202bed');c.strokeStyle='#ffd996';c.lineWidth=3;c.strokeRect(3,3,154,42);c.fillStyle='#ffe6ae';c.font='bold 25px sans-serif';c.textAlign='center';c.fillText('발사원',80,33);});
    const bar=canvasTexture(8,8,c=>{c.fillStyle='#ffffff';c.fillRect(0,0,8,8);});
    this.b.sourceMarker=new Batch(s,g,marker,40,17,false);this.b.sourceHealth=new Batch(s,g,bar,80,17,false);
    this.b.awakeningHalo=new Batch(s,g,coreRing,4,8,true);
    this.sky=this.mesh(null,-20);
    this.bg=this.mesh(null,-18);
    this.layers.far=this.mesh(null,-16);this.layers.mid=this.mesh(null,-12);this.layers.near=this.mesh(null,-8);
    const fog=canvasTexture(4,256,c=>{const gr=c.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#ffffff00');gr.addColorStop(.7,'#ffffff55');gr.addColorStop(1,'#ffffffaa');c.fillStyle=gr;c.fillRect(0,0,4,256);});
    this.fog=this.mesh(fog,-14);
    this.shade=this.mesh(canvasTexture(4,4,c=>{c.fillStyle='#fff';c.fillRect(0,0,4,4);}),22);this.shade.material.color.set('#05040c');
    this.flashQuad=this.mesh(this.shade.material.map,30,true);
    this.mandala=this.mesh(mandala,19,true);this.mandala.visible=false;
    const fore=canvasTexture(256,1024,c=>{c.filter='blur(10px)';c.fillStyle='#ffffff';poly(c,[[96,1040],[104,600],[92,300],[110,-20],[150,-20],[160,320],[150,620],[170,1040]],'#ffffff');
      for(const [y,d] of [[240,1],[420,-1],[610,1]] as [number,number][]){c.beginPath();c.moveTo(128,y);c.quadraticCurveTo(128+d*70,y-30,128+d*130,y-70);c.lineWidth=16;c.strokeStyle='#ffffff';c.stroke();ellipse(c,128+d*140,y-80,60,26,'#ffffff');}});
    this.fore=this.mesh(fore,-2);this.fore.visible=false;
    this.hero=this.mesh(null,12);this.hero.visible=false;
    for(let i=0;i<6;i++){const m=this.mesh(null,11,true);m.visible=false;this.ghosts.push(m);}
  }

  async load(onProgress:(n:number)=>void) {
    const loader=new THREE.TextureLoader(),base=`${import.meta.env.BASE_URL}assets/`;
    const kinds=Object.keys(ENEMIES) as EnemyKind[];
    const backgrounds=[...new Set(STAGES.map(s=>s.bg).filter(Boolean))] as string[];
    const total=HEROES.length+kinds.length+backgrounds.length;let done=0;
    const tick=()=>onProgress(++done/total);
    const get=async(file:string)=>{const t=await loader.loadAsync(base+file);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;this.texturePaths.push(base+file);return t;};
    const required=HEROES.map(async h=>{this.heroTex.set(h.id,await get(h.asset));tick();});
    const optional=[
      ...kinds.map(async k=>{try{this.enemyTex.set(k,{tex:await get(ENEMIES[k].asset),tint:'#ffffff'});}catch{/* filled by fallback below */}tick();}),
      ...backgrounds.map(async f=>{try{const t=await get(f);t.wrapS=THREE.MirroredRepeatWrapping;this.bgTex.set(f,t);}catch{/* procedural layers carry the stage */}tick();}),
    ];
    await Promise.all([...required,...optional]);
    for(const k of kinds)if(!this.enemyTex.has(k)){const fb=FALLBACK[k];const src=fb&&this.enemyTex.get(fb[0]);if(src)this.enemyTex.set(k,{tex:src.tex,tint:fb[1]});}
    if(!this.enemyTex.has('boss1'))throw new Error('필수 원화를 불러오지 못했습니다.');
    // The menu may already have rendered stage zero while its painted backdrop was loading.
    this.shownStage=-1;
  }
  setWorld(w:number){this.worldW=w;this.resize();}
  resize() {
    const r=this.host.getBoundingClientRect();if(!r.width||!r.height)return;
    this.renderer.setSize(r.width,r.height,false);
    const A=r.width/r.height,W=this.worldW;
    if(A>=W/H){const vw=H*A;this.cam={l:W/2-vw/2,r:W/2+vw/2,b:0,t:H};}
    else{const vh=W/A;this.cam={l:0,r:W,b:H/2-vh/2,t:H/2+vh/2};}
    this.camera.left=this.cam.l;this.camera.right=this.cam.r;this.camera.bottom=this.cam.b;this.camera.top=this.cam.t;this.camera.updateProjectionMatrix();
  }
  /** Converts a pointer position to world coordinates (y down). */
  toWorld(clientX:number,clientY:number){const r=this.host.getBoundingClientRect();const x=this.cam.l+(clientX-r.left)/r.width*(this.cam.r-this.cam.l);const y3=this.cam.t-(clientY-r.top)/r.height*(this.cam.t-this.cam.b);return{x,y:H-y3};}
  /** World point to a fraction of the canvas box, for DOM labels. */
  toScreen(x:number,y:number){return{left:(x-this.cam.l)/(this.cam.r-this.cam.l),top:(this.cam.t-Y(y))/(this.cam.t-this.cam.b)};}
  worldPerPixel(){const r=this.host.getBoundingClientRect();return (this.cam.r-this.cam.l)/Math.max(1,r.width);}
  heroTexture(id:HeroId){return this.heroTex.get(id);}

  private stageTextures(i:number) {
    let t=this.stageCache.get(i);if(t)return t;
    const st=STAGES[i];
    const sky=canvasTexture(4,512,c=>{const gr=c.createLinearGradient(0,0,0,512);gr.addColorStop(0,st.sky[2]);gr.addColorStop(.55,st.sky[1]);gr.addColorStop(1,st.sky[0]);c.fillStyle=gr;c.fillRect(0,0,4,512);});
    t={sky,far:canvasTexture(2048,512,paintLayer(st,'far',2048,512),true),mid:canvasTexture(2048,420,paintLayer(st,'mid',2048,420),true),near:canvasTexture(2048,300,paintLayer(st,'near',2048,300),true)};
    this.stageCache.set(i,t);return t;
  }
  private applyStage(i:number) {
    const st=STAGES[i],t=this.stageTextures(i);
    this.sky.material.map=t.sky;this.sky.material.needsUpdate=true;
    const bg=st.bg?this.bgTex.get(st.bg):undefined;
    this.bg.visible=!!bg;if(bg){this.bg.material.map=bg;this.bg.material.needsUpdate=true;this.bg.material.color.set(st.terrain==='storm'?'#8f86b3':st.terrain==='forge'?'#e6dcdc':'#ffffff');}
    for(const k of ['far','mid','near'] as Layer[]){this.layers[k].material.map=t[k];this.layers[k].material.needsUpdate=true;}
    this.layers.far.material.opacity=bg?0:1;this.layers.mid.material.opacity=bg?0:1;
    this.fog.material.color.set(st.fog);this.fog.material.opacity=bg?.35:.55;
    this.shownStage=i;
  }
  private quad(m:THREE.Mesh,x:number,y:number,w:number,h:number){m.position.set(x,Y(y),0);m.scale.set(w,h,1);}
  private placeBackground(dt:number,st:StageDef,speedMul:number) {
    const {l,r,b,t}=this.cam,cw=r-l,ch=t-b,cx=(l+r)/2;
    this.scroll+=st.scroll*speedMul*dt;
    this.sky.position.set(cx,(t+b)/2,0);this.sky.scale.set(cw+40,ch+40,1);
    if(this.bg.visible){const map=this.bg.material.map!,img=map.image as HTMLImageElement,aspect=img.width/img.height;const bh=Math.max(ch,cw/aspect)+20,bw=bh*aspect;
      this.bg.position.set(cx,(t+b)/2+((bh-ch)/2)*.4,0);this.bg.scale.set(cw+20,bh,1);map.repeat.set((cw+20)/bw,1);map.offset.x=(this.scroll*.035)/bw;}
    const layer=(m:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>,top:number,height:number,factor:number,tileW:number,toBottom=false)=>{
      const bottom=toBottom?Math.min(b-10,Y(top)-height):Y(top)-height;const hh=Y(top)-bottom;m.position.set(cx,bottom+hh/2,0);m.scale.set(cw+20,hh,1);
      const map=m.material.map;if(map){map.repeat.set((cw+20)/tileW,1);map.offset.x=(this.scroll*factor)/tileW%1;}
    };
    layer(this.layers.far,240*S,520*S,.09,2048*S);
    layer(this.layers.mid,500*S,420*S,.32,1900*S);
    layer(this.layers.near,640*S,300*S,1,1500*S,true);
    this.fog.position.set(cx,Y(560*S),0);this.fog.scale.set(cw+20,560*S,1);
  }

  private add(kind:keyof GameRenderer['particles'],p:Partial<Particle>&{x:number;y:number}) {
    const list=this.particles[kind];if(list.length>900)return;
    const life=p.life??.5;
    list.push({vx:0,vy:0,size:20,grow:0,color:WHITE,alpha:1,rot:0,vr:0,drag:2,stretch:1,...p,life,max:life});
  }
  private explosion(x:number,y:number,size:number,color:THREE.Color,smoke=true) {
    this.add('flash',{x,y,life:.22,size:size*1.4,grow:size*2.5,color:col('#fff2c8')});
    this.add('ring',{x,y,life:.45,size:size*.4,grow:size*3,color});
    const n=Math.min(40,10+size/6);
    for(let i=0;i<n;i++){const a=Math.random()*TAU,v=size*(1+Math.random()*4);this.add('spark',{x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.3+Math.random()*.45,size:6+Math.random()*10,color:i%3?color:WHITE,drag:3,stretch:2.5});}
    if(smoke&&!this.reducedMotion)for(let i=0;i<Math.min(10,3+size/30);i++){const a=Math.random()*TAU,v=size*.6*Math.random();this.add('smoke',{x:x+Math.cos(a)*size*.2,y:y+Math.sin(a)*size*.2,vx:Math.cos(a)*v-80,vy:Math.sin(a)*v,life:.7+Math.random()*.6,size:size*.5,grow:size*.9,color:col('#2b2730'),alpha:.55});}
  }
  private bolt(x:number,y:number) {
    const pts:number[][]=[];let cx=x+(Math.random()-.5)*160;const steps=12;
    for(let i=0;i<=steps;i++){const t=i/steps;pts.push([cx+(x-cx)*t+(i&&i<steps?(Math.random()-.5)*70:0),-40+(y+40)*t]);}
    this.bolts.push({pts,life:.24,max:.24,tx:x,ty:y});
  }
  event(e:GameEvent,state:GameState) {
    const hero=heroDef(state.hero),hc=col(hero.color),st=STAGES[state.stage];
    switch(e.kind){
      case 'hit':if(Math.random()<.6)for(let i=0;i<2;i++)this.add('spark',{x:e.x,y:e.y,vx:-120-Math.random()*200,vy:(Math.random()-.5)*260,life:.12,size:12,color:col('#fff1c0'),stretch:2});break;
      case 'kill':{
        const def=ENEMIES[e.enemy??'drone'],size=e.enemy?.startsWith('boss')?def.w*.6:def.w*.55*(e.big?1.2:1);
        this.explosion(e.x,e.y,size,col(st.accent));if(e.big)this.shake=Math.max(this.shake,5);break;}
      case 'explode':{
        const def=ENEMIES[e.enemy??'boss1'];
        for(let i=0;i<12;i++)this.later.push({at:this.elapsed+i*.11,run:()=>{this.explosion(e.x+(Math.random()-.5)*def.w*.7,e.y+(Math.random()-.5)*def.w*.5,90+Math.random()*80,col(i%2?st.accent:'#ffffff'));this.shake=Math.max(this.shake,10);}});
        this.later.push({at:this.elapsed+1.4,run:()=>{this.explosion(e.x,e.y,320,col('#ffffff'));this.flash=1;this.flashColor.set('#ffffff');this.shake=18;}});
        break;}
      case 'hurt':this.flash=.7;this.flashColor.set('#ff3355');this.shake=12;this.explosion(e.x,e.y,90,col('#ff6688'),false);break;
      case 'graze':this.add('spark',{x:e.x,y:e.y,vx:-60,vy:(Math.random()-.5)*80,life:.18,size:16,color:col('#b8fff4')});break;
      case 'perfect':this.add('ring',{x:e.x,y:e.y,life:.5,size:30,grow:420,color:col('#9ffcff')});this.add('ring',{x:e.x,y:e.y,life:.35,size:20,grow:240,color:WHITE});this.flash=.25;this.flashColor.set('#7fe9ff');break;
      case 'dash':this.ghostData.push({x:e.x,y:e.y,life:.25});for(let i=0;i<10;i++)this.add('spark',{x:e.x,y:e.y,vx:-Math.cos(e.value??0)*(200+Math.random()*300),vy:-Math.sin(e.value??0)*(200+Math.random()*300)+(Math.random()-.5)*120,life:.25,size:10,color:hc,stretch:3});break;
      case 'charge':this.add('flash',{x:e.x,y:e.y,life:.2,size:80,grow:200,color:hc});this.shake=Math.max(this.shake,4);
        // Arang's charge is a sweeping lash of hair in front of her.
        if(state.hero==='arang'){const p=state.player;for(let i=0;i<3;i++)this.swings.push({x:p.x+150+i*60,y:p.y+(i-1)*50,life:.32+i*.06,max:.32+i*.06,a:(i-1)*.35,n:i,s:1.2+.6*(e.value??0)});this.shake=Math.max(this.shake,8);}
        break;
      case 'near':{
        // Each hero swings differently: a fan sweep, an iron fist, a flurry of thunder punches.
        this.lunge=1;this.shake=Math.max(this.shake,state.hero==='golem'?7:4);
        const n=state.hero==='ryu'?3:1;
        for(let i=0;i<n;i++)this.swings.push({x:e.x+i*26,y:e.y+(i-1)*26*(n>1?1:0),life:.2+i*.05,max:.2+i*.05,a:(Math.random()-.5)*.5+(state.hero==='rin'?-.3:0),n:i,s:1});
        this.add('flash',{x:e.x,y:e.y,life:.14,size:state.hero==='golem'?160:110,grow:120,color:col(hero.glow)});
        if(state.hero==='golem')this.add('ring',{x:e.x,y:e.y,life:.3,size:40,grow:260,color:hc});
        for(let i=0;i<12;i++)this.add('spark',{x:e.x,y:e.y,vx:150+Math.random()*420,vy:(Math.random()-.5)*480,life:.3,size:state.hero==='rin'?16:12,color:i%3?hc:WHITE,stretch:2.4,drag:3});
        break;}
      case 'cancel':if((e.value??0)>12&&state.player.ultimateTimer<=0){this.flash=Math.max(this.flash,.16);this.flashColor.set('#fff4c6');}break;
      case 'phase':this.flash=.5;this.flashColor.set('#ffffff');this.shake=10;this.add('ring',{x:e.x,y:e.y,life:.7,size:60,grow:1400,color:col(st.accent)});break;
      case 'ultimate':
        this.flash=1;this.flashColor.set(hero.glow);this.shake=12;
        this.add('ring',{x:e.x,y:e.y,life:.9,size:60,grow:2200,color:hc});
        if(state.hero==='rin')for(let i=0;i<180;i++)this.add('petal',{x:e.x,y:e.y,life:ULT_TIME,size:14+Math.random()*16,rot:Math.random()*TAU,vr:(Math.random()-.5)*8,color:col(i%3?'#ff9aa8':'#ffe1e6'),vx:i,vy:Math.random(),drag:0});
        break;
      case 'bloom':this.add('flash',{x:e.x,y:e.y,life:.5,size:60,grow:300,color:col('#ff9bb0')});for(let i=0;i<12;i++){const a=i/12*TAU;this.add('spark',{x:e.x,y:e.y,vx:Math.cos(a)*420,vy:Math.sin(a)*420,life:.4,size:18,color:col('#ffb3c4'),stretch:2});}this.bloomAt.push({x:e.x,y:e.y,life:.7});break;
      case 'strike':this.bolt(e.x,e.y);this.flash=Math.max(this.flash,.14);this.flashColor.set('#fff6c8');this.shake=Math.max(this.shake,6);this.explosion(e.x,e.y,70,col('#ffe27a'),false);break;
      case 'stage':this.flash=.7;this.flashColor.set('#ffffff');break;
      case 'stageclear':this.flash=.6;this.flashColor.set('#ffffff');break;
      case 'pickup':if(e.big)this.add('ring',{x:e.x,y:e.y,life:.35,size:20,grow:120,color:col('#ffe7a8')});break;
      case 'extend':this.add('ring',{x:e.x,y:e.y,life:.6,size:30,grow:300,color:col('#7dffb4')});break;
      case 'awaken':this.add('ring',{x:e.x,y:e.y,life:1.1,size:60,grow:440,color:col(hero.glow)});this.add('ring',{x:e.x,y:e.y,life:.7,size:35,grow:220,color:hc});this.explosion(e.x,e.y,65,hc,false);break;
    }
  }
  private bloomAt:{x:number;y:number;life:number}[]=[];
  reset(){for(const k of Object.keys(this.particles) as (keyof GameRenderer['particles'])[])this.particles[k]=[];this.bolts=[];this.later=[];this.ghostData=[];this.bloomAt=[];this.shake=0;this.flash=0;this.lightning=0;this.frameTimes=[];}

  render(state:GameState,dt:number,focus=false,freeze=false) {
    const raw=dt;if(freeze)dt=0;
    this.elapsed+=dt;const t=this.elapsed,active=state.phase!=='menu';
    if(this.shownStage!==state.stage)this.applyStage(state.stage);
    const st=STAGES[state.stage],p=state.player,hero=heroDef(state.hero),hc=col(hero.color),W=this.worldW;
    const slow=state.slow>0?.33:1,gdt=dt*slow*(state.hitstop>0?0:1);
    for(let i=this.later.length-1;i>=0;i--)if(this.later[i].at<=this.elapsed){const l=this.later[i];this.later.splice(i,1);l.run();}
    // Speed: scrolling quickens in dashes and ultimates, pauses with the world.
    const speedMul=(active?1:.55)*(p.dashTime>0?2.2:1)*(p.ultimateTimer>0?1.6:1)*(state.transition>0?2.4:1);
    this.placeBackground(gdt,st,speedMul);
    this.shake*=Math.exp(-raw*8);this.flash=Math.max(0,this.flash-raw*2.8);
    const sh=this.reducedMotion?0:this.shake;
    this.camera.position.set(Math.sin(t*97)*sh,Math.cos(t*83)*sh*.6,5);
    const {l,r,b,t:top}=this.cam,cw=r-l,ch=top-b,cx=(l+r)/2;

    // Speed streaks and weather.
    const sp=st.scroll*speedMul;
    for(let i=0;i<70;i++){const k=(i*7919)%1000/1000,y=((i*331)%H),len=80+k*220,x=r-((t*sp*(1.6+k*1.6)+i*397)%(cw+len*2))+len;
      const burst=p.dashTime>0||p.ultimateTimer>0||state.transition>0;if(!burst&&i%5)continue;
      this.b.streak.push(x,y,len,3+k*2,0,col(st.light),(.03+k*.06)*(burst?3:1)*(active?1:.6));}
    this.b.streak.end();
    const wt=st.weather;let wn=0;
    for(let i=0;i<110;i++){
      const k=((i*7121)%997)/997,k2=((i*4271)%991)/991;let x=0,y=0,w=6,h=6,a=0,c=WHITE,al=.6;
      if(wt==='petals'){x=r-((t*(90+k*200)+i*233)%(cw+100))+50;y=(k2*H+t*(30+k*40)+Math.sin(t+i)*30)%H;w=8+k*8;h=5+k*4;a=t*2+i;c=col('#ffd0dc');al=.75;
        this.b.petalW.push(x,y,w,h,a,c,al);continue;}
      if(wt==='wisps'){x=r-((t*sp*(1.2+k)+i*271)%(cw+400))+200;y=k2*H;w=120+k*200;h=4+k*6;c=col('#ffffff');al=.08+k*.1;}
      else if(wt==='embers'){x=r-((t*(140+k*200)+i*233)%(cw+60))+30;y=H-((k2*H+t*(60+k*90))%H);w=h=4+k*6;c=col(i%3?'#ff9a3c':'#ffd27a');al=.7;}
      else if(wt==='fireflies'){x=r-((t*(40+k*60)+i*233)%(cw+60))+30;y=(k2*H+Math.sin(t*.7+i)*40+H)%H;w=h=4+k*5;c=col(st.accent);al=.3+.5*Math.max(0,Math.sin(t*3+i*1.7));}
      else if(wt==='souls'){x=r-((t*(60+k*80)+i*233)%(cw+60))+30;y=H-((k2*H+t*(30+k*50))%H);w=6+k*6;h=w*1.7;c=col('#bfefff');al=.22+.3*k;}
      else if(wt==='snow'){x=r-((t*(220+k*320)+i*233)%(cw+60))+30;y=(k2*H+t*(70+k*120))%H;w=h=3+k*7;c=WHITE;al=.75;}
      else {x=r-((t*(500+k*300)+i*233)%(cw+200))+100;y=(k2*H+t*(900+k*300))%H;w=36+k*30;h=2;a=1.25;c=col('#bfc8ff');al=.25;}
      this.b.weatherBack.push(x,y,w,h,a,c,al);wn++;
    }
    this.b.weatherBack.end();this.b.petalW.end();
    if(wt==='rain'&&!this.reducedMotion&&gdt>0){if(Math.random()<gdt*.25)this.lightning=1;}
    this.lightning=Math.max(0,this.lightning-raw*3);

    // Foreground silhouettes rushing past sell the speed.
    this.foreTimer-=gdt;
    if(this.foreTimer<=0&&active&&!this.reducedMotion&&st.terrain!=='clouds'&&st.terrain!=='storm'&&st.terrain!=='underworld'){this.foreTimer=7+Math.random()*7;this.foreX=r+260;}
    if(this.foreX>l-300){this.foreX-=sp*2.6*gdt;this.fore.visible=true;this.quad(this.fore,this.foreX,H/2,240,ch+200);this.fore.material.color.set(st.near);this.fore.material.opacity=st.bg?.5:.7;}
    else this.fore.visible=false;

    // Pickups
    for(const it of state.pickups){const y=it.y+Math.sin(it.age*5)*3;
      if(it.kind==='gold')this.b.pickups.push(it.x,y,22*Math.abs(Math.cos(it.age*6))+4,22,0,WHITE);
      else (it.kind==='power'?this.b.power:it.kind==='gauge'?this.b.gauge:this.b.life).push(it.x,y,40,40,Math.sin(it.age*2)*.15,WHITE);}
    for(const k of ['pickups','power','gauge','life'])this.b[k].end();

    // Enemies
    const live=new Set<number>();
    for(const e of state.enemies) {
      live.add(e.id);let m=this.enemyMeshes.get(e.id);const tex=this.enemyTex.get(e.kind)!;
      if(!m){m=this.mesh(tex.tex,e.boss?5:6);this.enemyMeshes.set(e.id,m);}
      const def=ENEMIES[e.kind],w=def.w*e.scale,h=w*def.aspect;
      m.position.set(e.x,Y(e.y),0);m.scale.set(w,h,1);
      m.rotation.z=e.boss?Math.sin(t*.9)*.02:e.path.type==='chase'&&e.attack?-(e.spin-Math.PI):Math.sin(e.age*3+e.seed)*.06;
      const c=tmpColor.copy(col(e.tint)).multiply(col(tex.tint));
      if(e.flash>0)c.multiplyScalar(2.2);
      m.material.color.copy(c);m.material.opacity=e.boss&&e.shield>0?.75+Math.sin(t*30)*.2:1;
      if(e.mid&&!e.boss&&e.x>30&&e.x<W-25){
        const y=Math.max(145,e.y-h*.5-23);
        this.b.sourceMarker.push(e.x,y,66,20,0,WHITE,1);
        this.b.sourceHealth.push(e.x,y+15,64,4,0,col('#1a2334'),1);
        const hp=Math.max(0,e.hp/e.maxHp);this.b.sourceHealth.push(e.x-32+32*hp,y+15,64*hp,4,0,col('#ffda92'),1);
      }
    }
    this.b.sourceMarker.end();this.b.sourceHealth.end();
    for(const [id,m] of this.enemyMeshes)if(!live.has(id)){this.scene.remove(m);m.material.dispose();this.enemyMeshes.delete(id);}

    // Player shots
    const bright=col(hero.glow);
    for(const s of state.shots){
      const a=Math.atan2(s.vy,s.vx);
      if(state.hero==='arang'){const big=s.kind==='charge';this.b.shotGlow.push(s.x,s.y,big?64:40,big?64:40,0,hc,.85);this.b.shotGlow.push(s.x,s.y,big?22:15,big?22:15,0,WHITE,1);}
      else if(state.hero==='hanui'&&s.kind!=='homing')this.b.shotArrow.push(s.x-24,s.y,s.kind==='charge'?150:96,s.kind==='charge'?22:14,a,s.kind==='charge'?bright:hc,1);
      else if(s.kind==='homing')this.b.shotGlow.push(s.x,s.y,26,26,0,hc,.9);
      else if(state.hero==='rin')this.b.shotPetal.push(s.x,s.y,s.kind==='charge'?84:46,s.kind==='charge'?42:22,a,s.kind==='charge'?bright:hc,1);
      else if(state.hero==='golem')this.b.shotBolt.push(s.x-30,s.y,s.kind==='charge'?220:110,s.kind==='charge'?s.r*2.2:22,a,s.kind==='charge'?bright:hc,1);
      else this.b.shotWave.push(s.x,s.y,s.kind==='charge'?110:62,s.kind==='charge'?150:78,a,s.kind==='charge'?bright:hc,1);
    }
    // Hanui's ultimate: a sky full of arrows falling across the screen.
    if(active&&p.ultimateTimer>0&&state.hero==='hanui'){const fall=1.08,fade=Math.min(1,p.ultimateTimer*2);
      for(let i=0;i<110;i++){const k=((i*7919)%997)/997,d=(t*(1600+k*900)+i*331)%(H*1.5+300),x0=l-260+((i*173)%(cw+360));
        this.b.shotArrow.push(x0+Math.cos(fall)*d,-120+Math.sin(fall)*d,110+k*50,14,fall,i%4?hc:bright,fade);}}
    for(const k of ['shotPetal','shotBolt','shotWave','shotGlow','shotArrow'])this.b[k].end();
    // These are the actual firing sockets used by the simulation, with five different weapon silhouettes.
    const growth=getAwakening(state.hero,p.awakening,p.power);
    for(const h of HEROES){
      if(active&&h.id===state.hero)for(const o of supportPositions(state.hero,p.awakening)){
        const size=h.id==='golem'?43:37;
        this.b[`support-${h.id}`].push(p.x+o.x,p.y+o.y,size,size,h.id==='rin'?-.15:0,WHITE,1);
      }
      this.b[`support-${h.id}`].end();
    }
    if(active&&growth.rank>=4){
      const size=growth.rank>=8?132:growth.rank>=6?112:92;
      this.b.awakeningHalo.push(p.x-12,p.y+20,size,size,t*.28,hc,.26);
      if(growth.rank>=6)this.b.awakeningHalo.push(p.x-12,p.y+20,size*.73,size*.73,-t*.4,col(hero.glow),.3);
    }
    this.b.awakeningHalo.end();

    // Lasers: warning line, then a beam whose white core width equals the collision core.
    for(const ls of state.lasers){
      const c=col(ls.color),dx=Math.cos(ls.angle),dy=Math.sin(ls.angle),mx=ls.x+dx*ls.length/2,my=ls.y+dy*ls.length/2;
      if(ls.age<ls.warn){const blink=.35+.45*(Math.sin(ls.age*30)*.5+.5)*(ls.age/ls.warn);this.b.laserGlow.push(mx,my,ls.length,10+ls.width*.25*(ls.age/ls.warn),ls.angle,c,blink);this.b.laserCore.push(mx,my,ls.length,2,ls.angle,c,blink);}
      else{const open=Math.min(1,(ls.age-ls.warn)/.12,(ls.warn+ls.life-ls.age)/.15);
        this.b.laserGlow.push(mx,my,ls.length,ls.width*1.7*open,ls.angle,c,1);
        this.b.laserCore.push(mx,my,ls.length,ls.width*.6*open/.76,ls.angle,WHITE,1);
        this.add('spark',{x:ls.x,y:ls.y,vx:(Math.random()-.5)*200,vy:(Math.random()-.5)*200,life:.15,size:30,color:c});}
    }
    this.b.laserGlow.end();this.b.laserCore.end();

    // Enemy bullets: coloured glow behind, white core in front whose edge is the hit radius.
    for(const bl of state.bullets){
      const c=col(bl.color),s=bl.r*2/.875;
      if(bl.style==='orb'||bl.style==='big'){this.b.bGlowRound.push(bl.x,bl.y,bl.r*4.6,bl.r*4.6,0,c,.95);this.b.bRound.push(bl.x,bl.y,s,s,0,WHITE);}
      else{const a=Math.atan2(Math.sin(bl.a)*bl.v+bl.gy,Math.cos(bl.a)*bl.v);
        if(bl.style==='rice'){this.b.bGlowLong.push(bl.x,bl.y,bl.r*7.4,bl.r*3.8,a,c,.95);this.b.bRice.push(bl.x,bl.y,s*2,s,a,WHITE);}
        else{this.b.bGlowLong.push(bl.x,bl.y,bl.r*10,bl.r*3.6,a,c,.95);this.b.bNeedle.push(bl.x,bl.y,s*4,s,a,WHITE);}}
    }
    for(const k of ['bGlowRound','bGlowLong','bRound','bRice','bNeedle'])this.b[k].end();

    // Player sprite, anchored so that the hit core is the real collision point.
    const ht=this.heroTex.get(state.hero);
    this.hero.visible=active&&!!ht;
    if(ht&&active){
      if(this.hero.material.map!==ht){this.hero.material.map=ht;this.hero.material.needsUpdate=true;}
      const img=ht.image as HTMLImageElement,hh=hero.spriteH,ww=hh*img.width/img.height;
      const vy=dt>0?(p.y-this.lastPlayer.y)/dt:0;this.lastPlayer.vy+=(vy-this.lastPlayer.vy)*Math.min(1,dt*10);
      this.lunge=Math.max(0,this.lunge-raw*7);
      const sx=p.x+(.5-hero.core[0])*ww+Math.sin(this.lunge*Math.PI)*16,sy=p.y+(.5-hero.core[1])*hh+Math.sin(t*5)*2;
      this.hero.position.set(sx,Y(sy),0);this.hero.scale.set(ww,hh,1);this.hero.rotation.z=-Math.max(-.18,Math.min(.18,this.lastPlayer.vy/2600));
      this.hero.material.opacity=p.invulnerable>0&&p.ultimateTimer<=0&&state.clearTimer<=0&&state.transition<=0?(Math.sin(t*30)>0?.35:.9):1;
      this.hero.material.color.set(p.dashIframes>0?'#ffffff':'#ffffff').multiplyScalar(p.dashIframes>0?1.6:1);
      // Dash afterimages
      if(p.dashTime>0&&Math.floor(t*60)%2===0)this.ghostData.push({x:sx,y:sy,life:.22});
      for(let i=this.ghostData.length-1;i>=0;i--){this.ghostData[i].life-=raw;if(this.ghostData[i].life<=0)this.ghostData.splice(i,1);}
      this.ghosts.forEach((g,i)=>{const d=this.ghostData[this.ghostData.length-1-i];g.visible=!!d;if(d){g.material.map=ht;g.material.color.copy(hc);g.material.opacity=d.life/.25*.6;g.position.set(d.x,Y(d.y),0);g.scale.set(ww,hh,1);}});
      this.lastPlayer.x=p.x;this.lastPlayer.y=p.y;
    }else this.ghosts.forEach(g=>g.visible=false);
    // Hit core: always visible. The white disc is exactly the hit radius.
    if(active){
      const ringA=focus?1:.8,ringS=focus?34:26;
      this.b.coreGlow.push(p.x,p.y,ringS*1.2,ringS*1.2,0,col('#7ff6ff'),focus?.55:.3);
      this.b.coreRing.push(p.x,p.y,ringS,ringS,t*3,col('#e9fdff'),ringA);
      this.b.coreDot.push(p.x,p.y,PLAYER_R*2/.8125,PLAYER_R*2/.8125,0,WHITE);
      if(focus)this.b.grazeRing.push(p.x,p.y,GRAZE_R*2*1.05,GRAZE_R*2*1.05,0,col('#9ffcff'),.35);
    }
    this.b.coreGlow.end();this.b.coreRing.end();this.b.coreDot.end();this.b.grazeRing.end();

    // Ultimates
    this.shade.visible=active&&(p.ultimateTimer>0||this.lightning>0||state.slow>0);
    if(this.shade.visible){this.quad(this.shade,cx,H/2,cw+60,ch+60);this.shade.material.opacity=p.ultimateTimer>0?.38:state.slow>0?.18:0;}
    // Arang's ultimate: the wail rolls out in cold rings.
    if(active&&p.ultimateTimer>0&&state.hero==='arang'&&this.elapsed-this.wailAt>.28){this.wailAt=this.elapsed;this.add('ring',{x:p.x,y:p.y,life:1,size:80,grow:1900,color:col('#a9c0ff')});for(let i=0;i<8;i++){const a=Math.random()*TAU;this.add('spark',{x:p.x+Math.cos(a)*40,y:p.y+Math.sin(a)*40,vx:Math.cos(a)*520,vy:Math.sin(a)*520,life:.6,size:20,color:col('#cfe0ff'),stretch:2});}}
    this.mandala.visible=active&&p.ultimateTimer>0&&state.hero==='rin';
    if(this.mandala.visible){const k=ULT_TIME-p.ultimateTimer,size=500+k*420;this.quad(this.mandala,W*.55,H/2,size,size);this.mandala.rotation.z=t*.4;this.mandala.material.color.set('#ff8fa3');this.mandala.material.opacity=Math.min(1,p.ultimateTimer)*.7;}
    if(active&&p.ultimateTimer>0&&state.hero==='golem'){
      const [ox,oy]=muzzleOffset('golem'),bx=p.x+ox,by=p.y+oy,len=r-bx+200,k=ULT_TIME-p.ultimateTimer,charge=Math.min(1,k/.25),fade=Math.min(1,p.ultimateTimer/.3);
      const flick=1+Math.sin(t*60)*.08;
      this.b.ultBeamGlow.push(bx+len/2,by,len,380*charge*fade*flick,0,hc,.9);
      this.b.ultBeamGlow.push(bx+len/2,by,len,190*charge*fade*flick,0,hc,1);
      this.b.ultBeamCore.push(bx+len/2,by,len,64*charge*fade*flick,0,col(hero.glow),.95);
      this.add('flash',{x:bx,y:by,life:.08,size:180*charge,grow:60,color:hc});
      for(let i=0;i<2;i++)this.add('spark',{x:bx+Math.random()*len*.6,y:by+(Math.random()-.5)*60,vx:2200,vy:0,life:.18,size:10,color:WHITE,stretch:8,drag:0});
      this.shake=Math.max(this.shake,4);
      if(Math.random()<.5)this.add('ring',{x:bx+Math.random()*len,y:by,life:.3,size:40,grow:300,color:hc});
      for(let i=0;i<3;i++)this.add('spark',{x:bx+Math.random()*len,y:by+(Math.random()-.5)*200,vx:900,vy:(Math.random()-.5)*200,life:.25,size:14,color:WHITE,stretch:4});
    }
    this.b.ultBeamGlow.end();this.b.ultBeamCore.end();
    for(let i=this.bloomAt.length-1;i>=0;i--){const bl=this.bloomAt[i];bl.life-=dt;if(bl.life<=0){this.bloomAt.splice(i,1);continue;}const s=180+(.7-bl.life)*500;this.b.bloom.push(bl.x,bl.y,s,s,t,col('#ff8fa8'),bl.life/.7);}
    this.b.bloom.end();
    for(let i=this.bolts.length-1;i>=0;i--){
      const bo=this.bolts[i];bo.life-=raw;if(bo.life<=0){this.bolts.splice(i,1);continue;}
      const a=bo.life/bo.max;
      for(let j=1;j<bo.pts.length;j++){const [x1,y1]=bo.pts[j-1],[x2,y2]=bo.pts[j];const jx=(Math.random()-.5)*10;const len=Math.hypot(x2-x1,y2-y1),ang=Math.atan2(y2-y1,x2-x1);
        this.b.bolt.push((x1+x2)/2+jx,(y1+y2)/2,len+6,46,ang,col('#ffd84a'),a);this.b.boltCore.push((x1+x2)/2+jx,(y1+y2)/2,len+4,7,ang,WHITE,a);}
    }
    this.b.bolt.end();this.b.boltCore.end();

    // Particles
    const step=(list:Particle[],batch:Batch,tex:'spark'|'smoke'|'flash'|'ring'|'petal')=>{
      for(let i=list.length-1;i>=0;i--){
        const q=list[i];
        if(tex==='petal'&&state.player.ultimateTimer<=0)q.life=0;
        q.life-=dt;if(q.life<=0){list.splice(i,1);continue;}
        if(tex==='petal'){const k=q.vx,phase=k*.137+t*2.2,rad=120+((k*37)%420)+Math.sin(t*3+k)*40;q.x=W*.52+Math.cos(phase)*rad*1.5;q.y=H/2+Math.sin(phase)*rad*.85;q.rot+=q.vr*dt;}
        else{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=Math.exp(-dt*q.drag);q.vy*=Math.exp(-dt*q.drag);q.rot+=q.vr*dt;}
        const k=q.life/q.max,size=q.size+q.grow*(1-k);
        const a=tex==='smoke'?q.alpha*k:tex==='ring'?k*.9:tex==='flash'?k:tex==='petal'?Math.min(1,q.life*2):k;
        if(tex==='spark'&&q.stretch>1){const sp=Math.hypot(q.vx,q.vy);batch.push(q.x,q.y,size*Math.max(1,Math.min(q.stretch,sp/120)),size*.6,Math.atan2(q.vy,q.vx),q.color,a);}
        else batch.push(q.x,q.y,size,size,q.rot,q.color,a);
      }
      batch.end();
    };
    step(this.particles.spark,this.b.spark,'spark');step(this.particles.smoke,this.b.smoke,'smoke');step(this.particles.flash,this.b.flash,'flash');
    step(this.particles.ring,this.b.ring,'ring');step(this.particles.petal,this.b.petal,'petal');

    // Melee swings
    for(let i=this.swings.length-1;i>=0;i--){const w=this.swings[i];w.life-=raw;if(w.life<=0){this.swings.splice(i,1);continue;}
      const k=w.life/w.max,size=(state.hero==='golem'?190:state.hero==='ryu'?120:230)*(1.15-k*.35)*w.s;
      this.b.slash.push(w.x-20+(1-k)*30,w.y,size,size*1.15,w.a,hc,k);this.b.slashCore.push(w.x-14+(1-k)*30,w.y,size*.8,size*.92,w.a,col(hero.glow),k);}
    this.b.slash.end();this.b.slashCore.end();

    // Debug: draw every collision shape so hit positions can be verified against the art.
    if(this.showHitboxes){
      const red=col('#ff3040'),green=col('#40ff70'),yellow=col('#ffe040');
      for(const e of state.enemies)for(const [x,y,rr] of hitCircles(e as Enemy))this.b.debug.push(x,y,rr*2/.95,rr*2/.95,0,red);
      for(const bl of state.bullets)this.b.debug.push(bl.x,bl.y,bl.r*2/.95,bl.r*2/.95,0,yellow);
      this.b.debug.push(p.x,p.y,PLAYER_R*2/.95,PLAYER_R*2/.95,0,green);this.b.debug.push(p.x,p.y,GRAZE_R*2/.95,GRAZE_R*2/.95,0,green,.4);
      for(const ls of state.lasers)if(ls.age>=ls.warn){const core=ls.width*.3;for(let d=0;d<ls.length;d+=core*2)this.b.debug.push(ls.x+Math.cos(ls.angle)*d,ls.y+Math.sin(ls.angle)*d,core*2,core*2,0,yellow,.6);}
      this.b.debug.end();
    }
    // Screen flash
    const fl=Math.max(this.flash,this.lightning*.35);
    this.flashQuad.visible=fl>0.01&&!this.reducedMotion||fl>.3;
    if(this.flashQuad.visible){this.quad(this.flashQuad,cx,H/2,cw+80,ch+80);this.flashQuad.material.color.copy(this.lightning>this.flash?col('#c9c4ff'):this.flashColor).multiplyScalar(this.reducedMotion?fl*.2:fl*.45);}
    this.renderer.render(this.scene,this.camera);
    if(raw>0){this.frameTimes.push(raw*1000);if(this.frameTimes.length>120)this.frameTimes.shift();}
  }
  diagnostics(state:GameState) {
    return {renderer:this.renderer.info,state:{phase:state.phase,time:state.time,stage:state.stage,hero:state.hero,score:state.score,enemies:state.enemies.length,bullets:state.bullets.length,player:state.player,assets:this.texturePaths,stats:state.stats},
      performance:{meanFrameMs:this.frameTimes.reduce((a,b)=>a+b,0)/Math.max(1,this.frameTimes.length),dpr:this.renderer.getPixelRatio()}};
  }
}
