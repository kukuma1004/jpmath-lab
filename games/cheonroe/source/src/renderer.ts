import * as THREE from 'three';
import { HEIGHT, WIDTH, HEROES, type GameState, type GameEvent, type HeroId, type EnemyKind } from './types';

const white=new THREE.Color('#ffffff');
const colorOf=(hero:HeroId)=>HEROES.find(h=>h.id===hero)!.color;
function canvasTexture(w:number,h:number,draw:(c:CanvasRenderingContext2D)=>void) {
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  draw(canvas.getContext('2d')!);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  return texture;
}
function path(c:CanvasRenderingContext2D,points:number[][],fill:string,stroke?:string,width=2) {
  c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();
  if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}
}
function ellipse(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,fill:string,stroke?:string,width=2) {
  c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();
  if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}
}
function metal(c:CanvasRenderingContext2D,y1:number,y2:number,light='#8a8f98',dark='#222833') {
  const g=c.createLinearGradient(0,y1,0,y2);g.addColorStop(0,light);g.addColorStop(.38,'#454c58');g.addColorStop(.5,'#777b81');g.addColorStop(1,dark);return g;
}
function enemyTexture(kind:EnemyKind) {
  return canvasTexture(600,500,c=>{
    c.lineJoin='round';
    if(kind==='boss') {
      // A floating temple guardian: articulated armor wings, horned iron mask,
      // rope collar, vermilion banners, bronze rivets, and exposed reactor.
      for(const s of [-1,1]){
        c.save();c.translate(300,240);c.scale(s,1);
        for(let i=0;i<5;i++) {
          const y=-135+i*58,x=75+i*9;
          path(c,[[x,y],[248-i*9,y-40],[280-i*9,y+1],[245-i*9,y+40],[x,y+47]],'#242c37','#111b27',7);
          path(c,[[x+9,y+7],[243-i*9,y-22],[248-i*9,y-3],[x+14,y+25]],'#59606b','#a68b65',2);
          path(c,[[228-i*8,y+3],[270-i*8,y+8],[232-i*8,y+38]],'#a16b47','#e4b879',2);
          ellipse(c,x+25,y+17,8,8,'#cda673','#26252a',3);
        }
        path(c,[[80,80],[155,62],[182,208],[152,183],[132,217],[106,182]],'#882e32','#d47a52',3);
        c.strokeStyle='#e6b778';c.lineWidth=3;c.strokeRect(122,99,21,54);
        c.restore();
      }
      ellipse(c,300,243,132,159,metal(c,80,400) as unknown as string,'#101b29',10);
      ellipse(c,300,290,85,96,'#101c2c','#b18c5a',8);
      for(let a=0;a<12;a++) {const t=a/12*Math.PI*2;ellipse(c,300+Math.cos(t)*103,286+Math.sin(t)*113,5,5,'#d8ad6c');}
      ellipse(c,300,295,61,70,'#162e3a','#527e86',5);
      ellipse(c,300,295,39,47,'#a1f2e2','#f0f4d7',4);
      ellipse(c,300,295,21,30,'#e8fff0');
      path(c,[[207,145],[217,73],[246,92],[260,138],[294,127],[325,138],[347,91],[380,72],[392,148],[363,183],[350,228],[300,252],[245,225],[234,181]],'#b18858','#222630',7);
      path(c,[[224,105],[199,30],[233,43],[262,124]],'#e4bf85','#44393b',5);
      path(c,[[339,122],[372,39],[405,20],[382,109]],'#e4bf85','#44393b',5);
      path(c,[[238,159],[286,170],[273,188],[242,180]],'#142931','#554235',4);
      path(c,[[315,170],[362,155],[355,178],[325,188]],'#142931','#554235',4);
      path(c,[[242,166],[279,174],[273,179],[248,175]],'#e0fff1');
      path(c,[[322,176],[356,163],[351,174],[327,181]],'#e0fff1');
      path(c,[[299,172],[280,207],[300,215],[319,205]],'#6c5644','#edc890',3);
      path(c,[[260,219],[286,230],[318,230],[341,216],[330,246],[302,258],[271,247]],'#1a2028','#d6a871',3);
      for(let i=0;i<5;i++)path(c,[[272+i*13,226],[279+i*11,229],[276+i*12,240]],'#f1d5a6');
      c.beginPath();c.moveTo(189,242);c.bezierCurveTo(220,398,387,399,411,241);c.strokeStyle='#171d24';c.lineWidth=27;c.stroke();c.strokeStyle='#c6ac79';c.lineWidth=19;c.stroke();c.setLineDash([4,12]);c.strokeStyle='#71573f';c.lineWidth=19;c.stroke();c.setLineDash([]);
      for(const x of [225,370]) {path(c,[[x,345],[x+17,350],[x+4,380],[x+17,394],[x,411],[x-13,390],[x-3,375]],'#e8e0c5','#817d71',2);}
      return;
    }
    c.translate(300,250);
    const large=kind==='brute'||kind==='turret';
    for(const s of [-1,1]){
      c.save();c.scale(1,s);
      if(kind==='wing') {
        path(c,[[-100,-24],[30,-155],[155,-165],[90,-75],[170,-31],[58,-35]],'#333641','#b99a67',8);
        path(c,[[-24,-51],[69,-131],[114,-137],[57,-67]],'#95604c','#e4a875',4);
        path(c,[[58,-84],[71,-100],[116,-102],[99,-86]],'#f2d9a8');
      }else if(kind==='drone') {
        path(c,[[-110,-22],[-55,-105],[87,-100],[125,-60],[70,-45],[40,-9]],'#832f3f','#292b34',7);
        path(c,[[-61,-62],[63,-77],[87,-62],[15,-41]],'#d2ac76','#f2d3a0',3);
        c.strokeStyle='#f6d5a0';c.lineWidth=4;c.beginPath();c.moveTo(-47,-54);c.lineTo(32,-61);c.stroke();
      }else{
        path(c,[[-135,-35],[-100,-113],[85,-122],[151,-80],[144,-35]],'#2a3340','#9b7c57',7);
        path(c,[[-104,-62],[-72,-90],[90,-99],[114,-72]],'#647681','#beac84',3);
        for(let j=0;j<4;j++)ellipse(c,-62+j*45,-79,5,5,'#dec389');
      }
      c.restore();
    }
    ellipse(c,10,5,large?128:107,large?74:54,metal(c,-60,78) as unknown as string,'#151c2a',8);
    path(c,[[-130,-30],[-28,-51],[-49,49],[-129,31],[-157,0]],kind==='drone'?'#b65545':'#bba378','#1c2430',6);
    ellipse(c,-89,-2,20,16,'#d04965','#efc79d',4);ellipse(c,-94,-4,9,7,'#fff4d4');
    if(kind==='turret') {
      path(c,[[-153,-24],[-62,-37],[-20,-23],[-20,21],[-154,27]],'#383f46','#c0b68f',6);
      for(let i=0;i<4;i++){c.fillStyle='#101f2a';c.fillRect(-140+i*22,-17,8,33);}
      c.strokeStyle='#9adfc4';c.lineWidth=9;c.beginPath();c.moveTo(-125,1);c.lineTo(-35,1);c.stroke();
    }
    if(kind==='brute') {
      path(c,[[-100,-35],[-129,-85],[-89,-60],[-40,-66],[-12,-110],[14,-59],[40,-45],[8,21],[-51,54],[-98,21]],'#a87853','#151f2b',7);
      path(c,[[-95,-16],[-59,-7],[-72,7]],'#a9f8da');path(c,[[-55,-10],[-24,-24],[-31,0]],'#a9f8da');
    }
    c.strokeStyle='#c1b79b';c.lineWidth=4;c.beginPath();c.moveTo(25,-30);c.lineTo(73,-22);c.lineTo(89,17);c.lineTo(45,31);c.stroke();
    ellipse(c,62,0,17,17,'#162c35','#859b99',4);ellipse(c,62,0,7,7,'#a0e4d1');
    for(let i=0;i<3;i++){c.fillStyle='#222b36';c.fillRect(108+i*11,-17,5,34);}
    const g=c.createLinearGradient(140,0,238,0);g.addColorStop(0,'#f4c47f');g.addColorStop(.4,'#e2645e');g.addColorStop(1,'#e2645e00');
    path(c,[[138,-18],[237,0],[138,18]],g as unknown as string);
  });
}

interface Particle {x:number;y:number;vx:number;vy:number;life:number;max:number;size:number;color:THREE.Color;}
interface Ring {x:number;y:number;life:number;max:number;size:number;color:THREE.Color;}
export class GameRenderer {
  readonly renderer:THREE.WebGLRenderer;
  readonly scene=new THREE.Scene();
  readonly camera=new THREE.OrthographicCamera(0,WIDTH,HEIGHT,0,.1,200);
  private geometry=new THREE.PlaneGeometry(1,1);
  private transform=new THREE.Object3D();
  private heroTextures=new Map<HeroId,THREE.Texture>();
  private hero!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private aura!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private hitCore!:THREE.Mesh;
  private enemies=new Map<number,THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>>();
  private enemyTextures=new Map<EnemyKind,THREE.Texture>();
  private friendly!:THREE.InstancedMesh;
  private threats!:THREE.InstancedMesh;
  private drops!:THREE.InstancedMesh;
  private goldDrops!:THREE.InstancedMesh;
  private healthDrops!:THREE.InstancedMesh;
  private sparks!:THREE.InstancedMesh;
  private rings!:THREE.InstancedMesh;
  private petals!:THREE.InstancedMesh;
  private particles:Particle[]=[];
  private ringData:Ring[]=[];
  private background!:THREE.Mesh;
  private foreground!:THREE.Mesh;
  private moonMist!:THREE.Mesh;
  private special!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private specialMaps=new Map<HeroId,THREE.Texture>();
  private slash!:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private nearLife=0;
  private shake=0;
  private selected:HeroId='rin';
  reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  private elapsed=0;
  private frameTimes:number[]=[];
  private texturePaths:string[]=[];
  constructor(private host:HTMLElement) {
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.setClearColor('#283444');
    this.host.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','천뢰 횡스크롤 전장');
    this.camera.position.z=100;
    this.setup();
    new ResizeObserver(()=>this.resize()).observe(host);this.resize();
  }
  private mesh(texture:THREE.Texture,w:number,h:number,x:number,y:number,z:number,additive=false) {
    const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,depthTest:false,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending});
    const mesh=new THREE.Mesh(this.geometry,material);mesh.scale.set(w,h,1);mesh.position.set(x,HEIGHT-y,z);mesh.renderOrder=z;this.scene.add(mesh);return mesh;
  }
  private instances(texture:THREE.Texture,count:number,z:number,additive=false) {
    const m=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,depthTest:false,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending});
    const mesh=new THREE.InstancedMesh(this.geometry,m,count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;mesh.renderOrder=z;this.scene.add(mesh);return mesh;
  }
  private setInstance(mesh:THREE.InstancedMesh,i:number,x:number,y:number,w:number,h:number,angle:number,color:THREE.Color) {
    this.transform.position.set(x,HEIGHT-y,0);this.transform.rotation.set(0,0,-angle);this.transform.scale.set(w,h,1);this.transform.updateMatrix();mesh.setMatrixAt(i,this.transform.matrix);mesh.setColorAt(i,color);
  }
  private finish(mesh:THREE.InstancedMesh,count:number) {mesh.count=count;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
  private setup() {
    const fallback=canvasTexture(1600,900,c=>{
      const sky=c.createLinearGradient(0,0,0,900);sky.addColorStop(0,'#ac7974');sky.addColorStop(.5,'#444b61');sky.addColorStop(1,'#1e2a3e');c.fillStyle=sky;c.fillRect(0,0,1600,900);
      ellipse(c,1140,235,160,160,'#e9b8a0');
      for(let layer=0;layer<5;layer++){c.beginPath();c.moveTo(0,900);for(let x=0;x<=1650;x+=70)c.lineTo(x,480+layer*80+Math.sin(x*.005+layer*1.2)*100+Math.cos(x*.009)*40);c.lineTo(1650,900);c.fillStyle=['#66647a','#51546c','#414b62','#303c53','#202d43'][layer];c.fill();}
    });
    this.background=this.mesh(fallback,1740,980,800,450,-10);
    const mist=canvasTexture(1600,500,c=>{const g=c.createLinearGradient(0,0,0,500);g.addColorStop(0,'#17243b00');g.addColorStop(.8,'#15223788');g.addColorStop(1,'#152237cc');c.fillStyle=g;c.fillRect(0,0,1600,500);});
    this.moonMist=this.mesh(mist,WIDTH,600,800,600,-8);
    const fg=canvasTexture(2400,700,c=>{
      c.fillStyle='#172432';
      c.beginPath();c.moveTo(0,700);c.lineTo(0,590);for(let x=0;x<=2450;x+=60)c.lineTo(x,578+Math.sin(x*.006)*65+Math.cos(x*.013)*25);c.lineTo(2400,700);c.fill();
      const roof=(x:number,y:number,w:number)=>{
        c.fillStyle='#172633';c.fillRect(x-w*.27,y,w*.54,55);path(c,[[x-w*.62,y+5],[x-w*.36,y-5],[x,y-61],[x+w*.36,y-5],[x+w*.62,y+5],[x+w*.55,y+16],[x,y-9],[x-w*.55,y+16]],'#152332','#81908d',2);
        for(let i=0;i<6;i++){c.fillStyle='#8a674c';c.fillRect(x-w*.22+i*w*.075,y+12,w*.025,32);}
      };
      roof(420,542,200);roof(420,493,165);roof(420,450,133);roof(1740,520,270);roof(1740,460,215);
      for(const x of [925,2120]){c.fillStyle='#3c262b';c.fillRect(x-61,470,14,155);c.fillRect(x+50,470,14,155);path(c,[[x-95,462],[x+97,462],[x+85,478],[x-83,478]],'#6f3832','#c58d69',2);c.fillRect(x-78,497,158,10);}
      for(const [x,y] of [[70,360],[1370,400],[2340,350]]) {
        c.strokeStyle='#172531';c.lineWidth=15;c.beginPath();c.moveTo(x,650);c.bezierCurveTo(x+50,530,x-30,450,x+44,y);c.stroke();
        for(let i=0;i<7;i++){const py=y+40+i*30;ellipse(c,x+28+Math.sin(i*2)*29,py,70+i*5,15,'#172531');}
      }
    });
    this.foreground=this.mesh(fg,2400,700,1200,700,-4);(this.foreground.material as THREE.MeshBasicMaterial).opacity=.14;
    const shot=canvasTexture(128,64,c=>{const g=c.createLinearGradient(0,0,128,0);g.addColorStop(0,'#ffffff00');g.addColorStop(.6,'#ffffffbb');g.addColorStop(1,'#ffffff');path(c,[[0,32],[96,18],[124,32],[96,46]],g as unknown as string);path(c,[[62,32],[99,27],[122,32],[99,37]],'#ffffff');});
    const bullet=canvasTexture(64,64,c=>{const g=c.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'#fff6df');g.addColorStop(.25,'#ffe7b8');g.addColorStop(.37,'#e3385e');g.addColorStop(.6,'#e33c6aaa');g.addColorStop(1,'#e33c6a00');c.fillStyle=g;c.fillRect(0,0,64,64);ellipse(c,32,32,15,15,'#ef6972','#3e152d',2);ellipse(c,32,32,9,9,'#fff4cd');});
    const spark=canvasTexture(64,64,c=>{const g=c.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#ffffff');g.addColorStop(.15,'#ffffffee');g.addColorStop(.5,'#ffffff66');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,64,64);});
    const ring=canvasTexture(256,256,c=>{c.strokeStyle='#ffffff';c.lineWidth=4;c.beginPath();c.arc(128,128,100,0,Math.PI*2);c.stroke();c.strokeStyle='#ffffff66';c.lineWidth=12;c.stroke();});
    const pickup=canvasTexture(96,96,c=>{path(c,[[48,5],[85,26],[85,68],[48,91],[11,68],[11,26]],'#313c48','#fff4c4',4);path(c,[[48,13],[77,30],[77,64],[48,82],[19,64],[19,30]],'#ffe2a0','#fffcdf',2);c.font='bold 45px Georgia';c.textAlign='center';c.fillStyle='#47342f';c.fillText('P',48,65);});
    const petal=canvasTexture(64,64,c=>{path(c,[[4,34],[16,13],[38,9],[60,30],[39,53],[18,50]],'#ecc0ae');c.strokeStyle='#f9d9bf';c.beginPath();c.moveTo(7,34);c.quadraticCurveTo(32,25,57,29);c.stroke();});
    const gold=canvasTexture(96,96,c=>{ellipse(c,48,48,34,34,'#e9b557','#54412d',5);ellipse(c,48,48,26,26,'#e9b557','#ffe7ac',3);path(c,[[48,25],[65,48],[48,71],[31,48]],'#fff0ba','#a96c31',2);});
    const health=canvasTexture(96,96,c=>{path(c,[[48,5],[86,28],[86,68],[48,91],[10,68],[10,28]],'#2a514b','#c3ffe1',4);c.fillStyle='#e0ffe7';c.fillRect(40,23,16,50);c.fillRect(23,40,50,16);});
    this.friendly=this.instances(shot,700,10,true);this.threats=this.instances(bullet,1500,15);this.drops=this.instances(pickup,100,7);this.goldDrops=this.instances(gold,100,7);this.healthDrops=this.instances(health,40,7);this.sparks=this.instances(spark,700,19,true);this.rings=this.instances(ring,70,18,true);this.petals=this.instances(petal,45,-2);
    this.aura=this.mesh(ring,85,85,230,450,8,true);this.aura.material.color.set('#ed786e');
    this.hero=this.mesh(spark,110,155,230,450,9);this.hero.visible=false;
    const core=canvasTexture(64,64,c=>{ellipse(c,32,32,24,24,'#142331','#f9f6d9',4);ellipse(c,32,32,8,8,'#f9ffed');});
    this.hitCore=this.mesh(core,27,27,230,450,16);this.hitCore.visible=false;
    const beam=canvasTexture(1024,256,c=>{const g=c.createLinearGradient(0,0,0,256);g.addColorStop(0,'#ffffff00');g.addColorStop(.35,'#ffffff33');g.addColorStop(.48,'#ffffffff');g.addColorStop(.52,'#ffffffff');g.addColorStop(.65,'#ffffff33');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,1024,256);});
    this.special=this.mesh(beam,1600,320,800,450,17,true);this.special.visible=false;
    this.specialMaps.set('golem',beam);
    this.specialMaps.set('rin',canvasTexture(1024,1024,c=>{
      c.translate(512,512);
      for(let i=0;i<12;i++){
        c.save();c.rotate(i/12*Math.PI*2);
        c.beginPath();c.moveTo(0,25);c.bezierCurveTo(-180,100,-110,330,0,490);c.bezierCurveTo(110,330,180,100,0,25);c.fillStyle='#ffffff10';c.fill();c.strokeStyle='#ffffff99';c.lineWidth=4;c.stroke();
        c.beginPath();c.moveTo(0,100);c.quadraticCurveTo(-45,260,0,410);c.strokeStyle='#ffffff55';c.lineWidth=2;c.stroke();c.restore();
      }
      for(const r of [150,270,300]){c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.strokeStyle='#ffffff77';c.lineWidth=3;c.stroke();}
    }));
    this.specialMaps.set('ryu',canvasTexture(1600,900,c=>{
      for(let i=0;i<6;i++) {
        const x=100+i*280,points:[[number,number],...[number,number][]]=[[x,-20]];
        for(let j=1;j<11;j++)points.push([x+Math.sin(j*7+i*13)*70,j*95]);
        c.beginPath();points.forEach(([px,py],j)=>j?c.lineTo(px,py):c.moveTo(px,py));
        c.strokeStyle='#ffffff15';c.lineWidth=55;c.stroke();c.strokeStyle='#ffffff77';c.lineWidth=13;c.stroke();c.strokeStyle='#ffffffff';c.lineWidth=4;c.stroke();
        for(let j=2;j<9;j+=3){const [px,py]=points[j];c.beginPath();c.moveTo(px,py);c.lineTo(px+92,py+52);c.lineTo(px+40,py+87);c.lineTo(px+143,py+190);c.strokeStyle='#ffffffaa';c.lineWidth=3;c.stroke();}
      }
    }));
    const slash=canvasTexture(256,256,c=>{c.strokeStyle='#ffffff';c.lineWidth=16;c.beginPath();c.ellipse(80,128,110,100,0,-1.3,1.3);c.stroke();c.lineWidth=4;c.strokeStyle='#ffffff88';c.beginPath();c.ellipse(80,128,130,118,0,-1.3,1.3);c.stroke();});
    this.slash=this.mesh(slash,220,220,300,450,18,true);this.slash.visible=false;
  }
  async load(onProgress:(n:number)=>void) {
    let done=0;const loader=new THREE.TextureLoader();
    const tasks=HEROES.map(async h=>{const url=`${import.meta.env.BASE_URL}assets/${h.asset}`;const t=await loader.loadAsync(url);t.colorSpace=THREE.SRGBColorSpace;this.heroTextures.set(h.id,t);this.texturePaths.push(url);onProgress(++done/9);});
    tasks.push((async()=>{const url=`${import.meta.env.BASE_URL}assets/shrine-valley.png`;const t=await loader.loadAsync(url);t.colorSpace=THREE.SRGBColorSpace;(this.background.material as THREE.MeshBasicMaterial).map=t;this.texturePaths.push(url);onProgress(++done/9);})());
    for(const kind of ['drone','wing','turret','brute','boss'] as EnemyKind[])tasks.push((async()=>{const url=`${import.meta.env.BASE_URL}assets/${kind}.png`;const t=await loader.loadAsync(url);t.colorSpace=THREE.SRGBColorSpace;this.enemyTextures.set(kind,t);this.texturePaths.push(url);onProgress(++done/9);})());
    await Promise.all(tasks);
  }
  resize() {const r=this.host.getBoundingClientRect();if(r.width&&r.height)this.renderer.setSize(r.width,r.height,false);}
  select(id:HeroId){this.selected=id;this.hero.material.map=this.heroTextures.get(id)||this.hero.material.map;this.hero.material.needsUpdate=true;}
  event(e:GameEvent,hero:HeroId) {
    const color=new THREE.Color(e.kind==='hurt'?'#ff6381':e.kind==='pickup'?'#ffe3a6':colorOf(hero));
    if(['kill','hurt','charge','ultimate','near','pickup'].includes(e.kind)){
      const count=e.kind==='ultimate'?120:e.kind==='kill'?24:14;
      for(let i=0;i<count&&this.particles.length<650;i++) {
        const angle=i/count*Math.PI*2+(i%3)*.15,velocity=(e.kind==='ultimate'?600:220)*(0.3+(i*37%100)/100);
        const life=.35+(i*13%100)/100*.6;
        this.particles.push({x:e.x,y:e.y,vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity,life,max:life,size:8+(i%5)*5,color});
      }
      this.ringData.push({x:e.x,y:e.y,life:e.kind==='ultimate'?1:.5,max:e.kind==='ultimate'?1:.5,size:e.kind==='ultimate'?1400:160,color});
      if(e.kind==='kill')this.shake=Math.max(this.shake,e.enemy==='boss'?14:2.5);
      if(e.kind==='hurt')this.shake=9;
      if(e.kind==='ultimate')this.shake=10;
      if(e.kind==='near')this.nearLife=.2;
    }
    if(e.kind==='graze'&&this.particles.length<650)this.particles.push({x:e.x,y:e.y,vx:-70,vy:20,life:.2,max:.2,size:20,color:new THREE.Color('#a7f8ed')});
    if(e.kind==='hit'&&this.particles.length<650)for(let i=0;i<2;i++)this.particles.push({x:e.x-20,y:e.y,vx:-70-i*80,vy:i===0?-95:95,life:.13,max:.13,size:15,color:new THREE.Color('#fff1b9')});
  }
  reset(){this.particles=[];this.ringData=[];this.shake=0;this.nearLife=0;this.elapsed=0;this.frameTimes=[];}
  render(state:GameState,dt:number,focus=false,freeze=false) {
    if(!freeze)this.elapsed+=dt;
    const t=this.elapsed,active=state.phase!=='menu';
    if(!freeze){this.shake*=Math.exp(-dt*9);this.nearLife=Math.max(0,this.nearLife-dt);}
    const sh=this.reducedMotion?0:this.shake;
    this.camera.position.x=Math.sin(t*98)*sh;this.camera.position.y=Math.cos(t*83)*sh*.55;
    this.background.position.x=800-Math.sin(t*.018)*45;
    this.foreground.position.x=1200-(t*20)%700;
    for(let i=0;i<38;i++) {
      const x=((i*293-t*(13+i%4*7))%1750+1750)%1750-75,y=((i*187+t*(3+i%5))%1000)-40;
      this.setInstance(this.petals,i,x,y,6+i%4*3,4+i%3*2,t*.2+i,white);
    }this.finish(this.petals,38);
    this.hero.visible=active;
    if(this.selected!==state.hero)this.select(state.hero);
    const p=state.player;
    const ht=this.heroTextures.get(state.hero);
    if(ht&&this.hero.material.map!==ht){this.hero.material.map=ht;this.hero.material.needsUpdate=true;}
    if(ht){const image=ht.image as HTMLImageElement;const aspect=image.width/image.height;const h=state.hero==='golem'?162:160;this.hero.scale.set(h*aspect,h,1);}
    this.hero.position.set(p.x,HEIGHT-p.y+Math.sin(t*5)*2,9);
    this.hero.rotation.z=focus?0:Math.sin(t*3)*.018;
    this.hero.material.opacity=p.invulnerable>0?(Math.sin(t*28)>.2?.4:1):1;
    this.aura.visible=active&&(p.charge>.1||p.ultimateTimer>0||p.invulnerable>0);
    const ar=50+p.charge*60+Math.sin(t*8)*5;
    this.aura.position.set(p.x,HEIGHT-p.y,8);this.aura.scale.set(ar,ar,1);this.aura.rotation.z=t;
    this.aura.material.color.set(colorOf(state.hero));this.aura.material.opacity=.3+Math.min(1,p.charge)*.5;
    this.hitCore.visible=active&&(focus||p.charge>.1);this.hitCore.position.set(p.x,HEIGHT-p.y,16);
    const live=new Set<number>();
    for(const enemy of state.enemies) {
      live.add(enemy.id);let m=this.enemies.get(enemy.id);
      if(!m){m=this.mesh(this.enemyTextures.get(enemy.kind)!,1,1,enemy.x,enemy.y,6);this.enemies.set(enemy.id,m);}
      const w=enemy.kind==='boss'?490:enemy.kind==='brute'?180:enemy.kind==='turret'?170:enemy.kind==='wing'?150:127;
      const img=this.enemyTextures.get(enemy.kind)!.image as HTMLImageElement;
      m.scale.set(w,w*img.height/img.width,1);m.position.set(enemy.x,HEIGHT-enemy.y,6);
      m.rotation.z=enemy.kind==='boss'?Math.sin(t)*.015:Math.sin(enemy.age*3+enemy.seed)*.06;
      m.material.color.set(enemy.flash>0?'#ffffff':'#e4e1de');m.material.opacity=1;
    }
    for(const [id,m] of this.enemies)if(!live.has(id)){this.scene.remove(m);m.material.dispose();this.enemies.delete(id);}
    let friendly=0,threats=0;
    const heroColor=new THREE.Color(colorOf(state.hero));
    for(const b of state.bullets) {
      const enemy=b.kind==='enemy',mesh=enemy?this.threats:this.friendly,index=enemy?threats++:friendly++;
      if(index>=(enemy?1500:700))continue;
      const charge=b.kind==='charge';
      const bw=enemy?Math.max(22,b.r*3.8):charge?88:state.hero==='golem'?64:42;
      const bh=enemy?bw:charge?44:state.hero==='ryu'?21:12;
      this.setInstance(mesh,index,b.x,b.y,bw,bh,enemy?0:Math.atan2(b.vy,b.vx),enemy?white:heroColor);
    }
    this.finish(this.friendly,Math.min(700,friendly));this.finish(this.threats,Math.min(1500,threats));
    const counts={power:0,gold:0,health:0};
    for(const drop of state.pickups){const mesh=drop.kind==='power'?this.drops:drop.kind==='gold'?this.goldDrops:this.healthDrops;if(counts[drop.kind]>=(drop.kind==='health'?40:100))continue;this.setInstance(mesh,counts[drop.kind]++,drop.x,drop.y+Math.sin(drop.age*4)*5,drop.kind==='gold'?27:36,drop.kind==='gold'?27:36,Math.sin(drop.age*2)*.08,white);}
    this.finish(this.drops,counts.power);this.finish(this.goldDrops,counts.gold);this.finish(this.healthDrops,counts.health);
    for(let i=this.particles.length-1;i>=0;i--) {
      const part=this.particles[i];if(!freeze){part.life-=dt;part.x+=part.vx*dt;part.y+=part.vy*dt;part.vx*=Math.exp(-dt*2);part.vy*=Math.exp(-dt*2);}
      if(part.life<=0){this.particles.splice(i,1);continue;}
    }
    for(let i=0;i<this.particles.length;i++){const part=this.particles[i];this.setInstance(this.sparks,i,part.x,part.y,part.size,part.size,0,part.color.clone().multiplyScalar(part.life/part.max));}this.finish(this.sparks,this.particles.length);
    for(let i=this.ringData.length-1;i>=0;i--){if(!freeze)this.ringData[i].life-=dt;if(this.ringData[i].life<=0)this.ringData.splice(i,1);}
    for(let i=0;i<Math.min(70,this.ringData.length);i++){const r=this.ringData[i],progress=1-r.life/r.max,size=20+r.size*progress;this.setInstance(this.rings,i,r.x,r.y,size,size,0,r.color.clone().multiplyScalar((1-progress)*.8));}this.finish(this.rings,Math.min(70,this.ringData.length));
    this.special.visible=p.ultimateTimer>0&&active;
    if(this.special.visible){
      const f=Math.min(1,p.ultimateTimer),map=this.specialMaps.get(state.hero)!;
      if(this.special.material.map!==map){this.special.material.map=map;this.special.material.needsUpdate=true;}
      this.special.material.color.set(colorOf(state.hero));this.special.material.opacity=Math.min(.78,f*.75);
      if(state.hero==='golem'){this.special.position.set(800,HEIGHT-p.y,17);this.special.scale.set(1700,230+Math.sin(t*40)*15,1);this.special.rotation.z=0;}
      else if(state.hero==='ryu'){this.special.position.set(800,450,17);this.special.scale.set(1600,1000,1);this.special.rotation.z=0;this.special.material.opacity*=.75+Math.sin(t*20)*.15;}
      else{const size=800+(3-p.ultimateTimer)*380;this.special.position.set(820,450,17);this.special.scale.set(size,size,1);this.special.rotation.z=t*.15;}
    }
    this.slash.visible=this.nearLife>0;this.slash.position.set(p.x+90,HEIGHT-p.y,18);this.slash.material.color.set(colorOf(state.hero));this.slash.material.opacity=this.nearLife/.2;
    this.renderer.render(this.scene,this.camera);
    if(dt>0){this.frameTimes.push(dt*1000);if(this.frameTimes.length>120)this.frameTimes.shift();}
  }
  diagnostics(state:GameState) {
    return {renderer:this.renderer.info,state:{phase:state.phase,time:state.time,hero:state.hero,score:state.score,enemies:state.enemies.length,bullets:state.bullets.length,player:state.player,assets:this.texturePaths,stats:state.stats},performance:{meanFrameMs:this.frameTimes.reduce((a,b)=>a+b,0)/Math.max(1,this.frameTimes.length),dpr:this.renderer.getPixelRatio(),postPasses:0,shadows:0},physics:{engine:'analytic-circles-and-swept-segments',timestep:1/120,bodies:state.enemies.length+1}};
  }
}
