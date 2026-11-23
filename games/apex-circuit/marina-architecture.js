import * as T from './vendor/three.module.min.js';
import {instances, matrix, random} from './world-landmarks.js?v=17';

// Each course-facing terrace is a glazed drum. Shared indexed buffers keep the
// illuminated reveals, curved curtain walls and deep balcony edges inexpensive.
export function marinaArchitecture(scene, course, office) {
  const groups = Array.from({length:4},()=>({positions:[],uvs:[],indices:[]}));
  const [windows, stone, bronze, light] = groups;
  const leaves=[], branches=[],mullions=[],lobbyLights=[], rng=random(1973);
  function panel(group, corners, u, v, du, dv) {
    const first=group.positions.length/3;
    for(const corner of corners)group.positions.push(...corner);
    group.uvs.push(u,v,u+du,v,u+du,v+dv,u,v+dv);
    group.indices.push(first,first+1,first+2,first,first+2,first+3);
  }
  function ring(group,x,z,y0,y1,rx,rz,topX,topZ,facets=24,twist=0) {
    function point(i,h,a,b){
      const t=i*Math.PI*2/facets;
      return [x+Math.cos(t)*a,h,z+Math.sin(t)*b];
    }
    for(let i=0;i<facets;i++){
      const a=point(i,y0,rx,rz), b=point(i+1,y0,rx,rz);
      const c=point(i+1+twist,y1,topX,topZ), d=point(i+twist,y1,topX,topZ);
      const span=Math.PI*(rx+rz)/facets/15;
      panel(group,[b,a,d,c],(i+1)*span,y0/48,-span,(y1-y0)/48);
    }
  }
  function terrace(x,z,y,rx,rz,levels){
    for(let floor=0;floor<levels;floor++){
      const setback=Math.floor(floor/2)*.76, a=rx-setback,b=rz-setback*.72;
      if(floor>0 && floor%2===0)x+=.42;
      const balcony=floor%2===1?1.04:.48;
      const top=y+(floor===0?4.05:3.05),height=top-y;
      ring(windows,x,z,y,top,a,b,a,b);
      // Fins project beyond the curved glazing so their highlights move with the car.
      for(let j=0;j<16;j++){
        const t=j*Math.PI/8,ct=Math.cos(t),st=Math.sin(t);
        mullions.push(matrix(x+ct*(a+.06),y+height/2,z+st*(b+.06),.11,height,.13,-t));
        if(j%3===0)lobbyLights.push(matrix(x+ct*(a+.37),top-.14,z+st*(b+.37),.23,.065,.23));
      }
      ring(bronze,x,z,top-.16,top,a,b,a+balcony,b+balcony);
      ring(stone,x,z,top,top+.34,a+balcony,b+balcony,a+balcony,b+balcony);
      ring(light,x,z,top+.075,top+.18,a+balcony+.02,b+balcony+.02,a+balcony+.02,b+balcony+.02);
      ring(bronze,x,z,top+.34,top+.36,a+balcony,b+balcony,floor===levels-1?.02:a-.8,floor===levels-1?.02:b-.8);
      if(floor===levels-1 || floor%2===1){
        for(let i=0;i<8;i++){
          const theta=i*.785+rng()*.3;
          const px=x+Math.cos(theta)*(a-.52),pz=z+Math.sin(theta)*(b-.52);
          branches.push(matrix(px,top+.87,pz,.11,1.13,.11));
          leaves.push(matrix(px,top+1.58,pz,.58+rng()*.44,.66+rng()*.38,.65));
        }
      }
      y=top+.35;
    }
    // A recessed rooftop lounge has a glazed clerestory and floating eave.
    if(levels>=5){
      const a=rx*.51,b=rz*.54;
      ring(windows,x,z,y,y+1.75,a,b,a,b);
      ring(bronze,x,z,y+1.75,y+1.9,a,b,a+.85,b+.85);
      ring(light,x,z,y+1.9,y+2.04,a+.85,b+.85,a+.85,b+.85);
      ring(stone,x,z,y+2.04,y+2.18,a+.85,b+.85,.02,.02);
    }
  }
  const approach=course.shortcuts[0].start;
  for(const [distance,lane,rx,rz,levels] of [
    [-106,-22,10,9,5],[-78,-23,12,9,6],[-49,-23,12,8.8,5],[-22,-22,10,8,7],
    [-4,-26,9,7,5],[-110,24,9,8,3],[-66,21,7,6,3]
  ]){
    const p=course.point(approach+distance,lane);
    terrace(p.x,p.z,p.y+2.3,rx,rz,levels);
  }
  for(const [x,z,rx,rz,levels] of [[76,137,18,9,7],[116,136,14,10,5],[175,125,18,12,9],[209,138,16,11,6]])terrace(x,z,-3,rx,rz,levels);
  // A tapered split crown remains identifiable across the far bank and on the return straight.
  const x=203,z=109, heights=[-3,12,29,45,59,73,85], widths=[9,9.6,8.7,7.2,5.3,3.1,.84];
  for(let i=0;i<heights.length-1;i++){
    const y=heights[i],end=heights[i+1],a=widths[i],b=widths[i+1];
    ring(windows,x,z,y,end,a,a*.81,b,b*.81,24);
    for(let floor=y+2.4;floor<end;floor+=2.6){
      const w=T.MathUtils.lerp(a,b,(floor-y)/(end-y));
      ring(bronze,x,z,floor,floor+.13,w+.08,w*.81+.08,w+.08,w*.81+.08,24);
    }
    for(let j=0;j<8;j++){
      const t=j*Math.PI/4;
      const A=new T.Vector3(x+a*Math.cos(t),y,z+a*.81*Math.sin(t));
      const B=new T.Vector3(x+b*Math.cos(t),end,z+b*.81*Math.sin(t));
      const off=new T.Vector3(-Math.sin(t)*.23,0,Math.cos(t)*.23);
      panel(i>1?light:stone,[A.clone().sub(off).toArray(),A.clone().add(off).toArray(),B.clone().add(off).toArray(),B.clone().sub(off).toArray()],0,0,1,1);
    }
  }
  for(const side of [-1,1])ring(light,x+side*.6,z,84,89,.19,.19,.045,.045,8);
  const materials=[
    new T.MeshBasicMaterial({map:office,color:0xf0e4d4}),
    new T.MeshStandardMaterial({color:0xb7a28b,roughness:.52,metalness:.19}),
    new T.MeshStandardMaterial({color:0x34445b,roughness:.29,metalness:.52}),
    new T.MeshBasicMaterial({color:0xffce8c})
  ];
  groups.forEach(({positions,uvs,indices},i)=>{
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));
    geometry.setIndex(indices);geometry.computeVertexNormals();
    materials[i].side=T.DoubleSide;
    scene.add(new T.Mesh(geometry,materials[i]));
  });
  const box=new T.BoxGeometry();
  instances(scene,box,new T.MeshStandardMaterial({color:0x9a846f,metalness:.45,roughness:.36}),mullions);
  instances(scene,box,new T.MeshBasicMaterial({color:0xffdfa9}),lobbyLights);
  instances(scene,box,new T.MeshStandardMaterial({color:0x77573a}),branches);
  instances(scene,new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({color:0x436a42}),leaves);
}
