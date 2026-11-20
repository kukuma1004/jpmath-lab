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

const frostPoints = [
  [-66,9,65],[-16,10,65],[56,12,62],[93,15,47],[99,18,20],
  [80,22,10],[44,24,13],[28,25,0],[35,27,-19],[79,29,-34],
  [92,30,-53],[82,28,-72],[48,24,-74],[6,19,-54],[-22,17,-53],
  [-49,15,-76],[-83,12,-76],[-101,9,-54],[-88,7,-31],[-53,7,-17],
  [-49,7,0],[-73,8,17],[-103,8,28],[-105,8,49]
];
const redrockPoints = [
  [-74,4,53],[-12,5,53],[57,8,47],[104,12,28],[126,15,-2],
  [121,17,-30],[91,18,-62],[54,16,-76],[14,12,-69],[-19,8,-49],
  [-52,6,-44],[-90,6,-62],[-117,9,-58],[-133,12,-36],
  [-120,13,-12],[-91,10,2],[-84,8,16],[-102,5,31],[-100,4,45]
];
// Two slalom sequences alternate drift sides, with short exits for earned boost.
const windwayPoints = [
  [-118,7,58],[-91,8,61],[-68,9,47],[-46,11,43],[-22,12,59],
  [4,13,63],[28,13,47],[53,14,43],[78,15,56],[108,17,57],
  [131,18,38],[146,19,7],[134,20,-19],[116,18,-32],[106,15,-56],
  [88,12,-75],[64,10,-92],[34,9,-92],[12,8,-74],[-13,7,-69],
  [-38,7,-87],[-64,6,-92],[-91,6,-80],[-125,6,-56],[-144,7,-20],[-143,7,24]
];
// A straight upper gantry leads to a separate lower catch deck. The gap endpoints
// are control points, so the road mesh and the flight system share the same cut.
const foundryPoints = [
  [-108,8,58],[-84,9,64],[-61,11,80],[-37,13,80],[-13,15,60],
  [12,17,57],[35,19,75],[60,21,72],[82,23,46],[106,25,29],
  [117,32,-5],[99,36,-32],[65,38,-44],[45,39,-44],[1,21,-44],
  [-26,20,-44],[-53,18,-44],[-82,14,-80],[-117,11,-68],
  [-133,9,-43],[-141,8,-11],[-142,8,24],[-132,8,47]
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
    (length, at) => ({ pads: [{distance: 56, lane: 2.8}, {distance: at(8), lane: -2.8}, {distance: at(15), lane: 2}, {distance: at(19), lane: -2.8}] })),
  makeCourse({ id: 'frost', name: '프로스트 패스', subtitle: '빙하 저수지', description: '댐을 건너 눈 덮인 고갯길의 연속 헤어핀을 공략하세요.', halfWidth: 7.4 }, frostPoints,
    (length, at) => ({ pads: [{distance: 44, lane: -2.8}, {distance: at(7)+6, lane: 2}, {distance: at(13), lane: -3}, {distance: at(20)+6, lane: 2.6}] })),
  makeCourse({ id: 'redrock', name: '레드록 캐니언', subtitle: '사암 채석장', description: '붉은 암벽 사이의 긴 고속 코너를 지나 채석장 굽잇길로 진입하세요.', halfWidth: 8.1 }, redrockPoints,
    (length, at) => ({ pads: [{distance: 39, lane: 2.9}, {distance: at(4)+4, lane: -3}, {distance: at(8), lane: 2.5}, {distance: at(14)+6, lane: -2.7}] })),
  makeCourse({ id: 'windway', recordId: 'windway-slalom', previousRecords: [{id: 'windway', name: '터빈 코즈웨이 · 이전 배치'}], name: '터빈 코즈웨이', subtitle: '해상 더블 슬라럼', description: '바다 위 연속 S자를 좌우 드리프트로 연결하고, 짧은 코너 출구에서 부스터로 추월하세요.', halfWidth: 8.1 }, windwayPoints,
    (length, at) => ({ pads: [{distance: at(3)+5, lane: -2.8}, {distance: at(7)+5, lane: 2.8}, {distance: at(17)+4, lane: -2.3}, {distance: at(21)+4, lane: 2.9}] })),
  makeCourse({ id: 'foundry', recordId: 'foundry-slalom', previousRecords: [{id: 'foundry', name: '아이언웍스 드롭 · 이전 배치'}], name: '아이언웍스 드롭', subtitle: '제철소 S자 고가', description: '연속 S자 고가를 드리프트로 올라가 18m 낙하에 도전하세요. 착지 후에는 외곽 코너로 이어집니다.', halfWidth: 7.8 }, foundryPoints,
    (length, at) => ({ pads: [{distance: at(3)+4, lane: 2.7}, {distance: at(12)-7, lane: 0}, {distance: at(16)+5, lane: -2.6}, {distance: at(21)+5, lane: 2.6}],
      gaps: [{start: at(13), end: at(14), drop: 18}] }))
];
export const courseRecordId = id => tracks.find(course => course.id === id)?.recordId || id;
export const track = tracks[0];
export const coursePoint = track.point;
export const courseFrame = track.frame;
