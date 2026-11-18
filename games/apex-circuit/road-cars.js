// Profiles run from the tail to the nose. Widths are half widths in scene units.
import * as T from './vendor/three.module.min.js';

const profiles = {
  'model-s': { color: 0xe9e9e3, w: 1.08, l: 4.63, h: .88, r: .39, ax: 1.43,
    roof: [[-.88,.04,.70],[-.66,.18,.83],[-.35,.53,.78],[-.08,.60,.77],[.16,.54,.75],[.46,.04,.83]], wheel: 10 },
  'model-3': { color: 0xb8242a, w: 1.01, l: 4.18, h: .88, r: .36, ax: 1.27,
    roof: [[-.86,.04,.65],[-.63,.24,.80],[-.36,.57,.79],[-.06,.69,.73],[.19,.58,.74],[.52,.03,.86]], wheel: 5 },
  'model-x': { color: 0xbfc5ca, w: 1.15, l: 4.66, h: 1.04, r: .43, ax: 1.43,
    roof: [[-.94,.04,.79],[-.78,.36,.81],[-.49,.66,.79],[-.12,.77,.77],[.14,.73,.75],[.49,.04,.87]], wheel: 10 },
  'model-y': { color: 0x245c9b, w: 1.09, l: 4.34, h: .98, r: .40, ax: 1.31,
    roof: [[-.94,.04,.74],[-.76,.30,.81],[-.40,.65,.79],[-.06,.76,.75],[.19,.62,.75],[.51,.03,.86]], wheel: 7 },
  cybertruck: { color: 0xa8adae, w: 1.17, l: 4.70, h: 1.08, r: .45, ax: 1.50,
    roof: [[-.96,.05,.90],[-.48,.34,.88],[-.04,.78,.82],[.69,.01,.91]], wheel: 7 },
  'ioniq-5-n': { color: 0x93cde4, w: 1.08, l: 4.20, h: .99, r: .39, ax: 1.38,
    roof: [[-.96,.04,.84],[-.78,.59,.84],[-.61,.66,.81],[.02,.67,.80],[.19,.62,.78],[.53,.04,.86]], wheel: 10 },
  'rs-etron-gt': { color: 0x175243, w: 1.12, l: 4.62, h: .83, r: .40, ax: 1.42,
    roof: [[-.89,.04,.70],[-.60,.28,.76],[-.34,.57,.74],[-.05,.61,.72],[.16,.52,.71],[.41,.03,.82]], wheel: 5 }
};

export function buildRoadCar(id, envMap) {
  const p = profiles[id];
  if (!p) throw new RangeError('Unknown road car: ' + id);
  const truck = id === 'cybertruck', hatch = id === 'ioniq-5-n', gt = id === 'rs-etron-gt';
  const yModel = id === 'model-y', xModel = id === 'model-x';
  const half = p.l / 2, w = p.w;
  const group = new T.Group();
  group.name = id;
  const batches = new Map();
  function material(color, metalness, roughness, emissive) {
    const m = new T.MeshStandardMaterial({ color, metalness, roughness, envMap: envMap || null, side: T.DoubleSide });
    if (emissive) { m.emissive.setHex(emissive); m.emissiveIntensity = 1.25; }
    batches.set(m, { pos: [], normal: [] });
    return m;
  }
  const paint = material(p.color, truck ? .64 : .40, truck ? .32 : .22);
  const glass = material(0x142839,.60,.16), black = material(0x171b20,.28,.42);
  const tire = material(0x202124,.03,.88), alloy = material(0xb0b7bc,.76,.28);
  const led = material(0xe6faff,.15,.24,0xc5edff), red = material(0xcf1826,.18,.25,0xab0810);
  const trim = hatch ? material(0xf04727,.32,.32) : black;
  // Brushed sheet varies mainly across the rolling direction. Object-space
  // coordinates keep the grain attached to each panel while the car turns.
  function surfaceFinish(mat, expression) {
    mat.onBeforeCompile = shader => {
      shader.vertexShader = 'varying vec3 vPanel;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>', '#include <begin_vertex>\nvPanel = position;');
      shader.fragmentShader = 'varying vec3 vPanel;\n' + shader.fragmentShader.replace(
        '#include <color_fragment>', '#include <color_fragment>\n' + expression);
    };
    mat.customProgramCacheKey = () => expression;
  }
  if (truck) {
    paint.metalness = .78;
    paint.roughness = .30;
    paint.envMapIntensity = 1.22;
    surfaceFinish(paint, `
      float grainPhase = (vPanel.y + vPanel.z * .016 + vPanel.x * .009) * 880.;
      float grain = sin(grainPhase + 1.8 * sin(grainPhase * .37));
      float grainVisibility = 1. - smoothstep(.5, 3., fwidth(grainPhase));
      float rolling = .045 * sin(32. * vPanel.y + .8 * vPanel.z);
      diffuseColor.rgb *= 1. + rolling + .10 * grain * grainVisibility;
    `);
  }
  glass.envMapIntensity = .68;
  surfaceFinish(glass, `
    float skyBand = smoothstep(.9, 1.8, vPanel.y);
    diffuseColor.rgb *= mix(vec3(.49,.61,.75), vec3(.94,1.12,1.32), skyBand);
  `);
  function collect(mat, geom) {
    const g = geom.index ? geom.toNonIndexed() : geom;
    const batch = batches.get(mat);
    batch.pos.push(...g.attributes.position.array);
    batch.normal.push(...g.attributes.normal.array);
    g.dispose();
    if (geom !== g) geom.dispose();
  }
  function quad(m,a,b,c,d) {
    const g = new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute([...a,...b,...c,...a,...c,...d],3));
    g.computeVertexNormals(); collect(m,g);
  }
  function box(m,x,y,z,sx,sy,sz) {
    collect(m,new T.BoxGeometry(sx,sy,sz).translate(x,y,z));
  }
  function rod(m,a,b,r,segments=6) {
    const va = new T.Vector3(...a), vb = new T.Vector3(...b);
    const delta = vb.clone().sub(va);
    const rot = new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize());
    const center = va.addScaledVector(delta,.5);
    collect(m,new T.CylinderGeometry(r,r,delta.length(),segments).applyQuaternion(rot).translate(center.x,center.y,center.z));
  }
  // Station rings form the bumper corners, rolled shoulder and hood. The lower
  // edge rises around each axle, leaving an actual opening over the tires.
  const stations = new Set([-1,-.965,-.88,-.75,-.5,-.2,0,.3,.52,.76,.9,.97,1].map(n=>n*half));
  for (const axle of [-p.ax,p.ax]) for(let i=0;i<=12;i++) stations.add(axle+(p.r+.065)*Math.cos(Math.PI*i/12));
  const rings = [...stations].sort((a,b)=>a-b).map(z=>{
    const u=z/half, end=Math.abs(u);
    const rounding = Math.pow(Math.max(0,(end-.69)/.31),2);
    const width=w*(1-(truck?.075:hatch?.10:gt?.20:.18)*rounding);
    const dz=Math.min(Math.abs(z-p.ax),Math.abs(z+p.ax));
    const arch=p.r+.045;
    const lower=dz<=arch ? p.r+Math.sqrt(Math.max(0,arch*arch-dz*dz)) : .29;
    const top=p.h+(truck ? -.13*u : -.12*Math.max(0,u))-.085*Math.pow(end,6);
    const fender = truck ? 0 : .083*Math.exp(-Math.pow(dz/.50,2));
    const shoulder=Math.max(lower+.026,top-.07+fender);
    const corners=[[truck?.92:.87,lower],[.977,lower*.40+shoulder*.60],[1,shoulder],
      [.945,Math.max(top+fender,shoulder+.026)],[.74,top+.040+fender*.55],[.46,top+.060],[0,top+.064]];
    return [...corners.map(([x,y])=>[-x*width,y,z]),...corners.slice(0,-1).reverse().map(([x,y])=>[x*width,y,z])];
  });
  const body = new T.BufferGeometry(), vertices=rings.flat(2), indices=[];
  const n=rings[0].length;
  for(let i=1;i<rings.length;i++) for(let j=0;j<n-1;j++) {
    const a=(i-1)*n+j, b=i*n+j;
    indices.push(a,b,b+1,a,b+1,a+1);
  }
  body.setAttribute('position',new T.Float32BufferAttribute(vertices,3)); body.setIndex(indices);
  if(truck) {
    const facets=body.toNonIndexed(); facets.computeVertexNormals(); collect(paint,facets); body.dispose();
  } else { body.computeVertexNormals(); collect(paint,body); }
  for(const ring of [rings[0],rings.at(-1)]) {
    // Pair the shoulder edges with a recessed lower bumper, then crown the hood lip.
    const dir=Math.sign(ring[0][2]), top=ring.slice(2,-2);
    for(let j=0;j<top.length-1;j++) {
      const a=top[j], b=top[j+1];
      const bevel=v=>[v[0]*.985,v[1]-.10,v[2]+dir*.048];
      const foot=v=>[v[0]*.94,.30,v[2]-dir*.045];
      quad(paint,a,b,bevel(b),bevel(a));
      quad(paint,bevel(a),bevel(b),foot(b),foot(a));
    }
    for(const side of [-1,1]) {
      const [lower,mid,shoulder]=side<0?ring:ring.slice().reverse();
      quad(paint,lower,mid,shoulder,[shoulder[0]*.94,.30,shoulder[2]-dir*.045]);
    }
  }
  function cabinSection([u,rise,roofW]) {
    const z=u*half, base=p.h+.005-.12*Math.max(0,u);
    return [[-.92*w,base,z],[-roofW*w,base+rise,z],[-roofW*w*.75,base+rise+(truck?0:.036),z],
      [roofW*w*.75,base+rise+(truck?0:.036),z],[roofW*w,base+rise,z],[.92*w,base,z]];
  }
  const roofProfile=[];
  for(let i=0;i<p.roof.length-1;i++) {
    const a=p.roof[i], b=p.roof[i+1];
    roofProfile.push(a);
    if(!truck && i>0 && i<p.roof.length-2) {
      const prev=p.roof[i-1], next=p.roof[i+2];
      roofProfile.push(a.map((v,k)=>(v+b[k])/2+(v+b[k]-prev[k]-next[k])/16));
    }
  }
  roofProfile.push(p.roof.at(-1));
  const canopy=roofProfile.map(cabinSection);
  for(let i=1;i<canopy.length;i++) {
    const a=canopy[i-1], b=canopy[i];
    for(let j=0;j<5;j++) {
      const bed=truck && i===1;
      const roofPanel=i>1 && i<canopy.length-1 && (hatch || gt);
      quad(bed ? black : roofPanel && j>0 && j<4 ? paint : glass,a[j],b[j],b[j+1],a[j+1]);
    }
    for(const [bottom,top] of [[0,1],[5,4]]) {
      rod(paint,a[top],b[top],truck?.020:.027);
      rod(truck?black:alloy,a[bottom],b[bottom],.014);
      if(i===1 || i===canopy.length-1 || (!truck && roofProfile[i]===p.roof[3])) rod(roofProfile[i]===p.roof[3]?black:paint,b[bottom],b[top],roofProfile[i]===p.roof[3]?.036:.024);
    }
  }
  for(const side of [-1,1]) {
    const x=side*w;
    box(trim,x*.96,.31,0,.09,.08,p.ax*1.43);
    // A shut line and lower crease break up the long side panels at grazing angles.
    for(const z of [-p.ax*.61,.03,p.ax*.61]) {
      const bottomZ=z*.86;
      rod(black,[x*.993,p.h-.075,z],[x*.962,.36,bottomZ],.008,4);
    }
    if(hatch || gt) rod(hatch?alloy:paint,[x*.976,.40,-p.ax*.62],[x*.985,hatch?.70:.48,p.ax*.64],.014);
    for(const door of [-.45,.46]) {
      box(truck?black:alloy,x*.984,p.h-.115,door,.025,.026,.13);
    }
    rod(black,[x*.85,p.h+.13,.55],[x*1.025,p.h+.14,.54],.031);
    box(paint,x*1.047,p.h+.175,.55,.17,.095,.20);
    if(xModel || hatch || yModel || truck) for(const axle of [-p.ax,p.ax]) {
      const count=truck?4:14;
      for(let i=0;i<count;i++) {
        const arc=(index,radius)=>[x*1.009,p.r+radius*Math.sin(Math.PI*index/count),axle+radius*Math.cos(Math.PI*index/count)];
        quad(black,arc(i,p.r+.012),arc(i+1,p.r+.012),arc(i+1,p.r+.098),arc(i,p.r+.098));
      }
    }
    for(const axle of [-p.ax,p.ax]) {
      const center=x*.895, outer=x*1.006;
      const disk=(m,rad,depth,cx)=>collect(m,new T.CylinderGeometry(rad,rad,depth,28).rotateZ(Math.PI/2).translate(cx,p.r,axle));
      disk(tire,p.r,.23,center); disk(black,p.r*.76,.025,outer);
      {
        const lip=new T.TorusGeometry(p.r*.715,.012,5,28).rotateY(Math.PI/2);
        collect(truck?black:alloy,lip.translate(outer+side*.017,p.r,axle));
      }
      const point=(r,a,offset)=>[outer+side*offset,p.r+r*Math.sin(a),axle+r*Math.cos(a)];
      for(let i=0;i<p.wheel;i++){
        const a=i*Math.PI*2/p.wheel;
        quad(truck?black:alloy,point(.065,a-.30,.045),point(p.r*.69,a+.10,.03),point(p.r*.69,a+(truck?.68:.34),.03),point(.065,a+.50,.045));
        if(truck) rod(alloy,point(p.r*.37,a+.04,.044),point(p.r*.65,a+.12,.039),.005,4);
      }
      disk(black,p.r*(truck?.24:.17),.038,outer+side*.036);
    }
  }
  const nz=half+.056, tz=-half-.056;
  const bumperW=w*(truck?.925:hatch?.90:gt?.80:.82);
  const frontY=p.h-(truck?.215:.19), rearY=p.h+(truck?.03:-.095);
  const frontLip = truck ? .45 : gt ? .395 : .365;
  quad(black,[-bumperW*.97,frontLip,nz],[bumperW*.97,frontLip,nz],
    [bumperW*.86,.267,nz-.068],[-bumperW*.86,.267,nz-.068]);
  for(const side of [-1,1]) {
    const f=side*bumperW;
    if(!truck && !hatch && !yModel) {
      quad(black,[f*.49,frontY-.042,nz+.004],[f*.96,frontY+.046,nz+.004],
        [f*.90,frontY-.028,nz+.009],[f*.62,frontY-.082,nz+.009]);
    }
    if(!truck) {
      quad(black,[f*.73,.46,nz+.004],[f*.92,.49,nz+.004],[f*.86,.36,nz+.004],[f*.68,.36,nz+.004]);
    }
  }
  box(black,0,.355,tz,bumperW*1.7,.13,.075);
  if(truck || yModel) {
    box(led,0,frontY,nz,bumperW*1.88,truck?.041:.027,.035);
    if(truck) {
      box(black,0,frontY-.044,nz-.003,bumperW*1.95,.068,.044);
      box(black,0,.352,nz+.01,bumperW*1.89,.15,.095);
      for(const side of [-1,1]) {
        const k=side*w;
        const peak=canopy[2][side<0?1:4], nose=canopy[3][side<0?1:4];
        const peakEdge=[peak[0]+side*.012,peak[1]+.004,peak[2]];
        const noseEdge=[nose[0]+side*.012,nose[1]+.004,nose[2]];
        quad(paint,peakEdge,noseEdge,[noseEdge[0]+side*.007,noseEdge[1]-.007,noseEdge[2]-.105],
          [peakEdge[0]+side*.011,peakEdge[1]-.052,peakEdge[2]-.042]);
        const sail=canopy[1][side<0?1:4];
        quad(paint,[k*.929,p.h+.052,-half*.96],[sail[0]+side*.021,sail[1]+.012,sail[2]],
          [k*.923,p.h+.017,-half*.55],[k*.93,p.h+.008,-half*.94]);
        const pillarZ=half*.025;
        rod(black,[k*.923,p.h+.027,pillarZ],[k*.829,p.h+.695,pillarZ],.024,4);
      }
    }
    box(truck?red:black,0,rearY,tz,bumperW*1.92,.055,.025);
    if(yModel) box(red,0,rearY+.022,tz-.019,bumperW*1.81,.024,.02);
  }
  if(hatch) {
    for(const [z,y] of [[nz,frontY],[tz,rearY]]) {
      box(black,0,y,z,bumperW*1.90,.135,.043);
      for(const s of [-1,1]) for(let k=0;k<6;k++) for(let row=0;row<2;row++)
        box(z>0?led:red,s*bumperW*(.52+k*.072),y+(row-.5)*.044,z+Math.sign(z)*.03,.055,.032,.021);
    }
    box(paint,0,p.h+.61,-half*.80,w*1.68,.046,.22);
    box(trim,0,.29,nz,bumperW*1.82,.035,.10);
  } else if(!truck) {
    for(const s of [-1,1]){
      const fx=s*bumperW, rz=tz-.013;
      if(!yModel) {
        rod(led,[fx*.57,frontY-.037,nz],[fx*.91,frontY+.032,nz],gt?.025:.032);
        rod(led,[fx*.91,frontY+.032,nz],[s*w*.96,frontY+.089,half*.89],.025);
      }
      rod(red,[fx*.54,rearY-.024,rz],[fx*.92,rearY+.019,rz],.034);
      rod(red,[fx*.92,rearY+.019,rz],[s*w*.97,rearY+.055,-half*.89],.026);
      if(gt) for(let k=0;k<4;k++) box(led,fx*(.62+.067*k),frontY+.05,nz,.024,.047,.026);
      if(yModel) box(led,fx*.83,frontY-.18,nz,.19,.04,.04);
    }
    if(gt) {
      quad(black,[-bumperW*.66,.57,nz+.017],[bumperW*.66,.57,nz+.017],[bumperW*.49,.36,nz+.017],[-bumperW*.49,.36,nz+.017]);
      box(red,0,rearY-.003,tz-.016,bumperW*1.45,.025,.025);
      for(let i=-2;i<=2;i++) box(black,i*.22,.305,tz-.024,.035,.118,.16);
    }
  } else {
    for(let i=0;i<9;i++){
      const t=i/10, a=canopy[0][2], b=canopy[1][2];
      box(black,0,T.MathUtils.lerp(a[1],b[1],t)+.019,T.MathUtils.lerp(a[2],b[2],t),w*1.49,.025,.035);
    }
  }
  if (id === 'model-s' || xModel) {
    // The S liftback has a low deck lip. The X carries its wing higher
    // above the glass and has a roof joint for each falcon-wing door.
    const z = -half * (xModel ? .83 : .93);
    const y = p.h + (xModel ? .34 : .075);
    box(xModel ? paint : black,0,y,z,w * (xModel ? 1.59 : 1.52),.035,xModel ? .20 : .105);
    for (const side of [-1,1]) {
      if (xModel) {
        rod(black,[side*w*.60,y-.13,z+.02],[side*w*.63,y,z],.027);
        const roofEdge=canopy.find((_,index)=>roofProfile[index]===p.roof[3])[side<0?1:4];
        rod(black,roofEdge,[side*w*.20,roofEdge[1]+.039,roofEdge[2]],.012,4);
      }
      rod(red,[side*bumperW*.54,rearY-.026,tz-.016],
        [side*bumperW*.64,rearY-.074,tz-.016],.016);
    }
  }
  if (hatch) {
    for(const side of [-1,1]) {
      for(let i=0;i<3;i++) {
        const z=-half*(.74+i*.035);
        rod(black,[side*w*.877,p.h+.30-i*.048,z],[side*w*.897,p.h+.23-i*.048,z-.055],.015,4);
      }
    }
  }
  // One draw call per finish, shared across wheels, lamps and body details.
  for(const [mat,data] of batches) {
    if(!data.pos.length) { mat.dispose(); continue; }
    const geo=new T.BufferGeometry();
    geo.setAttribute('position',new T.Float32BufferAttribute(data.pos,3));
    geo.setAttribute('normal',new T.Float32BufferAttribute(data.normal,3));
    geo.computeBoundingSphere();
    group.add(new T.Mesh(geo,mat));
  }
  return group;
}
