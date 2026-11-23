import * as T from './vendor/three.module.min.js';

export function buildJunctions(scene, course, kit) {
  if (!course.shortcuts.length) return;
  const {strip,block,surface,placard,grain,batch} = kit;
  const steel = surface(0x596574,.34), beam = surface(0x313d48,.63);
  const concrete = surface(0x8d8781,.8);
  concrete.map = grain('concrete-grain');
  const amber = new T.MeshBasicMaterial({color:0xffac35,side:T.DoubleSide});
  const chalk = surface(0xe0d9bd,.7);
  const foliage = surface(0x263c32,.92);
  const warmLens = new T.MeshBasicMaterial({color:0xffdb9e});
  const asphalt = surface(course.id==='metro'?0x847e82:0xa7a19a,.55);
  asphalt.map = grain(course.id==='metro'?'wet-asphalt':'asphalt-grain');
  asphalt.side = concrete.side = steel.side = T.DoubleSide;
  const fixtures = new Map();
  const mainSamples = Array.from({length:Math.ceil(course.length/2)},(_,i)=>course.sample(i*2));
  function member(mat,a,b,w,depth=w) {
    if(!fixtures.has(mat)) fixtures.set(mat, []);
    const delta=b.clone().sub(a);
    const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize());
    fixtures.get(mat).push({position:a.clone().lerp(b,.5),rotation:new T.Euler().setFromQuaternion(q),scale:[w,delta.length(),depth]});
  }
  function sign(path, d, lateral, h, label, w, height, bg, fg) {
    const p=path.sample(d), obj=placard(label,w,height,bg,fg);
    obj.position.copy(path.point(d,lateral,h));
    obj.rotation.y=Math.atan2(p.dx,p.dz)+Math.PI;
    scene.add(obj);
  }
  function marinaGuide(distance, lane, exit) {
    const canvas=document.createElement('canvas');
    canvas.width=640;canvas.height=224;
    const ctx=canvas.getContext('2d');
    const finish=ctx.createLinearGradient(0,0,0,224);
    finish.addColorStop(0,'#244648');finish.addColorStop(1,'#102d31');
    ctx.fillStyle=finish;ctx.fillRect(0,0,640,224);
    ctx.strokeStyle='#b9cacc';ctx.lineWidth=4;
    ctx.strokeRect(9,9,622,206);
    ctx.fillStyle='#f1f5e7';ctx.textBaseline='middle';
    ctx.font='bold 98px sans-serif';ctx.fillText(exit?'↗':'↑',28,111);
    ctx.font='bold 64px sans-serif';ctx.fillText(exit?'한강 마리나':'센트럴시티',138,92);
    ctx.font='32px sans-serif';ctx.fillStyle='#bfd3d0';
    ctx.fillText(exit?'Hangang Marina':'Central City',140,162);
    const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
    const panel=new T.Mesh(new T.PlaneGeometry(4.6,1.61),new T.MeshBasicMaterial({map}));
    panel.position.copy(course.point(distance,lane,6.42));
    panel.rotation.y=course.frame(distance).rotation.y+Math.PI;
    scene.add(panel);
  }
  for (const route of course.shortcuts) {
    const w=route.halfWidth;
    const side=Math.sign(route.entryLane);
    strip(route,scene,asphalt,-w,w,0,0,.7);
    strip(route,scene,concrete,-w,w,-.44,-.44,1);
    for(const edge of [-1,1]) {
      const g=edge*w;
      strip(route,scene,concrete,g,g,-.44,0,.9);
      const joined=d=>d<(edge===side?11:25)||d>route.length-(edge===side?12:25);
      strip(route,scene,concrete,g-edge*.18,g-edge*.18,.02,.45,.8,joined);
      strip(route,scene,concrete,g-edge*.18,g+edge*.05,.45,.45,.8,joined);
      strip(route,scene,steel,g-edge*.08,g+edge*.06,.82,.82,.9,joined);
      strip(route,scene,steel,g-edge*.08,g-edge*.08,.70,.82,.9,joined);
      strip(route,scene,chalk,g-edge*.33,g-edge*.23,.019,.019,.8);
      for(let d=12;d<route.length-10;d+=3.4) {
        if(joined(d))continue;
        member(steel,route.point(d,g,.4),route.point(d,g,.79),.095);
        if(Math.floor(d/3.4)%2===0)member(amber,route.point(d,g-edge*.19,.34),route.point(d+.46,g-edge*.19,.34),.081);
      }
    }
    // A pair of inclined stripes makes an arrow painted flush with the bridge.
    for(let d=5;d<route.length-5;d+=17) {
      for(const e of [-1,1])member(amber,route.point(d,e*1.13,.04),route.point(d+1.42,0,.04),.15,.15);
    }
    for(let d=24;d<route.length-20;d+=18) {
      const p=route.point(d,0,-.45);
      if (mainSamples.some(row=>Math.hypot(row.x-p.x,row.z-p.z)<course.halfWidth+2)) continue;
      member(concrete,new T.Vector3(p.x,-5,p.z),p,.92,1.2);
      member(beam,route.point(d,-w+.13,-.56),route.point(d,w-.13,-.56),.46,.46);
    }
    const portal=23;
    for(const e of [-1,1])member(beam,route.point(portal,e*(w+.14),0),route.point(portal,e*(w+.14),4.9),.22);
    member(steel,route.point(portal,-w-.4,4.7),route.point(portal,w+.4,4.7),.24);
    sign(route,portal-.2,0,4.46,'❯❯  SHORTCUT',4.85,.92,'#271c15','#ffc658');
    // Highway signs are repeated in advance of the gate, high enough to read over rivals.
    const metro=course.id==='metro';
    const d=route.start-(metro?3:35), span=course.halfWidth+1.2;
    for(const e of [-1,1])member(steel,course.point(d,e*span,0),course.point(d,e*span,6.55),.33);
    for(const h of [5.5,6.6])member(beam,course.point(d,-span,h),course.point(d,span,h),.21);
    for(let l=-span;l<span-1;l+=1.5)member(steel,course.point(d,l,5.5),course.point(d,l+1.4,6.6),.083);
    if(metro) {
      for(const e of [-1,1]) {
        const lane=e*span;
        member(concrete,course.point(d,lane,-.18),course.point(d,lane,1.03),.65,.78);
        member(steel,course.point(d+.6,lane,.12),course.point(d+.6,lane,6.72),.19);
        for(const h of [2,4.1,6.3])member(steel,course.point(d,lane,h),course.point(d+.6,lane,h+.41),.10);
      }
      member(beam,course.point(d+.6,-span,6.63),course.point(d+.6,span,6.63),.18);
      marinaGuide(d-.48,-side*2.43,false);
      marinaGuide(d-.48,side*2.43,true);
    } else {
      sign(course,d-.25,-side*3.1,5.94,'↑  외해 순환로',4.9,1.12,'#103c39','#e4f1e9');
      sign(course,d-.25,side*3.1,5.94,'↖  해상 정비교',4.9,1.12,'#103c39','#e4f1e9');
    }
    for(let n=0;n<4;n++){
      const d=route.start-17+n*4;
      member(amber,course.point(d,route.entryLane-side*.8,.045),course.point(d+1.55,route.entryLane,.045),.14);
    }
  }
  if(course.id==='metro') {
    let resolveFacade;
    scene.userData.junctionReady = new Promise(resolve => { resolveFacade = resolve; });
    const facade=new T.TextureLoader().load(new URL('./assets/marina-cafe.webp',import.meta.url).href,
      () => resolveFacade(true), undefined, () => resolveFacade(false));
    facade.colorSpace=T.SRGBColorSpace;facade.anisotropy=4;
    const glass=new T.MeshBasicMaterial({map:facade,side:T.DoubleSide,color:0xe1d1bc});
    const warm=new T.MeshBasicMaterial({color:0xffdfa1});
    const d0=course.shortcuts[0].start;
    const waterfrontSide=Math.sign(course.shortcuts[0].entryLane);
    const railLane=(course.halfWidth+.52)*waterfrontSide;
    for(let d=d0-109;d<d0-6;d+=5.6) {
      member(beam,course.point(d,railLane,.46),course.point(d+.87,railLane,.46),.21,.19);
      const lensLane=railLane-.101*waterfrontSide;
      member(warmLens,course.point(d+.12,lensLane,.46),course.point(d+.75,lensLane,.46),.092,.065);
    }
    for(let d=d0-108;d<d0-2;d+=12.8) {
      const g=new T.Group(), f=course.frame(d,-14.5);
      g.position.copy(f.position);g.rotation.y=f.rotation.y;scene.add(g);
      block(g,concrete,0,2.1,0,5.8,6.3,12.62);
      const window=new T.Mesh(new T.PlaneGeometry(12.24,3.85),glass);
      // Local -X is the driver's right when the group's +Z follows the road.
      window.position.set(-2.94,2.0,0);window.rotation.y=-Math.PI/2;g.add(window);
      block(g,beam,-3.25,4.18,0,1.28,.22,12.76);
      block(g,warm,-3.88,4.05,0,.05,.075,10.8);
      block(g,concrete,-3.2,5.53,0,2.3,.39,12.75);
      for(const z of [-5,0,5])block(g,steel,-4.15,6.02,z,.10,.8,.11);
      block(g,steel,-4.15,6.42,0,.12,.13,12.75);
      // Mullions, door recesses and a continuous terrace soffit give the photo
      // facade depth as it sweeps past instead of reading as one billboard.
      for(let z=-5.5;z<6;z+=1.85){
        block(g,steel,-3.01,2.04,z,.12,3.85,.10);
        block(g,beam,-3.19,.16,z,.48,.3,1.68);
      }
      block(g,steel,-3.02,2.1,0,.10,.085,12.3);
      for(const z of [-4.3,4.3]){
        block(g,beam,-3.42,1.85,z,.72,3.7,.32);
        block(g,warm,-3.81,3.0,z,.035,.46,.12);
      }
      block(g,concrete,-.7,7.75,0,5.7,.42,12.75);
      block(g,beam,-3.2,7.4,0,.35,.55,12.75);
      // A real colonnade carries the terrace. The recess, paired soffit beams,
      // slatted canopy and planters remain visibly separate while driving past.
      const world=(x,y,z)=>new T.Vector3(x,y,z).applyAxisAngle(new T.Vector3(0,1,0),f.rotation.y).add(f.position);
      for(const z of [-5.8,5.8]) {
        member(concrete,world(-4.1,.1,z),world(-4.1,7.55,z),.36,.42);
        member(steel,world(-4.1,5.35,z),world(-2.6,7.35,z),.13);
      }
      for(let z=-5.5;z<6;z+=1.1) {
        member(beam,world(-4.25,5.28,z),world(-1.6,5.28,z),.075,.1);
      }
      for(const z of [-3.6,3.6]) {
        member(concrete,world(-4.15,.33,z-.85),world(-4.15,.33,z+.85),.48,.52);
        member(foliage,world(-4.15,.64,z-.78),world(-4.15,.64,z+.78),.38,.45);
        member(warmLens,world(-3.79,5.24,z-.75),world(-3.79,5.24,z+.75),.045);
      }
      // Recess the dining room behind its open terrace and reuse the interior atlas.
      const upperWindow=new T.Mesh(window.geometry,glass);
      upperWindow.position.set(-2.2,6.53,0);
      upperWindow.rotation.y=window.rotation.y;
      upperWindow.scale.y=.48;
      g.add(upperWindow);
      for(const z of [-5.9,-3.9,-1.95,0,1.95,3.9,5.9]){
        member(beam,world(-2.26,5.62,z),world(-2.26,7.44,z),.08,.11);
      }
      // Terrace uprights and inset horizontal rails replace an empty slab edge.
      for(let z=-5.7;z<=5.7;z+=.95)member(steel,world(-4.15,5.7,z),world(-4.15,6.4,z),.038);
      member(steel,world(-4.15,6.05,-6.25),world(-4.15,6.05,6.25),.045);

    }
    // Waterfront slips and individual hulls sit below the elevated road.
    const waterMaterial=new T.MeshStandardMaterial({color:0x102b3a,metalness:.42,roughness:.32});
    waterMaterial.onBeforeCompile=shader=>{
      shader.uniforms.marinaTime=scene.userData.worldTime;
      shader.vertexShader='varying vec3 marinaPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nmarinaPosition=(modelMatrix*vec4(position,1.)).xyz;');
      shader.fragmentShader='uniform float marinaTime; varying vec3 marinaPosition;\n'+shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        vec2 p=marinaPosition.xz;
        float phase=dot(p,vec2(1.7,.8))+sin(p.y*.42)+marinaTime*.74;
        float detail=dot(p,vec2(4.7,-2.9))+sin(p.x*.91)-marinaTime*1.1;
        float swell=sin(phase)*(1.-smoothstep(.4,2.6,fwidth(phase)));
        float chop=sin(detail)*(1.-smoothstep(.4,2.6,fwidth(detail)));
        normal=normalize(normal+mat3(viewMatrix)*vec3(swell*.09,0.,chop*.065));
      `).replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
        float column=pow(max(0.,sin(marinaPosition.x*.29+sin(marinaPosition.z*2.9)*.12)),18.);
        float flicker=.4+.6*pow(max(0.,sin(marinaPosition.z*8.1+marinaTime+sin(marinaPosition.x*3.))),3.);
        totalEmissiveRadiance+=vec3(.12,.105,.07)*column*flicker;
      `);
    };
    const water=new T.Mesh(new T.PlaneGeometry(289,84),waterMaterial);
    water.rotation.x=-Math.PI/2;water.position.set(95,-2.9,105);scene.add(water);
    scene.userData.marinaWater=water;
    const hulls=[];
    for(let i=0;i<12;i++) {
      const x=-25+i*21,z=78+(i%3)*5;
      block(scene,beam,x,-2.56,z,1.05,.34,16);
      hulls.push({position:new T.Vector3(x+3,-2.21,z+1),rotation:new T.Euler(),scale:[1.4,.56,4.4]});
      block(scene,concrete,x+3,-1.63,z+1,1.74,.75,2.95);
      block(scene,beam,x+3,-1.56,z+2,1.78,.31,.065);
      block(scene,chalk,x+3,-1.19,z+1,1.94,.12,3.08);
      member(steel,new T.Vector3(x+3,-1.7,z),new T.Vector3(x+3,4.8,z),.068);
      member(steel,new T.Vector3(x+3,3.9,z),new T.Vector3(x+3,-1.8,z+4),.028);
      member(steel,new T.Vector3(x+3,3.9,z),new T.Vector3(x+3,-1.8,z-3),.028);
    }
    batch(scene,chalk,hulls,new T.SphereGeometry(1,12,8));
    // Quayside lights and mooring cleats create a human scale below the road.
    for(let i=0;i<12;i++) {
      const x=-25+i*21,z=78+(i%3)*5;
      for(const dz of [-5,5]) {
        member(steel,new T.Vector3(x,-2.4,z+dz),new T.Vector3(x,-1.42,z+dz),.09);
        member(warmLens,new T.Vector3(x,-1.45,z+dz),new T.Vector3(x,-1.23,z+dz),.12);
        member(steel,new T.Vector3(x-.28,-2.3,z+dz+1),new T.Vector3(x+.28,-2.3,z+dz+1),.08);
      }
    }

  }
  for(const [mat,rows] of fixtures) batch(scene,mat,rows);
}
