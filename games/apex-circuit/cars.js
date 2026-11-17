import * as T from './vendor/three.module.min.js';
import { track } from './track.js';

const mat = (color, roughness = .68) => new T.MeshStandardMaterial({ color, roughness });
const rubber = mat(0x111626);
const trim = mat(0x233149, .46);
const glass = mat(0x183f66, .24);
const glassTop = mat(0x306a82, .26);
const light = new T.MeshBasicMaterial({ color: 0xfff0b7 });
const orange = new T.MeshBasicMaterial({ color: 0xf95f39 });
const blue = new T.MeshBasicMaterial({ color: 0x29efea });
const white = mat(0xfff1d5, .48);
const box = new T.BoxGeometry();
const tire = new T.CylinderGeometry(.48, .48, .40, 12);
const hub = new T.CylinderGeometry(.24, .24, .045, 10);
const liveries = [
  { body: 0xf99d24, stripes: 0xffedb0, dark: 0xa5492b, nose: .58, wing: 2.13, round: 1.0, number: '27' },
  { body: 0xf24843, stripes: 0xffe2c7, dark: 0x922b3c, nose: .78, wing: 2.26, round: .68, number: '08' },
  { body: 0x2fd2d4, stripes: 0xe1f7dc, dark: 0x246c9c, nose: .83, wing: 1.89, round: 1.12, number: '51' },
  { body: 0x8d7bfa, stripes: 0xe9c7ff, dark: 0x5351a0, nose: .45, wing: 2.18, round: 1.29, number: '13' },
  { body: 0xf4ed7a, stripes: 0xd6f3c2, dark: 0x4c9072, nose: .64, wing: 1.95, round: .88, number: '35' }
];

function shell(rows) {
  const model = [];
  const bands = [[-1, 0], [1, 0], [.91, .62], [.58, 1], [-.58, 1], [-.91, .62]];
  for (const [z, w, low, high] of rows) {
    for (const [x, t] of bands) model.push(new T.Vector3(x * w, T.MathUtils.lerp(low, high, t), z));
  }
  const positions = [];
  function triangle(a, b, c) { positions.push(...model[a].toArray(), ...model[b].toArray(), ...model[c].toArray()); }
  for (let i = 0; i < rows.length - 1; i++) {
    for (let j = 0; j < 6; j++) {
      const a = i * 6 + j;
      const b = i * 6 + (j + 1) % 6;
      triangle(a, b, a + 6);
      triangle(b, b + 6, a + 6);
    }
  }
  for (let i = 1; i < 5; i++) {
    triangle(0, i + 1, i);
    const last = rows.length * 6 - 6;
    triangle(last, last + i, last + i + 1);
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

// The static body and wheel details share draw calls by surface.
function buildBody(model, design) {
  const paint = mat(design.body, .35);
  const stripe = mat(design.stripes, .41);
  const lower = mat(design.dark, .52);
  const buckets = new Map();
  const transform = new T.Object3D();
  function part(material, geometry, x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) {
    transform.position.set(x, y, z);
    transform.scale.set(sx, sy, sz);
    transform.rotation.set(rx, ry, rz);
    transform.updateMatrix();
    const g = (geometry.index ? geometry.toNonIndexed() : geometry.clone()).applyMatrix4(transform.matrix);
    const bucket = buckets.get(material) || { positions: [], normals: [] };
    bucket.positions.push(...g.getAttribute('position').array);
    bucket.normals.push(...g.getAttribute('normal').array);
    buckets.set(material, bucket);
    g.dispose();
  }
  function block(material, ...args) { part(material, box, ...args); }
  const chassis = shell([[-2.04, .96, .27, .71], [-1.55, 1.03, .26, .90],
    [-.21, .91, .24, .90], [.82, .72, .24, .76], [1.71, design.nose, .24, .54], [2.10, design.nose * .72, .28, .45]]);
  part(paint, chassis, 0, 0, 0);
  chassis.dispose();
  const canopy = shell([[-.97, .53, .82, .99], [-.46, .52, .85, 1.29 * design.round],
    [.02, .43, .83, 1.24 * design.round], [.59, .29, .74, .84]]);
  part(glass, canopy, 0, 0, 0);
  canopy.dispose();

  block(lower, 0, .26, -.24, 1.65, .24, 3.55);
  block(trim, 0, .30, 1.75, 2.54, .16, .57);
  block(paint, 0, .39, 1.84, 2.52, .12, .33);
  block(stripe, 0, .55, 1.42, .285, .044, .85, .19);
  block(glassTop, 0, (1.29 * design.round + 1.24 * design.round) / 2 + .008, -.22, .24, .025, .46, -.05);
  block(trim, 0, .35, -1.93, 2.10, .23, .34);
  block(paint, 0, 1.09, -1.60, design.wing, .14, .56, -.09);
  block(stripe, 0, 1.11, -1.39, design.wing * .91, .044, .125);
  for (const side of [-1, 1]) {
    block(lower, side * .63, .78, -1.67, .17, .62, .18, -.16);
    block(trim, side * design.wing / 2, 1.12, -1.61, .11, .35, .68, -.09);
    block(paint, side * .86, .53, -.56, .61, .39, 1.31, 0, side * .035);
    block(stripe, side * .91, .735, -.37, .35, .047, .93);
    block(trim, side * .89, .555, .093, .39, .20, .085);
    block(light, side * .86, .45, 1.97, .42, .07, .055);
    block(orange, side * .74, .64, -2.04, .31, .10, .069);
    block(white, side * .44, .41, -2.085, .17, .15, .14);
    for (const z of [-1.34, 1.18]) {
      part(rubber, tire, side * 1.03, .49, z, 1, z < 0 ? 1.18 : .86, 1, 0, 0, Math.PI / 2);
      part(stripe, hub, side * 1.24, .49, z, 1, 1, 1, 0, 0, Math.PI / 2);
    }
  }
  for (const [material, { positions, normals }] of buckets) {
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new T.Float32BufferAttribute(normals, 3));
    model.add(new T.Mesh(geometry, material));
  }
  const label = document.createElement('canvas');
  label.width = 128;
  label.height = 128;
  const ctx = label.getContext('2d');
  ctx.fillStyle = '#fff1d1';
  ctx.fillRect(4, 18, 120, 92);
  ctx.fillStyle = '#192332';
  ctx.font = 'italic 900 76px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(design.number, 62, 68);
  const texture = new T.CanvasTexture(label);
  texture.colorSpace = T.SRGBColorSpace;
  const decal = new T.Mesh(new T.PlaneGeometry(.72, .70), new T.MeshBasicMaterial({ map: texture, transparent: true,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1, depthWrite: false }));
  decal.rotation.x = -Math.PI / 2 + .21;
  decal.rotation.z = Math.PI;
  decal.position.set(0, .758, .77);
  model.add(decal);
}

function blobMaterial() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const fill = ctx.createRadialGradient(32, 32, 7, 32, 32, 31);
  fill.addColorStop(0, 'rgba(10,16,29,.76)');
  fill.addColorStop(.64, 'rgba(10,16,29,.38)');
  fill.addColorStop(1, 'rgba(10,16,29,0)');
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, 64, 64);
  return new T.MeshBasicMaterial({ map: new T.CanvasTexture(canvas), transparent: true, depthWrite: false });
}

export function buildCars(scene) {
  const shadowGeometry = new T.PlaneGeometry(4.0, 5.4).rotateX(-Math.PI / 2);
  const shadowMaterial = blobMaterial();
  const plumeGeometry = new T.ConeGeometry(.20, 1, 7).rotateX(-Math.PI / 2).translate(0, 0, -.50);
  return liveries.map((design, id) => {
    const model = new T.Group();
    const shadow = new T.Mesh(shadowGeometry, shadowMaterial);
    shadow.renderOrder = 2;
    buildBody(model, design);
    const jets = new T.Group();
    if (id === 0) {
      for (const side of [-1, 1]) {
        const flame = new T.Mesh(plumeGeometry, blue);
        flame.position.set(side * .44, .43, -2.13);
        jets.add(flame);
      }
      model.add(jets);
    }
    scene.add(shadow, model);
    return { model, shadow, jets };
  });
}

const sample = {};
export function driveCar(visual, car, boosting, elapsed) {
  const p = track.sample(car.distance, sample);
  const x = p.x - p.dz * car.lane;
  const z = p.z + p.dx * car.lane;
  const y = p.y + p.bank * car.lane;
  const heading = Math.atan2(p.dx, p.dz) - car.slip;
  visual.model.position.set(x, y + car.air + .04, z);
  visual.model.rotation.set(-Math.atan(p.slope), heading, Math.atan(-p.bank) - car.slip * .19, 'YXZ');
  visual.shadow.position.set(x, y + .046, z);
  visual.shadow.rotation.set(-Math.atan(p.slope), heading, Math.atan(-p.bank), 'YXZ');
  const spread = 1 + car.air * .15;
  visual.shadow.scale.set(spread, 1, spread);
  visual.jets.visible = boosting;
  for (let i = 0; i < visual.jets.children.length; i++) {
    const jet = visual.jets.children[i];
    jet.scale.z = 3.6 + Math.sin(elapsed * 32 + i) * .44;
  }
}
