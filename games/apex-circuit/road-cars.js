// Profiles run from the tail to the nose. Widths are half widths in scene units.
import * as T from './vendor/three.module.min.js';

const profiles = {
  'model-s': { color: 0xe4e7ec, w: 1.08, l: 4.72, h: .86, r: .39, ax: 1.46,
    roof: [[-.92,.015,.72],[-.72,.12,.83],[-.36,.46,.81],[-.11,.55,.79],[.13,.49,.75],[.44,.04,.84]],
    noseSweep: .24, tailSweep: .15, wheel: 10 },
  'model-3': { color: 0xbc222c, w: 1.01, l: 4.40, h: .86, r: .378, ax: 1.36,
    roof: [[-.87,.025,.72],[-.69,.15,.80],[-.38,.50,.80],[-.09,.61,.76],[.15,.55,.75],[.49,.04,.85]],
    noseSweep: .30, tailSweep: .19, wheel: 5 },
  'model-x': { color: 0xbfc5ca, w: 1.15, l: 4.68, h: 1.05, r: .43, ax: 1.44,
    roof: [[-.96,.04,.80],[-.79,.33,.84],[-.52,.65,.82],[-.21,.76,.79],[.14,.73,.76],[.48,.04,.86]],
    noseSweep: .20, tailSweep: .12, wheel: 10 },
  'model-y': { color: 0x225c9e, w: 1.09, l: 4.34, h: .95, r: .40, ax: 1.33,
    roof: [[-.94,.04,.74],[-.74,.24,.81],[-.42,.58,.80],[-.10,.71,.77],[.14,.65,.75],[.53,.03,.86]],
    noseSweep: .25, tailSweep: .19, wheel: 7 },
  cybertruck: { color: 0xb7bbbd, w: 1.17, l: 4.84, h: 1.08, r: .45, ax: 1.54,
    roof: [[-.96,.04,.90],[-.47,.37,.88],[-.05,.76,.83],[.69,.01,.91]],
    noseSweep: .105, tailSweep: .025, wheel: 7 },
  'ioniq-5-n': { color: 0x90c9e0, w: 1.08, l: 4.26, h: .98, r: .39, ax: 1.40,
    roof: [[-.98,.04,.84],[-.81,.54,.84],[-.63,.63,.82],[-.02,.65,.80],[.17,.61,.78],[.54,.04,.86]],
    noseSweep: .095, tailSweep: .080, wheel: 10 },
  'rs-etron-gt': { color: 0x26705d, w: 1.12, l: 4.76, h: .84, r: .40, ax: 1.46,
    roof: [[-.89,.025,.73],[-.61,.20,.76],[-.35,.48,.76],[-.07,.55,.73],[.14,.48,.72],[.43,.028,.84]],
    noseSweep: .27, tailSweep: .145, wheel: 5 }
};

export function buildRoadCar(id) {
  const p = profiles[id];
  if (!p) throw new RangeError('Unknown road car: ' + id);
  const truck = id === 'cybertruck', hatch = id === 'ioniq-5-n', gt = id === 'rs-etron-gt';
  const yModel = id === 'model-y', xModel = id === 'model-x';
  const modelS = id === 'model-s', model3 = id === 'model-3';
  const half = p.l / 2, w = p.w;
  const group = new T.Group();
  group.name = id;
  const batches = new Map();
  function material(color, metalness, roughness, emissive, clearcoat) {
    const options = { color, metalness, roughness, side: T.DoubleSide };
    const m = clearcoat
      ? new T.MeshPhysicalMaterial({ ...options, clearcoat, clearcoatRoughness: .16 })
      : new T.MeshStandardMaterial(options);
    if (emissive) { m.emissive.setHex(emissive); m.emissiveIntensity = 1.25; }
    batches.set(m, { pos: [], normal: [] });
    return m;
  }
  const paint = material(p.color, truck ? .67 : .54, truck ? .28 : .155, 0, truck ? 0 : .94);
  const glass = material(0x34424c,.26,.09,0,.9), black = material(0x121820,.24,.49);
  const tire = material(0x181b20,.03,.86), alloy = material(truck?0x87929b:0x89939e,.78,.24);
  const led = material(0xe6faff,.15,.24,0xc5edff), red = material(0xcf1826,.18,.25,0xab0810);
  const rotor=material(0x58595a,.68,.39);
  const caliper=material(gt||hatch||model3?0xb82e22:0x414953,.34,.36);
  const cabin = material(0x232830,.06,.72);
  glass.transparent = true;
  glass.opacity = truck ? .84 : .78;
  glass.depthWrite = false;
  glass.forceSinglePass = true;
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
    paint.envMapIntensity = 1.25;
    surfaceFinish(paint, `
      float grainPhase = (vPanel.y + vPanel.z * .016 + vPanel.x * .009) * 880.;
      float grain = sin(grainPhase + 1.8 * sin(grainPhase * .37));
      float grainVisibility = 1. - smoothstep(.5, 3., fwidth(grainPhase));
      float rolling = .012 * sin(45. * vPanel.y + .8 * vPanel.z);
      diffuseColor.rgb *= 1. + rolling + .15 * grain * grainVisibility;
    `);
    surfaceFinish(tire, `
      vec2 treadPoint = vec2(abs(vPanel.z) - ${p.ax}, vPanel.y - ${p.r});
      float theta = atan(treadPoint.y, treadPoint.x);
      float treadPhase = theta * 4.4563 + abs(vPanel.x) * 14.;
      float width = clamp(fwidth(treadPhase), .025, .3);
      float seam = 1. - smoothstep(.09, .09 + width, abs(fract(treadPhase) - .5));
      float shoulder = smoothstep(.86, .99, length(treadPoint) / ${p.r});
      diffuseColor.rgb *= 1. + shoulder * (.14 - .51 * seam);
    `);
  }
  glass.envMapIntensity = .85;
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
  function triangle(m,a,b,c) {
    const g = new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute([...a,...b,...c],3));
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
  const sectionZ = [...stations].sort((a,b)=>a-b);
  const rings = sectionZ.map(z=>{
    const u=z/half, end=Math.abs(u);
    const rounding = Math.pow(Math.max(0,(end-.69)/.31),2);
    const waist=truck?0:(hatch?.018:.036)*Math.exp(-Math.pow(u/.44,2));
    const width=w*(1-waist-(truck?.065:hatch?.085:gt?.16:.16)*rounding);
    const dz=Math.min(Math.abs(z-p.ax),Math.abs(z+p.ax));
    const arch=p.r+.034;
    const floor=truck?.30:gt?.19:.22;
    const lower=dz<=arch ? p.r+Math.sqrt(Math.max(0,arch*arch-dz*dz)) : floor;
    const top=p.h+(truck ? -.115*u : -.145*Math.max(0,u))-(truck?.046:.105)*Math.pow(end,5);
    const fender = truck ? 0 : (gt?.113:.093)*Math.exp(-Math.pow(dz/.52,2));
    const shoulder=Math.max(lower+.026,top-.07+fender);
    const archBlend=1-T.MathUtils.smoothstep(dz,arch,arch+.10);
    const skirtWidth=T.MathUtils.lerp(truck?.95:.955,.995,archBlend);
    const corners=[[skirtWidth,lower],[T.MathUtils.lerp(truck?.982:hatch?.96:.923,.998,archBlend),lower*.51+shoulder*.49],[1,shoulder],
      [.945,Math.max(top+fender,shoulder+.026)],[.74,top+.040+fender*.55],[.46,top+.060],[0,top+.064]];
    function panel(sign,[x,y]) {
      const sweep = truck || hatch ? Math.max(0,(x-.64)/.36) : Math.pow(x,2.4);
      const inset = (u>=0?p.noseSweep:p.tailSweep)*sweep*Math.pow(end,10);
      return [sign*x*width,y,z-Math.sign(u)*inset];
    }
    return [...corners.map(point=>panel(-1,point)),...corners.slice(0,-1).reverse().map(point=>panel(1,point))];
  });
  const body = new T.BufferGeometry(), vertices=rings.flat(2), indices=[];
  const n=rings[0].length;
  for(let i=1;i<rings.length;i++) for(let j=0;j<n-1;j++) {
    const a=(i-1)*n+j, b=i*n+j;
    indices.push(a,b,b+1,a,b+1,a+1);
  }
  body.setAttribute('position',new T.Float32BufferAttribute(vertices,3)); body.setIndex(indices);
  if(truck) {
    // Keep the folds between sheets crisp while letting each sheet reflect as one panel.
    for(let j=0;j<n-1;j++) smoothPanel(paint,rings.map(row=>[row[j],row[j+1]]));
    body.dispose();
  } else { body.computeVertexNormals(); collect(paint,body); }
  // A turned-in metal flange and the dark wheelhouse close the opening behind each tire.
  for (const side of [-1,1]) {
    const idx=side<0?0:n-1;
    for(let i=1;i<rings.length;i++){
      const a=rings[i-1][idx],b=rings[i][idx];
      const inset=(pt,dx,dy)=>[pt[0]-side*dx,pt[1]+dy,pt[2]];
      quad(paint,a,b,inset(b,.030,.004),inset(a,.030,.004));
      quad(black,inset(a,.030,.004),inset(b,.030,.004),inset(b,.26,-.04),inset(a,.26,-.04));
    }
  }
  const crest = rings.map(ring=>ring.slice(2,-2));
  const knots = crest[0].map(p=>p[0]/crest[0].at(-1)[0]);
  function crossPoint(row,u) {
    let i=1;
    while(i<knots.length-1 && knots[i]<u) i++;
    const f=(u-knots[i-1])/(knots[i]-knots[i-1]);
    const a=row[i-1], b=row[i];
    return a.map((value,k)=>T.MathUtils.lerp(value,b[k],f));
  }
  // The lamp lenses, radiator openings and bumper trim share the same swept
  // surface as the end caps, including at the angled corners.
  function fascia(ringIndex,direction) {
    const ring=rings[ringIndex], row=crest[ringIndex];
    const width=row.at(-1)[0];
    function point(u,v,lift) {
      const [,top,z]=crossPoint(row,u);
      // The low edge tucks under; the narrow bevel catches the key light.
      const section=truck ? (v<=.78 ? T.MathUtils.lerp(-.12,.048,v/.78) : T.MathUtils.lerp(.048,0,(v-.78)/.22))
        : -.088*(1-v)**3 + .043*Math.sin(Math.PI*v);
      return [u*width*(.94+.06*v),T.MathUtils.lerp(.27,top,v),z+direction*(section+lift)];
    }
    function band(m,profile,lift=.010) {
      for(let j=1;j<profile.length;j++) {
        const [from,lowerStart,upperStart]=profile[j-1];
        const [to,lowerEnd,upperEnd]=profile[j];
        const cuts=[from,...knots.filter(x=>x>from&&x<to),to];
        for(let i=1;i<cuts.length;i++) {
          const lo=cuts[i-1], hi=cuts[i];
          const slice=(u,part)=>{
            const q=(u-from)/(to-from);
            const bottom=T.MathUtils.lerp(lowerStart,lowerEnd,q);
            const top=T.MathUtils.lerp(upperStart,upperEnd,q);
            const split=T.MathUtils.clamp(.78,bottom,top);
            return [bottom,split,top][part];
          };
          for(let layer=0;layer<2;layer++) {
            const a=point(lo,slice(lo,layer),lift), b=point(hi,slice(hi,layer),lift);
            const c=point(hi,slice(hi,layer+1),lift), d=point(lo,slice(lo,layer+1),lift);
            if(a[1]===d[1]&&b[1]===c[1]) continue;
            if(direction>0) quad(m,a,b,c,d);
            else quad(m,b,a,d,c);
          }
        }
      }
    }
    function stripe(m,from,to,low,high,lift) {
      band(m,[[from,low,high],[to,low,high]],lift);
    }
    if(truck) stripe(paint,-1,1,0,1,0);
    else {
      const across=[...new Set([...knots,...Array.from({length:33},(_,i)=>i/16-1)])].sort((a,b)=>a-b);
      const rows=Array.from({length:13},(_,i)=>across.map(u=>point(u,i/12,0)));
      smoothPanel(paint,direction>0?rows.reverse():rows);
    }
    for(const side of [-1,1]) {
      const [lower,mid,shoulder]=side<0?ring:ring.slice().reverse();
      const bottom=point(side,0,0), bevel=point(side,.78,0);
      quad(paint,lower,mid,bevel,bottom);
      triangle(paint,mid,shoulder,bevel);
    }
    const lipUs=[...new Set([-1,...knots,1])].sort((a,b)=>a-b);
    for(let j=1;j<lipUs.length;j++){
      const a=point(lipUs[j-1],0,.003), b=point(lipUs[j],0,.003);
      const edge=pt=>[pt[0]*1.012,pt[1]-.038,pt[2]+direction*.036];
      const under=pt=>[pt[0]*.94,pt[1]-.039,pt[2]-direction*.18];
      quad(black,a,b,edge(b),edge(a));
      quad(black,edge(a),edge(b),under(b),under(a));
    }
    return {band,stripe};
  }
  const front=fascia(rings.length-1,1);
  const rear=fascia(0,-1);
  function bonnetLens(end,innerOffset) {
    const rows = sectionZ.map((z,i)=>({ z:z/half, rim:crest[i] })).filter(({z})=>z>=end);
    for(const side of [-1,1]) {
      const at=(row,u,lift)=>{
        const p=crossPoint(row.rim,side*u);
        p[1]+=lift;
        return p;
      };
      for(let i=1;i<rows.length;i++) {
        const a=rows[i-1], b=rows[i];
        const taper=row=>T.MathUtils.smoothstep(row.z,end,1);
        const inner=row=>.981-(innerOffset+.095)*taper(row);
        const outer=row=>.992-.030*taper(row);
        quad(black,at(a,inner(a),.012),at(a,outer(a),.012),at(b,outer(b),.012),at(b,inner(b),.012));
        const beamIn=row=>T.MathUtils.lerp(inner(row),outer(row),.27);
        const beamOut=row=>T.MathUtils.lerp(inner(row),outer(row),.59);
        quad(led,at(a,beamIn(a),.021),at(a,beamOut(a),.021),at(b,beamOut(b),.021),at(b,beamIn(b),.021));
      }
    }
  }
  function cabinSection([u,rise,roofW]) {
    const z=u*half, base=p.h+.021-.137*Math.max(0,u);
    const height=rise*(truck?.88:hatch?.96:xModel||yModel?.94:.85);
    const belt=truck?.929:.919-.065*Math.pow(Math.abs(u),2);
    const bow=truck?0:.095*Math.sin(u*Math.PI*.78);
    return [[-belt*w,base,z],[-roofW*w,base+height,z],[-roofW*w*.75,base+height+(truck?0:.043),z+bow],
      [roofW*w*.75,base+height+(truck?0:.043),z+bow],[roofW*w,base+height,z],[belt*w,base,z]];
  }
  const roofProfile=[];
  const roofCurve=new T.CatmullRomCurve3(p.roof.map(([u,r,x])=>new T.Vector3(u,r,x)),false,'centripetal');
  const steps=truck?1:7;
  for(let i=0;i<(p.roof.length-1)*steps;i++) {
    roofProfile.push(i%steps===0?p.roof[i/steps]:roofCurve.getPoint(i/((p.roof.length-1)*steps)).toArray());
  }
  roofProfile.push(p.roof.at(-1));
  const canopy=roofProfile.map(cabinSection);
  // The broad daylight opening reveals the dashboard, paired headrests and rear shelf.
  const cabinRear = p.roof[truck ? 1 : 0][0] + .05;
  const cabinFront = p.roof.at(-1)[0] - .08;
  box(cabin,0,p.h-.14,half*(cabinRear+cabinFront)*.5,w*1.60,.08,half*(cabinFront-cabinRear));
  box(cabin,0,p.h-.12,half*(cabinFront-.13),w*1.38,.095,half*.18);
  for(const rowZ of [-.39,.07]){
    for(const side of [-1,1]){
      const seatX=side*w*.46, seatZ=half*rowZ;
      const back=new T.SphereGeometry(1,12,8).scale(.237,.215,.092).rotateX(-.12);
      collect(cabin,back.translate(seatX,p.h+.065,seatZ));
      collect(cabin,new T.SphereGeometry(1,12,8).scale(.119,.080,.064)
        .translate(seatX,p.h+.270,seatZ-.035));
    }
  }
  function blend(a,b,t){return a.map((v,k)=>T.MathUtils.lerp(v,b[k],t));}
  function smoothPanel(mat, rows){
    const geo=new T.BufferGeometry(), indices=[],count=rows[0].length;
    for(let i=1;i<rows.length;i++) for(let j=1;j<count;j++){
      const a=(i-1)*count+j-1,b=i*count+j-1;
      indices.push(a,b,b+1,a,b+1,a+1);
    }
    geo.setAttribute('position',new T.Float32BufferAttribute(rows.flat(2),3));
    geo.setIndex(indices);geo.computeVertexNormals();collect(mat,geo);
  }
  for(const side of [-1,1]){
    const low=side<0?0:5,high=side<0?1:4;
    const sideRows=canopy.map((row,i)=>{
      const bot=row[low],top=row[high],rise=roofProfile[i][1];
      return [0,.33,.70,1].map(t=>{
        const pt=blend(bot,top,t);
        if(!truck) pt[0]+=side*Math.sin(Math.PI*t)*.032*Math.min(1,rise/.30);
        return pt;
      });
    });
    if(truck) {
      for(let i=1;i<sideRows.length;i++)
        quad(i===1?paint:glass,sideRows[i-1][0],sideRows[i][0],sideRows[i][3],sideRows[i-1][3]);
    } else smoothPanel(glass,sideRows);
    for(let i=1;i<canopy.length;i++){
      const a=canopy[i-1],b=canopy[i],u=(roofProfile[i-1][0]+roofProfile[i][0])*.5;
      const quarterCut = hatch ? -.69 : -.56;
      const pillarDepth = truck ? .081 : .081+.90*(1-T.MathUtils.smoothstep(u,quarterCut-.18,quarterCut));
      const lower=(row,t)=>{const pt=blend(row[high],row[low],t);pt[0]+=side*.010;return pt;};
      const inner=row=>blend(row[high],row[side<0?2:3],truck?.09:.22);
      const edge=row=>[row[high][0]+side*.005,row[high][1]+.006,row[high][2]];
      quad(paint,inner(a),inner(b),edge(b),edge(a));
      quad(paint,edge(a),edge(b),lower(b,pillarDepth),lower(a,pillarDepth));
      rod(truck||hatch?black:alloy,a[low],b[low],truck?.007:.009);
    }
    const pillarAt=truck?-.04:hatch?-.18:-.19;
    if(!truck){
      let k=roofProfile.findIndex(v=>v[0]>pillarAt);
      const row=canopy[k], bot=row[low],top=row[high];
      const pt=(t,dz)=>{const v=blend(bot,top,t);v[0]+=side*(.012+Math.sin(Math.PI*t)*.035);v[2]+=dz;return v;};
      for(let j=0;j<3;j++){
        const t=j/3,v=(j+1)/3;
        quad(black,pt(t,-.040),pt(t,.039),pt(v,.039),pt(v,-.040));
      }
    }
  }
  const upperRows=canopy.map(row=>[row[1],row[2],blend(row[2],row[3],.5),row[3],row[4]]);
  if(!truck) for(const row of upperRows) row[2][1]+=.015;
  const topFinish=i=>truck&&i===1?black:(hatch||gt)&&roofProfile[i][0]>-.55&&roofProfile[i][0]<=.15?paint:glass;
  let run=0;
  for(let i=1;i<upperRows.length;i++){
    if(i===upperRows.length-1||topFinish(i)!==topFinish(i+1)){
      smoothPanel(topFinish(i),upperRows.slice(run,i+1));run=i;
    }
  }
  // The ceramic frit follows the windshield perimeter. A wiper rests just inside the cowl.
  const windStart=canopy.length-1-steps;
  function windshield(u,t,lift) {
    const edge=u<0 ? 1 : 4, center=u<0 ? 2 : 3;
    const q=Math.abs(u);
    function section(row,k) {
      const middle=(row[2][k]+row[3][k])*.5;
      return q<.75 ? T.MathUtils.lerp(middle,row[center][k],q/.75)
        : T.MathUtils.lerp(row[center][k],row[edge][k],(q-.75)/.25);
    }
    const pos=windStart+t*steps, i=Math.floor(pos), j=Math.min(i+1,canopy.length-1);
    return [0,1,2].map(k=>T.MathUtils.lerp(section(canopy[i],k),section(canopy[j],k),pos-i)
      +(k===1?lift+(truck?0:.015*Math.max(0,1-q/.75)):0));
  }
  for(const [lo,hi,t0,t1] of [[-1,1,.954,1],[-1,1,0,.016],[-1,-.978,0,1],[.978,1,0,1]]) {
    for(let i=0;i<6;i++){
      const a=T.MathUtils.lerp(lo,hi,i/6), b=T.MathUtils.lerp(lo,hi,(i+1)/6);
      quad(black,windshield(a,t0,.005),windshield(b,t0,.005),windshield(b,t1,.005),windshield(a,t1,.005));
    }
  }
  if(truck) {
    rod(black,windshield(-.90,.94,.016),windshield(-.94,.39,.016),.011);
    rod(black,windshield(-.945,.67,.022),windshield(-.96,.10,.022),.014);
  } else {
    for(const start of [-.63,.11]){
      rod(black,windshield(start,.96,.013),windshield(start+.25,.89,.016),.009);
      rod(black,windshield(start+.06,.914,.020),windshield(start+.55,.869,.020),.012);
    }
  }
  function sidePoint(side,y,z,lift=0) {
    let i=1;
    while(i<sectionZ.length-1 && sectionZ[i]<z) i++;
    function inSection(ring) {
      const sideRing=side<0 ? ring : ring.slice().reverse();
      const [lower,mid,shoulder,top]=sideRing;
      const [a,b]=y<mid[1]?[lower,mid]:y<shoulder[1]?[mid,shoulder]:[shoulder,top];
      const f=T.MathUtils.clamp((y-a[1])/(b[1]-a[1]),0,1);
      return [T.MathUtils.lerp(a[0],b[0],f)+side*lift,T.MathUtils.lerp(a[1],b[1],f),T.MathUtils.lerp(a[2],b[2],f)];
    }
    const t=T.MathUtils.clamp((z-sectionZ[i-1])/(sectionZ[i]-sectionZ[i-1]),0,1);
    const a=inSection(rings[i-1]), b=inSection(rings[i]);
    return a.map((v,k)=>T.MathUtils.lerp(v,b[k],t));
  }
  for(const side of [-1,1]) {
    const x=side*w;
    const sillSpan=p.ax-p.r-(truck?.044:.085);
    for(let i=0;i<8;i++) {
      const a=sillSpan*(i/4-1), b=sillSpan*((i+1)/4-1);
      const sill=truck||hatch||xModel||yModel?black:paint;
      quad(sill,sidePoint(side,.265,a,.010),sidePoint(side,.265,b,.010),sidePoint(side,.32,b,.019),sidePoint(side,.32,a,.019));
      if(!truck && !hatch) {
        const sweep=z=>.322+.067*(z/sillSpan)**2;
        quad(paint,sidePoint(side,.30,a,.016),sidePoint(side,.30,b,.016),
          sidePoint(side,sweep(b),b,.025),sidePoint(side,sweep(a),a,.025));
      }
      if(truck) quad(black,sidePoint(side,.30,a,.020),sidePoint(side,.30,b,.020),
        sidePoint(side,.398,b,.011),sidePoint(side,.398,a,.011));
      if(hatch) quad(trim,sidePoint(side,.35,a,.018),sidePoint(side,.35,b,.018),sidePoint(side,.385,b,.018),sidePoint(side,.385,a,.018));
    }
    // The shut lines follow the changing cross-section instead of floating as straight rods.
    for(const z of [-p.ax*.60,.035,p.ax*.57]) {
      const top=p.h-.073, bottom=.34;
      for(let i=0;i<6;i++) {
        const a=T.MathUtils.lerp(top,bottom,i/6), b=T.MathUtils.lerp(top,bottom,(i+1)/6);
        const taper=y=>z*(.95+.05*(y-bottom)/(top-bottom));
        const za=taper(a), zb=taper(b);
        quad(black,sidePoint(side,a,za-.0035,.009),sidePoint(side,a,za+.0035,.009),
          sidePoint(side,b,zb+.0035,.009),sidePoint(side,b,zb-.0035,.009));
      }
    }
    if(hatch || gt) {
      const zSpan=p.ax*.65;
      for(let i=0;i<8;i++) {
        const a=zSpan*(i/4-1), b=zSpan*((i+1)/4-1);
        const line=z=>hatch ? .54+z*.16 : .45+z*.04;
        quad(hatch?alloy:paint,sidePoint(side,line(a),a,.014),sidePoint(side,line(b),b,.014),
          sidePoint(side,line(b)+.018,b,.014),sidePoint(side,line(a)+.018,a,.014));
      }
    }
    for(const door of [-.45,.46]) {
      if(truck) continue;
      const y=p.h-.153;
      const [hx,hy,hz]=sidePoint(side,y,door,.009);
      box(black,hx,hy,hz,.012,.036,.145);
      box(truck ? paint : alloy,hx+side*.008,hy+.003,hz,.008,.014,.115);
    }
    rod(black,[x*.86,p.h+.09,.61],[x*1.025,p.h+.14,.59],.023);
    collect(truck?black:paint,new T.SphereGeometry(1,12,6).scale(.091,.048,.103).translate(x*1.039,p.h+.151,.59));
    for(const axle of [-p.ax,p.ax]) {
      const center=x*.895, outer=x*1.006;
      const disk=(m,rad,depth,cx,segments=28)=>collect(m,new T.CylinderGeometry(rad,rad,depth,segments).rotateZ(Math.PI/2).translate(cx,p.r,axle));
      const crossSection=[[.69,-.125],[.88,-.130],[.974,-.101],[1,-.055],[1,.064],[.973,.103],[.872,.128],[.69,.135]];
      const rubber=new T.LatheGeometry(crossSection.map(([r,dx])=>new T.Vector2(r*p.r,dx)),32);
      collect(tire,rubber.rotateZ(-Math.PI/2).translate(center,p.r,axle));
      disk(black,p.r*.763,.024,outer);
      disk(rotor,p.r*.555,.012,outer+side*.018,32);
      const discRing=new T.TorusGeometry(p.r*.488,.006,4,32).rotateY(Math.PI/2);
      collect(black,discRing.translate(outer+side*.028,p.r,axle));
      collect(caliper,new T.SphereGeometry(1,10,6).scale(.014,p.r*.225,p.r*.090)
        .translate(outer+side*.028,p.r+.035,axle-p.r*.45));
      const lip=new T.TorusGeometry(p.r*.714,.011,5,28).rotateY(Math.PI/2);
      collect(truck?black:alloy,lip.translate(outer+side*.018,p.r,axle));
      if(truck || hatch || xModel || yModel) {
        const count=truck?4:18;
        const arc=(i,radius,shift)=>[x*1.005+side*shift,p.r+radius*Math.sin(Math.PI*i/count),axle+radius*Math.cos(Math.PI*i/count)];
        for(let i=0;i<count;i++) {
          const innerRadius=p.r+(truck?.045:.024), outerRadius=p.r+(truck?.128:.092);
          const offset=truck?.047:.009;
          quad(black,arc(i,innerRadius,offset),arc(i+1,innerRadius,offset),
            arc(i+1,outerRadius,truck?.018:-.013),arc(i,outerRadius,truck?.018:-.013));
          if(truck) quad(black,arc(i,innerRadius,offset),arc(i+1,innerRadius,offset),
            arc(i+1,innerRadius,-.045),arc(i,innerRadius,-.045));
        }
      }
      const point=(r,a,offset)=>[outer+side*offset,p.r+r*Math.sin(a),axle+r*Math.cos(a)];
      for(let i=0;i<p.wheel;i++){
        const a=i*Math.PI*2/p.wheel;
        const mid=point(p.r*.51,a-.12,.044);
        const end=point(p.r*.69,a+.10,.033);
        quad(truck?black:alloy,point(.065,a-.31,.044),mid,end,point(p.r*.69,a+(truck?.67:.28),.033));
        quad(truck?black:alloy,point(.065,a-.31,.044),point(p.r*.69,a+(truck?.67:.28),.033),point(p.r*.41,a+.39,.043),point(.065,a+.47,.044));
        if(truck){
          quad(rotor,point(p.r*.24,a-.14,.049),point(p.r*.59,a+.04,.052),
            point(p.r*.67,a+.22,.045),point(p.r*.38,a+.21,.048));
        }
        if(model3||gt||modelS){
          const fork=(r,angle,offset)=>point(r*p.r,a+angle,offset);
          quad(alloy,fork(.39,.13,.046),fork(.68,-.235,.034),fork(.699,-.139,.034),fork(.48,.18,.047));
        }
        if(truck || gt) {
          rod(alloy,point(p.r*.38,a+(truck?.17:.25),.045),point(p.r*.65,a+(truck?.25:.39),.040),.006,4);
        }
      }
      disk(truck?black:rotor,p.r*(truck?.235:.169),.041,outer+side*.042,truck?7:20);
      for(let j=0;j<5;j++){
        const a=j*Math.PI*2/5;
        collect(alloy,new T.CylinderGeometry(.009,.009,.012,6).rotateZ(Math.PI/2)
          .translate(outer+side*.066,p.r+.043*Math.sin(a),axle+.043*Math.cos(a)));
      }
    }
  }
  // Hood reveals run along the fender break, turning inward as the bumper rolls away.
  if(!truck){
    for(const side of [-1,1]){
      let last;
      for(let i=0;i<sectionZ.length;i++){
        const u=sectionZ[i]/half;
        if(u<p.roof.at(-1)[0] || u>.97) continue;
        const k=side*(.77-.20*T.MathUtils.smoothstep(u,.55,1));
        const pt=crossPoint(crest[i],k);pt[1]+=.004;
        if(last) rod(black,last,pt,.005,4);
        last=pt;
      }
    }
  }
  function pair(face,m,profile,lift) {
    face.band(m,profile,lift);
    face.band(m,profile.slice().reverse().map(([u,low,high])=>[-u,low,high]),lift);
  }

  front.band(black,[[-.93,.055,.14],[-.71,.065,.30],[0,.072,.36],[.71,.065,.30],[.93,.055,.14]],.032);
  rear.band(black,[[-.88,.14,.29],[-.62,.08,.31],[.62,.08,.31],[.88,.14,.29]]);
  if(truck) {
    front.stripe(black,-.98,.98,.75,.885);
    front.stripe(led,-.972,.972,.807,.862,.021);
    front.band(black,[[-.995,.035,.32],[-.76,.028,.45],[.76,.028,.45],[.995,.035,.32]],.017);
    front.stripe(rotor,-.72,.72,.19,.22,.027);
    rear.stripe(black,-.96,.96,.78,.88);
    rear.stripe(red,-.945,.945,.811,.856,.021);
    rear.band(black,[[-.98,.025,.37],[-.70,.025,.39],[.70,.025,.39],[.98,.025,.37]],.019);
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
      const pillarTop=blend(peak,nose,(pillarZ-peak[2])/(nose[2]-peak[2]));
      rod(black,[k*.923,p.h+.027,pillarZ],[pillarTop[0]+side*.008,pillarTop[1]-.008,pillarZ],.019,4);
    }
    for(let i=0;i<9;i++) {
      const t=i/10, a=canopy[0][2], b=canopy[1][2];
      box(black,0,T.MathUtils.lerp(a[1],b[1],t)+.017,T.MathUtils.lerp(a[2],b[2],t),w*1.49,.018,.030);
    }
  } else if(hatch) {
    for(const [face,m] of [[front,led],[rear,red]]) {
      face.band(black,[[-.98,.75,.899],[-.78,.68,.899],[.78,.68,.899],[.98,.75,.899]]);
      for(let i=0;i<6;i++) {
        const u=.51+i*.069;
        for(const v of [.735,.812]) pair(face,m,[[u,v,v+.048],[u+.046,v,v+.048]],.024);
      }
    }
    front.band(black,[[-.63,.30,.36],[-.48,.29,.51],[.48,.29,.51],[.63,.30,.36]],.017);
    front.stripe(trim,-.91,.91,.045,.105,.022);
    rear.stripe(trim,-.74,.74,.105,.146,.021);
    box(paint,0,p.h+.55,-half*.84,w*1.63,.042,.21);
  } else if(gt) {
    front.band(black,[[-.60,.24,.56],[-.46,.19,.70],[.46,.19,.70],[.60,.24,.56]],.022);
    front.stripe(paint,-.50,.50,.334,.362,.034);
    front.stripe(alloy,-.45,.45,.46,.485,.035);
    pair(front,black,[[.685,.18,.42],[.912,.25,.53],[.98,.27,.47]],.017);
    pair(front,black,[[.53,.73,.81],[.74,.72,.88],[.974,.76,1]],.015);
    pair(front,led,[[.55,.755,.782],[.76,.759,.798],[.946,.945,.99]],.029);
    bonnetLens(.89,.104);
    for(let i=0;i<4;i++) {
      const u=.74+i*.044, v=.76+i*.015;
      pair(front,led,[[u,v,v+.067],[u+.018,v+.004,v+.071]],.031);
    }
    rear.band(black,[[-.979,.70,.85],[-.73,.62,.83],[.73,.62,.83],[.979,.70,.85]],.015);
    rear.stripe(red,-.925,.925,.740,.777,.028);
    pair(rear,red,[[.60,.676,.78],[.809,.674,.786],[.949,.75,.82]],.030);
    for(let i=-2;i<=2;i++) rear.stripe(alloy,i*.17-.014,i*.17+.014,.14,.27,.031);
  } else if(yModel) {
    front.stripe(black,-.965,.965,.77,.882);
    front.stripe(led,-.955,.955,.826,.865,.023);
    pair(front,black,[[.655,.48,.615],[.914,.52,.695],[.969,.54,.683]]);
    pair(front,led,[[.745,.546,.595],[.907,.589,.641],[.945,.613,.649]],.026);
    rear.stripe(black,-.98,.98,.766,.913);
    rear.stripe(red,-.952,.952,.812,.859,.021);
    pair(rear,red,[[.645,.766,.815],[.938,.750,.827]],.025);
  } else {
    // Each sedan and the X use their own contour inside a dark lens housing.
    const lens=model3 ? [[.49,.69,.74],[.72,.74,.851],[.974,.806,1]]
      : modelS ? [[.42,.755,.827],[.74,.745,.861],[.974,.807,1]]
        : [[.48,.72,.81],[.76,.702,.88],[.974,.746,1]];
    const beam=model3 ? [[.52,.717,.738],[.75,.791,.828],[.946,.955,.995]]
      : modelS ? [[.445,.786,.814],[.74,.786,.821],[.948,.947,.99]]
        : [[.505,.754,.792],[.77,.756,.806],[.953,.947,.985]];
    pair(front,black,lens,.018);
    pair(front,led,beam,.030);
    bonnetLens(model3?.86:.90,model3?.126:.093);
    if(xModel) {
      pair(front,led,[[.765,.723,.752],[.932,.724,.754],[.955,.755,.812]],.028);
      front.band(paint,[[-.64,.52,.65],[-.47,.66,.721],[.47,.66,.721],[.64,.52,.65]],.013);
    }
    pair(front,black,[[.68,.185,.24],[.79,.24,.416],[.932,.30,.475],[.962,.33,.44]]);
    pair(rear,black,[[.414,.634,.77],[.718,.68,.84],[.977,.75,.918]],.014);
    const tail=model3 ? [[.470,.672,.731],[.754,.697,.749],[.964,.799,.875]]
      : [[.443,.674,.740],[.655,.727,.777],[.974,.79,.862]];
    pair(rear,red,tail,.026);
    if(!model3) {
      rear.stripe(alloy,-.62,.62,.725,.75,.026);
      pair(rear,red,[[.523,.674,.719],[.736,.656,.727],[.947,.728,.784]],.027);
    }
  }
  rear.stripe(black,-.18,.18,.45,.603,.012);
  if(!truck) rear.stripe(alloy,-.14,.14,.544,.567,.026);
  if (modelS || xModel) {
    // The S liftback has a low deck lip. The X carries its wing higher
    // above the glass and has a roof joint for each falcon-wing door.
    const z = -half * (xModel ? .83 : .93);
    const y = p.h + (xModel ? .34 : .075);
    box(xModel ? paint : black,0,y,z,w * (xModel ? 1.59 : 1.52),.035,xModel ? .20 : .105);
    if (xModel) {
      for (const side of [-1,1]) {
        rod(black,[side*w*.60,y-.13,z+.02],[side*w*.63,y,z],.027);
        const roofEdge=canopy.find((_,index)=>roofProfile[index]===p.roof[3])[side<0?1:4];
        rod(black,roofEdge,[side*w*.20,roofEdge[1]+.039,roofEdge[2]],.012,4);
      }
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
