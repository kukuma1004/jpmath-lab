import * as T from './vendor/three.module.min.js';
import {grain, instances, matrix, nearest, pathSamples, random} from './world-landmarks.js?v=14';

const box=new T.BoxGeometry();
const finish=(color,options={})=>new T.MeshStandardMaterial({color,roughness:.78,...options});
const lit=color=>new T.MeshBasicMaterial({color});
const textured=(color)=>finish(color,{map:grain('concrete-grain')});

export function harborVillage(scene,course) {
  const road=pathSamples(course),rng=random(1938);
  const walls=[], roofs=[], lights=[],girders=[],awnings=[], glass=[], masts=[],hulls=[];
  // A working quay on piles: arcades, upstairs windows and stepped roof parapets.
  for(const [cx,cz] of [[-43,13],[-40,-40],[105,63],[108,86],[-12,108]]){
    for(let i=-2;i<=2;i++) {
      const x=cx+i*5.8,z=cz+(i%2)*1.45, h=3.6+rng()*5.3;
      if(nearest(x,z,road).distance<course.halfWidth+6)continue;
      girders.push(matrix(x,-2.2,z,5.95,1,8.6));
      for(const dx of [-2.15,2.15])girders.push(matrix(x+dx,-5.4,z, .38,6.4,.48));
      walls.push(matrix(x,h*.5-1.7,z,5.45,h,5));
      roofs.push(matrix(x,h-1.68,z,5.8,.34,5.4));
      roofs.push(matrix(x+1.5,h-1.22,z-.7,.85,.8,1.1));
      for(const side of [-1,1]){
        awnings.push(matrix(x,.49,z+side*2.85,5.1,.17,1.25));
        for(let j=-1;j<=1;j++){
          glass.push(matrix(x+j*1.48,-.49,z+side*2.52,1.18,1.88,.07));
          for(let y=1.7;y<h-2.1;y+=1.85)lights.push(matrix(x+j*1.48,y,z+side*2.53,.76,.9,.06));
        }
      }
    }
  }
  for(const [x,z,yaw] of [[29,73,.5],[40,80,.72],[54,86,.41],[-21,100,-.9],[82,92,.64],[110,-71,.2]]){
    hulls.push(matrix(x,-7.67,z,1.45,.9,4.6,yaw));
    masts.push(matrix(x,-3.45,z,.10,8.6,.10));
    roofs.push(matrix(x,-7.05,z,1.4,.58,3.6,yaw));
  }
  // Slender travelling dock cranes with open trusses, counterweights and hanging hooks.
  for(const [x,z] of [[112,37],[126,51],[115,99],[-58,102]]){
    const mast=9+rng()*4, deck=-2;
    girders.push(matrix(x,deck-.5,z,8,1.2,5));
    for(const dx of [-1.35,1.35]){
      for(const dz of [-1.1,1.1]) masts.push(matrix(x+dx,deck+mast*.5,z+dz,.19,mast,.19));
      for(let y=1;y<mast;y+=2.4) masts.push(matrix(x+dx,deck+y,z,.16,.18,2.4));
    }
    for(const side of [-1,1]) masts.push(matrix(x+4.8,deck+mast+side*.62,z,16,.17,.22));
    for(let n=0;n<8;n++){
      const brace=new T.Matrix4().makeRotationZ((n%2?1:-1)*.98);
      brace.scale(new T.Vector3(.11,2.32,.12));
      brace.setPosition(x-2.3+n*1.95,deck+mast,z);
      masts.push(brace);
    }
    roofs.push(matrix(x-2,deck+mast,z,2.5,1.8,2.2));
    masts.push(matrix(x+12,deck+mast-2.7,z,.085,5.3,.085));
    girders.push(matrix(x+12,deck+mast-5.4,z,.55,.32,.5));
  }
  // A terraced ferry port wraps the far quay behind the approach pylons.
  for(let j=0;j<21;j++){
    const z=-44+j*4.8,x=166+Math.sin(j*.37)*12,h=6+rng()*9+(j%7===0?9:0);
    girders.push(matrix(x,-6.3,z,16,4,5.1));
    walls.push(matrix(x,-4.4+h/2,z,6.2,h,4.53));
    roofs.push(matrix(x,-4.4+h,z,6.6,.39,4.8));
    for(let level=-1.8;level<h-5;level+=2.05){
      glass.push(matrix(x-3.13,level,z,.09,.76,3.6));
      awnings.push(matrix(x-3.39,level-.52,z,.62,.15,4.23));
    }
  }
  // Container feeders sit beyond the bridge, giving the open-water sightline scale.
  const containers=[[],[],[]], shipWindows=[];
  for(const [x,z,yaw] of [[153,55,-.42],[82,142,.74],[-159,55,.18]]){
    const at=(dx,y,dz,w,h,d)=>matrix(x+dx*Math.cos(yaw)+dz*Math.sin(yaw),y,z-dx*Math.sin(yaw)+dz*Math.cos(yaw),w,h,d,yaw);
    const outline=new T.Shape();
    outline.moveTo(-15,-3.2);outline.lineTo(10,-3.2);outline.quadraticCurveTo(15,-2.7,18,0);
    outline.quadraticCurveTo(15,2.7,10,3.2);outline.lineTo(-15,3.2);outline.closePath();
    const hull=new T.Mesh(new T.ExtrudeGeometry(outline,{depth:2.6,bevelEnabled:true,bevelThickness:.35,bevelSize:.32,bevelSegments:1}),finish(0x394753));
    hull.rotation.order='YXZ';hull.rotation.x=Math.PI/2;hull.rotation.y=yaw;hull.position.set(x,-5.55,z);scene.add(hull);
    roofs.push(at(-11,-3.85,0,4.6,3.3,5.2));masts.push(at(-11,-1.7,0,5.3,1.05,5.7));
    shipWindows.push(at(-11,-1.55,0,5.4,.38,5.8));
    masts.push(at(-11,.1,0,.16,3.3,.16));
    for(let row=0;row<5;row++) for(const side of [-1,1]){
      const layers=1+Math.floor(rng()*3);
      for(let k=0;k<layers;k++) containers[Math.floor(rng()*3)].push(at(-6+row*3.85,-4.83+k*1.52,side*1.36,3.7,1.43,2.52));
    }
  }
  [0xa34e39,0x546d78,0xb78d56].forEach((color,i)=>instances(scene,box,finish(color),containers[i]));
  instances(scene,box,lit(0xf6dbab),shipWindows);
  instances(scene,box,textured(0xdba275),walls);
  instances(scene,box,finish(0x947168),roofs);
  instances(scene,box,finish(0x62605c),girders);
  instances(scene,box,finish(0xad593f),awnings);
  instances(scene,box,lit(0xffce85),lights);
  instances(scene,box,finish(0x396064,{roughness:.27}),glass);
  instances(scene,box,finish(0xc3b9a5),masts);
  instances(scene,new T.SphereGeometry(1,12,6),finish(0xe3dcd0),hulls);
}

export function streetShops(scene,course,placard){
  const shells=[], parapets=[], warm=[], frames=[], glass=[], planters=[], foliage=[], rng=random(731);
  const signs=[],coolSigns=[],path=pathSamples(course);
  for(let d=10;d<course.length;d+=15.5){
    for(const side of [-1,1]){
      const p=course.point(d,side*(course.halfWidth+9.4)), s=course.sample(d);
      if(nearest(p.x,p.z,path).distance<course.halfWidth+7.4)continue;
      const yaw=Math.atan2(-s.dz,s.dx),base=-3, h=5.4+rng()*3.2;
      const at=(along,out,y,w,a,b)=>matrix(p.x+s.dx*along-s.dz*out,y,p.z+s.dz*along+s.dx*out,w,a,b,yaw);
      shells.push(at(0,0,base+h*.5,12.6,h,4.8));
      for(const level of [base+1.1,base+h-1.8]){
        glass.push(at(0,-side*2.43,level+.87,11.9,1.72,.08));
        for(let a=-5.3;a<=5.4;a+=1.55){
          warm.push(at(a,-side*2.51,level+1.53,.95,.14,.09));
          frames.push(at(a-.59,-side*2.55,level+.82,.13,1.73,.12));
          if(rng()>.5)warm.push(at(a,-side*2.51,level+.56,.34,.81,.08));
        }
        parapets.push(at(0,-side*2.64,level-.11,13,.30,.84));
      }
      const signFace=rng()>.48?signs:coolSigns;
      const edge=side* -3.12;
      signFace.push(at(4.8,edge,base+h-.60,.69,2.45,.66));
      for(let j=0;j<3;j++) warm.push(at(4.8,edge-side*.35,base+h+.1-j*.48,.36,.09,.05));
      coolSigns.push(at(-2.3,-side*2.72,base+h-1.69,5.1,.09,.14));
      parapets.push(at(0,0,base+h+.05,13,.4,5.25));
      parapets.push(at(-3.2,.34,base+h+.78,3.3,1.23,2.2));
      const tree=at(5.8,-side*4.1,base+1.4,1.4,1.6,1.4);
      planters.push(at(5.8,-side*4.1,base+.22,1.5,.6,1.5));foliage.push(tree);
    }
  }
  // Projecting double-sided marquees give each block its own scale and rhythm.
  const names=['NOVA FM','ARCADE','MIDNIGHT','HOTEL 27','AFTER HOURS','CINEMA'];
  const palette=[['#913251','#ffeac8'],['#176065','#e3ffd6'],['#403575','#ffd5e6']];
  for(let i=0;i<12;i++){
    const d=course.length*(i+.35)/12,side=i%3===0?-1:1;
    const p=course.point(d,side*(course.halfWidth+7.4)),v=course.sample(d);
    if(nearest(p.x,p.z,path).distance<course.halfWidth+6)continue;
    const y=p.y+5.2+(i%3)*1.25, yaw=Math.atan2(-v.dx,-v.dz)+side*.32;
    const sign=placard(names[i%names.length],5.4,1.8,...palette[i%3]);
    sign.position.set(p.x,y,p.z);sign.rotation.y=yaw;scene.add(sign);
    frames.push(matrix(p.x,y-2,p.z,.2,4,.2));
    warm.push(matrix(p.x,y-1.0,p.z,5.5,.07,.21,yaw));
  }
  instances(scene,box,textured(0x566376),shells);
  instances(scene,box,finish(0x899197),parapets);
  instances(scene,box,lit(0xfbca84),warm);
  instances(scene,box,finish(0x855f43),frames);
  instances(scene,box,lit(0x674e46),glass);
  instances(scene,box,lit(0xf05282),signs);
  instances(scene,box,lit(0x64d1e9),coolSigns);
  instances(scene,box,finish(0x6d6f68),planters);
  instances(scene,new T.IcosahedronGeometry(1,1),finish(0x3d6256),foliage);
}

export function quarryArch(scene){
  // A sandstone fin eroded through its centre, with a deep soffit and flared footings.
  const positions=[],uvs=[],colors=[],indices=[],segments=28,sides=11;
  const tint=new T.Color();
  for(let j=0;j<=segments;j++){
    const a=j*Math.PI/segments, bx=160+Math.sin(a*2.1)*5.4, by=3+Math.sin(a)*24+Math.sin(a*3.7)*1.2, bz=72+Math.cos(a)*22;
    for(let i=0;i<=sides;i++){
      const t=(i%sides)*2*Math.PI/sides;
      const erosion=.81+.15*Math.sin(a*14+t*3)+.10*Math.sin(t*5-a*19);
      const r=(3.6+Math.pow(Math.abs(Math.cos(a)),4)*5.8)*erosion;
      const x=bx+Math.cos(t)*r*1.38,y=by+Math.sin(a)*Math.sin(t)*r,z=bz+Math.cos(a)*Math.sin(t)*r;
      positions.push(x,y,z);uvs.push((z*.77+x*.61)/12,y/7);
      tint.set(0xbc7554).multiplyScalar(.76+.19*Math.sin(y*1.05+x*.12)+.13*Math.sin(y*.37));
      colors.push(tint.r,tint.g,tint.b);
      if(j<segments&&i<sides){const n=j*(sides+1)+i;indices.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1);}
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  g.setIndex(indices);g.computeVertexNormals();
  const arch=new T.Mesh(g,finish(0xffe5cf,{vertexColors:true,map:grain('quarry-bedding'),side:T.DoubleSide}));
  scene.add(arch);
}
