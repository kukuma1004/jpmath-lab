import * as THREE from 'three';

// Elliptical armour courses with independently shaped silhouettes and folded hems.
function courses(rows, sides = 14, pleats = 0, hem = 0) {
  const positions = [];
  const indices = [];
  rows.forEach(([height, width, depth, offset = 0], row) => {
    for (let i = 0; i < sides; i++) {
      const angle = i * Math.PI * 2 / sides;
      const ridge = 1 + (i % 2 ? -1 : 1) * pleats * (1 - row / rows.length);
      positions.push(Math.sin(angle) * width * ridge, height + (!row ? hem * Math.cos(3 * angle) : 0), offset + Math.cos(angle) * depth * ridge);
      if (row) {
        const a = (row - 1) * sides + i, b = (row - 1) * sides + (i + 1) % sides;
        indices.push(a, b, a+sides, b, b+sides, a+sides);
      }
    }
  });
  for(let i=1;i<sides-1;i++) {
    const top=(rows.length-1)*sides;
    indices.push(0,i+1,i,top,top+i,top+i+1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

export function installShapes(shape, plaque) {
  shape.ridge = courses([[-.5,.43,.45],[-.32,.5,.50],[.05,.43,.44],[.34,.26,.28],[.5,.02,.04]],8);
  shape.helm = courses([[-.5,.47,.45],[-.34,.5,.49],[0,.44,.46],[.29,.27,.32],[.5,.035,.065]]);
  shape.cuirass = courses([[-.5,.31,.37],[-.36,.37,.42],[-.02,.48,.49],[.22,.5,.50],[.39,.41,.39],[.5,.28,.28]]);
  shape.spaulder = courses([[-.5,.44,.44],[-.38,.5,.50],[.05,.47,.48],[.38,.32,.37],[.5,.13,.19]]);
  shape.skirt = courses([[-.5,.50,.50,-.08],[-.40,.485,.48,-.07],[.16,.33,.35],[.5,.29,.30]],20,.135,.043);
  shape.cowl = courses([[-.5,.36,.44,-.09],[-.2,.50,.5,-.04],[.11,.47,.45],[.5,.30,.32]],16,.065,.09);
  shape.mantle = plaque([[-.32,.50],[.30,.50],[.39,.28],[.48,-.43],[.26,-.49],[.09,-.37],[-.06,-.51],[-.23,-.44],[-.46,-.49],[-.35,.14]],.04,.012);
  shape.kite = plaque([[-.5,.32],[-.24,.45],[0,.54],[.46,.39],[.49,.18],[.35,-.23],[.05,-.57],[-.21,-.34],[-.42,-.04]],.09,.019);
  shape.axe = plaque([[-.54,.24],[-.32,.43],[-.09,.48],[.01,.34],[-.12,.30],[.08,.10],[.25,.25],[.28,.42],[.49,.21],[.55,-.04],[.49,-.30],[.35,-.51],[.32,-.25],[.22,-.15],[.08,-.08],[-.10,.07],[-.23,.16],[-.38,.19]],.125,.018);
  shape.wave = plaque([[-.49,-.16],[-.39,.06],[-.22,.25],[-.05,.33],[.15,.31],[.25,.20],[.22,.09],[.15,.16],[.02,.17],[-.14,.09],[-.20,-.01],[-.06,-.08],[.19,-.16],[.40,-.13],[.51,-.05],[.43,-.21],[.24,-.28],[.02,-.25],[-.24,-.14]],.027);
  shape.blade = plaque([[-.17,-.5],[.19,-.48],[.28,.17],[0,.5],[-.23,.17]],.13,.012);
}

const iron=0x41444a, steel=0x818383, edge=0xb2a18b, gold=0xb68b50, dark=0x302b2a, hide=0x654635, teal=0x285650;
function rod(b,a,c,width,color,stride=0) {
  const axis=new THREE.Vector3(...c).sub(new THREE.Vector3(...a));
  const rotation=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.clone().normalize()));
  b.add('octagon',color,a.map((v,i)=>(v+c[i])/2),[width,axis.length(),width],[rotation.x,rotation.y,rotation.z],stride);
}
function arch(b,points,width,color) {
  for(let i=1;i<points.length;i++) rod(b,points[i-1],points[i],width,color);
}
export function ranger(b,leader) {
  for(const s of [-1,1]) {
    b.add('spaulder',iron,[s*.116,.24,0],[.139,.29,.15],[.08,0,s*.08],s)
      .add('dome',hide,[s*.125,.09,.049],[.163,.17,.285],[0,s*.09,0],s)
      .add('spaulder',steel,[s*.188,.80,0],[.218,.198,.245],[0,0,s*.29])
      .add('octagon',edge,[s*.196,.758,0],[.181,.021,.218],[0,0,s*.29]);
    rod(b,[s*.207,.745,.00],[s*.246,.593,.09],.114,0x74716b);
    rod(b,[s*.246,.593,.09],[s*.20,.60,.21],.094,hide);
  }
  b.add('skirt',0x24423e,[0,.47,-.025],[.458,.45,.35],[.08,0,0])
    .add('cuirass',0x495858,[0,.678,0],[.399,.337,.305])
    .add('octagon',hide,[0,.562,0],[.354,.059,.281])
    .add('cowl',0x32635c,[0,.827,-.025],[.37,.176,.32])
    .add('helm',steel,[0,1.01,0],[.275,.273,.267])
    .add('octagon',edge,[0,.925,0],[.278,.025,.274])
    .add('spaulder',iron,[0,.912,-.025],[.235,.10,.229])
    .add('dome',gold,[0,1.148,0],[.032,.051,.049]);
  // The camera sees the rear ranks: build the equipment on their backs in relief.
  b.add('mantle',0x326862,[0,.479,-.145],[.425,.390,.69],[-.18,0,.03])
    .add('cowl',0x4b7971,[0,.795,-.055],[.357,.177,.31])
    .add('octagon',0x805639,[0,.572,-.014],[.396,.055,.317])
    .add('ridge',0xaaa195,[0,1.025,-.006],[.026,.261,.281]);
  rod(b,[-.150,.795,-.147],[.138,.569,-.179],.047,0xa17550);
  rod(b,[.148,.798,-.15],[-.137,.568,-.176],.043,0x735036);
  for(const side of [-1,1]) {
    b.add('spaulder',0x665a4b,[side*.113,.386,.01],[.155,.184,.176],[0,0,side*.07],side)
      .add('octagon',0xb29b79,[side*.224,.693,.045],[.12,.034,.122],[.15,0,side*.18])
      .add('dome',0x806e58,[side*.125,.088,-.047],[.155,.108,.12],[0,0,0],side);
  }
  // Wide recurved limbs bracket each helmet at the oblique chase-camera angle.
  const tips=[[-.514,.703,.112],[-.472,.738,.15],[-.334,.807,.231],[-.151,.839,.281],[.029,.817,.278],[.218,.768,.236],[.412,.677,.132],[.473,.652,.106]];
  arch(b,tips,.032,0xc29462);
  rod(b,tips[0],tips.at(-1),.011,0xd2bd98);
  rod(b,[.026,.807,.13],[.028,.835,.408],.052,hide);
  if(leader) {
    rod(b,[-.20,.39,-.06],[-.23,1.84,-.06],.029,hide);
    b.add('pennant',teal,[-.40,1.68,-.06],[.38,.28,.6],[0,.2,-.08])
      .add('spade',gold,[-.40,1.69,-.077],[.075,.117,.17]);
  }
  return b.geometry;
}

function shield(b,color,tower) {
  const pos=[-.69,1.30,.38], angle=[.07,-.16,-.10], size=[tower?.97:.86,tower?1.63:1.42,.73];
  b.add('kite',edge,pos,size,angle)
    .add('kite',color,[-.69,1.30,.446],[size[0]*.906,size[1]*.91,.55],angle)
    .add('wave',gold,[-.69,1.32,.52],[.49,.49,.55],angle);
  for (const [x,y] of [[-.34,.37],[-.14,.52],[.29,.44],[.32,.21],[.21,-.24],[.045,-.62],[-.22,-.29]]) {
    b.add('dome',gold,[-.69+x,1.30+y,.491+x*.16+y*.07],[.035,.036,.034]);
  }
}
function weapon(b,stage) {
  const upper=[1.19,2.43,.31], lower=[.43,.51,.32];
  rod(b,lower,upper,.084,hide);
  for(const h of [.12,.39,.55,.87,.98]) {
    const x=lower[0]+.76*h, y=lower[1]+1.92*h;
    rod(b,[x-.013,y-.031,.32],[x+.013,y+.031,.32],.105,gold);
  }
  if(stage===4 || stage===6) {
    b.add('axe',edge,upper,[stage===6?1.23:1.14,stage===6?1.19:1.07,1],[0,-.1,-.26])
      .add('axe',steel,[1.17,2.46,.394],[stage===6?1.08:.94,stage===6?1.03:.88,.25],[0,-.1,-.26]);
  } else if(stage===2) {
    b.add('block',iron,upper,[.85,.50,.49],[0,.11,-.30]);
    for(const s of [-1,1]) b.add('block',edge,[1.19+s*.34,2.43-s*.105,.31],[.115,.54,.53],[0,.11,-.30]);
  } else if(stage===3) {
    const p=[[.66,.51,.35],[1.10,.91,.35],[1.25,1.50,.35],[1.23,2.08,.35],[.93,2.65,.35]];
    arch(b,p,.098,hide);rod(b,p[0],p.at(-1),.025,edge);
  } else if(stage===5) {
    for(const s of [-1,0,1]) {
      rod(b,upper,[1.28+s*.23,2.63,.31],.084,gold);
      b.add('blade',edge,[1.36+s*.23,2.84,.31],[.25,.48,.8],[0,0,-.32]);
    }
  } else {
    b.add('blade',stage===1?0xa3cdd4:edge,[1.33,2.79,.31],[stage===1?.65:.86,stage===7?1.32:.89,.9],[0,0,-.38]);
    if(stage!==1) rod(b,[.90,2.55,.31],[1.45,2.34,.31],.084,gold);
  }
}

export function knight(b,stage) {
  const colors=[0x654544,0x527382,0x76422d,0x3b5040,teal,0x575a73,0x854c39,0x553d50];
  const cloth=colors[stage], plated=stage===2||stage===6, shell=plated?0x5c5855:0x686c70;
  for(const s of [-1,1]) {
    const x=s*(plated?.38:.345);
    const leg=s;
    b.add('dome',dark,[x,.11,.101+s*.045],[.303,.208,.498],[0,s*.15,0],leg)
      .add('spaulder',shell,[x,.375,.004],[.229,.466,.24],[.10,0,-s*.10],leg)
      .add('dome',edge,[x,.606,.086],[.245,.24,.219],[0,0,-s*.10],leg)
      .add('dome',steel,[x,.61,.12],[.203,.204,.20],[0,0,-s*.10],leg);
    rod(b,[s*.206,1.065,-.02],[x,.643,.012],.246,iron,leg);
    for(let j=0;j<3;j++) b.add('spaulder',j%2?steel:shell,[s*(.235+.029*j),1.225-.105*j,.015],[.34,.177,.44],[0,0,s*.22]);
    const shoulder=s*(plated?.54:.437);
    rod(b,[shoulder,1.89,0],[s*.61,1.55,.067],.226,iron);
    for(let j=0;j<3;j++) b.add('spaulder',j===1?edge:shell,[shoulder+s*.021*j,1.94-.063*j,0],[plated?.54:.384,.215,.442],[0,0,s*.31]);
    rod(b,[s*.61,1.55,.07],[s*.74,1.50,.28],.171,shell);
    b.add('dome',iron,[s*.76,1.49,.30],[.178,.18,.194]);
  }
  b.add('skirt',cloth,[0,.987,-.03],[.74,.93,.56])
    .add('cuirass',shell,[0,1.642,0],[plated?1.03:.86,.66,.57])
    .add('octagon',hide,[0,1.346,.015],[.66,.106,.49])
    .add('dome',gold,[0,1.35,.263],[.149,.122,.042])
    .add('cowl',iron,[0,1.971,0],[.48,.207,.45])
    .add('helm',shell,[0,2.211,-.006],[.43,.496,.417])
    .add('kite',iron,[0,2.146,.182],[.357,.32,.65])
    .add('blade',gold,[0,2.157,.22],[.068,.33,.32]);
  for(const s of [-1,1]) {
    rod(b,[0,2.214,.233],[s*.171,2.248,.143],.034,gold);
    rod(b,[0,2.195,.237],[s*.155,2.226,.163],.023,0x211e20);
    for(let i=0;i<4;i++) b.add('dome',gold,[s*(.238-i*.023),1.8-i*.101,.228],[.031,.031,.032]);
  }
  // Overlapping belly lames, raised breastbone and sweeping gorget edge.
  for(let j=0;j<3;j++) b.add('cuirass',j===1?steel:shell,[0,1.425+j*.064,.14],[.67+j*.061,.146,.34]);
  for(const side of [-1,1]) {
    arch(b,[[side*.381,1.856,.106],[side*.273,1.826,.211],[side*.144,1.772,.291],[0,1.73,.306]],.048,edge);
    rod(b,[side*.34,1.835,.167],[side*.128,1.527,.265],.064,0x664b38);
    b.add('mantle',cloth,[side*.294,1.40,-.21],[.54,.97,.87],[.19,side*.17,side*.18]);
  }
  b.add('spade',gold,[0,1.761,.316],[.146,.164,.64])
    .add('blade',edge,[0,1.641,.308],[.051,.19,.31]);
  for(const side of [-1,1]) {
    const shoulder=side*(plated?.54:.437);
    b.add('dome',edge,[shoulder,1.89,.189],[.134,.133,.049])
      .add('dome',iron,[shoulder,1.89,.217],[.090,.089,.038])
      .add('kite',shell,[side*.108,2.118,.187],[.129,.213,.48],[.03,side*.31,side*.05])
      .add('blade',edge,[side*.345,.398,.119],[.087,.358,.43],[.11,0,-side*.10]);
    rod(b,[side*.636,1.545,.116],[side*.656,1.534,.157],.209,edge);
  }
  b.add('mantle',cloth,[.042,.996,.252],[.474,.704,.61],[.04,0,-.06])
    .add('wave',gold,[.041,.808,.277],[.294,.255,.47]);
  if([0,4].includes(stage)) shield(b,cloth,stage===0);
  weapon(b,stage);
  if(stage===4) b.add('blade',edge,[0,2.43,-.025],[.13,.291,1.6],[.17,Math.PI/2,0]);
  if(stage===1 || stage===3 || stage===7) for(const s of [-1,1]) {
    if(stage===1) for(let i=0;i<3;i++) b.add('shard',i===1?0x7daabd:0xabc8cb,[s*(.44+.1*i),2.07-.058*i,-.10],[.166,.56,.17],[.24,0,-s*(.32+.31*i)]);
    if(stage===3) {
      arch(b,[[s*.16,2.36,-.06],[s*.34,2.51,-.055],[s*.44,2.75,-.10]],.059,hide);
      rod(b,[s*.30,2.49,-.06],[s*.27,2.68,-.06],.042,edge);
      b.add('skirt',cloth,[s*.29,1.73,-.085],[.37,.56,.43],[0,0,s*.33]);
    }
    if(stage===7) {
      b.add('pennant',cloth,[s*.39,1.32,-.263],[.74,1.87,1],[.19,s*.21,s*.25]);
      for(let i=0;i<2;i++) b.add('blade',gold,[s*(.105+i*.082),2.44+i*.071,0],[.135,.31+i*.14,.66],[0,0,-s*(.14+.16*i)]);
    }
  }
  if(stage===2) {
    for(const s of [-1,1]) {
      b.add('octagon',iron,[s*.42,2.07,-.250],[.218,.80,.22])
        .add('octagon',gold,[s*.42,2.47,-.250],[.244,.069,.244]);
      for(let i=0;i<3;i++) rod(b,[s*.069,1.78-i*.087,.284],[s*.264,1.82-i*.087,.229],.044,0xff821e);
    }
  }
  if(stage===5) b.add('dome',gold,[0,2.39,-.035],[.71,.185,.55]);
  if(stage===6) for(const s of [-1,1]) b.add('shard',0x975c49,[s*.56,1.94,0],[.66,.49,.55],[0,0,-s*.31]);
  return b.geometry;
}
