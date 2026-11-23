import * as T from './vendor/three.module.min.js';
import { instances, matrix, nearest, noise, pathSamples, spruceGrove, random } from './world-landmarks.js?v=16';

// The road carries its own banks. Fit the adjoining landscape below its lowest edge.
function landscape(scene, course, frost, grain, road) {
  const size = 111, step = 4.5, span = (size - 1) * step * .5;
  const positions = new Float32Array(size * size * 3);
  const colors = new Float32Array(positions.length);
  const triangles = [];
  const tint = new T.Color();
  const low = new T.Color(frost ? 0x8dabbc : 0xa4684c);
  const high = new T.Color(frost ? 0xe7f2f2 : 0xd6a472);
  for (let iz = 0; iz < size; iz++) {
    for (let ix = 0; ix < size; ix++) {
      const x = ix * step - span, z = iz * step - span;
      const verge = nearest(x,z,road);
      const ripple = noise(x*.073,z*.092);
      const warp = (noise(x*.029,z*.034) - .5) * 2.1;
      const ridge = Math.abs(Math.sin(.024*x+.017*z+warp)*Math.cos(.019*z-.011*x-warp*.6));
      const wave = (ripple - .5)*7 + Math.cos(.073*z+.019*x)*2.1;
      const bank = course.halfWidth;
      let height = frost ? 2 + ridge*ridge*61 + wave + 2.1*Math.sin(x*.17+z*.09+warp) : 2 + Math.floor((ridge*48+wave)/5)*5 + ripple*1.8;
      // The dam retains a low basin on the outside of the start straight.
      if (frost && z > 42 && z < 133 && Math.abs(x)<87) height = -9 + wave*.31;
      if (!frost) {
        const bench = Math.max(Math.abs(x-9)/38,Math.abs(z-6)/22);
        height = T.MathUtils.lerp(6.6,height,T.MathUtils.smoothstep(bench,.85,1.5));
      }
      // A drainage valley beyond the east approach opens a layered view of the reservoir and far ridges.
      const valley=T.MathUtils.smoothstep(x,26,128)*(1-T.MathUtils.smoothstep(Math.abs(z-61),19,92));
      height=T.MathUtils.lerp(height,frost?-8+wave*.36:5+ripple*5,valley*.96);
      const shoulder = verge.height - 2.9 + (ripple-.5)*.58;
      height = T.MathUtils.lerp(shoulder, height, T.MathUtils.smoothstep(verge.distance,bank+3,39));
      if (frost && z > 66 && z < 127 && Math.abs(x)<58) height = Math.min(height,-8);
      const index = iz*size+ix, p = index*3;
      positions.set([x,height,z],p);
      tint.copy(low).lerp(high, .38 + .48*ripple).toArray(colors,p);
      if (ix < size-1 && iz < size-1) {
        triangles.push(index,index+size,index+1,index+1,index+size,index+size+1);
      }
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position',new T.BufferAttribute(positions,3));
  geometry.setAttribute('color',new T.BufferAttribute(colors,3));
  geometry.setIndex(triangles);
  geometry.computeVertexNormals();
  const terrain = new T.Mesh(geometry, frontierStone(frost,grain));
  terrain.userData.distant = true;
  scene.add(terrain);
  return (x,z) => {
    const a = T.MathUtils.clamp((x+span)/step,0,size-1.001);
    const b = T.MathUtils.clamp((z+span)/step,0,size-1.001);
    const ix = Math.floor(a), iz = Math.floor(b);
    const u = a-ix, v = b-iz;
    const index = (iz*size+ix)*3+1;
    const h00 = positions[index], h10 = positions[index+3];
    const h01 = positions[index+size*3], h11 = positions[index+size*3+3];
    return u+v <= 1 ? h00+(h10-h00)*u+(h01-h00)*v : h11+(h01-h11)*(1-u)+(h10-h11)*(1-v);
  };
}

function frontierStone(frost, grain) {
  // World-space grain keeps cuttings and loose boulders on the same scale.
  const rock = new T.MeshStandardMaterial({vertexColors:true, roughness:.94});
  rock.customProgramCacheKey = () => frost ? 'snow-pass' : 'quarry-strata';
  rock.onBeforeCompile = shader => {
    shader.uniforms.rockTile = {value:grain('slate-rock')};
    shader.uniforms.outcropTile = {value:grain(frost ? 'alpine-schist' : 'quarry-bedding')};
    shader.vertexShader = 'varying vec3 frontierPoint;\n' + shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      vec4 frontierWorld=vec4(position,1.);
      #ifdef USE_INSTANCING
        frontierWorld=instanceMatrix*frontierWorld;
      #endif
      frontierPoint=(modelMatrix*frontierWorld).xyz;
    `);
    shader.fragmentShader = 'varying vec3 frontierPoint; uniform sampler2D rockTile, outcropTile;\n' + shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      vec3 p=frontierPoint;
      vec3 n=normalize(cross(dFdx(p),dFdy(p)));
      vec3 w=pow(abs(n),vec3(4.0)); w/=max(.001,w.x+w.y+w.z);
      float grain=dot(w,vec3(texture2D(rockTile,p.zy*.32).r,texture2D(rockTile,p.xz*.32).r,texture2D(rockTile,p.xy*.32).r));
      float erosion=texture2D(rockTile,p.xz*.061).g;
      vec3 bedding = texture2D(outcropTile,p.zy*vec2(.13,.13)).rgb*w.x
        + texture2D(outcropTile,p.xz*.13).rgb*w.y + texture2D(outcropTile,p.xy*.13).rgb*w.z;
      float seam=p.y*1.34+p.x*.021-p.z*.038+erosion*1.2;
      ${frost ? 'float drift=smoothstep(.43,.82,abs(n.y)+erosion*.23); diffuseColor.rgb=mix(vec3(.19,.25,.29)*(.68+grain),diffuseColor.rgb*(.81+.64*grain),drift);' :
      'float band=smoothstep(.25,.9,sin(seam))*(1.-abs(n.y)*.66); diffuseColor.rgb*=mix(vec3(1.02,.96,.89),vec3(.63,.49,.41),band)*(.72+.80*grain);'}
      float exposed=1.-smoothstep(.54,.96,abs(n.y));
      diffuseColor.rgb=mix(diffuseColor.rgb,bedding*(.84+.42*grain), ${frost ? '.86*exposed' : '.41+.49*exposed'});
    `);
  };
  return rock;
}

function outcrop() {
  const rng = random(6710), verts = [], colors = [];
  const profile = [[-.52,.94],[-.25,1],[-.10,.84],[.07,.88],[.17,.64],[.31,.60],[.5,.37]];
  const directions = Array.from({length:8}, (_,i) => {
    const angle = i*Math.PI/4;
    const radius = .71 + rng()*.29;
    return [Math.cos(angle)*radius,Math.sin(angle)*radius];
  });
  const rings = profile.map(([y,r]) => directions.map(([x,z]) =>
    [x*r+.14*y,y+(rng()-.5)*.062,z*r-.13*y]));
  const tone = new T.Color(0xd7a076);
  const face = (a,b,c,level) => {
    verts.push(...a,...b,...c);
    const shade = level*(.86+rng()*.14);
    for (let i=0;i<3;i++) colors.push(tone.r*shade,tone.g*shade,tone.b*shade);
  };
  for (let j=0;j<rings.length-1;j++) {
    for (let i=0;i<directions.length;i++) {
      const n=(i+1)%directions.length;
      face(rings[j][i],rings[j+1][i],rings[j][n],j%2 ? .75 : .96);
      face(rings[j][n],rings[j+1][i],rings[j+1][n],j%2 ? .79 : 1);
      if (j===rings.length-2) face([.07,.51,-.065],rings[j+1][n],rings[j+1][i],1.08);
    }
  }
  const geo=new T.BufferGeometry();
  geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  geo.computeVertexNormals();
  return geo;
}

function plantTuft() {
  const rng = random(213), verts = [];
  for (let i=0;i<7;i++) {
    const a=i*.898+rng()*.4, reach=.32+rng()*.5;
    const x=Math.cos(a)*reach,z=Math.sin(a)*reach,h=.53+rng()*.45;
    verts.push(-z*.12,0,x*.12,x*.63,h*.56,z*.63,z*.12,0,-x*.12,
      z*.12,0,-x*.12,x*.63,h*.56,z*.63,x,h,z);
  }
  const geo=new T.BufferGeometry();
  geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));
  geo.computeVertexNormals();
  return geo;
}

function vergeDetails(scene, course, frost, grain, road, ground) {
  const rng=random(frost ? 37172 : 8029);
  const rocks=[], drifts=[], crowns=[], trunks=[], tufts=[], columns=[];
  for (let d=12; d<course.length; d+=12.25) {
    for (const side of [-1,1]) {
      const lane=course.halfWidth+3.3;
      const place=(offset,spread) => course.point(d+(rng()-.5)*spread,side*(lane+offset));
      for (let i=0;i<3;i++) {
        const {x,z}=place(i*2+rng()*5,10);
        const radius=.37+rng()*1.33;
        if (nearest(x,z,road).distance<course.halfWidth+2+radius) continue;
        const y=ground(x,z);
        if (frost && y<-6.7) continue;
        rocks.push(matrix(x,y-radius*.25,z,radius*1.45,radius*.72,radius,rng()*6.28));
        if (frost && i!==0) drifts.push(matrix(x,y+radius*.14,z,radius*1.30,radius*.41,radius*.86,rng()*6.28));
        if (!frost && i!==1) tufts.push(matrix(x+.16,y,z-.56,.78,.23+rng()*.59,.78,rng()*6.28));
      }
      if (frost) {
        // Leave the water and road edge open. Pines collect on higher snow-covered benches.
        for (let i=0;i<8;i++) {
          const {x,z}=place(4+rng()*25,21);
          const h=3.3+rng()*6.7;
          const y=ground(x,z);
          if (y<-4 || nearest(x,z,road).distance<lane+1.8+h*.24 || Math.abs(ground(x+1,z)-y)>2.1) continue;
          trunks.push(matrix(x,y+.23*h,z,.08*h,.59*h,.08*h));
          crowns.push(matrix(x,y+.55*h,z,.24*h,.90*h,.24*h,rng()*6.28));
        }
      } else if (Math.floor(d/12.25)%3===1) {
        // Eroded stacks rise from the cutting beyond the outside of the racing line.
        for (let i=0;i<3;i++) {
          const {x,z}=place(3+i*3.4+rng()*5,9.1);
          const radius=1.25+rng()*1.19, h=2.8+rng()*7.1;
          if(nearest(x,z,road).distance<lane+radius*1.6) continue;
          columns.push(matrix(x,ground(x,z)+h*.21,z,radius*1.38,h,radius,rng()*6.28));
        }
      }
    }
  }
  const rockGeo=new T.IcosahedronGeometry(1,1);
  const rockVertices=rockGeo.attributes.position;
  const rockColors=[];
  const stoneTint=new T.Color(frost ? 0x8e9fa7 : 0xc0896b);
  for(let i=0;i<rockVertices.count;i++){
    const x=rockVertices.getX(i), y=rockVertices.getY(i), z=rockVertices.getZ(i);
    const fracture=.85+.17*Math.sin(x*4.7+y*1.7)*Math.cos(z*4.3+x);
    rockVertices.setXYZ(i,x*fracture,Math.min(.76,y*fracture+.08*x),z*fracture);
    rockColors.push(stoneTint.r,stoneTint.g,stoneTint.b);
  }
  rockGeo.setAttribute('color',new T.Float32BufferAttribute(rockColors,3));
  rockGeo.computeVertexNormals();
  const cube=new T.BoxGeometry();
  const material=(color, options={})=>new T.MeshStandardMaterial({color,roughness:.94,...options});
  const props=[
    instances(scene,rockGeo,frontierStone(frost,grain),rocks),
    instances(scene,rockGeo,material(0xcadfe6),drifts),
    instances(scene,cube,material(0x524943),trunks),
    spruceGrove(scene,crowns,true),
    instances(scene,plantTuft(),material(0x887452,{side:T.DoubleSide}),tufts),
    instances(scene,outcrop(),frontierStone(false,grain),columns)
  ];
  for (const mesh of props) if (mesh) mesh.userData.distant=true;
}

// Broad benches and vertical fractures read at speed, while the generated rock tile
// carries mineral detail as the car draws alongside the face.
function escarpments(scene,frost,ground,grain){
  const rng=random(frost?2401:833);
  const positions=[],colors=[],uv=[],indices=[];
  const palette=(frost?[0x6d99a7,0x97c9d3,0xcbe3e8,0xf1f7f5]:[0x945a48,0xc2815d,0xae664e,0xe6a773]).map(c=>new T.Color(c));
  function stack(x,z,rx,rz,h,y){
    const sides=frost?7:13,angle=rng()*6.28;
    const radii=Array.from({length:sides},()=>.84+rng()*.27);
    const levels=frost?[[0,1.22],[.42,1],[.91,.89],[1,.70]]:[[0,1.35],[.24,1.02],[.29,.92],[.53,.86],[.56,.77],[.86,.74],[.90,.65],[1,.61]];
    const topSlope=(rng()-.5)*.19;
    for(let k=1;k<levels.length;k++){
      for(let j=0;j<sides;j++){
        const corners=[];
        for(const [layer,i] of [[k-1,j],[k,j],[k,(j+1)%sides],[k-1,(j+1)%sides]]){
          const [e,r]=levels[layer],a=i*Math.PI*2/sides+angle;
          const dx=Math.cos(a)*radii[i],dz=Math.sin(a)*radii[i];
          corners.push([x+dx*rx*r+e*rx*.09,y+h*(e+e*topSlope*dx),z+dz*rz*r]);
        }
        const base=positions.length/3;
        const tone=palette[frost?Math.min(k-1,2):(k-1)%4].clone().multiplyScalar(.9+.13*Math.cos(j*1.77));
        const ax=corners[3][0]-corners[0][0],az=corners[3][2]-corners[0][2],length=Math.hypot(ax,az);
        for(const [i,v] of corners.entries()){
          positions.push(...v);colors.push(tone.r,tone.g,tone.b);
          uv.push((j+i/4+(i>1?length:0))*.18,v[1]*.19);
        }
        indices.push(base,base+1,base+2,base,base+2,base+3);
        if(k===levels.length-1){
          const c=positions.length/3;positions.push(x+rx*.09,y+h,z);
          colors.push(palette[3].r,palette[3].g,palette[3].b);uv.push(.5,.5);indices.push(base+1,c,base+2);
        }
      }
    }
  }
  if(frost){
    // A descending, fractured glacier tongue on the far side of the reservoir.
    for(let n=0;n<40;n++){
      const x=138+Math.floor(n/5)*7.3+rng()*3,z=54+(n%5)*8.6+rng()*4;
      const floor=ground(x,z);
      stack(x,z,4+rng()*4.7,5+rng()*3,8+(x-135)*.32+rng()*6,floor-2.7);
    }
  }else{
    for(const [x,z,rx,rz,h] of [[195,67,12,19,45],[206,89,9,8,56],[195,109,21,10,32],[178,-60,23,13,46],[-165,-108,26,15,36],[-180,47,13,10,41],[63,131,13,17,35]]){
      stack(x,z,rx,rz,h,ground(x,z)-3);
    }
  }
  const geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  geometry.setIndex(indices);geometry.computeVertexNormals();
  const material=new T.MeshStandardMaterial({vertexColors:true,roughness: frost ? .55 : .94,side:T.DoubleSide});
  material.map=grain(frost?'alpine-schist':'quarry-bedding');
  material.onBeforeCompile=shader=>{
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
      vec3 vein=texture2D(map,vMapUv).rgb;
      diffuseColor.rgb*=.79+dot(vein,vec3(.25,.5,.25))*.69;
    `);
  };
  const formation=new T.Mesh(geometry,material);formation.userData.distant=true;scene.add(formation);
}

export function frontier(scene,course,{block,surface,placard,grain}) {
  const frost = course.id==='frost';
  const road=pathSamples(course,3);
  const ground=landscape(scene,course,frost,grain,road);
  vergeDetails(scene,course,frost,grain,road,ground);
  escarpments(scene,frost,ground,grain);
  const dark = surface(frost ? 0x465b69 : 0x573d37);
  const body = surface(frost ? 0x9cacb5 : 0xc79565);
  body.map = grain('concrete-grain');
  const paint = surface(frost ? 0xe6a74f : 0xd8a446);
  if(frost) {
    const ice=surface(0x77adb9,.47);
    ice.map=grain('slate-rock');
    ice.onBeforeCompile = shader => {
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>', `
        float frost=texture2D(map,vMapUv*vec2(11.,6.)).r;
        float cloud=texture2D(map,vMapUv*vec2(3.,2.)).g;
        diffuseColor.rgb*=.68+frost*.59+cloud*.48;
      `);
    };
    block(scene,ice,0,-6.8,100,115,.6,62);
    block(scene,ice,188,-6.85,65,145,.55,84);
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
      const p=course.point(d,side*(course.halfWidth+1.3),0);
      const base=Math.min(p.y-.12,ground(p.x,p.z));
      block(scene,dark,p.x,(p.y+1.8+base)/2,p.z,.13,p.y+1.8-base,.13);
      block(scene,paint,p.x,p.y+1.64,p.z,.19,.31,.19);
      block(scene,surface(0xfbe2a7),p.x,p.y+1.37,p.z,.17,.08,.17);
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
  for(const [i,ratio] of [.17,.39,.71].entries()) {
    const d=course.length*ratio, lane=course.halfWidth+4.0;
    const p=course.point(d,lane,2.8), v=course.sample(d);
    const panel=placard(signs[i],5.6,1.45,frost?'#174862':'#512c20','#fff1be');
    panel.position.copy(p); panel.rotation.y=Math.atan2(-v.dx,-v.dz);scene.add(panel);
    const base=Math.min(p.y-1,ground(p.x,p.z));
    block(scene,dark,p.x,(base+p.y)/2,p.z,.24,p.y-base,.24);
  }
}
