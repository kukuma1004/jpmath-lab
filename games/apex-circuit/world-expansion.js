import * as T from './vendor/three.module.min.js';
import { instances, matrix, nearest, noise, pathSamples } from './world-landmarks.js?v=17';

const UP = new T.Vector3(0, 1, 0);
const cube = new T.BoxGeometry();
const metal = color => new T.MeshStandardMaterial({color, roughness: .62, metalness: .24});
const glow = color => new T.MeshBasicMaterial({color});

function beam(a, b, width, depth = width) {
  const direction = b.clone().sub(a);
  return new T.Matrix4().compose(a.clone().lerp(b, .5),
    new T.Quaternion().setFromUnitVectors(UP, direction.clone().normalize()),
    new T.Vector3(width, direction.length(), depth));
}

function rotorGeometry() {
  const shape = new T.Shape();
  shape.moveTo(-.037, .07);
  shape.lineTo(-.073, .34);
  shape.lineTo(-.022, .98);
  shape.lineTo(.009, 1);
  shape.lineTo(.044, .45);
  shape.lineTo(.052, .13);
  shape.closePath();
  const blade = new T.ExtrudeGeometry(shape, {depth: .025, bevelEnabled: false});
  const positions = [], normals = [];
  for (let i = 0; i < 3; i++) {
    const part = blade.clone().rotateZ(i * Math.PI * 2 / 3);
    positions.push(...part.attributes.position.array);
    normals.push(...part.attributes.normal.array);
    part.dispose();
  }
  blade.dispose();
  const result = new T.BufferGeometry();
  result.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  result.setAttribute('normal', new T.Float32BufferAttribute(normals, 3));
  return result;
}

function turbineCoast(scene, course, kit, time) {
  const {block, surface, placard, grain} = kit;
  const white = metal(0xe6e7da), navy = metal(0x203f54), orange = metal(0xed9a4d);
  const concrete = surface(0x969c94); concrete.map = grain('concrete-grain');
  const towers = [], bases = [], rotors = [], hubs = [], braces = [], rings = [];
  const placements = [[-80, -25, 39], [-26, -18, 44], [30, -12, 42], [79, 6, 36],
    [-174, -78, 45], [-100, -128, 50], [13, -139, 46], [152, -104, 54]];
  const yaw = -.52;
  for (const [x, z, height] of placements) {
    bases.push(matrix(x, -6.4, z, 4.5, 3.1, 4.5));
    towers.push(matrix(x, -4.9 + height / 2, z, 1, height, 1));
    block(scene, orange, x, -3.2, z, 2.9, 1.5, 2.9);
    const nacelle = new T.Group(); nacelle.position.set(x, height - 4.9, z); nacelle.rotation.y = yaw;
    block(nacelle, white, 0, .1, -.5, 2.8, 2.1, 5.4);
    block(nacelle, navy, 0, -.8, -1.7, 2.55, .38, 2.7);
    block(nacelle, orange, 0, .15, -3.22, 2.72, 1.55, .14);
    for (const side of [-1, 1]) {
      for (let y = 3; y < height - 6; y += 2.2) {
        block(scene, navy, x + side * .52, y - 4.9, z + 1.14, .11, .13, .26);
      }
    }
    scene.add(nacelle);
    const hub = new T.Vector3(0, 0, 2.4).applyAxisAngle(UP, yaw).add(nacelle.position);
    hubs.push(matrix(hub.x, hub.y, hub.z, 1, 1, 1, yaw));
    rotors.push(matrix(hub.x, hub.y, hub.z + .02, height * .32, height * .32, height * .32, yaw));
    rings.push(matrix(x, -7.68, z, 1, 1, 1));
  }
  instances(scene, new T.CylinderGeometry(.93, 1.42, 1, 14), white, towers);
  instances(scene, new T.CylinderGeometry(2.6, 3.4, 1, 12), concrete, bases);
  instances(scene, new T.SphereGeometry(.92, 12, 8), white, hubs);
  const rotor = white.clone();
  rotor.side = T.DoubleSide;
  rotor.customProgramCacheKey = () => 'windway-turbine-rotor';
  rotor.onBeforeCompile = shader => {
    shader.uniforms.rotorTime = time;
    shader.vertexShader = 'uniform float rotorTime;\n' + shader.vertexShader
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nfloat rotorAngle=rotorTime*.31; mat2 rotorSpin=mat2(cos(rotorAngle),sin(rotorAngle),-sin(rotorAngle),cos(rotorAngle)); objectNormal.xy=rotorSpin*objectNormal.xy;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.xy=rotorSpin*transformed.xy;');
  };
  const moving = instances(scene, rotorGeometry(), rotor, rotors);
  moving.userData.distant = true; // Static shadow maps should not contain the animated rotor.
  const wash = new T.TorusGeometry(3.7, .10, 4, 32); wash.rotateX(Math.PI / 2);
  instances(scene, wash, glow(0x6bbaae), rings);

  // Substation island: sheet-metal switchgear, cable bridges and an access pier.
  block(scene, concrete, -38, -4.6, 17, 50, 6.1, 22);
  block(scene, navy, -38, -1.35, 17, 49.9, .42, 21.9);
  block(scene, white, -38, 1.9, 14, 22, 6.1, 10);
  block(scene, orange, -38, 5.12, 14, 22.8, .34, 10.7);
  for (let x = -46; x <= -29; x += 4) {
    block(scene, navy, x, 2.3, 19.08, 2.8, 2.5, .1);
    block(scene, white, x, 5.64, 14, 2.6, .7, 3.4);
    for (const z of [8.8, 24]) {
      block(scene, navy, x, .15, z, 2.6, 2.7, 2.4);
      block(scene, orange, x, 1.6, z, 2.2, .24, 2);
      for (const side of [-.7, .7]) block(scene, white, x + side, 2.36, z, .20, 1.1, .20);
    }
  }
  const sign = placard('OFFSHORE / 07', 13, 1.6, '#18394a', '#e7e8cb');
  sign.position.set(-38, 3.75, 19.18); scene.add(sign);
  const road = pathSamples(course, 3);
  for (let d = 15; d < course.length; d += 23) {
    for (const side of [-1, 1]) {
      const p = course.point(d, side * (course.halfWidth + 1.4), .15);
      const top = p.clone().addScaledVector(UP, 2.1);
      braces.push(beam(p, top, .12));
      const vane = course.point(d + 1, side * (course.halfWidth + 1.4), 2.2);
      braces.push(beam(top, vane, .06));
    }
  }
  instances(scene, cube, navy, braces);
  // Low rock shelves anchor the pier without filling the racing corridor.
  const rocks = [];
  for (let i = 0; i < 27; i++) {
    const x = -64 + (i * 13 % 55), z = 31 + Math.sin(i * 2.3) * 5;
    if (nearest(x, z, road).distance > course.halfWidth + 4)
      rocks.push(matrix(x, -6.1, z, 2.5 + i % 4, 1.6 + i % 3, 2.1, i));
  }
  instances(scene, new T.IcosahedronGeometry(1, 1), surface(0x657c7d), rocks);
}

function ironworks(scene, course, kit) {
  const {block, surface, placard, grain} = kit;
  const steel = metal(0x4f626b), dark = metal(0x283943), rust = metal(0xa96542), ivory = metal(0xd5c8ae);
  const road = pathSamples(course, 3);
  const terrain = new T.PlaneGeometry(650, 540, 76, 64); terrain.rotateX(-Math.PI / 2);
  const positions = terrain.attributes.position;
  const colors = [], lo = new T.Color(0x3c4548), hi = new T.Color(0x78837f), tint = new T.Color();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), z = positions.getZ(i), edge = nearest(x, z, road);
    const n = noise(x * .043, z * .055);
    let height = -3.8 + n * 3 + Math.max(0, Math.abs(x) - 163) * .15 + Math.max(0, Math.abs(z) - 112) * .12;
    height = T.MathUtils.lerp(Math.min(height, edge.height - 3.5), height,
      T.MathUtils.smoothstep(edge.distance, course.halfWidth + 2, course.halfWidth + 18));
    // The abandoned transfer trench remains visibly open below the cut deck.
    if (x > -4 && x < 54 && z > -58 && z < -29) height = Math.min(height, -15 + n * 2);
    positions.setY(i, height);
    tint.copy(lo).lerp(hi, n).toArray(colors, i * 3);
  }
  terrain.setAttribute('color', new T.Float32BufferAttribute(colors, 3)); terrain.computeVertexNormals();
  const ground = new T.MeshStandardMaterial({vertexColors: true, roughness: .96, map: grain('slate-rock')});
  const field = new T.Mesh(terrain, ground); field.userData.distant = true; scene.add(field);
  const platforms = [], pipes = [], ladders = [], rings = [];
  const cylinder = new T.CylinderGeometry(1, 1, 1, 20);
  const furnaceProfile = [[9, 0], [9, 3], [7, 5], [7, 22], [5.7, 28], [4.5, 31], [4.5, 34]];
  const furnace = new T.LatheGeometry(furnaceProfile.map(([x, y]) => new T.Vector2(x, y)), 24);
  const blast = new T.Mesh(furnace, rust); blast.position.set(47, -2, 4); scene.add(blast);
  for (const y of [3, 10, 19, 28]) {
    rings.push(matrix(47, y, 4, 1, 1, 1));
    for (const side of [-1, 1]) block(scene, steel, 47 + side * 8.4, y, 4, 2.5, .24, 15);
  }
  const collar = new T.TorusGeometry(7.5, .27, 6, 32); collar.rotateX(Math.PI / 2);
  instances(scene, collar, ivory, rings);
  const towerGeo = new T.LatheGeometry([[7.8, 0], [8.6, 3], [7.5, 10], [5.4, 20], [5.9, 27], [7.7, 34], [7.7, 35], [7.1, 35], [7.1, 34], [5.3, 27]].map(([x, y]) => new T.Vector2(x, y)), 24);
  instances(scene, towerGeo, ivory, [matrix(-38, -2, 1, 1, 1, 1), matrix(-8, -2, 9, 1, .87, 1)]);
  for (const [x, z] of [[-38, 1], [-8, 9]]) {
    const crown = new T.Mesh(new T.TorusGeometry(7.4, .29, 6, 32), steel);
    crown.rotation.x = Math.PI / 2; crown.position.set(x, x === -38 ? 33.1 : 28.5, z); scene.add(crown);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6)
      platforms.push(matrix(x + Math.cos(a) * 7.6, .2, z + Math.sin(a) * 7.6, .55, 4.8, .55, a));
  }
  for (const [x, z, height] of [[73, -12, 54], [89, 7, 43], [-62, -18, 40]]) {
    pipes.push(matrix(x, height / 2 - 2, z, 2.5, height, 2.5));
    for (let y = 2; y < height - 1; y += 6) {
      block(scene, rust, x, y, z, 5.12, 1.8, 5.12);
      for (let step = 0; step < 5; step++) ladders.push(matrix(x + 2.68, y + step * .46, z, .17, .14, 1.2));
    }
    block(scene, dark, x, height - 1.6, z, 5.6, .6, 5.6);
  }
  instances(scene, cylinder, ivory, pipes);
  instances(scene, cube, steel, [...platforms, ...ladders]);
  // A pitched fabrication hall has sawtooth roof lights and external buttresses.
  const hall = new T.Group(); hall.position.set(-20, -1.6, 34);
  block(hall, dark, 0, 4, 0, 62, 8, 16);
  for (let x = -28; x <= 28; x += 8) {
    block(hall, rust, x, 4.6, 8.3, .45, 9.2, .60);
    const roof = block(hall, steel, x, 8.6, 0, 7.2, .36, 17.4); roof.rotation.z = -.12;
    block(hall, ivory, x + 3.5, 8.9, 0, .18, 1, 17);
    for (let y = 2.9; y < 6.7; y += 1.1) block(hall, ivory, x, y, 8.13, 5.8, .47, .08);
  }
  scene.add(hall);
  const hallSign = placard('IRONWORKS  /  TRANSFER 18', 34, 2.3, '#243842', '#eed6a2');
  hallSign.position.set(-20, 5.1, 42.4); scene.add(hallSign);
  const pipework = [];
  for (const offset of [0, 2.5, 5]) {
    pipework.push(beam(new T.Vector3(-53, 12 + offset * .1, 20 + offset), new T.Vector3(37, 12 + offset * .1, 20 + offset), .72));
  }
  instances(scene, cylinder, rust, pipework);
  // Side-mounted warning panels announce the jump while leaving the full deck clear.
  const gap = course.gaps[0];
  for (const side of [-1, 1]) {
    const group = new T.Group(); const frame = course.frame(gap.start - 28, side * (course.halfWidth + 1.8), 0);
    group.position.copy(frame.position); group.rotation.copy(frame.rotation);
    block(group, steel, 0, 2.7, 0, .23, 5.4, .23);
    const sign = placard('18m  DROP  >>>', 5.9, 1.65, '#372e28', '#ffce7b');
    sign.position.set(0, 4.3, -.18); sign.rotation.y = Math.PI; group.add(sign); scene.add(group);
  }
}

export function expansion(scene, course, kit, waves) {
  if (course.id === 'windway') turbineCoast(scene, course, kit, waves);
  else ironworks(scene, course, kit);
}
