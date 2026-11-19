import { frontier } from './world-frontiers.js?v=8';
import * as T from './vendor/three.module.min.js';
import { grain, alpine, metropolis, coastalBridge, roadFurniture } from './world-landmarks.js?v=6';
import { courseFrame, coursePoint, track } from './track.js?v=5';

const box = new T.BoxGeometry();
const dummy = new T.Object3D();
const surface = (color, roughness = 0.82) => new T.MeshStandardMaterial({ color, roughness });
const unlit = color => new T.MeshBasicMaterial({ color });
const steel = new T.MeshStandardMaterial({color:0x6c7984,roughness:.43,metalness:.34,side:T.DoubleSide});
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
const sunDirection = new T.Vector3(.78, .11, -.63).normalize();
const seaLevel = -7.86;
const roadStyles = {
  sunset: { curb: 0xdf6946, pale: 0xf5ddac, shoulder: 0x9b8870, signal: 0xd65337, sign: '#332a37', dust: [.20, .12, .07] },
  summit: { curb: 0xe8aa45, pale: 0xf9e2a4, shoulder: 0x9e9686, signal: 0xbc842b, sign: '#293744', dust: [.18, .15, .11] },
  metro: { curb: 0x3e8792, pale: 0xb8dce3, shoulder: 0x476277, signal: 0x36889c, sign: '#102c3e' },
  frost: { curb: 0x367782, pale: 0xe5f3f0, shoulder: 0x7996a4, signal: 0x42778f, sign: '#163746', dust: [.29, .38, .41] },
  redrock: { curb: 0xc18243, pale: 0xf8d99b, shoulder: 0xa17958, signal: 0xb26835, sign: '#3e2b27', dust: [.32, .19, .11] },
};

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

function terrainTransform(x, y, z, sx, sy, sz, yaw = 0) {
  return { position: new T.Vector3(x, y, z), rotation: new T.Euler(0, yaw, 0), scale: [sx, sy, sz] };
}

function strip(track, parent, material, left, right, low, high, step = 1.7) {
  const point = track.point || coursePoint;
  const sections = Math.ceil(track.length / step);
  const gaps = track.gaps || [];
  const distances = [...new Set([...Array.from({length: sections + 1}, (_,i) => i * track.length / sections),
    ...gaps.flatMap(g => [g.start, g.end])])].sort((a,b) => a-b);
  const positions = [];
  const uv = [];
  const indices = [];
  for (let i = 0; i < distances.length; i++) {
    const d = distances[i];
    positions.push(...point(d, left, low).toArray(), ...point(d, right, high).toArray());
    uv.push(0, d / 7, Math.abs(right-left)/7, d / 7);
    if (i === distances.length - 1 || gaps.some(g => d >= g.start && d < g.end)) continue;
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
  return mesh;
}

function road(scene, track, theme) {
  const frame = track.frame || courseFrame;
  const point = track.point || coursePoint;
  const at = (distance, lane, height, ...scale) => ({ ...frame(distance, lane, height), scale });
  const style = roadStyles[theme];
  const width = track.halfWidth;
  const asphalt = surface(theme === 'frost' ? 0x9fbdc8 : theme === 'redrock' ? 0xc8af9d : theme === 'metro' ? 0x889aa9 : 0xbdbac1, theme === 'metro' ? .27 : .84);
  asphalt.map = grain(theme === 'metro' ? 'wet-asphalt' : 'asphalt-grain');
  if(theme === 'metro'){
    asphalt.metalness = .14;
    const mirror = scene.userData.wetMirror = {
      wetView: {value:null}, wetProjection: {value:new T.Matrix4()}, wetStrength:{value:0}
    };
    asphalt.customProgramCacheKey = () => 'metro-rain-film';
    asphalt.onBeforeCompile = shader => {
      Object.assign(shader.uniforms,mirror);
      shader.vertexShader = 'uniform mat4 wetProjection; varying vec4 wetCoord;\n' + shader.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nwetCoord = wetProjection * modelMatrix * vec4(transformed,1.);');
      shader.fragmentShader = 'uniform sampler2D wetView; uniform float wetStrength; varying vec4 wetCoord;\n' + shader.fragmentShader.replace('#include <map_fragment>', `
        #include <map_fragment>
        float lane = vMapUv.x * 7.;
        float distanceM = vMapUv.y * 7.;
        float grit = texture2D(map,vMapUv*2.4).r;
        float puddleNoise = texture2D(map, vMapUv*.41+vec2(.17,.53)).g;
        float film = smoothstep(.025,.25,puddleNoise*.72 + .065*sin(lane*.8+distanceM*.18));
        float aggregate = texture2D(map,vMapUv*1.53).g;
        diffuseColor.rgb = vec3(.012,.018,.024) + diffuseColor.rgb * (.46+.54*grit) + vec3(.15,.16,.17)*aggregate;
        float lampZ = mod(distanceM-5.+9.,18.)-9.;
        float lateral = abs(lane-${width.toFixed(2)});
        float lampX = lateral-(${width.toFixed(2)}-1.65);
        float spread = .30 + .055*abs(lampZ);
        float shine = exp(-lampX*lampX/(spread*spread)) * exp(-abs(lampZ)*.43);
        float flutter = .57+.43*sin(distanceM*27.+sin(lane*23.))*sin(lane*9.+distanceM*8.);
        vec3 lens = lane < ${width.toFixed(2)} ? vec3(.47,.72,1.) : vec3(1.,.63,.31);
        diffuseColor.rgb += lens * shine * flutter * (.55+film*.56);
      `).replace('#include <roughnessmap_fragment>', `
        #include <roughnessmap_fragment>
        roughnessFactor = mix(.57,.29,film);
      `).replace('#include <opaque_fragment>', `
        if(wetStrength>0. && wetCoord.w>0.){
          vec2 wetUv=wetCoord.xy/wetCoord.w*.5+.5;
          vec2 ripple=vec2(dFdx(grit),dFdy(grit))*.017 + .0011*vec2(sin(distanceM*7.+lane*4.),cos(lane*13.));
          vec2 smear=vec2(.0017,.0058)*(.8+grit);
          vec3 echo=texture2D(wetView,wetUv+ripple).rgb*.50
            +texture2D(wetView,wetUv+ripple+smear).rgb*.25
            +texture2D(wetView,wetUv+ripple-smear).rgb*.25;
          float grazing=pow(1.-clamp(dot(normal,normalize(vViewPosition)),0.,1.),2.);
          outgoingLight=mix(outgoingLight,echo,wetStrength*(.055+.19*film+.14*grazing));
        }
        #include <opaque_fragment>
      `);
    };
  }
  if(theme !== 'metro'){
    asphalt.customProgramCacheKey = () => 'road-wear-' + theme;
    const dustColor = style.dust.map(value => value.toFixed(2)).join(',');
    asphalt.onBeforeCompile = shader => {
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>', `
        #include <map_fragment>
        float lane=vMapUv.x*7.0;
        float longitudinal=vMapUv.y;
        float rubber=abs(fract((lane+.16*sin(longitudinal*.49))/3.72)-.5);
        float wear=(1.-smoothstep(.045,.15,abs(rubber-.23)));
        float grit=texture2D(map,vMapUv*2.73+vec2(.38,.63)).r;
        float repairTint=texture2D(map,vMapUv*.29).g;
        diffuseColor.rgb*=1.24+grit*.88+repairTint*.62-wear*.20;
        diffuseColor.rgb+=vec3(.017,.016,.015)*(1.-wear*.55);
        float drift = abs(lane-${width.toFixed(2)}) + .27*sin(longitudinal*2.+lane*.6) + .25*repairTint;
        float shoulder = smoothstep(${(width-1.48).toFixed(2)},${(width-.12).toFixed(2)},drift);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(${dustColor})*(.60+.95*grit),shoulder*.72);
      `);
    };
  }
  const absent = (d, radius = 0) => track.gaps?.some(g => d + radius > g.start && d - radius < g.end);
  const curb = surface(style.curb, .72);
  const curbWhite = surface(style.pale);
  const shoulder = surface(style.shoulder);
  shoulder.map = grain('concrete-grain');
  steel.side = T.DoubleSide;
  const pavement = strip(track, scene, asphalt, -width, width, 0, 0);
  pavement.receiveShadow = true;
  if(theme === 'metro') scene.userData.wetPavement = pavement;
  strip(track, scene, steel, -width-.4, width+.4, -0.68, -0.68);
  for (const side of [-1, 1]) {
    strip(track, scene, steel, side * (width+.39), side * (width+.39), -0.68, 0.08);
    const edge = (side * (width-.04));
    strip(track, scene, shoulder, edge - .26, edge + .26, 0.08, 0.08);
    const guard = side * (width+.49);
    // Folded galvanized W-beam, with a bright upper lip and dark recessed waist.
    for (const [a,b,ya,yb] of [[.03,.14,.76,.70],[.14,.04,.70,.56],[.04,.13,.56,.47],[.13,.03,.47,.36]]) {
      strip(track, scene, steel, guard - side*a, guard - side*b, ya, yb);
    }
    strip(track, scene, steel, guard - .10, guard + .10, 0.41, 0.41);
    strip(track, scene, curbWhite, side * (width-.64) - .066, side * (width-.64) + .066, 0.018, 0.018);
  }
  const curbs = [[], []], posts = [], seams = [], piers = [], crossbeams = [];
  const segments = Math.ceil(track.length / 1.55);
  for (let i = 0; i < segments; i++) {
    const distance = i * track.length / segments;
    if (absent(distance, .8)) continue;
    for (const side of [-1, 1]) {
      const p = track.sample(distance);
      if (Math.abs(p.curve) > .017 || distance < 65)
        curbs[Math.floor(i / 2) % 2].push(at(distance, side * (width-.23), .07, .44, .12, 1.48));
      if (i % 3 === 0) posts.push(at(distance, side * (width+.5), .37, .24, .78, .24));
    }
    if (i % 4 === 0) seams.push(at(distance, 0, .016, .09, .018, 2.05));
    if (i % 8 !== 0) continue;
    const p = track.sample(distance);
    if (theme === 'summit' || p.y < 2 && p.z > 22) continue;
    crossbeams.push(at(distance, 0, -0.9, 13.6, .8, 1.4));
    for (const lane of [-4.9, 4.9]) {
      const pos = point(distance, lane);
      const height = pos.y + 7.3;
      piers.push(terrainTransform(pos.x, pos.y - height / 2 - .55, pos.z, 1.07, height, 1.07,
        Math.atan2(p.dx, p.dz)));
    }
  }
  batch(scene, curb, curbs[0]);
  batch(scene, curbWhite, curbs[1]);
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

function island(scene, x, z, rx, rz, top, seed, coast) {
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
  const foamRim = rings[5];
  for (let i = 0; i < sides; i++) {
    const a = foamRim[i];
    const b = foamRim[(i + 1) % sides];
    const widthA = 2.7 + Math.sin(i * 6.283 / sides * 3 + seed) * .8;
    const widthB = 2.7 + Math.sin((i + 1) * 6.283 / sides * 3 + seed) * .8;
    const outer = (v, width) => new T.Vector2(v.x - x, v.z - z).setLength(width).add(new T.Vector2(v.x, v.z));
    const oa = outer(a, widthA);
    const ob = outer(b, widthB);
    const u = i / sides;
    const v = (i + 1) / sides;
    const foamY = seaLevel + .017;
    coast.positions.push(a.x, foamY, a.z, oa.x, foamY, oa.y, b.x, foamY, b.z,
      oa.x, foamY, oa.y, ob.x, foamY, ob.y, b.x, foamY, b.z);
    coast.uvs.push(u, 0, u, 1, v, 0, u, 1, v, 1, v, 0);
  }
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

function gantry(scene, course, label) {
  const start = (course.frame || courseFrame)(1.8);
  const group = new T.Group();
  group.position.copy(start.position);
  group.rotation.copy(start.rotation);
  const style = roadStyles[course.id];
  const panel = surface(style.signal, .42);
  const panelTrim = surface(style.pale, .63);
  for (const x of [-8.4, 8.4]) {
    block(group, ink, x, 2.44, 0, .89, 4.89, 1.42);
    block(group, panel, x, 2.65, -.72, .49, 4.12, .15);
    block(group, panelTrim, x, 4.88, 0, 1.12, .22, 1.7);
    block(group, steel, x, .27, 0, 1.28, .54, 1.84);
    for (const y of [.72, 1.04, 1.36]) block(group, panelTrim, x, y, -.82, .51, .12, .08);
  }
  block(group, panel, 0, 5.09, 0, 17.8, 1.68, 1.62);
  block(group, steel, 0, 6.02, 0, 18.1, .18, 1.81);
  block(group, ink, 0, 4.19, 0, 6.5, .36, 1.5);
  for (const z of [-.832, .832]) {
    const face = placard(label, 13.6, 1.53, style.sign);
    face.rotation.y = z < 0 ? Math.PI : 0;
    face.position.set(0, 5.22, z);
    group.add(face);
    for (const x of [-7.5, 7.5]) {
      for (const y of [4.69, 5.07, 5.45]) {
        const grille = block(group, ink, x, y, z, .69, .14, .08);
        grille.rotation.z = x < 0 ? -.31 : .31;
      }
    }
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

function scenery(scene, waves) {
  const coast = { positions: [], uvs: [] };
  for (const terrain of [[-19, -50, 42, 29, 4.2, 11], [-62, -42, 21, 23, 2.15, 29],
    [-97, 12, 23, 24, -.65, 38], [-29, 27, 45, 12, -1.96, 55], [-44, -88, 7.3, 5.3, 4.1, 70],
    [40, -11, 21, 18, -.15, 84], [-15, 95, 28, 14, -3.3, 161], [148, -74, 32, 20, -1.7, 85],
    [-136, -138, 41, 12, -1.8, 16]]) {
    island(scene, ...terrain, coast);
  }
  shoreFoam(scene, coast, waves);
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

function shoreFoam(scene, coast, waves) {
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(coast.positions, 3));
  geometry.setAttribute('uv', new T.Float32BufferAttribute(coast.uvs, 2));
  const material = new T.ShaderMaterial({
    side: T.DoubleSide, depthWrite: false, transparent: true, forceSinglePass: true,
    uniforms: { uTime: waves, uColor: { value: new T.Color(0xc8fff0) } },
    vertexShader: `
      varying vec2 vUv;
      varying vec2 vWorld;
      void main() {
        vUv = uv;
        vWorld = position.xz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }`,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec2 vWorld;
      void main() {
        float tide = sin(uTime * 1.2 + sin(vUv.x * 43.982) * 0.58) * .15;
        float broken = .62 + sin(vWorld.x * 1.63 - vWorld.y * 1.74 + uTime) * .18
          + sin(vWorld.x * .87 + vWorld.y * 1.32 - uTime * .7) * .16;
        float primary = (vUv.y - .22 - tide) * 6.4;
        float secondary = (vUv.y - .59 - tide * 1.32) * 13.0;
        float front = exp(-primary * primary);
        float fringe = exp(-secondary * secondary);
        float fade = smoothstep(.02, .19, vUv.y) * (1.0 - smoothstep(.65, .98, vUv.y));
        gl_FragColor = vec4(uColor, (front * .31 + fringe * .11) * broken * fade);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const foam = new T.Mesh(geometry, material);
  foam.renderOrder = 1;
  scene.add(foam);
}

function water(scene) {
  const material = new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSun: { value: sunDirection }, uInk: { value: new T.Color(0x04445b) },
      uWave: { value: new T.Color(0x269e9e) }, uGold: { value: new T.Color(0xecbe85) },
      uHorizon: { value: new T.Color(0xe69783) } },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
      }`,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uSun, uInk, uWave, uGold, uHorizon;
      varying vec3 vWorld;
      void main() {
        vec2 p = vWorld.xz;
        float crossSwell = p.x * .14 - p.y * .21 + uTime * .65;
        float mainSwell = p.x * .082 + p.y * .31 - uTime * .87;
        float run = p.x * .22 - p.y * .54;
        float ripple = run * 1.72 + sin(crossSwell * .52) * 2.6 + uTime * 1.32;
        float wind = sin(p.x * .91 + p.y * .22 - uTime * .72 + cos(crossSwell * .58) * 2.7);
        float facets = abs(fract(ripple * .63 + wind * .19) * 2.0 - 1.0);
        float chop = facets * (.61 + wind * .39);
        float distanceFade = 1.0 - smoothstep(65.0, 250.0, distance(vWorld, cameraPosition));
        vec3 flowNormal = normalize(vec3(
          (cos(crossSwell) * .027 + cos(ripple) * .022) * distanceFade, 1.0,
          (cos(mainSwell) * .054 + cos(ripple) * .037) * distanceFade));
        vec3 view = normalize(vWorld - cameraPosition);
        vec3 reflection = reflect(view, flowNormal);
        float gloss = max(0.0, dot(reflection, uSun));
        float reflectionFalloff = pow(1.0 - clamp(-dot(view, flowNormal), 0.0, 1.0), 3.0);
        float beam = pow(gloss, 18.0) * .56 + pow(gloss, 85.0) * (.46 + .48 * chop);
        float wash = .38 + cos(crossSwell * .28 + cos(mainSwell * .35)) * .12 + .047 * sin(mainSwell);
        vec3 col = mix(uInk, uWave, wash);
        col = mix(col, uGold * .75 + uInk * .15, reflectionFalloff * .78);
        float crest = smoothstep(.69, .98, chop) * smoothstep(.16, .8, sin(run * .1 + crossSwell * .4));
        col += uGold * beam * .69 + vec3(.23, .33, .23) * crest * distanceFade;
        float horizonGlow = pow(max(0.0, dot(view, uSun)), 16.0);
        vec3 haze = mix(uHorizon, uGold, horizonGlow * .7);
        col = mix(haze + uGold * beam * .26, col, smoothstep(0.0, .063, -view.y));
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const plate = new T.Mesh(new T.PlaneGeometry(2400, 2400), material);
  plate.position.y = seaLevel;
  plate.rotation.x = -Math.PI / 2;
  scene.add(plate);
  return material.uniforms.uTime;
}

function sky(scene, night, mountain, theme) {
  const material = new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false,
    uniforms: {
      uSun: { value: night ? new T.Vector3(-.25,.38,-.88).normalize() : sunDirection }, uHorizon: { value: new T.Color(night ? 0x494772 : theme === 'frost' ? 0xc6deeb : theme === 'redrock' ? 0xf0b083 : mountain ? 0xf0c8ac : 0xe69783) },
      uOrange: { value: new T.Color(night ? 0x5a6486 : 0xffce80) }, uSky: { value: new T.Color(night ? 0x080f29 : theme === 'frost' ? 0x345782 : theme === 'redrock' ? 0x688aa5 : mountain ? 0x365e82 : 0x617896) },
      uNight: {value: night ? 1 : 0},
    },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 uSun, uHorizon, uOrange, uSky;
      uniform float uNight;
      varying vec3 vDir;
      float cloudNoise(vec2 p) {
        vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        vec4 h=fract(sin(vec4(dot(i,vec2(127.1,311.7)))+vec4(0.,127.1,311.7,438.8))*43758.54);
        return mix(mix(h.x,h.y,f.x),mix(h.z,h.w,f.x),f.y);
      }
      void main() {
        vec3 ray = normalize(vDir);
        float h = smoothstep(-0.03, 0.49, ray.y);
        float sun = max(0.0, dot(ray, uSun));
        vec3 col = mix(uHorizon, uSky, h);
        col = mix(col, uOrange, pow(sun, 15.0) * 0.72);
        float band = cloudNoise(ray.xz/max(.04,ray.y+.18)*3.6 + ray.y*18.)*.64 + cloudNoise(ray.xz/max(.04,ray.y+.18)*11.2)*.36;
        float cloud = smoothstep(.47, .72, band) * smoothstep(.015, .051, ray.y)
          * (1.0 - smoothstep(.18, .35, ray.y));
        col = mix(col, mix(vec3(.56, .39, .32),vec3(.10,.11,.21),uNight), cloud * .39);
        col += mix(vec3(.48, .24, .09),vec3(.04,.07,.12),uNight) * pow(sun, 150.0);
        col += mix(vec3(1.55, 1.04, .59),vec3(.75,.83,.95),uNight) * smoothstep(.99912, .99942, sun);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const dome = new T.Mesh(new T.SphereGeometry(900, 20, 12), material);
  dome.renderOrder = 100;
  scene.add(dome);
}

export function buildWorld(scene, course = track) {
  const theme = course.id || 'sunset';
  const night = theme === 'metro', mountain = theme === 'summit';
  const extra = theme === 'frost' || theme === 'redrock';
  scene.fog = new T.FogExp2(theme === 'frost' ? 0xc4d9e5 : theme === 'redrock' ? 0xe1ab85 : night ? 0x343854 : mountain ? 0xabb9bf : 0xd4aa92, night ? .0041 : mountain ? .0026 : .00125);
  scene.background = new T.Color(0xd4bfa8);
  sky(scene, night, mountain, theme);
  const waves = extra || night || mountain ? {value: 0} : water(scene);
  scene.add(new T.HemisphereLight(night ? 0x97c2ff : extra ? 0xd4e8ff : 0xffe8ca, night ? 0x71628b : 0x639aaf, 1.05));
  const sun = new T.DirectionalLight(night ? 0xb3dcff : theme === 'frost' ? 0xf9f2df : theme === 'redrock' ? 0xffdfb8 : mountain ? 0xffe3bf : 0xffcb8d, night ? 1.7 : 3.4);
  sun.target.position.set(-21, 0, -18);
  sun.position.copy(sun.target.position).addScaledVector(sunDirection, 115);
  sun.position.y = 99;
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -123, right: 123, top: 97, bottom: -97, near: 15, far: 290 });
  sun.shadow.bias = -.00019;
  sun.shadow.normalBias = .19;
  sun.shadow.autoUpdate = false;
  sun.shadow.needsUpdate = true;
  scene.add(sun, sun.target);
  const rim = new T.DirectionalLight(0xb5dfff, 1.00);
  rim.position.set(-85, 48, 90);
  scene.add(rim);
  if (extra) frontier(scene, course, {block,surface,placard,grain});
  else if (mountain) alpine(scene, course, waves);
  else if (night) metropolis(scene, course);
  else { scenery(scene, waves); coastalBridge(scene); }
  roadFurniture(scene, course, theme);
  const lights = gantry(scene, course, theme === 'frost' ? 'FROST PASS' : theme === 'redrock' ? 'RED ROCK CANYON' : mountain ? 'SKYLINE DROP' : night ? 'MIDNIGHT RING' : 'SUNSET PIER');
  combineStaticBoxes(scene);
  scene.traverse(object => {
    if (!object.isMesh || !object.material.isMeshStandardMaterial) return;
    object.castShadow = !object.userData.distant;
    object.receiveShadow = true;
  });
  road(scene, course, theme);
  return { waves, lights, sun };
}
