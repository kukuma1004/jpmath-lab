import * as T from './vendor/three.module.min.js';

// Race distance is measured along the main road. Both ends of the bypass
// correspond to the same checkpoints on either road.
export function makeBypass(course, start, end, waypoints, name, entryLane) {
  const anchor = (d) => course.point(d, entryLane, .025);
  const curve = new T.CatmullRomCurve3([anchor(start), anchor(start + 4),
    ...waypoints.map(p => new T.Vector3(...p)), anchor(end - 4), anchor(end)], false, 'centripetal');
  curve.arcLengthDivisions = 700;
  const length = curve.getLength();
  const count = Math.ceil(length * 2);
  const points = curve.getSpacedPoints(count);
  // In the overlap at a merge the two roads must be one banked surface,
  // rather than an independent low bridge through the main driving volume.
  const attachment = new Array(points.length).fill(null);
  if (course.id === 'metro') {
    const main = Array.from({length: Math.ceil(course.length / 1.5)}, (_, i) =>
      ({...course.sample(i * 1.5), distance: i * 1.5}));
    for (let i = 0; i < points.length; i++) {
      const d = i * length / count;
      if (d > 40 && d < length - 40) continue;
      const p = points[i]; let nearest, squared = Infinity;
      for (const row of main) {
        const ds = (row.x-p.x)**2 + (row.z-p.z)**2;
        if (ds < squared) { nearest = row; squared = ds; }
      }
      if (Math.abs(nearest.distance - (d < 40 ? start : end)) > 65) continue;
      const weight = 1 - T.MathUtils.smoothstep(Math.sqrt(squared), course.halfWidth + 2.85, course.halfWidth + 6.5);
      if (!weight) continue;
      const lane = (p.x-nearest.x)*-nearest.dz + (p.z-nearest.z)*nearest.dx;
      const forward = (p.x-nearest.x)*nearest.dx + (p.z-nearest.z)*nearest.dz;
      p.y = T.MathUtils.lerp(p.y, nearest.y + nearest.bank*lane + nearest.slope*forward + .025, weight);
      attachment[i] = {row: nearest, weight};
    }
  }
  const rows = points.map((p, i) => {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(count, i + 1)];
    const flat = Math.max(.00001, Math.hypot(b.x - a.x, b.z - a.z));
    const dx=(b.x-a.x)/flat, dz=(b.z-a.z)/flat, attach=attachment[i];
    const bank = attach ? attach.weight * (attach.row.bank*(attach.row.dz*dz+attach.row.dx*dx)
      + attach.row.slope*(-attach.row.dx*dz+attach.row.dz*dx)) : 0;
    return {x:p.x, y:p.y, z:p.z, dx, dz, slope:(b.y-a.y)/flat, bank, curve:0};
  });
  rows.forEach((row, i) => {
    const a = rows[Math.max(0,i-1)], b = rows[Math.min(count,i+1)];
    row.curve = Math.atan2(a.dz*b.dx-a.dx*b.dz,a.dx*b.dx+a.dz*b.dz)/(2*length/count);
  });
  function sample(distance, out = {}) {
    const t = T.MathUtils.clamp(distance / length, 0, 1) * count;
    const i = Math.floor(t), a = rows[i], b = rows[Math.min(count,i+1)];
    for (const field of ['x','y','z','dx','dz','slope','bank','curve']) out[field] = T.MathUtils.lerp(a[field], b[field], t-i);
    const flat = Math.hypot(out.dx, out.dz) || 1;
    out.dx /= flat;
    out.dz /= flat;
    return out;
  }
  function point(distance, lane=0, height=0) {
    const p = sample(distance);
    return new T.Vector3(p.x-p.dz*lane,p.y+p.bank*lane+height,p.z+p.dx*lane);
  }
  return {name,start,end,entryLane,length,halfWidth:2.55,sample,point,ratio:(end-start)/length};
}
export function sampleDriver(track, car, distance, out={}) {
  if (!car.shortcut) return track.sample(distance,out);
  const route = car.shortcut;
  const local = (distance-car.shortcutBase-route.start)/route.ratio;
  if (local >= 0 && local <= route.length) return route.sample(local,out);
  track.sample(distance,out);
  out.x -= out.dz * route.entryLane;
  out.z += out.dx * route.entryLane;
  out.y += out.bank * route.entryLane;
  return out;
}
