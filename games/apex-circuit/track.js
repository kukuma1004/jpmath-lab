import * as T from './vendor/three.module.min.js';

const sunsetPoints = [
  [-55, 0, 34], [-7, 0, 34], [28, 0.7, 32], [57, 3.2, 20],
  [70, 5.6, -3], [58, 5.5, -26], [37, 3.8, -28], [20, 3.5, -15],
  [2, 5.2, -20], [7, 9.9, -45], [-4, 12.2, -67], [-37, 11.3, -72],
  [-64, 7.1, -59], [-78, 4.1, -35], [-100, 2.5, -24],
  [-113, 1.2, -2], [-108, 0.6, 23], [-87, 0.1, 36]
];
const summitPoints = [
  [-82,8,54], [-35,12,54], [9,18,51], [56,25,39], [82,32,14],
  [82,36,-17], [66,41,-48], [47,45,-66], [34,46,-66], [24,48,-66],
  [-18,26,-66], [-34,24,-66], [-61,22,-82], [-95,19,-77], [-116,15,-50],
  [-103,10,-27], [-79,7,-15], [-81,5,1], [-110,4,15], [-112,6,39]
];
const metroPoints = [
  [-82,1,50], [-36,1,50], [36,1,50], [64,2,47], [72,3,35],
  [72,4,3], [80,5,-6], [100,5,-11], [106,4,-23], [101,3,-45],
  [89,2,-53], [55,1,-52], [46,1,-44], [45,1,-21], [35,1,-13],
  [12,1,-14], [4,1,-25], [2,2,-56], [-8,3,-67], [-70,4,-68],
  [-86,4,-59], [-88,3,-37], [-83,2,-11], [-96,1,0], [-117,1,7],
  [-122,1,21], [-113,1,42]
];

function makeCourse(meta, points, setup) {
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


  function point(distance, lane = 0, height = 0) {
    const p = sample(distance);
    return new T.Vector3(p.x - p.dz * lane, p.y + p.bank * lane + height, p.z + p.dx * lane);
  }

  function frame(distance, lane = 0, height = 0) {
    const p = sample(distance);
    return {
      position: new T.Vector3(p.x - p.dz * lane, p.y + p.bank * lane + height, p.z + p.dx * lane),
      rotation: new T.Euler(-Math.atan(p.slope), Math.atan2(p.dx, p.dz), Math.atan(-p.bank), 'YXZ')
    };
  }

  // Arc-length cache entries at control points give the precise road cut locations.
  const arc = line.getLengths();
  function distanceAt(index) {
    const key = index / points.length * line.arcLengthDivisions;
    return T.MathUtils.lerp(arc[Math.floor(key)], arc[Math.ceil(key)], key % 1);
  }
  return { ...meta, length, sample, point, frame, ramps: [], gaps: [], ...setup(length, distanceAt) };
}

export const tracks = [
  makeCourse({ id: 'sunset', name: '선셋 피어', subtitle: '황혼의 항구', description: '바다를 따라 부두를 돌아 나오는 고속 코스', halfWidth: 7.5 }, sunsetPoints,
    length => ({ pads: [{ distance: 31, lane: -3.25 }, { distance: 165, lane: 3.4 },
      { distance: 256, lane: -2.8 }, { distance: length - 58, lane: 2.9 }], ramps: [{ start: 284, length: 25 }] })),
  makeCourse({ id: 'summit', name: '스카이라인 드롭', subtitle: '알파인 패스', description: '능선에서 뛰어올라 22m 아래 협곡 도로에 착지하세요.', halfWidth: 7.9 }, summitPoints,
    (length, at) => ({ pads: [{distance: 40, lane: 2.7}, {distance: at(7), lane: 0}, {distance: length - 80, lane: -3}],
      gaps: [{start: at(9), end: at(10), drop: 22}] })),
  makeCourse({ id: 'metro', name: '미드나이트 링', subtitle: '심야 도심', description: '젖은 대로에서 가속하고 연속 직각 코너를 드리프트로 연결하세요.', halfWidth: 7 }, metroPoints,
    (length, at) => ({ pads: [{distance: 56, lane: 2.8}, {distance: at(8), lane: -2.8}, {distance: at(15), lane: 2}, {distance: at(19), lane: -2.8}] }))
];
export const track = tracks[0];
export const coursePoint = track.point;
export const courseFrame = track.frame;
