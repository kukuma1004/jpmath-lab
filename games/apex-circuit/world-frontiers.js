import * as T from './vendor/three.module.min.js';

// The road carries its own banks. Fit the adjoining landscape below its lowest edge.
function landscape(scene, course, frost, grain) {
  const road = [];
  for (let d = 0; d < course.length; d += 3) road.push(course.sample(d));
  const positions = [], colors = [];
  const tint = new T.Color();
  const grid = [];
  const size = 111, step = 4.5;
  for (let iz = 0; iz < size; iz++) {
    for (let ix = 0; ix < size; ix++) {
      const x = (ix - 55) * step, z = (iz - 55) * step;
      let nearest, squared = Infinity;
      for (const p of road) {
        const r = (p.x-x)**2 + (p.z-z)**2;
        if (r < squared) { squared = r; nearest = p; }
      }
      const distance = Math.sqrt(squared);
      const ridge = Math.abs(Math.sin(.024*x+.017*z)*Math.cos(.019*z-.011*x));
      const wave = Math.sin(.051*x-.037*z) + Math.cos(.073*z+.019*x);
      let height = frost ? 2 + ridge*ridge*85 + wave*5 : 1 + Math.floor((ridge*47+wave*3)/6)*6;
      // The dam retains a low basin on the outside of the start straight.
      if (frost && z > 44 && z < 130 && Math.abs(x)<87) height = -9 + wave;
      if (!frost) {
        const bench = Math.max(Math.abs(x-9)/41,Math.abs(z-6)/20);
        height = T.MathUtils.lerp(6.6,height,T.MathUtils.smoothstep(bench,.85,1.5));
      }
      const shoulder = nearest.y - 3.9;
      height = T.MathUtils.lerp(shoulder, height, T.MathUtils.smoothstep(distance,12,46));
      if (frost && z > 65 && Math.abs(x)<50) height = Math.min(height,-8);
      grid.push([x,height,z]);
    }
  }
  function face(a,b,c) {
    positions.push(...a,...b,...c);
    const y = (a[1]+b[1]+c[1])/3;
    const slope = Math.max(a[1],b[1],c[1])-Math.min(a[1],b[1],c[1]);
    tint.setHex(frost ? slope>4.7 ? 0x788998 : 0xd3e4e8 :
      [0xaa7765,0xc69372,0xd1a783,0xaf8068][Math.abs(Math.floor(y/5))%4]);
    tint.multiplyScalar(.94+.06*Math.sin(a[0]*.15+b[2]*.29));
    for(let j=0;j<3;j++) colors.push(tint.r,tint.g,tint.b);
  }
  for(let iz=0;iz<size-1;iz++) for(let ix=0;ix<size-1;ix++) {
    const a=iz*size+ix, b=a+size;
    face(grid[a],grid[b],grid[a+1]); face(grid[a+1],grid[b],grid[b+1]);
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  geometry.computeVertexNormals();
  // Project stone in terrain space so steep cuttings retain their grain.
  const rock = new T.MeshStandardMaterial({vertexColors:true, roughness:.94});
  rock.customProgramCacheKey = () => frost ? 'snow-pass' : 'quarry-strata';
  rock.onBeforeCompile = shader => {
    shader.uniforms.rockTile = {value:grain('slate-rock')};
    shader.vertexShader = 'varying vec3 frontierPoint;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nfrontierPoint=position;');
    shader.fragmentShader = 'varying vec3 frontierPoint; uniform sampler2D rockTile;\n' + shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      vec3 p=frontierPoint;
      vec3 n=normalize(cross(dFdx(p),dFdy(p)));
      vec3 w=pow(abs(n),vec3(4.0)); w/=max(.001,w.x+w.y+w.z);
      float grain=dot(w,vec3(texture2D(rockTile,p.zy*.19).r,texture2D(rockTile,p.xz*.19).r,texture2D(rockTile,p.xy*.19).r));
      float seam=p.y*.81+sin(p.x*.095)+cos(p.z*.065);
      ${frost ? 'float drift=smoothstep(.48,.94,abs(n.y)+grain*.23); diffuseColor.rgb=mix(vec3(.26,.32,.37)*(.65+grain),diffuseColor.rgb*(.84+.36*grain),drift);' :
      'float band=smoothstep(.32,.93,sin(seam)); diffuseColor.rgb*=mix(vec3(.69,.58,.53),vec3(1.1,1.04,.92),band)*(.80+.60*grain);'}
    `);
  };
  scene.add(new T.Mesh(geometry,rock));
}

export function frontier(scene,course,{block,surface,placard,grain}) {
  const frost = course.id==='frost';
  landscape(scene,course,frost,grain);
  const dark = surface(frost ? 0x465b69 : 0x573d37);
  const body = surface(frost ? 0x9cacb5 : 0xc79565);
  body.map = grain('concrete-grain');
  const paint = surface(frost ? 0xe6a74f : 0xd8a446);
  if(frost) {
    block(scene,surface(0x7aaeba,.29),0,-6.8,100,115,.6,63);
    // Ribbed downstream face below the open crest road.
    for(let d=10;d<121;d+=5) {
      const p=course.point(d,5.5,-10.4);
      const wall=block(scene,body,p.x,p.y,p.z,5.4,17,4.5);
      wall.rotation.y=Math.atan2(-course.sample(d).dz,course.sample(d).dx);
      if(d%10===0) block(scene,dark,p.x,p.y-1,p.z+2.7,1.2,15,2.8);
    }
    for(const x of [-28,-4,20]) {
      block(scene,body,x,12,85,8,10,8);
      block(scene,dark,x,17.7,85,9.4,1.6,9.4);
      for(const offset of [-2.4,0,2.4]) {
        block(scene,dark,x+offset,14.5,80.93,1.5,2.7,.22);
        block(scene,paint,x+offset,16.05,80.74,1.8,.19,.45);
      }
      block(scene,paint,x,15.3,89.1,5,.8,.3);
    }
    // Snow stakes punctuate the pass and give the bare snowfield scale.
    for(let d=0;d<course.length;d+=22) {
      for(const side of [-1,1]) {
        const p=course.point(d,side*(course.halfWidth+1.35),0);
        block(scene,dark,p.x,p.y+.95,p.z,.14,2.7,.14);
        block(scene,paint,p.x,p.y+2.24,p.z,.19,.52,.19);
      }
    }
  } else {
    // Quarry headframe, winding house and inclined ore conveyor on the infield.
    block(scene,body,17,13,8,18,12,10);
    block(scene,dark,17,19.4,8,20,1.2,12);
    for(const x of [-10,-2]) for(const z of [1,9]) {
      block(scene,paint,x,23,z,1.1,33,1.1);
    }
    for(const y of [15,24,33]) {
      for(const z of [1,9]) {
        block(scene,dark,-6,y,z,9,.65,.65);
        block(scene,paint,-6,y+4,z,.6,11.4,.6).rotation.z=.76;
      }
    }
    block(scene,body,-6,40,5,12,4.2,13);
    block(scene,dark,-6,42.4,5,13,1,14);
    const conveyor=new T.Group();
    conveyor.position.set(17,27,5); conveyor.rotation.z=-.47; scene.add(conveyor);
    block(conveyor,dark,0,0,0,51,1.4,3.8);
    for(const side of [-1,1]){
      block(conveyor,paint,0,1.6,side*1.8,51,.25,.25);
      for(let x=-24;x<=24;x+=4){
        block(conveyor,paint,x,1,side*1.8,.24,1.6,.24);
      }
    }
    for(let x=11;x<=23;x+=3){
      block(scene,dark,x,15.3,13.1,2.1,3.2,.28);
      block(scene,paint,x,13.6,13.3,2.4,.24,.6);
    }
  }
  const signs = frost ? ['DAM 01','SWITCHBACK','NORTH PASS'] : ['QUARRY 04','RIM BEND','CUTBACK'];
  for(const [i,ratio] of [.14,.39,.71].entries()) {
    const d=course.length*ratio, lane=course.halfWidth+2.8;
    const p=course.point(d,lane,2.8), v=course.sample(d);
    const panel=placard(signs[i],5.6,1.45,frost?'#174862':'#512c20','#fff1be');
    panel.position.copy(p); panel.rotation.y=Math.atan2(-v.dx,-v.dz);scene.add(panel);
    block(scene,dark,p.x,p.y-1.6,p.z,.24,3.1,.24);
  }
}
