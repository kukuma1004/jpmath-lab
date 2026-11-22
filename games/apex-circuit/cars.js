import { sampleDriver } from './bypass.js?v=14';
import * as T from './vendor/three.module.min.js';
import { track } from './track.js?v=14';
import { buildRoadCar } from './road-cars.js?v=14';

const box = new T.BoxGeometry();
const tire = new T.CylinderGeometry(.37, .37, .22, 28);
const rim = new T.CylinderGeometry(.258, .258, .022, 24);
const tube = new T.CylinderGeometry(1, 1, 1, 20);
const designRows = [
  ['vector', '27', 0xe99a25, 0xffeed1, .55, .10, 1.16],
  ['raptor', '08', 0xc92c27, 0xf8c5ac, .68, -.12, 1.13],
  ['vortex', '51', 0xe7e6dc, 0x32aea9, .53, -.03, 1.08],
  ['nova', '13', 0x175cc7, 0xffc45c, .47, .24, 1.22],
  ['pulse', '35', 0x278b78, 0xf4de70, .50, .12, 1.12]
];
const liveries = designRows.map(([id, number, body, stripe, cabin, offset, roof]) =>
  ({id, number, body, stripe, cabin, offset, roof}));

// Sample longitudinal sections with shared vertices so highlights flow around the arches.
function loft(rows, section) {
  const centers = new T.CatmullRomCurve3(rows.map(([z, w, base]) => new T.Vector3(w, base, z)), false, 'catmullrom', .36);
  const heights = new T.CatmullRomCurve3(rows.map(([z, , , top], i) => new T.Vector3(i, top, z)), false, 'catmullrom', .36);
  const vertices = [], indices = [];
  const steps = (rows.length - 1) * 4, n = section.length;
  for (let i = 0; i <= steps; i++) {
    const mid = centers.getPoint(i / steps), high = heights.getPoint(i / steps).y;
    for (const [x, y] of section) vertices.push(x * mid.x, mid.y + (high - mid.y) * y, mid.z);
    if (i === steps) continue;
    for (let j = 0; j < n; j++) {
      const a = i * n + j, b = i * n + (j + 1) % n;
      indices.push(a, b, a + n, b, b + n, a + n);
    }
  }
  for (let j = 1; j < n - 1; j++) {
    indices.push(0, j + 1, j, steps * n, steps * n + j, steps * n + j + 1);
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
const bodySection = [[-.76,0],[.76,0],[.97,.14],[1,.39],[.97,.62],[.87,.81],[.67,.94],[.37,.99],[0,1],[-.37,.99],[-.67,.94],[-.87,.81],[-.97,.62],[-1,.39],[-.97,.14]];
const dome = [[-.92,0],[.92,0],[1,.1],[.96,.35],[.84,.60],[.65,.82],[.38,.96],[0,1],[-.38,.96],[-.65,.82],[-.84,.60],[-.96,.35],[-1,.1]];
const dark = new T.MeshStandardMaterial({color:0x181e24, roughness:.36, metalness:.4});
const rubber = new T.MeshStandardMaterial({color:0x101114, roughness:.93});
const metal = new T.MeshStandardMaterial({color:0x888e94, roughness:.28, metalness:.67});
const headlight = new T.MeshBasicMaterial({color:0xe1faff});
const taillight = new T.MeshBasicMaterial({color:0xff2b27, toneMapped:false});
function buildBody(model, d, envMap) {
  const paint = new T.MeshPhysicalMaterial({color:d.body, metalness:.55, roughness:.24, clearcoat:1, clearcoatRoughness:.11, envMap, envMapIntensity:1.1});
  const glass = new T.MeshPhysicalMaterial({color:0x263945, metalness:.73, roughness:.13, clearcoat:1, envMap, envMapIntensity:1.28});
  const stripe = new T.MeshStandardMaterial({color:d.stripe, metalness:.23, roughness:.32});
  const buckets = new Map(), transform = new T.Object3D();
  function part(material, geometry, x=0, y=0, z=0, sx=1, sy=1, sz=1, rx=0, ry=0, rz=0) {
    transform.position.set(x,y,z);
    transform.scale.set(sx,sy,sz);
    transform.rotation.set(rx,ry,rz);
    transform.updateMatrix();
    const g = (geometry.index ? geometry.toNonIndexed() : geometry.clone()).applyMatrix4(transform.matrix);
    const bucket = buckets.get(material) || {positions:[], normals:[]};
    for (const value of g.attributes.position.array) bucket.positions.push(value);
    for (const value of g.attributes.normal.array) bucket.normals.push(value);
    buckets.set(material,bucket);
    g.dispose();
  }
  const block = (mat,...args) => part(mat,box,...args);
  function skin(mat,rows,section=bodySection,x=0,z=0) {
    const g=loft(rows,section);
    part(mat,g,x,0,z);
    g.dispose();
  }
  const power=d.id==='raptor', compact=d.id==='nova';
  skin(dark,[[-2.09,1.01,.15,.43],[-1.53,1.09,.13,.48],[-.25,.99,.13,.40],[1.34,1.07,.13,.43],[2.12,.97,.13,.22]]);
  skin(paint,[[-2.01,.96,.44,.73],[-1.77,1.04,.39,.80],[-1.15,1.01,.35,.82],[-.42,.88,.26,.76],[.45,.82,.29,.67],[1.20,.98,.29,power?.71:.57],[1.85,.97,.22,.43],[2.06,.82,.20,.31]]);
  // Long separate wheel fairings leave deep venturi channels alongside the cockpit.
  for (const side of [-1,1]) {
    skin(paint,[[-2.03,.17,.44,.68],[-1.79,.27,.43,.88],[-1.36,.31,.54,power?1.02:.98],[-1.03,.29,.47,.94],[-.62,.19,.27,.78],[-.16,.10,.24,.51],[.39,.085,.27,.48],[.76,.18,.40,.71],[1.16,.275,.55,compact?.99:.92],[1.46,.28,.53,.89],[1.81,.23,.30,.69],[2.02,.16,.23,.48]],dome,side*.866);
    block(dark,side*1.025,.245,0,.15,.095,1.30,0,side*.045);
    for (const z of [-1.31,1.23]) {
      part(rubber,tire,side*1.015,.38,z,1,1,1,0,0,Math.PI/2);
      part(metal,rim,side*1.124,.38,z,1,1,1,0,0,Math.PI/2);
      part(dark,rim,side*1.137,.38,z,.86,.55,.86,0,0,Math.PI/2);
      for (let i=0;i<7;i++) {
        const a=i*Math.PI*2/7;
        block(metal,side*1.148,.38+.11*Math.cos(a),z+.11*Math.sin(a),.013,.19,.035,a+.24);
      }
    }
    for (let i=0;i<5;i++) {
      const z=-1.63+i*.074, y=(power?1.02:.98)-.043*Math.pow((z+1.35)/.34,2);
      block(dark,side*.865,y+.006,z,.31,.014,.044);
    }
    block(dark,side*.865,.613,1.91,.30,.045,.19,.63,side*.11);
    for (let i=0;i<2;i++) block(headlight,side*(.833+i*.081),.633,1.925,.027,.018,.185,.63,side*.11);
    block(dark,side*.74,.586,-2.018,.55,.154,.12,0,side*.11,side*.068);
    for (let i=0;i<7;i++) block(taillight,side*(.53+i*.066),.597+i*.004,-2.085+i*.006,.052,.035,.02);
    part(metal,tube,side*.29,.385,-2.035,.106,.19,.095,Math.PI/2);
    part(rubber,tube,side*.29,.385,-2.134,.076,.016,.067,Math.PI/2);
    for(const x of [.48,.87]) block(dark,side*x,.228,-1.94,.036,.25,.34,-.12,side*.08);
  }
  skin(glass,[[-1.21,.22,.755,.802],[-.93,d.cabin*.81,.765,d.roof*.87],[-.52,d.cabin,.70,d.roof*.985],[-.16,d.cabin,.70,d.roof],[.27,d.cabin*.92,.66,d.roof*.94],[.65,d.cabin*.73,.63,.91],[.91,d.cabin*.46,.63,.70]],dome,0,d.offset);
  // Flying buttresses taper from the rear wheel shoulders to the cabin roof.
  for(const side of [-1,1]) {
    skin(paint,[[-1.67,.061,.762,.817],[-1.27,.098,.768,.884],[-.89,.082,.767,d.roof*.845],[-.55,.046,.757,d.roof*.87],[-.23,.023,.745,d.roof*.82]],dome,side*d.cabin*.77,d.offset);
  }
  skin(stripe,[[-2.019,.187,.733,.738],[-1.77,.19,.802,.807],[-1.49,.188,.818,.824],[-1.25,.175,.824,.829],[-1.08,.13,.817,.822]]);
  if(power || compact || d.id==='vortex') {
    const h=power?1.12:compact?1.03:.98;
    for (const side of [-1,1]) {
      block(dark,side*.63,(h+.73)/2,-1.75,.046,h-.72,.20,-.22);
      block(paint,side*1.055,h,-1.79,.046,.16,.40,-.11);
    }
    block(dark,0,h,-1.78,2.1,.055,power?.39:.26,-.10);
  }
  const decalCanvas=document.createElement('canvas');
  decalCanvas.width=128; decalCanvas.height=96;
  const ctx=decalCanvas.getContext('2d');
  ctx.fillStyle='#1a1a1c'; ctx.font='italic 900 74px Arial'; ctx.textAlign='center'; ctx.fillText(d.number,62,75);
  const texture=new T.CanvasTexture(decalCanvas); texture.colorSpace=T.SRGBColorSpace;
  const decal=new T.Mesh(new T.PlaneGeometry(.34,.32),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
  decal.rotation.set(-Math.PI/2-.054,0,Math.PI);
  decal.position.set(0,.829,-1.55);
  model.add(decal);
  for(const [material, bucket] of buckets) {
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(bucket.positions,3));
    g.setAttribute('normal',new T.Float32BufferAttribute(bucket.normals,3));
    model.add(new T.Mesh(g,material));
  }
}

function carReflection() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, 128);
  sky.addColorStop(0, '#5b87b4');
  sky.addColorStop(.39, '#b7d2e4');
  sky.addColorStop(.49, '#eab789');
  sky.addColorStop(.54, '#3d5758');
  sky.addColorStop(1, '#152334');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#fff1ce';
  ctx.fillRect(13, 31, 62, 19);
  ctx.fillStyle = '#dcefff';
  ctx.fillRect(128, 21, 65, 10);
  const light = new T.CanvasTexture(canvas);
  light.colorSpace = T.SRGBColorSpace;
  light.mapping = T.EquirectangularReflectionMapping;
  return light;
}

function shadowStamp() {
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#130e21';
  ctx.shadowColor = '#130e21';
  ctx.shadowBlur = 10;
  // One continuous contact silhouette with the wheel lobes left visible.
  ctx.fillRect(18, 22, 60, 114);
  ctx.fillRect(10, 29, 76, 21);
  ctx.fillRect(8, 104, 80, 25);
  ctx.fillRect(10, 125, 76, 10);
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  return new T.MeshBasicMaterial({map: texture, transparent: true, opacity: .40, depthWrite: false});
}

const boostShapes = {
  needle: { width: .48, length: 2.8, spacing: .27, sway: .025, rhythm: 12 },
  fork: { width: .72, length: 2.1, spacing: .40, sway: .06, rhythm: 15 },
  pulse: { width: .86, length: 1.6, spacing: .37, sway: .025, rhythm: 8 },
  ribbon: { width: 1.02, length: 2.25, spacing: .32, sway: .08, rhythm: 6 },
  plume: { width: 1.12, length: 1.8, spacing: .45, sway: .035, rhythm: 10 }
};
const prototypeBoost = {
  vector: { boostStyle: 'needle', boostColor: 0xffc15a },
  raptor: { boostStyle: 'plume', boostColor: 0xff6334 },
  nova: { boostStyle: 'pulse', boostColor: 0x719fff },
  vortex: { boostStyle: 'fork', boostColor: 0x64e8e1 },
  pulse: { boostStyle: 'ribbon', boostColor: 0xffe482 }
};
const boostGeometry = new Map();
const boostMaterials = new Map();
let boostTexture;

// Longitudinal ribbons share one texture; their edges and cadence define the engine type.
function exhaustGeometry(style) {
  if (boostGeometry.has(style)) return boostGeometry.get(style);
  const positions = [], uvs = [], indices = [];
  const blades = style === 'fork' ? [-.25, .25] : [0];
  const rows = 16;
  for (const blade of blades) {
    const offset = positions.length / 3;
    for (let i = 0; i <= rows; i++) {
      const t = i / rows;
      let width = Math.pow(1 - t, .68) * .5;
      let center = blade * (.45 + t * .8);
      if (style === 'needle') width *= .67;
      if (style === 'fork') width *= .35;
      if (style === 'plume') width *= .66 + Math.sin(t * Math.PI) * .56;
      if (style === 'pulse') width *= .50 + .44 * Math.pow(Math.sin(t * Math.PI * 3), 2);
      if (style === 'ribbon') { width *= .67; center = Math.sin(t * Math.PI * 1.6) * .16; }
      for (const side of [-1, 1]) {
        positions.push(center + side * width, 0, -t);
        uvs.push(side < 0 ? 0 : 1, 1 - t);
      }
      if (i < rows) {
        const n = offset + i * 2;
        indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
      }
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  boostGeometry.set(style, geometry);
  return geometry;
}

function exhaustMaterial(color = 0xb4fff1) {
  if (boostMaterials.has(color)) return boostMaterials.get(color);
  if (!boostTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const pixels = ctx.createImageData(canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      const t = y / (canvas.height - 1);
      const width = .30 * Math.pow(1 - t, .78) + .013;
      for (let x = 0; x < canvas.width; x++) {
        const radius = Math.abs((x + .5) / canvas.width - .5) / width;
        const heat = Math.exp(-radius * radius * 3.1) * Math.pow(1 - t, 1.8);
        const amber = Math.max(0, 1 - t * 4.8);
        const i = (y * canvas.width + x) * 4;
        const light = Math.min(255, 195 + heat * 60 + amber * 35);
        pixels.data[i] = light;
        pixels.data[i + 1] = light;
        pixels.data[i + 2] = light;
        pixels.data[i + 3] = 255 * Math.exp(-radius * radius * 1.7) * Math.min(1, (1 - t) * 3);
      }
    }
    ctx.putImageData(pixels, 0, 0);
    boostTexture = new T.CanvasTexture(canvas);
    boostTexture.colorSpace = T.SRGBColorSpace;
  }
  const material = new T.MeshBasicMaterial({map: boostTexture, color, transparent: true, depthWrite: false, toneMapped: false, side: T.DoubleSide});
  boostMaterials.set(color, material);
  return material;
}

function tuneExhaust(visual, spec) {
  const style = boostShapes[spec.boostStyle] ? spec.boostStyle : 'needle';
  const settings = boostShapes[style];
  const variation = [...spec.id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 9;
  visual.boostProfile = { ...settings, variation, style };
  visual.jets.userData.style = style;
  for (const [index, jet] of visual.jets.children.entries()) {
    jet.geometry = exhaustGeometry(style);
    jet.material = exhaustMaterial(spec.boostColor);
    jet.position.set((index ? 1 : -1) * settings.spacing, .28, -2.14);
  }
  visual.jets.position.z = spec.id === 'cybertruck' ? -.29 : spec.cosmetic ? -.10 : 0;
}

export function buildCars(scene) {
  const reflection = carReflection();
  const shadowGeometry = new T.PlaneGeometry(3.45, 5.8).rotateX(-Math.PI / 2);
  const shadowMaterial = shadowStamp();
  const exhaust = exhaustMaterial();
  const jetGeometry = exhaustGeometry('needle');
  const visuals = liveries.map((design, id) => {
    const model = new T.Group();
    const shadow = new T.Mesh(shadowGeometry, shadowMaterial.clone());
    shadow.renderOrder = 2;
    const body = new T.Group();
    buildBody(body, design, reflection);
    model.add(body);
    const jets = new T.Group();
    for (const side of [-1, 1]) {
      const flame = new T.Mesh(jetGeometry, exhaust);
      flame.position.set(side * .29, .28, -2.14);
      jets.add(flame);
    }
    model.add(jets);
    scene.add(shadow, model);
    const visual = { model, shadow, jets, body, id: design.id };
    tuneExhaust(visual, { id: design.id, ...prototypeBoost[design.id] });
    return visual;
  });
  visuals[0].roadBodies = new Map();
  visuals[0].reflection = reflection;
  return visuals;
}

export function selectVehicle(visuals, vehicle, roadRoster) {
  const player = visuals[0];
  for (const visual of visuals) {
    visual.roadBody?.removeFromParent();
    visual.roadBody = null;
    visual.roadId = null;
    visual.body.visible = !vehicle.cosmetic;
  }
  if (vehicle.cosmetic) {
    const selected = roadRoster.findIndex(spec => spec.id === vehicle.id);
    for (const [index, visual] of visuals.entries()) {
      const spec = roadRoster[(selected + index) % roadRoster.length];
      const { id } = spec;
      let body = player.roadBodies.get(id);
      if (!body) {
        body = buildRoadCar(id);
        player.roadBodies.set(id, body);
      }
      visual.model.add(body);
      visual.roadBody = body;
      visual.roadId = id;
      tuneExhaust(visual, spec);
    }
    return;
  }
  for (const visual of visuals) tuneExhaust(visual, { id: visual.id, ...prototypeBoost[visual.id] });
  const other = visuals.find(v => v.id === vehicle.id);
  if (!other || player === other) { tuneExhaust(player, vehicle); return; }
  const previous = player.body, previousId = player.id;
  player.model.add(other.body);
  other.model.add(previous);
  player.body = other.body;
  player.id = other.id;
  other.body = previous;
  other.id = previousId;
  tuneExhaust(player, vehicle);
  tuneExhaust(other, { id: other.id, ...prototypeBoost[other.id] });
}

const sample = {};
const touchdown = {};
export function driveCar(visual, car, boosting, elapsed, course = track) {
  const p = sampleDriver(course, car, car.distance, sample);
  const x = p.x - p.dz * car.lane;
  const z = p.z + p.dx * car.lane;
  const y = p.y + p.bank * car.lane;
  const heading = Math.atan2(p.dx, p.dz) - car.slip;
  let pitch = Math.atan(p.slope);
  if (car.flight) {
    const { launch, span } = car.flight;
    const flightProgress = (car.distance - launch) / span;
    course.sample(launch + span, touchdown);
    pitch = T.MathUtils.lerp(T.MathUtils.clamp(car.pitch, -.34, .23),
      Math.atan(touchdown.slope), T.MathUtils.smoothstep(flightProgress, .76, 1));
  }
  visual.model.position.set(x, y + car.air + .02, z);
  visual.model.rotation.set(-pitch, heading, Math.atan(-p.bank) - car.slip * .025, 'YXZ');
  const marker = (car.distance % course.length + course.length) % course.length;
  visual.shadow.visible = !course.gaps.some(gap => gap.start <= marker && marker < gap.end);
  const cast = .12 + car.air * .72;
  const offsetX = -.78 * cast;
  const offsetZ = .63 * cast;
  const groundHeight = p.slope * (p.dx * offsetX + p.dz * offsetZ)
    + p.bank * (-p.dz * offsetX + p.dx * offsetZ);
  visual.shadow.position.set(x + offsetX, y + groundHeight + .064, z + offsetZ);
  visual.shadow.rotation.set(-Math.atan(p.slope), heading, Math.atan(-p.bank), 'YXZ');
  const spread = 1 + car.air * .15;
  visual.shadow.scale.set(spread, 1, spread * 1.05);
  visual.shadow.material.opacity = .62 / (1 + car.air * .24);
  visual.jets.visible = boosting;
  for (let i = 0; i < visual.jets.children.length; i++) {
    const jet = visual.jets.children[i];
    const profile = visual.boostProfile;
    const phase = elapsed * (profile.rhythm + profile.variation * .28) + i * .8;
    const wave = Math.sin(phase);
    const pulse = profile.style === 'pulse' ? .16 : .06;
    jet.scale.x = profile.width * (.96 + profile.variation * .012) * (1 + wave * pulse);
    jet.scale.z = profile.length * (1 + .045 * Math.sin(phase * 1.3) + profile.variation * .006);
    jet.rotation.y = car.slip * .42 + Math.sin(phase * .65) * profile.sway;
  }
}
