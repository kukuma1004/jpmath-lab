import * as T from './vendor/three.module.min.js';
import { courseFrame, coursePoint, track } from './track.js';

const box = new T.BoxGeometry();
const dummy = new T.Object3D();
const surface = (color, roughness = 0.82) => new T.MeshStandardMaterial({ color, roughness });
const unlit = color => new T.MeshBasicMaterial({ color });
const asphalt = surface(0x374157);
const steel = surface(0x353d53);
const concrete = surface(0xadb5a8);
const white = surface(0xffecd2);
const red = surface(0xe45b44);
const aqua = new T.MeshStandardMaterial({ color: 0x6cf7d4, emissive: 0x2ff6d0, emissiveIntensity: 0.65 });
const ink = surface(0x192b40);
const amber = surface(0xff9c43);
const glass = surface(0x438591, 0.29);
const sand = surface(0xd7a575);
const stone = surface(0x835958);
const trim = surface(0xead5a5);
const green = surface(0x3d7967);
const moss = surface(0x599774);
const sunDirection = new T.Vector3(0.64, 0.23, -0.74).normalize();

function randomFrom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function block(parent, material, x, y, z, sx, sy, sz) {
  const mesh = new T.Mesh(box, material);
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  parent.add(mesh);
  return mesh;
}

function batch(parent, material, transforms, geometry = box) {
  if (!transforms.length) return;
  const mesh = new T.InstancedMesh(geometry, material, transforms.length);
  transforms.forEach(({ position, rotation, scale }, i) => {
    dummy.position.copy(position);
    dummy.rotation.copy(rotation);
    dummy.scale.set(...scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  parent.add(mesh);
}

function combineStaticBoxes(scene) {
  scene.updateMatrixWorld(true);
  const groups = new Map();
  scene.traverse(object => {
    if (!object.isMesh || object.isInstancedMesh || object.geometry !== box) return;
    if (!groups.has(object.material)) groups.set(object.material, []);
    groups.get(object.material).push(object);
  });
  for (const [material, objects] of groups) {
    if (objects.length < 2) continue;
    const mesh = new T.InstancedMesh(box, material, objects.length);
    objects.forEach((object, i) => {
      mesh.setMatrixAt(i, object.matrixWorld);
      object.removeFromParent();
    });
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
  }
}

function at(distance, lane, height, ...scale) {
  return { ...courseFrame(distance, lane, height), scale };
}

function terrainTransform(x, y, z, sx, sy, sz, yaw = 0) {
  return { position: new T.Vector3(x, y, z), rotation: new T.Euler(0, yaw, 0), scale: [sx, sy, sz] };
}

function strip(parent, material, left, right, low, high, step = 1.7) {
  const sections = Math.ceil(track.length / step);
  const positions = [];
  const uv = [];
  const indices = [];
  for (let i = 0; i <= sections; i++) {
    const d = i / sections * track.length;
    positions.push(...coursePoint(d, left, low).toArray(), ...coursePoint(d, right, high).toArray());
    uv.push(0, d / 7, 1, d / 7);
    if (i === sections) continue;
    const j = i * 2;
    indices.push(j, j + 1, j + 2, j + 1, j + 3, j + 2);
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new T.Mesh(geometry, material);
  parent.add(mesh);
}

function paintTexture() {
  const tile = document.createElement('canvas');
  tile.width = 256;
  tile.height = 128;
  const ctx = tile.getContext('2d');
  const rng = randomFrom(9821);
  const image = ctx.createImageData(tile.width, tile.height);
  for (let y = 0; y < tile.height; y++) {
    for (let x = 0; x < tile.width; x++) {
      const edgeShade = 24 * Math.pow(Math.abs(x / 128 - 1), 5);
      const tire = 9 * Math.exp(-Math.pow((x - 83) / 6, 2)) + 9 * Math.exp(-Math.pow((x - 173) / 6, 2));
      const value = Math.floor(213 + rng() * 36 - edgeShade - tire);
      const i = (y * tile.width + x) * 4;
      image.data.set([value, value, value, 255], i);
    }
  }
  ctx.putImageData(image, 0, 0);
  const tex = new T.CanvasTexture(tile);
  tex.colorSpace = T.SRGBColorSpace;
  tex.wrapT = T.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function road(scene) {
  asphalt.map = paintTexture();
  steel.side = T.DoubleSide;
  strip(scene, asphalt, -7.5, 7.5, 0, 0);
  strip(scene, steel, -7.9, 7.9, -0.68, -0.68);
  for (const side of [-1, 1]) {
    strip(scene, steel, side * 7.89, side * 7.89, -0.68, 0.08);
    const edge = (side * 7.46);
    strip(scene, concrete, edge - .26, edge + .26, 0.08, 0.08);
    const guard = side * 7.99;
    strip(scene, concrete, guard - .14, guard + .14, 0.68, 0.68);
    strip(scene, steel, guard - .10, guard + .10, 0.41, 0.41);
    strip(scene, white, side * 6.9 - .06, side * 6.9 + .06, 0.018, 0.018);
  }
  const curbs = [[], []], posts = [], seams = [], piers = [], crossbeams = [];
  const segments = Math.ceil(track.length / 1.55);
  for (let i = 0; i < segments; i++) {
    const distance = i * track.length / segments;
    for (const side of [-1, 1]) {
      const p = track.sample(distance);
      if (Math.abs(p.curve) > .017 || distance < 65)
        curbs[Math.floor(i / 2) % 2].push(at(distance, side * 7.27, .07, .44, .12, 1.48));
      if (i % 3 === 0) posts.push(at(distance, side * 8, .37, .24, .78, .24));
    }
    if (i % 4 === 0) seams.push(at(distance, 0, .016, .09, .018, 2.05));
    if (i % 8 !== 0) continue;
    const p = track.sample(distance);
    if (p.y < 2 && p.z > 22) continue;
    crossbeams.push(at(distance, 0, -0.9, 13.6, .8, 1.4));
    for (const lane of [-4.9, 4.9]) {
      const pos = coursePoint(distance, lane);
      const height = pos.y + 7.3;
      piers.push(terrainTransform(pos.x, pos.y - height / 2 - .55, pos.z, 1.07, height, 1.07,
        Math.atan2(p.dx, p.dz)));
    }
  }
  batch(scene, red, curbs[0]);
  batch(scene, white, curbs[1]);
  batch(scene, concrete, posts);
  batch(scene, surface(0x9cabb1), seams);
  batch(scene, surface(0x8f9291), piers);
  batch(scene, steel, crossbeams);

  const finish = [[], []];
  for (let stripe = 0; stripe < 2; stripe++) {
    for (let i = 0; i < 18; i++) {
      finish[(i + stripe) % 2].push(at((stripe - .5) * .84, (i - 8.5) * .77, .025, .77, .021, .84));
    }
  }
  batch(scene, white, finish[0]);
  batch(scene, ink, finish[1]);

  const arrows = [];
  const outlines = [];
  for (const { distance, lane } of track.pads) {
    outlines.push(at(distance, lane, .047, 3.6, .085, 6.5));
    for (let n = -1; n <= 1; n++) {
      for (const sign of [-1, 1]) {
        const arm = at(distance + 1.6 * n + .15, lane + sign * .65, .12, .29, .06, 1.65);
        arm.rotation.y += sign * .92;
        arrows.push(arm);
      }
    }
  }
  batch(scene, surface(0x225d5d), outlines);
  batch(scene, aqua, arrows);

  const chevrons = [];
  for (let d = 10; d < track.length; d += 6) {
    const p = track.sample(d);
    if (Math.abs(p.curve) < .038) continue;
    chevrons.push(at(d, Math.sign(p.curve) * 7.98, .9, .18, .79, 1.05));
  }
  batch(scene, amber, chevrons);
  const launch = [];
  for (const ramp of track.ramps) {
    for (let n = 0; n < 9; n++) {
      const marking = at(ramp.start - 1.2, n * 1.57 - 6.28, .036, .39, .034, 1.0);
      marking.rotation.y -= .58;
      launch.push(marking);
    }
  }
  batch(scene, amber, launch);
}

function island(scene, x, z, rx, rz, top, seed) {
  const rng = randomFrom(seed);
  const layers = [[.65, top], [.88, top - .24], [.96, top - 1.03],
    [.98, T.MathUtils.lerp(top, -6.8, .55)], [1.045, -6.7], [1.10, -7.85], [1.18, -8.2]];
  const colors = [0xd8a878, 0xe7b887, 0xbf7d61, 0xa35c51, 0x844e52, 0xd7af84, 0x6caeb0];
  const sides = 30;
  const rim = Array.from({ length: sides }, () => .86 + rng() * .27);
  const rings = layers.map(([r, y], j) => rim.map((noise, i) => {
    const a = (i / sides) * Math.PI * 2;
    return new T.Vector3(x + rx * r * noise * Math.cos(a), y + (rng() - .5) * (j > 2 ? .25 : .65),
      z + rz * r * noise * Math.sin(a));
  }));
  const positions = [], tints = [];
  function face(a, b, c, color) {
    const rgb = new T.Color(color).multiplyScalar(.81 + rng() * .25);
    positions.push(...a.toArray(), ...b.toArray(), ...c.toArray());
    for (let i = 0; i < 3; i++) tints.push(rgb.r, rgb.g, rgb.b);
  }
  for (let i = 0; i < sides; i++) {
    const n = (i + 1) % sides;
    face(new T.Vector3(x, top + .07, z), rings[0][n], rings[0][i], colors[0]);
    for (let j = 1; j < layers.length; j++) {
      face(rings[j - 1][i], rings[j - 1][n], rings[j][i], colors[j]);
      face(rings[j - 1][n], rings[j][n], rings[j][i], colors[j]);
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new T.Float32BufferAttribute(tints, 3));
  geometry.computeVertexNormals();
  scene.add(new T.Mesh(geometry, new T.MeshStandardMaterial({ vertexColors: true, roughness: .94, side: T.DoubleSide })));
}

function placard(text, width, height, background = '#162b3c', foreground = '#f7e6af') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.round(512 * height / width);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = foreground;
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  ctx.fillStyle = foreground;
  ctx.font = `italic 900 ${Math.min(66, Math.round(canvas.height * .60))}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, canvas.height / 2 + 1, 455);
  const tex = new T.CanvasTexture(canvas);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  return new T.Mesh(new T.PlaneGeometry(width, height), new T.MeshBasicMaterial({ map: tex, side: T.DoubleSide }));
}

function gantry(scene) {
  const start = courseFrame(1.8);
  const group = new T.Group();
  group.position.copy(start.position);
  group.rotation.copy(start.rotation);
  for (const x of [-8.4, 8.4]) {
    block(group, ink, x, 2.5, 0, .89, 5, 1.42);
    block(group, red, x, 2.38, -.67, .47, 4.6, .15);
    block(group, white, x, 4.88, 0, 1.12, .22, 1.7);
  }
  block(group, red, 0, 5.09, 0, 17.8, 1.68, 1.62);
  block(group, ink, 0, 4.19, 0, 6.5, .36, 1.5);
  for (const z of [-.832, .832]) {
    const face = placard('SUNSET PIER', 13.6, 1.61);
    face.rotation.y = z < 0 ? Math.PI : 0;
    face.position.set(0, 5.22, z);
    group.add(face);
  }
  const lights = [];
  for (let x = -2.4; x < 2.5; x += 1.2) {
    const signal = new T.MeshBasicMaterial({ color: 0xe85738 });
    lights.push(signal);
    block(group, signal, x, 4.1, -.79, .73, .24, .08);
    block(group, signal, x, 4.1, .79, .73, .24, .08);
  }
  scene.add(group);
  return lights;
}

function paddock(scene) {
  const group = new T.Group();
  group.position.set(-22, -1.70, 20);
  group.rotation.y = .02;
  block(group, stone, 0, -.4, 0, 50, 1.2, 10);
  block(group, trim, 0, .2, 0, 49.8, .45, 9.9);
  for (const x of [-16.5, -8.25, 0, 8.25, 16.5]) {
    block(group, white, x, 1.9, 0, 8, 3.8, 6.5);
    block(group, ink, x, 1.47, 3.26, 6.1, 2.4, .12);
    for (let y = .55; y < 2.6; y += .5) block(group, glass, x, y, 3.34, 5.7, .22, .13);
    block(group, red, x, 4.0, 0, 8.13, .45, 7.05);
    block(group, white, x, 4.25, 0, 8.1, .12, 7.01);
    block(group, ink, x, 4.36, -.3, 6.7, .11, 4.6);
    block(group, amber, x + 3.8, 2.37, 3.4, .23, 2.85, .23);
  }
  const deck = new T.Group();
  deck.position.set(-6, 4.03, -1.65);
  block(deck, steel, 0, .25, 0, 13.5, .55, 3.3);
  block(deck, glass, 0, 1.45, 0, 12.5, 2.0, 2.92);
  block(deck, white, 0, 2.54, 0, 13.6, .15, 3.4);
  block(deck, red, 0, 2.74, 0, 13.7, .25, 3.58);
  for (let x = -5; x < 6; x += 2) block(deck, ink, x, 1.55, 1.48, .11, 2.0, .1);
  group.add(deck);
  const sign = placard('APEX', 7.9, 1.35, '#da543a');
  sign.position.set(10.6, 5.19, 1.8);
  group.add(sign);
  scene.add(group);
}

function harbor(scene) {
  const dock = new T.Group();
  dock.position.set(81, -6.7, 33);
  dock.rotation.y = -.28;
  block(dock, stone, 0, -.38, 0, 24, 1.2, 5);
  block(dock, sand, 0, .23, 0, 24, .25, 4.8);
  for (const x of [-11, -6, 1, 7, 11]) {
    block(dock, ink, x, -.25, 2.09, .48, 2.02, .48);
    block(dock, amber, x, .88, 2.09, .62, .22, .62);
  }
  for (const [x, y, color] of [[-7, 1.25, red], [-2.1, 1.25, amber], [-7, 2.96, white], [7.2, 1.25, glass]]) {
    block(dock, color, x, y, -.85, 4.72, 1.66, 2.26);
    for (let j = -2; j < 2.2; j += .5) block(dock, steel, x + j, y, .3, .055, 1.49, .06);
  }
  scene.add(dock);

  const boat = new T.Group();
  boat.position.set(81, -7.5, 40);
  boat.rotation.y = -.86;
  const hull = new T.Shape();
  hull.moveTo(-2.4, -5.8);
  hull.lineTo(2.4, -5.8);
  hull.lineTo(2.6, 4.2);
  hull.lineTo(0, 7.3);
  hull.lineTo(-2.6, 4.2);
  hull.closePath();
  const body = new T.Mesh(new T.ExtrudeGeometry(hull, { depth: .95, bevelEnabled: true,
    bevelSegments: 1, bevelSize: .24, bevelThickness: .16 }), red);
  body.rotation.x = Math.PI / 2;
  body.position.y = 1.09;
  boat.add(body);
  block(boat, white, 0, 1.45, -1, 3.64, .75, 6.35);
  block(boat, glass, 0, 2.23, -2.23, 3.58, .84, 2.8);
  block(boat, white, 0, 2.72, -2.23, 3.78, .19, 3.15);
  block(boat, amber, 0, 2.03, 2.3, 1.37, .14, 2.1);
  block(boat, ink, 0, 3.10, -2.6, .12, .81, .12);
  scene.add(boat);
}

function lighthouse(scene) {
  const light = new T.Group();
  light.position.set(-44, 4.1, -88);
  function drum(material, rt, rb, y, height) {
    const mesh = new T.Mesh(new T.CylinderGeometry(rt, rb, height, 12), material);
    mesh.position.y = y;
    light.add(mesh);
  }
  drum(stone, 2.3, 3.1, .45, 1.4);
  drum(white, 1.67, 2.15, 2.25, 2.8);
  drum(red, 1.42, 1.67, 4.55, 1.8);
  drum(white, 1.27, 1.42, 6.4, 1.9);
  drum(ink, 2.0, 2.07, 7.48, .35);
  drum(new T.MeshBasicMaterial({ color: 0xffd478 }), 1.38, 1.38, 8.19, 1.12);
  drum(red, .27, 1.82, 9.15, .94);
  drum(ink, .11, .15, 9.86, .51);
  scene.add(light);
}

function scenery(scene) {
  island(scene, -19, -50, 42, 29, 4.2, 11);
  island(scene, -62, -42, 21, 23, 2.15, 29);
  island(scene, -97, 12, 23, 24, -.65, 38);
  island(scene, -29, 27, 45, 12, -1.96, 55);
  island(scene, -44, -88, 7.3, 5.3, 4.1, 70);
  island(scene, 40, -11, 21, 18, -.15, 84);
  island(scene, -15, 95, 28, 14, -3.3, 161);
  island(scene, 148, -74, 32, 20, -1.7, 85);
  island(scene, -136, -138, 41, 12, -1.8, 16);
  const rocks = [], brush = [];
  const rng = randomFrom(55914);
  const clusters = [[-20, -50, 27, 16, 4], [-83, -24, 9, 6, 1], [40, -9, 8, 7, 0], [-97, 12, 8, 10, -.9], [-15, 95, 17, 8, -3.2]];
  for (const [x, z, rx, rz, y] of clusters) {
    for (let i = 0; i < 31; i++) {
      const px = x + (rng() - .5) * rx * 2;
      const pz = z + (rng() - .5) * rz * 2;
      let roadDistance = Infinity;
      for (let d = 0; d < track.length; d += 4) {
        const p = track.sample(d);
        roadDistance = Math.min(roadDistance, Math.hypot(px - p.x, pz - p.z));
      }
      if (roadDistance < 9.9) continue;
      const size = .25 + rng() * 1.1;
      rocks.push(terrainTransform(px, y + size * .32, pz, size * 1.64, size * .85, size * 1.1, rng() * 6));
      if (i % 2 === 0) brush.push(terrainTransform(px - .6, y + size * .44, pz + .5, size, size * .65, size, rng() * 6));
    }
  }
  const rock = new T.IcosahedronGeometry(1, 0);
  batch(scene, stone, rocks, rock);
  batch(scene, moss, brush, rock);

  const trunks = [], leaves = [];
  for (const [x, y, z, h] of [[-32, 4, -43, 5.9], [-22, 4, -43, 7.6],
    [-51, 2.6, -37, 7.5], [-56, 2.5, -33, 5.2], [43, -.2, -5, 7.8], [48, -.22, -.1, 6.1],
    [-100, -.7, 9, 7.4], [-94, -.7, 8, 5.8], [-90, -.8, 12, 7], [-57, -1.65, 23, 6.9],
    [-14, -3.3, 99, 6.8], [-6, -3.3, 94, 5.6]]) {
    const trunk = terrainTransform(x, y + h / 2, z, .48, h, .51);
    trunk.rotation.z = .12;
    trunks.push(trunk);
    for (let i = 0; i < 7; i++) {
      const angle = i / 7 * Math.PI * 2 + rng() * .34;
      const spread = 1.04 + rng() * .64;
      const leaf = terrainTransform(x - h * .057 + Math.sin(angle) * spread, y + h + .19,
        z + Math.cos(angle) * spread, .96, .49, 2.16, angle);
      leaf.rotation.x = .21;
      leaves.push(leaf);
    }
  }
  batch(scene, surface(0x785447), trunks, new T.CylinderGeometry(.44, .65, 1, 6));
  const blade = new T.BufferGeometry();
  blade.setAttribute('position', new T.Float32BufferAttribute([
    0,0,-.96, -.43,.32,-.27, 0,.58,-.11,
    0,0,-.96, 0,.58,-.11, .43,.32,-.27,
    -.43,.32,-.27, -.38,.20,.24, 0,.58,-.11,
    0,.58,-.11, .38,.20,.24, .43,.32,-.27,
    -.38,.20,.24, 0,-.43,1.0, 0,.58,-.11,
    0,.58,-.11, 0,-.43,1.0, .38,.20,.24
  ], 3));
  blade.computeVertexNormals();
  green.side = T.DoubleSide;
  batch(scene, green, leaves, blade);

  paddock(scene);
  lighthouse(scene);
  harbor(scene);
}

function water(scene) {
  const material = new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSun: { value: sunDirection }, uInk: { value: new T.Color(0x147187) },
      uWave: { value: new T.Color(0x51bda9) }, uGold: { value: new T.Color(0xf6a765) } },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
      }`,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uSun, uInk, uWave, uGold;
      varying vec3 vWorld;
      void main() {
        vec2 p = vWorld.xz;
        float wave = sin(p.x * .18 + p.y * .28 + uTime * .68) + sin(p.x * .12 - p.y * .28 - uTime * .92);
        float flow = sin(p.x * .08 - p.y * .13 + uTime * .48);
        float grain = sin(p.y * 1.53 + sin(p.x * .31 + uTime * .96) * 2.8 + p.x * .24 + uTime * 1.17);
        float crest = smoothstep(.86, .99, grain) * smoothstep(.44, .98, flow);
        vec3 view = normalize(vWorld - cameraPosition);
        float distanceFade = 1.0 - smoothstep(120.0, 500.0, distance(vWorld, cameraPosition));
        vec3 col = mix(uInk, uWave, .38 + wave * .035 * distanceFade + flow * .14);
        float gleam = pow(max(0.0, dot(normalize(vec3(view.x + wave * .03, -view.y, view.z)), uSun)), 18.0);
        col += uGold * gleam * (.47 + .44 * crest) + vec3(.045, .10, .10) * crest * distanceFade;
        col = mix(uGold * 0.64 + uInk * 0.25, col, smoothstep(0.008, 0.27, -view.y));
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const plate = new T.Mesh(new T.PlaneGeometry(2400, 2400), material);
  plate.position.y = -7.86;
  plate.rotation.x = -Math.PI / 2;
  scene.add(plate);
  return material.uniforms.uTime;
}

function sky(scene) {
  const material = new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false,
    uniforms: {
      uSun: { value: sunDirection }, uHorizon: { value: new T.Color(0xe2a78e) },
      uOrange: { value: new T.Color(0xffd48e) }, uSky: { value: new T.Color(0x718da9) },
    },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 uSun, uHorizon, uOrange, uSky;
      varying vec3 vDir;
      void main() {
        vec3 ray = normalize(vDir);
        float h = smoothstep(-0.03, 0.63, ray.y);
        float sun = max(0.0, dot(ray, uSun));
        vec3 col = mix(uHorizon, uSky, h);
        col = mix(col, uOrange, pow(sun, 12.0) * 0.72);
        col += vec3(1.5, 0.89, 0.43) * smoothstep(0.9980, 0.9986, sun);
        float streak = sin(ray.y * 128.0 + sin(ray.x * 7.5) * 2.5) * sin(ray.x * 24.0 + 1.3);
        col += vec3(0.16, 0.11, 0.087) * smoothstep(0.43, 0.9, streak) * (1.0 - smoothstep(0.23, 0.51, ray.y)) * h;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const dome = new T.Mesh(new T.SphereGeometry(900, 20, 12), material);
  dome.renderOrder = -20;
  scene.add(dome);
}

export function buildWorld(scene) {
  scene.fog = new T.FogExp2(0xc7b6a3, .00275);
  scene.background = new T.Color(0xd4bfa8);
  sky(scene);
  const waves = water(scene);
  scene.add(new T.HemisphereLight(0xffeed5, 0x779dc0, 1.72));
  const sun = new T.DirectionalLight(0xffc591, 2.55);
  sun.position.copy(sunDirection).multiplyScalar(140);
  scene.add(sun);
  const rim = new T.DirectionalLight(0xc5dfff, 1.03);
  rim.position.set(-85, 48, 90);
  scene.add(rim);
  scenery(scene);
  road(scene);
  const lights = gantry(scene);
  combineStaticBoxes(scene);
  return { waves, lights };
}
