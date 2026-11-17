import * as T from './vendor/three.module.min.js';

const points = [
  [-55, 0, 34], [-7, 0, 34], [28, 0.7, 32], [57, 3.2, 20],
  [70, 5.6, -3], [58, 5.5, -26], [37, 3.8, -28], [20, 3.5, -15],
  [2, 5.2, -20], [7, 9.9, -45], [-4, 12.2, -67], [-37, 11.3, -72],
  [-64, 7.1, -59], [-78, 4.1, -35], [-100, 2.5, -24],
  [-113, 1.2, -2], [-108, 0.6, 23], [-87, 0.1, 36]
];
const line = new T.CatmullRomCurve3(points.map(v => new T.Vector3(...v)), true, 'centripetal');
line.arcLengthDivisions = 1600;
const length = line.getLength();
const count = Math.ceil(length * 2);
const stride = length / count;
const samples = Array.from({ length: count }, (_, i) => line.getPointAt(i / count));
const sampleVectors = samples.map((p, i) => {
  const before = samples[(i + count - 2) % count];
  const after = samples[(i + 2) % count];
  const planar = Math.hypot(after.x - before.x, after.z - before.z);
  return { dx: (after.x - before.x) / planar, dz: (after.z - before.z) / planar,
    slope: (after.y - before.y) / planar };
});
const rows = samples.map((p, i) => {
  const before = sampleVectors[(i + count - 4) % count];
  const after = sampleVectors[(i + 4) % count];
  const curve = Math.atan2(before.dz * after.dx - before.dx * after.dz,
    before.dx * after.dx + before.dz * after.dz) / (8 * stride);
  return { ...sampleVectors[i], curve, bank: Math.max(-0.18, Math.min(0.18, curve * 3.1)) };
});
const fields = ['dx', 'dz', 'curve', 'slope', 'bank'];
function sample(distance, out = {}) {
  const index = ((distance % length + length) % length) / stride;
  const current = Math.floor(index) % count;
  const next = (current + 1) % count;
  const t = index - Math.floor(index);
  const a = samples[current];
  const b = samples[next];
  out.x = T.MathUtils.lerp(a.x, b.x, t);
  out.y = T.MathUtils.lerp(a.y, b.y, t);
  out.z = T.MathUtils.lerp(a.z, b.z, t);
  for (const key of fields) out[key] = T.MathUtils.lerp(rows[current][key], rows[next][key], t);
  return out;
}

export const track = {
  length, halfWidth: 7.5, sample,
  pads: [{ distance: 31, lane: -3.25 }, { distance: 165, lane: 3.4 },
    { distance: 256, lane: -2.8 }, { distance: length - 58, lane: 2.9 }],
  ramps: [{ start: 284, length: 25 }],
};

export function coursePoint(distance, lane = 0, height = 0) {
  const p = sample(distance);
  return new T.Vector3(p.x - p.dz * lane, p.y + p.bank * lane + height, p.z + p.dx * lane);
}

export function courseFrame(distance, lane = 0, height = 0) {
  const p = sample(distance);
  const yaw = Math.atan2(p.dx, p.dz);
  return { position: new T.Vector3(p.x - p.dz * lane, p.y + p.bank * lane + height, p.z + p.dx * lane),
    rotation: new T.Euler(-Math.atan(p.slope), yaw, Math.atan(-p.bank), 'YXZ') };
}
