import * as T from './vendor/three.module.min.js';

const textureCache = new Map();
export function grain(name) {
  if (textureCache.has(name)) return textureCache.get(name);
  const tile = new T.TextureLoader().load(new URL('./assets/'+name+'.webp', import.meta.url).href);
  tile.wrapS = tile.wrapT = T.RepeatWrapping;
  tile.colorSpace = T.SRGBColorSpace;
  tile.anisotropy = 4;
  textureCache.set(name,tile);
  return tile;
}
const UP = new T.Vector3(0,1,0);
const cube = new T.BoxGeometry();
export function pineCrown(seed, compact, snowy = false) {
  const rng=random(seed), positions=[],tints=[];
  const face=(a,b,c,tone)=>{
    positions.push(...a,...b,...c);
    for(const t of [tone*.76,tone*.97,tone]) {
      if (snowy) {
        const coat = T.MathUtils.smoothstep(t, .55, .87);
        tints.push(t*.42 + coat*.46, t*.64 + coat*.25, t*.59 + coat*.35);
      } else tints.push(t*.89,t,t*.94);
    }
  };
  // Branch fans taper in tiers, with a hanging tip on either side of the central spine.
  const tiers=compact?4:5, fans=compact?5:8;
  for(let k=0;k<tiers;k++){
    const y=-.48+k*.84/tiers, r=1-k*.82/tiers;
    for(let i=0;i<fans;i++){
      const a=i*2*Math.PI/fans+k*2.17+rng()*.23,reach=r*(.58+.42*rng());
      const vertex=(angle,radius,h)=>[Math.cos(angle)*radius,h,Math.sin(angle)*radius];
      const center=[0,y+.29+rng()*.08,0], mid=vertex(a,reach*.64,y+.07);
      const left=vertex(a-.25,reach*.89,y-.01),right=vertex(a+.23,reach*.91,y-.06),end=vertex(a,reach,y-.12);
      const tone=.68+rng()*.32;
      face(center,left,mid,tone);face(center,mid,right,tone);face(mid,left,end,tone);face(mid,end,right,tone);
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  g.setAttribute('color',new T.Float32BufferAttribute(tints,3));g.computeVertexNormals();return g;
}
const mat = (color, roughness=.78) => new T.MeshStandardMaterial({color,roughness});
const glow = color => new T.MeshBasicMaterial({color});
export function random(seed) {
  return () => ((seed = (Math.imul(seed,1664525)+1013904223) >>> 0) / 4294967296);
}
export function instances(scene, geometry, material, items) {
  if (!items.length) return;
  const mesh = new T.InstancedMesh(geometry, material, items.length);
  items.forEach((m,i) => mesh.setMatrixAt(i,m));
  mesh.computeBoundingSphere();
  scene.add(mesh);
  return mesh;
}
export function matrix(x,y,z,w,h,d,yaw=0) {
  return new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromAxisAngle(UP,yaw),new T.Vector3(w,h,d));
}
function beam(a,b,w,d=w) {
  const direction = b.clone().sub(a);
  return new T.Matrix4().compose(a.clone().lerp(b,.5),new T.Quaternion().setFromUnitVectors(UP,direction.clone().normalize()),new T.Vector3(w,direction.length(),d));
}
export function pathSamples(course, step = 2) {
  return Array.from({length:Math.ceil(course.length/step)},(_,i)=>course.sample(i*step));
}
export function nearest(x,z,path) {
  let best=Infinity, height=0;
  for (const p of path) {
    const d=(x-p.x)**2+(z-p.z)**2;
    if(d<best){best=d;height=p.y;}
  }
  return {distance:Math.sqrt(best), height};
}
function hash(x,z) {
  const n=Math.sin(x*127.1+z*311.7)*43758.5453;
  return n-Math.floor(n);
}
export function noise(x,z) {
  const i=Math.floor(x),j=Math.floor(z);
  const u=T.MathUtils.smoothstep(x-i,0,1),v=T.MathUtils.smoothstep(z-j,0,1);
  return T.MathUtils.lerp(T.MathUtils.lerp(hash(i,j),hash(i+1,j),u),T.MathUtils.lerp(hash(i,j+1),hash(i+1,j+1),u),v);
}
const ridges=[[-58,-120,78,69],[66,-130,83,73],[-110,16,61,48],[188,-182,107,110],[-167,-186,123,130],[-250,24,129,113],[0,233,100,96],[221,115,144,126],[-137,176,92,102],[74,-231,154,120]];
function foldedRock(x,z) {
  const bend=noise(x*.024,z*.024)*1.7;
  const ridge=1-Math.abs(2*noise(x*.050+bend,z*.087)-1);
  return ridge*ridge*6.4 + noise(x*.16,z*.13)*2.5;
}
function alpineField(x,z,path,width) {
  const bank = nearest(x,z,path);
  const stone = noise(x*.038,z*.038)*8 + noise(x*.12,z*.12)*3.8;
  const gorge = Math.abs(x - (3 + Math.sin((z+66)*.035)*10));
  const lip = T.MathUtils.smoothstep(gorge,15,32);
  let terrain = -32 + (42 + 10*noise(x*.014,z*.014) + stone)*lip;
  let peak=0;
  for(const [px,pz,h,r] of ridges){
    const dist=Math.hypot(x-px,(z-pz)*1.15);
    peak=Math.max(peak,h*Math.max(0,1-dist/r));
  }
  terrain+=peak*(.72+.19*noise(x*.036,z*.036)) + stone*.4 + foldedRock(x,z);
  const approach = T.MathUtils.smoothstep(bank.distance,width+2,width+20);
  const shoulder = bank.height-2.15 - (1-lip)*68;
  return T.MathUtils.lerp(shoulder,terrain,approach);
}
function distantAlps(scene,compact) {
  const geo=new T.PlaneGeometry(510,690,compact?52:78,compact?80:115);
  geo.rotateX(-Math.PI/2);
  const pos=geo.attributes.position, colors=[];
  const granite=new T.Color(0x47546a), shadow=new T.Color(0x354151), ice=new T.Color(0xf5e9da);
  const crags=[[-319,-214,173,117],[-395,-150,196,134],[-368,-60,160,113],
    [-417,8,202,142],[-352,76,168,112],[-329,172,153,128],[-443,239,187,136]];
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i)-385,z=pos.getZ(i)-48;
    let height=-14;
    for(const [cx,cz,h,span] of crags){
      const dx=x-cx,dz=z-cz;
      height=Math.max(height,h*(1-Math.hypot(dx+dz*.29,dz*1.14)/span));
    }
    pos.setXYZ(i,x,height+foldedRock(x*.67,z*.67)*2.3+9*noise(x*.038,z*.046),z);
  }
  geo.computeVertexNormals();
  const normal=geo.attributes.normal;
  const tint=new T.Color();
  for(let i=0;i<pos.count;i++){
    const pocket=noise(pos.getX(i)*.08,pos.getZ(i)*.095);
    const snow=T.MathUtils.smoothstep(normal.getY(i)*1.28+normal.getZ(i)*.14+pos.getY(i)*.004+pocket*.19,.99,1.25);
    tint.copy(shadow).lerp(granite,pocket).lerp(ice,snow);
    colors.push(tint.r,tint.g,tint.b);
  }
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  scene.add(new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:.98})));
}
// The old gallery curves around the south wall beside the jump.
function alpineGallery(scene) {
  const deck=[], concrete=[], rails=[], lamps=[];
  const curve=new T.CatmullRomCurve3([[49,39,-34],[31,39,-41],[12,38,-45],[-7,36,-43],[-24,34,-36],[-42,31,-29]].map(v=>new T.Vector3(...v)));
  const points=curve.getSpacedPoints(36);
  for(let i=0;i<points.length-1;i++) {
    const a=points[i],b=points[i+1],mid=a.clone().lerp(b,.5);
    const yaw=Math.atan2(b.x-a.x,b.z-a.z),span=a.distanceTo(b)+.10;
    const side=new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
    deck.push(matrix(mid.x,mid.y,mid.z,5.2,.8,span,yaw));
    for(const sign of [-1,1]) {
      const edge=mid.clone().addScaledVector(side,sign*2.45);
      concrete.push(matrix(edge.x,edge.y+.54,edge.z,.31,.32,span,yaw));
      const post=a.clone().addScaledVector(side,sign*2.45);
      rails.push(matrix(post.x,post.y+1.1,post.z,.10,1.24,.10,yaw));
      for(const rise of [.98,1.63]) rails.push(matrix(edge.x,edge.y+rise,edge.z,.08,.08,span+.05,yaw));
      if(i%6===0) lamps.push(matrix(post.x,post.y+1.74,post.z,.14,.14,.14,yaw));
      if(i%5===2) {
        const pier=mid.clone().addScaledVector(side,sign*1.55);
        concrete.push(matrix(pier.x,(mid.y-29)*.5,pier.z,1.12,mid.y+29,1.46,yaw));
      }
    }
    if(i%5===2) concrete.push(matrix(mid.x,mid.y-.85,mid.z,5,1.12,1.78,yaw));
  }
  instances(scene,cube,mat(0x555352),deck);
  instances(scene,cube,new T.MeshStandardMaterial({color:0xa9a496,map:grain('concrete-grain'),roughness:.88}),concrete);
  instances(scene,cube,new T.MeshStandardMaterial({color:0xb4b2a4,metalness:.52,roughness:.42}),rails);
  instances(scene,cube,glow(0xffda90),lamps);
}
export function alpine(scene,course,time) {
  const path=pathSamples(course), rng=random(419);
  const compact=matchMedia('(pointer:coarse), (max-width:800px)').matches;
  distantAlps(scene,compact);
  alpineGallery(scene);
  const resolution=compact?142:192;
  const geo=new T.PlaneGeometry(580,580,resolution,resolution);
  geo.rotateX(-Math.PI/2);
  const positions=geo.attributes.position;
  const colors=new Float32Array(positions.count*3);
  const heights=new Float32Array(positions.count);
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),z=positions.getZ(i);
    heights[i]=alpineField(x,z,path,course.halfWidth);
    positions.setY(i,heights[i]);
  }
  geo.computeVertexNormals();
  const base=new T.Color(), rock=new T.Color(0x818187), grass=new T.Color(0x849161), snow=new T.Color(0xe2e8e8);
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),z=positions.getZ(i),y=heights[i],normal=geo.attributes.normal.getY(i);
    const breakup=noise(x*.1,z*.1);
    const stratum=Math.sin(y*1.15+x*.13+z*.08);
    base.copy(rock).lerp(grass,T.MathUtils.smoothstep(normal,.72,.96)*.8)
      .multiplyScalar(.67+.34*breakup+.10*stratum)
      .lerp(snow,T.MathUtils.smoothstep(y+breakup*16+(normal-.65)*82,68,87));
    base.toArray(colors,i*3);
    geo.attributes.uv.setXY(i,(x*.82+z*.58)/11,(y*.89+z*.56-x*.32)/11);
  }
  geo.setAttribute('color',new T.BufferAttribute(colors,3));
  const terrain=new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:.99,map:grain('slate-rock')}));
  terrain.material.onBeforeCompile=shader=>{
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>', `
      vec3 grit=texture2D(map,vMapUv).rgb;
      float rock=dot(grit,vec3(.299,.587,.114));
      float fissure=texture2D(map,vMapUv*.31+vec2(.31,.47)).g;
      diffuseColor.rgb*=.80+fissure*1.05;
      diffuseColor.rgb*=.76+rock*2.15;
    `);
  };
  terrain.userData.distant=true;
  scene.add(terrain);
  canyonSpurs(scene,course,path);
  const river=[],ripple=[],vapor=[];
  for(let z=-190;z<=185;z+=3){
    const center=3+Math.sin((z+66)*.035)*10;
    const next=3+Math.sin((z+69)*.035)*10;
    river.push(matrix(center,-24.5,z,11+2*noise(z*.05,2),.3,4,-Math.atan2(next-center,3)));
    if(rng()>.25) ripple.push(matrix(center+(rng()-.5)*6,-24.33,z,.18+rng()*.62,.025,.9+rng()*2.3,rng()*.4));
    if(z>-145 && z<35 && rng()>.19) vapor.push(matrix(center+(rng()-.5)*19,-7+rng()*22,z,22+rng()*20,6+rng()*7,1,Math.PI/2+(rng()-.5)*.8));
  }
  instances(scene,cube,mat(0x427679,.28),river);
  instances(scene,cube,mat(0xb2bdaf),ripple);
  const mist=new T.ShaderMaterial({
    uniforms:{uTime:time},transparent:true,depthWrite:false,side:T.DoubleSide,forceSinglePass:true,
    vertexShader:`varying vec2 vUv; varying vec3 place;
      void main(){vUv=uv;vec4 p=instanceMatrix*vec4(position,1.0);place=p.xyz;gl_Position=projectionMatrix*modelViewMatrix*p;}`,
    fragmentShader:`uniform float uTime; varying vec2 vUv; varying vec3 place;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.545);}
      float n(vec2 p){vec2 f=fract(p);f=f*f*(3.-2.*f);vec2 i=floor(p);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y);}
      void main(){float mask=max(0.,1.-dot(vUv*2.-1.,vUv*2.-1.));
        vec2 p=vec2(place.z+place.x*.2,place.y);p.x+=uTime*.46;float cloud=n(p*.32)*.48+n(p*.095)*.52;
        gl_FragColor=vec4(.70,.75,.76,mask*mask*smoothstep(.22,.67,cloud)*.62);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  instances(scene,new T.PlaneGeometry(),mist,vapor);
  const needles=[],trunks=[];
  for(let i=0;i<(compact?1020:1670);i++){
    const x=(rng()-.5)*340,z=(rng()-.5)*330;
    if(nearest(x,z,path).distance<course.halfWidth+4) continue;
    const y=alpineField(x,z,path,course.halfWidth),h=2.2+rng()*6;
    if(y<2 || y>59 || noise(x*.034,z*.034)<.30) continue;
    trunks.push(matrix(x,y+.24*h,z,.06*h,.6*h,.06*h));
    needles.push(matrix(x,y+.57*h,z,.25*h,.90*h,.25*h,rng()*6));
  }
  instances(scene,cube,mat(0x584941),trunks);
  instances(scene,pineCrown(1389,compact),new T.MeshStandardMaterial({color:0x567063,vertexColors:true,side:T.DoubleSide}),needles);
  const steel=[],struts=[];
  for(const gap of course.gaps || []){
    for(const [end,sign] of [[gap.start,-1],[gap.end,1]]){
      for(const side of [-1,1]){
        for(let i=0;i<4;i++){
          const d=end+sign*(2+i*4);
          const top=course.point(d,side*(course.halfWidth-.8),-.8);
          const bottom=top.clone();bottom.y-=8+i*.8;
          steel.push(beam(top,bottom,.65));
          if(i<3){
            const next=course.point(d+sign*4,side*(course.halfWidth-.8),-.8);
            struts.push(beam(bottom,next,.34));
            struts.push(beam(bottom,next.clone().add(new T.Vector3(0,-8-(i+1)*.8,0)),.44));
          }
        }
      }
    }
  }
  instances(scene,cube,new T.MeshStandardMaterial({color:0xc3b9aa,map:grain('concrete-grain')}),steel);
  instances(scene,cube,mat(0x535966),struts);
}
function canyonSpurs(scene, course, path) {
  const rng=random(7648), spurs=[], positions=[],colors=[],uvs=[];
  const ring=Array.from({length:9},(_,i)=>[Math.cos(i*.698)*(.74+rng()*.24),Math.sin(i*.698)*(.72+rng()*.28)]);
  const levels=[[-.50,.88],[-.22,.96],[.18,.96],[.40,.67],[.50,.36]];
  const rings=levels.map(([y,r])=>ring.map(([x,z])=>[x*r+y*.25,y+(rng()-.5)*.09,z*r+y*.14]));
  function face(a,b,c,tone){
    positions.push(...a,...b,...c);
    for(const v of [a,b,c]){
      colors.push(tone*.99,tone,tone*.98);
      uvs.push(v[0]+v[2]*.6,v[1]*3.2+v[0]*.23);
    }
  }
  for(let j=0;j<4;j++)for(let i=0;i<9;i++){
    const next=(i+1)%9, tone=.68+rng()*.30;
    face(rings[j][i],rings[j+1][i],rings[j][next],tone);
    face(rings[j][next],rings[j+1][i],rings[j+1][next],tone+.04);
    if(j===3)face([0,.52,0],rings[4][next],rings[4][i],tone+.1);
  }
  const geo=new T.BufferGeometry();
  for(const [name,data,size] of [['position',positions,3],['color',colors,3],['uv',uvs,2]]){
    geo.setAttribute(name,new T.Float32BufferAttribute(data,size));
  }
  geo.computeVertexNormals();
  for(let i=0;i<2480;i++){
    const x=(rng()-.5)*282,z=(rng()-.5)*266;
    const proximity=nearest(x,z,path);
    if(proximity.distance<course.halfWidth+8)continue;
    const y=alpineField(x,z,path,course.halfWidth);
    const gradient=Math.max(Math.abs(alpineField(x+2,z,path,course.halfWidth)-y),
      Math.abs(alpineField(x,z+2,path,course.halfWidth)-y))*.5;
    if(gradient<.49 || y < -22 || noise(x*.064,z*.054)<.34)continue;
    const h=1.7+rng()*4.8+Math.min(gradient,2)*1.7;
    const m=matrix(x,y-.35*h,z,h*(.16+rng()*.16),h,h*(.62+rng()*.62),rng()*.45-.6);
    spurs.push(m);
  }
  const material=new T.MeshStandardMaterial({color:0x87878a,vertexColors:true,map:grain('slate-rock'),roughness:.93,side:T.DoubleSide});
  material.onBeforeCompile=shader=>{
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
      float grit=texture2D(map,vMapUv).r;
      diffuseColor.rgb*=.66+2.35*grit;
    `);
  };
  instances(scene,geo,material,spurs);
}

function facade(rng,palette) {
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;
  const g=canvas.getContext('2d');
  g.fillStyle='#111e30';g.fillRect(0,0,256,512);
  for(let row=0;row<48;row++){
    for(let col=0;col<16;col++){
      const x=col*16,y=row*10.667;
      g.fillStyle=rng()<.52 ? palette[Math.floor(rng()*palette.length)] : '#243548';
      g.fillRect(x+2,y+2,12,6);
      g.fillStyle='rgba(9,19,31,.55)';g.fillRect(x+8,y+2,1,6);
    }
  }
  const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;
  return new T.MeshBasicMaterial({map:t});
}
export function metropolis(scene,course) {
  const rng=random(912),path=pathSamples(course), bodies=[[],[]], caps=[],trim=[[],[]], podiums=[],antennae=[];
  for(let i=-10;i<=10;i++) for(let j=-10;j<=10;j++){
    const x=i*19+(rng()-.5)*7,z=j*19+(rng()-.5)*7,w=9+rng()*7,d=9+rng()*7;
    const road=nearest(x,z,path);
    if(road.distance<course.halfWidth+Math.hypot(w,d)/2+3) continue;
    const h=10+Math.pow(rng(),1.7)*66 + (road.distance>85?12:0), m=rng()>.5?1:0, y=-3;
    bodies[m].push(matrix(x,y+h/2,z,w,h,d));
    podiums.push(matrix(x,y+1.6,z,w+1.8,3.2,d+1.8));
    caps.push(matrix(x,y+h+.3,z,w+.3,.6,d+.3));
    if(i%3===0 || j%4===0){
      const crown=2+rng()*6;
      bodies[m].push(matrix(x,y+h+crown/2,z,w*.77,crown,d*.76));
      caps.push(matrix(x,y+h+crown,z,w*.79,.35,d*.78));
      antennae.push(matrix(x+w*.12,y+h+crown+2,z,.12,4,.12));
      trim[m].push(matrix(x,y+h-.36,z,w+.06,.22,d+.07));
      if(h>35) trim[m].push(matrix(x-w*.5-.03,y+h*.55,z-d*.46,.14,h*.85,.17));
    }
  }
  for(const [i,palette] of ['#52748b #405a73 #93c4cb #8d8876','#6d728f #5b627e #e1b090 #9294a2'].entries()){
    // A dark roof closes each lit facade at its skyline silhouette.
    instances(scene,cube,facade(rng,palette.split(' ')),bodies[i]);
    instances(scene,cube,glow(i?0xfd7696:0x67daf5),trim[i]);
  }
  instances(scene,cube,mat(0x1d293a),caps);
  instances(scene,cube,mat(0x344451),podiums);
  instances(scene,cube,mat(0x50637b),antennae);
  instances(scene,cube,mat(0x141c29),[matrix(0,-3.4,0,760,.4,760)]);
  stationSigns(scene,course);
}
function stationSigns(scene,course){
  const framePosts=[],frames=[],rim=[],feet=[];
  const faces=[[],[]];
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;
  const g=canvas.getContext('2d');
  g.fillStyle='#172b3b';g.fillRect(0,0,1024,256);
  for(let i=0;i<2;i++){
    const x=i*512;
    const gradient=g.createLinearGradient(x,0,x+512,256);
    gradient.addColorStop(0,i?'#3d1638':'#103746');
    gradient.addColorStop(1,i?'#8f3453':'#176373');
    g.fillStyle=gradient;g.fillRect(x,0,512,256);
    g.fillStyle=i?'#ed8491':'#73e2dc';g.fillRect(x,0,10,256);g.fillRect(x+28,180,450,3);
    g.fillStyle='#dce8ea';g.font='700 68px Arial,sans-serif';g.fillText(i?'자정선':'도심 순환',x+29,118);
    g.font='bold 25px Arial,sans-serif';g.fillText(i?'MIDNIGHT  /  TRANSIT':'METRO  /  CENTRAL',x+30,162);
    g.fillStyle=i?'#ffa1a9':'#88e8e3';g.font='18px monospace';g.fillText(i?'NIGHT SERVICE     M—02':'CIRCULAR EXPRESS  M—01',x+30,218);
  }
  const atlas=new T.CanvasTexture(canvas);atlas.colorSpace=T.SRGBColorSpace;atlas.anisotropy=4;
  for(let d=41,i=0;d<course.length;d+=89,i++){
    const side=i%2?1:-1, lane=side*(course.halfWidth+3.6),f=course.frame(d,lane,4.9);
    const yaw=f.rotation.y+Math.PI+side*.22;
    faces[i%2].push(matrix(f.position.x,f.position.y,f.position.z,4.9,2.25,1,yaw));
    const out=new T.Vector3(Math.sin(yaw),0,Math.cos(yaw));
    const center=f.position.clone().addScaledVector(out,-.15);
    frames.push(matrix(center.x,center.y,center.z,5.12,2.45,.20,yaw));
    rim.push(matrix(center.x,center.y+1.21,center.z,5.12,.06,.24,yaw));
    const foot=course.point(d,lane,-2);
    framePosts.push(beam(foot,center,.22));
    feet.push(matrix(foot.x,foot.y+.4,foot.z,1.15,.8,1.15,yaw));
  }
  const faceMat=new T.MeshBasicMaterial({map:atlas});
  for(let i=0;i<2;i++){
    const g=new T.PlaneGeometry();
    const uv=g.attributes.uv;
    for(let n=0;n<uv.count;n++) uv.setX(n,(i+uv.getX(n))*.5);
    instances(scene,g,faceMat,faces[i]);
  }
  instances(scene,cube,mat(0x23343f),frames);
  instances(scene,cube,mat(0x536674),framePosts);
  instances(scene,cube,mat(0x55626a),feet);
  instances(scene,cube,glow(0x9cd3e0),rim);
}
export function coastalBridge(scene){
  const piers=[],girders=[],stays=[],lamps=[];
  // Coastal viaduct across the bay, seen through successive parallax layers.
  const p=(x,y,z)=>new T.Vector3(x,y,z);
  girders.push(matrix(164,6,-16,8,1.05,230));
  for(let z=-128;z<=99;z+=14){
    piers.push(matrix(164,-1.27,z,2.1,13.5,1.85));
    girders.push(matrix(164,5.15,z,7.7,.8,2.15));
  }
  for(const z of [-49,31]){
    for(const s of [-1,1]){
      const foot=p(164+s*4.8,-8,z),head=p(164+s*.75,32,z);
      piers.push(beam(foot,head,1.45,2.1));
      for(let i=1;i<=7;i++) for(const side of [-1,1]){
        const anchor=p(164+s*3.85,6.6,z+side*(4.5+i*4.4));
        stays.push(beam(anchor,p(164+s*1.0,21+i*1.45,z),.115));
      }
    }
    girders.push(matrix(164,29,z,3.9,.9,2.1));
    lamps.push(matrix(164,32.15,z,1.7,.25,1.7));
  }
  instances(scene,cube,mat(0xc0ada0),piers);
  instances(scene,cube,mat(0x56606e),girders);
  instances(scene,cube,mat(0xf7dfc3),stays);
  instances(scene,cube,glow(0xff7655),lamps);
}
export function roadFurniture(scene,course,theme){
  const poles=[],lenses=[],pads=[],brackets=[],stripes=[], hazard=[];
  const night=theme==='metro';
  const w=course.halfWidth;
  for(let d=5;d<course.length;d+= night ? 18 : 29){
    if(course.gaps?.some(g=>d>g.start-1 && d<g.end+1))continue;
    for(const side of [-1,1]){
      const p=course.point(d,side*(w+.84),0),h=night?6.9:1.05;
      const top=p.clone().addScaledVector(UP,h);
      poles.push(beam(p,top,night?.16:.13));
      if(night){
        const arm=course.point(d,side*(w-1.15),h+.15);
        poles.push(beam(top,arm,.12));
        lenses.push(beam(arm,course.point(d,side*(w-1.89),h+.12),.20,.29));
      } else lenses.push(beam(top,top.clone().addScaledVector(UP,-.23),.15));
    }
  }
  for(const gap of course.gaps||[]){
    for(const [lip,dir] of [[gap.start,-1],[gap.end,1]]){
      // Paint a worn ivory base across the complete deck cut under the amber markings.
      const verts=[], tex=[];
      for(const side of [-1,1]){
        for(const offset of [.13,1.65]){
          const p=course.point(lip+dir*offset,side*(w-.68),.034);
          verts.push(p.x,p.y,p.z);
          tex.push(side*w/5,offset/5);
        }
      }
      const paint=new T.BufferGeometry();
      paint.setAttribute('position',new T.Float32BufferAttribute(verts,3));
      paint.setAttribute('uv',new T.Float32BufferAttribute(tex,2));
      paint.setIndex([0,1,2,1,3,2]);
      paint.computeVertexNormals();
      const stripe=new T.MeshStandardMaterial({color:0xffe6b6,map:grain('concrete-grain'),roughness:.88,side:T.DoubleSide});
      scene.add(new T.Mesh(paint,stripe));
      const d=lip+dir*.77;
      for(let lane=-w+.75;lane<w-.45;lane+=1.18){
        const a=course.point(d-.61,lane-.32,.105),b=course.point(d+.61,lane+.32,.105);
        hazard.push(beam(a,b,.54,.10));
      }
      for(let i=0;i<5;i++){
        const d=lip+dir*(1.5+i*3.6);
        for(const side of [-1,1]){
          const p=course.point(d,side*(w+.42),.8);
          const q=course.point(d,side*(w+.42),i===0?4.45:1.65);
          brackets.push(beam(p,q,.28));
          pads.push(beam(q,q.clone().addScaledVector(UP,-.6),.34));
          if(dir<0 && i%2===0){
            const a=course.point(d,side*(w-1),.075),b=course.point(d+.85,side*2.4,.075);
            stripes.push(beam(a,b,.19,.14));
          }
        }
      }
    }
  }
  instances(scene,cube,mat(night?0x324259:0x61676b),poles);
  instances(scene,cube,glow(night?0xc5ebff:0xffc077),lenses);
  instances(scene,cube,mat(0x392e2a),brackets);
  instances(scene,cube,glow(0xffb044),pads);
  instances(scene,cube,mat(0xffb335),stripes);
  instances(scene,cube,mat(0xf4af40),hazard);
  bendSigns(scene, course, night);
}

function bendSigns(scene, course, night) {
  const bodies = [], brackets = [], faces = [[], []];
  const width = course.halfWidth;
  for (let d = 11; d < course.length; d += 8.5) {
    const { curve } = course.sample(d + 2);
    if (Math.abs(curve) < .036 || course.gaps.some(g => d > g.start - 15 && d < g.end + 9)) continue;
    const side = Math.sign(curve);
    const base = course.point(d, side * (width + .73), .24);
    const face = course.point(d, side * (width + .73), 1.45);
    const { dx, dz } = course.sample(d);
    const yaw = Math.atan2(dx, dz) + Math.PI + side * .27;
    const mount = face.clone().addScaledVector(new T.Vector3(Math.sin(yaw), 0, Math.cos(yaw)), -.048);
    brackets.push(beam(base, face, .094));
    bodies.push(matrix(mount.x, mount.y, mount.z, 1.28, .67, .07, yaw));
    faces[side < 0 ? 1 : 0].push(matrix(face.x, face.y, face.z, 1.23, .62, 1, yaw));
  }
  instances(scene, cube, mat(0x4e5659), brackets);
  instances(scene, cube, mat(0x30393e), bodies);
  for (const [index, items] of faces.entries()) {
    if (!items.length) continue;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const g = canvas.getContext('2d');
    g.fillStyle = night ? '#dbebce' : '#ffd180';
    g.fillRect(0, 0, 128, 64);
    if (index === 0) {
      g.translate(128, 0);
      g.scale(-1, 1);
    }
    g.fillStyle = '#262a29';
    g.beginPath();
    g.moveTo(30, 11);
    g.lineTo(67, 11);
    g.lineTo(101, 32);
    g.lineTo(67, 53);
    g.lineTo(30, 53);
    g.lineTo(64, 32);
    g.closePath();
    g.fill();
    const map = new T.CanvasTexture(canvas);
    map.colorSpace = T.SRGBColorSpace;
    instances(scene, new T.PlaneGeometry(), new T.MeshBasicMaterial({ map }), items);
  }
}
