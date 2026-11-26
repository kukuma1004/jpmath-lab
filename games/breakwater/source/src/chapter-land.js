import * as THREE from 'three';

const palettes = [
  { rock: [0x444d45,0x536052,0x687062], wall:0x57524a, trim:0xad8862, lamp:0xf4bb66 },
  { rock: [0x343e48,0x475460,0x626e72], wall:0x414957, trim:0x897a65, lamp:0xffbf58 },
  { rock: [0x5f5459,0x806966,0x95756d], wall:0x866c60, trim:0xb99a78, lamp:0xffdc93 },
  { rock: [0x76423a,0x9b5c48,0xba7960], wall:0x714739, trim:0xb38968, lamp:0xffbe64 },
  { rock: [0x323044,0x414052,0x505265], wall:0x353341, trim:0x766477, lamp:0xec817a },
];

export function chapterLand(index, { Assembly, randomFrom, cliffFinish, masonryFinish, torchGlow }) {
  const group = new THREE.Group();
  const land = new Assembly(), fort = new Assembly(), lamps = new Assembly();
  const random = randomFrom(4291 + index);
  const {rock, wall, trim, lamp} = palettes[index-3];
  const gateZ = -55;
  function beacon(x,y,z,r) {
    lamps.add('octagon',lamp,[x,y,z],[r,1.28*r,r]);
    fort.add('octagon',trim,[x,y-.72*r,z],[r*1.45,.22*r,r*1.45])
      .add('cone',wall,[x,y+.9*r,z],[r*1.67,.74*r,r*1.67]);
    for(const dx of [-.43,.43]) fort.add('block',wall,[x+dx*r,y,z+.35*r],[.10*r,1.32*r,.1*r]);
    const sprite=new THREE.Sprite(torchGlow);
    sprite.scale.set(3.8*r,3.1*r,1);
    sprite.position.set(x,y,z+r*.6);
    group.add(sprite);
  }
  const pine=(x,y,z,h)=>{
    land.add('hex',0x59473a,[x,y+h*.31,z],[.29,h*.72,.29]);
    for(let j=0;j<5;j++){
      const width=h*(.40-j*.064);
      land.add('cone',j%2?0x324e47:0x273e38,[x,y+h*(.33+j*.15),z],[width,h*.43,width],[.04,j*.6,.03]);
    }
  };
  for(const side of [-1,1]){
    for(let i=0;i<18;i++){
      const z=9-i*5.4, x=side*(13+random()*3);
      const height=3+random()*3 + (i>8 ? (i-8)*.67 : 0);
      if(index===5){
        land.add('block',rock[i%3],[side*12,-2.2,z],[4.2,4.4,5.44])
          .add('block',trim,[side*12,.02,z],[4.48,.30,5.41]);
        if(i%2===0){
          const h=2.5+random()*2;
          land.add('block',wall,[side*15,h*.5,z],[3.8,h,5.3])
            .add('cone',0x674a4d,[side*15,h+.88,z],[6,2.1,6],[0,.37,0]);
          for(const dz of [-1.4,0,1.4]) lamps.add('block',lamp,[side*13.08,h*.62,z+dz],[.08,.62,.31]);
        }
      }else if(index===6){
        for(let j=0;j<4;j++){
          land.add('block',rock[(j+i)%3],[side*(10+j*2.15),-3.2+j*1.35,z],[4.2,3.6+j*.7,5.57],[0,random()*.12,side*.038]);
        }
      }else{
        for(let j=0;j<2;j++){
          const h=height*(1+j*.64);
          land.add('rock',rock[(i+j)%3],[x+side*j*4,h*.43-4.1,z],[7+j*3,h*1.5,10],[.14,random()*2,side*.19]);
        }
        if(index===3) for(let j=0;j<5;j++) pine(x+side*(j*.78-1),height*.9-4.0,z+random()*3,4+random()*5);
        if(index===4 && i%4===2){
          for(let j=0;j<4;j++){
            land.add('shard',0x8aabaf,[x-side*(2+j*.18),height*.25-3,z+j*.28],[.47,height*1.04,.78],[.08,.13,-side*.20]);
          }
        }
        if(index===7 && i%3===1){
          land.add('taper',wall,[x,-.3,z],[3.4,7,3.4])
            .add('cone',trim,[x,5.15,z],[3.8,4.2,3.8]);
        }
      }
    }
    const x=side*6, z=gateZ;
    fort.add('block',wall,[side*10,1.0,z-2],[10,6,5])
      .add('block',trim,[side*10,4.1,z-2],[10.3,.30,5.3]);
    const towerHeight=[6.5,8.3,7.6,5.6,11.6][index-3];
    fort.add('taper',wall,[x,towerHeight*.5,z],[3.6,towerHeight,3.6])
      .add('octagon',trim,[x,towerHeight-.15,z],[4,.46,4]);
    for(const level of [.26,.62,.84]) fort.add('octagon',trim,[x,towerHeight*level,z],[3.7-level*.4,.18,3.7-level*.4]);
    if(index===3 || index===7){
      fort.add('cone',index===3?0x4b4946:0x484053,[x,towerHeight+2,z],[4.1,4.4,4.1]);
      for(let j=0;j<5;j++) fort.add('cone',trim,[side*(8.2+j*1.2),4.9,z],[.45,2,.45]);
    }else beacon(x,towerHeight+.87,z,1.34);
    fort.add('pennant',index===3?0x344d40:0x733b42,[side*3.8,4.4,z+1.19],[1.33,3.8,.5])
      .add('spade',trim,[side*3.8,4.3,z+1.24],[.33,1.2,.30]);
    if(index===6){
      for(const px of [9,11.5])fort.add('block',trim,[side*px,3,z+5],[.47,7,.5],[0,0,side*.09]);
      fort.add('block',wall,[side*9,6.85,z+5],[8,.49,.65],[0,0,side*.18])
        .add('block',wall,[side*6,.5+3.0,z+5],[.10,5,.1])
        .add('hex',trim,[side*6,1.16,z+5],[1.4,1.1,1.4]);
    }
  }
  fort.add('block',wall,[0,2.5,gateZ-1.3],[10,7,2.8]);
  fort.add('block',0x242530,[0,2.0,gateZ+.19],[5.2,4,.22]);
  for(let j=-5;j<=5;j++){
    const h=4.4-.063*j*j;
    lamps.add('block',lamp,[j*.43,h*.5,gateZ+.34],[.16,h,.12]);
  }
  for(let j=0;j<=14;j++){
    const a=j*Math.PI/14;
    fort.add('block',trim,[Math.cos(a)*2.59,2.18+Math.sin(a)*2.44,gateZ+.47],[.53,.55,.52],[0,0,a-Math.PI/2]);
  }
  if(index===4 || index===6){
    for(const h of [6.58,7.62])fort.add('block',trim,[0,h,gateZ],[11,.26,.62]);
    for(let j=-5;j<5;j++)fort.add('block',wall,[j+.49,7.1,gateZ+.08],[1.5,.16,.34],[0,0,(j%2?1:-1)*.78]);
  }
  if(index===4){
    for(const side of [-1,1]){
      for(const offset of [0,1]){
        const x=side*(2.95+offset*1.25);
        fort.add('block',0x493e37,[x,5.42,gateZ+.6],[.15,2.05,.14]);
        fort.add('hex',trim,[x,4.31,gateZ+.6],[.28,.29,.28]);
      }
      fort.add('hex',wall,[side*6,11.3,gateZ],[.13,2.5,.13])
        .add('pennant',0x813e37,[side*6+.59,11.94,gateZ],[1.14,.79,.32]);
    }
  }
  const rockMesh=land.mesh(), castle=fort.mesh();
  rockMesh.material=cliffFinish;
  castle.material=masonryFinish;
  group.add(rockMesh,castle,new THREE.Mesh(lamps.geometry,new THREE.MeshBasicMaterial({vertexColors:true})));
  return group;
}
