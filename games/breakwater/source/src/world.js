import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import slateUrl from './art/weathered-slate.jpg?inline';
import duskUrl from './art/mountain-sunset.jpg?inline';

const loader = new THREE.TextureLoader();
const rockSurface = loader.load(slateUrl);
rockSurface.wrapS = rockSurface.wrapT = THREE.RepeatWrapping;
rockSurface.anisotropy = 4;
const PI = Math.PI;
const deckWidth = 9.05;
const stone = {
  sandstone: 0x66656a, ashlar: 0x79777a, cornice: 0x929097, seam: 0x383b48,
  pier: 0x53535c, bronze: 0xc77f48, timber: 0x664338,
};
const attire = {
  jade: 0x287a6c, brightJade: 0x65b29a, pale: 0xaeb8ba, steel: 0xc1bbb1,
  burgundy: 0x9b3446, scarlet: 0xb94251, wine: 0x653244,
  leather: 0x66483f, umber: 0x423235, iron: 0x343544, oldGold: 0xc18b54, skin: 0xd99c74,
};
const solid = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.84 });
// Project the stone grain in local space so it travels with each moving span.
function weatheredMaterial(masonry) {
  const material = solid.clone();
  material.onBeforeCompile = shader => {
    shader.uniforms.rockSurface = { value: rockSurface };
    shader.vertexShader = 'varying vec3 surfacePoint; varying vec3 surfaceNormal;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nsurfacePoint=position; surfaceNormal=normal;');
    shader.fragmentShader = 'uniform sampler2D rockSurface; varying vec3 surfacePoint; varying vec3 surfaceNormal;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec3 n=abs(normalize(surfaceNormal));
      vec2 uv=n.y>max(n.x,n.z)?surfacePoint.xz:(n.x>n.z?surfacePoint.zy:surfacePoint.xy);
      float grit=texture2D(rockSurface,uv*${masonry ? '0.37' : '0.12'}).r;
      diffuseColor.rgb*=clamp(0.76+1.25*grit,0.64,1.53);
      ${masonry ? `
        if(n.y<0.68) {
          float row=floor(uv.y*2.7);
          vec2 tile=fract(vec2(uv.x*1.28+mod(row,2.0)*0.5,uv.y*2.7));
          vec2 edge=min(tile,1.0-tile);
          float mortar=smoothstep(0.017,0.073,min(edge.x,edge.y));
          diffuseColor.rgb*=mix(0.58,1.08,mortar);
        }` : `
        float layers=sin(surfacePoint.y*3.6+uv.x*.54+grit*5.0);
        diffuseColor.rgb*=0.94+0.11*layers;`}
    `);
  };
  material.customProgramCacheKey = () => 'weathered-' + masonry;
  return material;
}
const masonryFinish = weatheredMaterial(true);
const cliffFinish = weatheredMaterial(false);
const shape = {
  block: new THREE.BoxGeometry(1, 1, 1),
  hex: new THREE.CylinderGeometry(0.5, 0.5, 1, 6),
  octagon: new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
  taper: new THREE.CylinderGeometry(0.43, 0.5, 1, 8),
  dome: new THREE.SphereGeometry(0.5, 8, 5),
  cone: new THREE.ConeGeometry(0.5, 1, 8),
  shard: new THREE.IcosahedronGeometry(0.5, 0),
  rock: new THREE.DodecahedronGeometry(0.5, 0),
};

function plaque(points, depth, bevel = 0) {
  const profile = new THREE.Shape();
  profile.moveTo(...points[0]);
  for (const point of points.slice(1)) profile.lineTo(...point);
  profile.closePath();
  return new THREE.ExtrudeGeometry(profile, {
    depth, steps: 1, bevelEnabled: bevel > 0, bevelSegments: 1,
    bevelSize: bevel, bevelThickness: bevel,
  }).translate(0, 0, -depth / 2);
}

shape.shield = plaque([[-0.42, 0.48], [0.42, 0.48], [0.47, 0.15], [0.32, -0.27], [0, -0.50], [-0.32, -0.27], [-0.47, 0.15]], 0.12, 0.022);
shape.pennant = plaque([[-0.5, 0.52], [0.5, 0.52], [0.44, -0.37], [0, -0.51], [-0.44, -0.37]], 0.017);
shape.spade = plaque([[-0.34, -0.46], [0.34, -0.46], [0.5, 0.06], [0.2, 0.25], [0, 0.52], [-0.2, 0.25], [-0.5, 0.06]], 0.06);

const marchTime = { value: 0 };
const marchStrength = { value: 1 };
const figurePaint = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0.19 });
figurePaint.onBeforeCompile = shader => {
  shader.uniforms.marchTime = marchTime;
  shader.uniforms.marchStrength = marchStrength;
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nattribute float stepSide;\nuniform float marchTime;\nuniform float marchStrength;')
    .replace('#include <begin_vertex>', [
      '#include <begin_vertex>',
      'vec3 origin = instanceMatrix[3].xyz;',
      'float foot = sin(marchTime * 11.3 + origin.x * 2.9 + origin.z * 0.66) * stepSide * marchStrength;',
      'transformed.z += foot * 0.105;',
      'transformed.y += max(0.0, foot) * 0.083;',
    ].join('\n'));
};
figurePaint.customProgramCacheKey = () => 'gatefront-instanced-march';

class Assembly {
  constructor(figure = false) {
    this.figure = figure;
    this.parts = [];
    this.pose = new THREE.Object3D();
  }

  add(kind, color, at, size, rotation = [0, 0, 0], stride = 0) {
    const master = shape[kind];
    const part = master.index ? master.toNonIndexed() : master.clone();
    this.pose.position.set(...at);
    this.pose.scale.set(...size);
    this.pose.rotation.set(...rotation);
    this.pose.updateMatrix();
    part.applyMatrix4(this.pose.matrix);
    part.deleteAttribute('uv');
    const length = part.attributes.position.count;
    const tint = new THREE.Color(color);
    const colors = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      colors.set([tint.r, tint.g, tint.b], i * 3);
    }
    part.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    if (this.figure) {
      part.setAttribute('stepSide', new THREE.BufferAttribute(new Float32Array(length).fill(stride), 1));
    }
    this.parts.push(part);
    return this;
  }

  get geometry() {
    const baked = mergeGeometries(this.parts);
    for (const part of this.parts) part.dispose();
    this.parts.length = 0;
    return baked;
  }

  mesh() {
    return new THREE.Mesh(this.geometry, solid);
  }
}

function bow(builder) {
  builder.add('block', attire.leather, [0.18, 0.69, 0.27], [0.09, 0.08, 0.53], [-0.06, 0, 0])
    .add('block', attire.oldGold, [0.18, 0.731, 0.39], [0.06, 0.022, 0.24])
    .add('block', attire.iron, [0.18, 0.69, 0.15], [0.064, 0.12, 0.08]);
  for (const sign of [-1, 1]) {
    builder.add('block', attire.leather, [0.18 + sign * 0.12, 0.71, 0.39], [0.26, 0.048, 0.052], [0, -sign * 0.18, 0])
      .add('block', attire.oldGold, [0.18 + sign * 0.27, 0.71, 0.32], [0.13, 0.043, 0.052], [0, sign * 0.68, 0])
      .add('block', 0xcdbe9e, [0.18 + sign * 0.15, 0.716, 0.21], [0.31, 0.015, 0.014], [0, -sign * 0.30, 0]);
  }
}

function spear(builder, kind) {
  if (kind === 'armor') {
    builder.add('shield', attire.oldGold, [-0.25, 0.60, 0.27], [0.41, 0.58, 0.44], [0.10, 0.10, 0.02])
      .add('shield', attire.wine, [-0.25, 0.61, 0.307], [0.365, 0.50, 0.38], [0.10, 0.10, 0.02])
      .add('block', attire.oldGold, [-0.25, 0.61, 0.346], [0.07, 0.27, 0.018], [0.10, 0, 0.56]);
  }
  const x = kind === 'runner' ? 0.25 : 0.33;
  builder.add('hex', attire.leather, [x, 0.68, 0.26], [0.049, 0.91, 0.049], [kind === 'runner' ? 1.15 : 0.39, 0, 0.17], -0.13)
    .add('spade', attire.steel, [x + 0.079, kind === 'runner' ? 0.89 : 1.15, kind === 'runner' ? 0.73 : 0.47], [0.09, 0.24, 0.11], [kind === 'runner' ? 1.15 : 0.39, 0, 0.17]);
}

function soldier(kind) {
  const friend = kind === 'leader' || kind === 'ally';
  const leader = kind === 'leader';
  const heavy = kind === 'armor';
  const scout = kind === 'runner';
  const cloth = friend ? attire.jade : scout ? attire.scarlet : attire.burgundy;
  const plate = friend ? 0xc6c6bd : heavy ? attire.oldGold : 0xaa8d79;
  const build = new Assembly(true);

  for (const sign of [-1, 1]) {
    const x = sign * 0.105;
    build.add('block', attire.umber, [x, 0.25, 0], [0.15, 0.27, 0.15], [0.03, 0, sign * 0.07], sign)
      .add('block', attire.leather, [x, 0.10, 0.054], [0.165, 0.15, 0.246], [0, 0, sign * 0.04], sign)
      .add('block', plate, [x, 0.193, 0.093], [0.12, 0.091, 0.044], [0, 0, sign * 0.05], sign)
      .add('octagon', cloth, [sign * 0.23, 0.66, 0.03], [0.17, 0.25, 0.17], [-0.62, 0, sign * 0.16], -sign * 0.25)
      .add('block', attire.skin, [sign * 0.20, 0.62, 0.178], [0.09, 0.10, 0.115], [0, 0, 0], -sign * 0.13);
  }

  build.add('taper', cloth, [0, 0.53, 0], [0.44, 0.38, 0.31])
    .add('block', attire.leather, [0, 0.46, 0.015], [0.44, 0.09, 0.32])
    .add('block', attire.oldGold, [0.041, 0.46, 0.186], [0.099, 0.086, 0.027])
    .add('taper', plate, [0, 0.70, 0], [0.432, 0.23, 0.31])
    .add('block', cloth, [0, 0.68, 0.157], [0.13, 0.27, 0.028])
    .add('hex', attire.skin, [0, 0.875, 0.012], [0.245, 0.208, 0.228])
    .add('octagon', attire.iron, [0, 0.964, 0.014], [0.312, 0.10, 0.32])
    .add('taper', plate, [0, 1.012, 0.015], [0.293, 0.145, 0.28])
    .add('block', plate, [0, 0.917, 0.132], [0.077, 0.109, 0.083])
    .add('block', attire.iron, [0, 0.936, 0.150], [0.203, 0.035, 0.021]);
  const pennant = friend ? (leader ? attire.brightJade : attire.jade) : attire.wine;
  build.add('pennant', pennant, [0, 0.60, -0.169], [0.43, 0.54, 0.55], [0.10, 0, 0]);
  // A fluted travelling cloak flares around the legs and folds up at the shoulders.
  for (let fold=-2;fold<=2;fold++) {
    const edge=Math.abs(fold);
    build.add('pennant',edge===1 ? (friend ? 0x428f78 : 0x984556) : pennant,
      [fold*.081,.51+edge*.025,-.197+edge*.021],[.138,.68-edge*.043,.72],[.23,fold*.16,fold*.11]);
  }
  build.add('cone',plate,[0,1.075,.012],[.31,.22,.29])
    .add('octagon',attire.oldGold,[0,.981,.015],[.317,.028,.32]);
  if (friend) {
    // Back-facing collars, embroidered mantle and pauldrons read from the chase camera.
    for (const side of [-1, 1]) {
      build.add('dome', plate, [side*.22,.755,-.018], [.215,.19,.28], [0,0,side*.25])
        .add('pennant', attire.brightJade, [side*.092,.72,-.202], [.238,.246,.65], [.26,side*.16,side*.27])
        .add('block', 0xdab26e, [side*.095,.52,-.233], [.018,.286,.018], [.18,0,side*.19]);
    }
    build.add('spade',0xe7bd75,[0,.56,-.246],[.092,.146,.15],[.19,0,0]);
  }
  if (leader) {
    build.add('hex',attire.leather,[-.27,1.03,-.08],[.035,1.85,.035],[0,0,-.04])
      .add('pennant',attire.jade,[-.48,1.75,-.08],[.43,.36,.52],[0,.18,-.14])
      .add('spade',attire.oldGold,[-.46,1.76,-.105],[.10,.20,.16]);
  }
  if (friend) {
    bow(build);
    build.add('hex', attire.leather, [-0.16, 0.72, -0.195], [0.12, 0.38, 0.12], [0.25, -0.06, -0.29])
      .add('block', attire.pale, [-0.14, 0.929, -0.222], [0.10, 0.10, 0.073], [0.25, 0, -0.29]);
  } else {
    spear(build, kind);
  }
  if (leader || heavy) {
    for (const sign of [-1, 1]) {
      build.add('taper', plate, [sign * 0.23, 0.75, 0], [0.22, 0.17, 0.24], [0, 0, sign * 0.38]);
    }
  }
  if (leader || scout) {
    build.add('spade', leader ? attire.brightJade : attire.scarlet, [0, 1.107, -0.016], [0.05, leader ? 0.27 : 0.16, 0.20], [0.2, PI / 2, 0]);
  }
  return build.geometry;
}

function guardian() {
  const forge = new Assembly(true);
  const trim = 0xb27a53;
  const enamel = 0x774154;
  const shell = 0x5c5267;
  for (const sign of [-1, 1]) {
    forge.add('block', attire.iron, [sign * 0.36, 0.22, 0.13], [0.49, 0.44, 0.68], [0, 0, 0], sign)
      .add('hex', shell, [sign * 0.36, 0.64, 0.02], [0.52, 0.65, 0.54], [0.07, 0, sign * 0.12], sign)
      .add('spade', trim, [sign * 0.39, 0.68, 0.28], [0.37, 0.39, 0.35], [0, 0, 0], sign)
      .add('taper', shell, [sign * 0.79, 1.67, 0], [0.69, 0.47, 0.72], [0, 0, sign * 0.32])
      .add('taper', trim, [sign * 0.80, 1.78, 0], [0.75, 0.19, 0.77], [0, 0, sign * 0.32])
      .add('hex', shell, [sign * 0.87, 1.22, 0.15], [0.48, 0.52, 0.48], [-0.45, 0, sign * 0.06], -sign * 0.30)
      .add('cone', trim, [sign * 0.29, 2.56, 0.015], [0.19, 0.49, 0.17], [0.12, 0, -sign * 0.52]);
  }

  forge.add('taper', attire.iron, [0, 1.11, 0], [1.30, 0.56, 0.74])
    .add('taper', shell, [0, 1.53, 0], [1.54, 0.63, 0.76])
    .add('shield', trim, [0, 1.55, 0.42], [0.80, 0.65, 0.53])
    .add('shield', enamel, [0, 1.56, 0.48], [0.70, 0.54, 0.46])
    .add('hex', trim, [0, 1.61, 0.54], [0.30, 0.09, 0.30], [PI / 2, 0, 0])
    .add('hex', 0x503540, [0, 1.62, 0.60], [0.20, 0.06, 0.20], [PI / 2, 0, 0])
    .add('pennant', enamel, [0, 0.99, -0.40], [1.34, 1.43, 1.0], [0.14, 0, 0])
    .add('octagon', attire.iron, [0, 2.00, 0.01], [0.72, 0.37, 0.65])
    .add('taper', shell, [0, 2.23, 0.005], [0.79, 0.40, 0.68])
    .add('spade', trim, [0, 2.17, 0.379], [0.50, 0.52, 0.41])
    .add('block', attire.iron, [0, 2.20, 0.416], [0.51, 0.131, 0.034])
    .add('block', 0xeabd6d, [-0.127, 2.209, 0.442], [0.15, 0.048, 0.018])
    .add('block', 0xeabd6d, [0.127, 2.209, 0.442], [0.15, 0.048, 0.018])
    .add('hex', attire.leather, [1.17, 0.96, 0.25], [0.17, 1.44, 0.17], [0.31, 0, -0.41])
    .add('hex', shell, [1.42, 1.52, 0.38], [0.55, 0.85, 0.56], [0, 0, PI / 2 - 0.36])
    .add('hex', trim, [1.80, 1.66, 0.40], [0.56, 0.13, 0.55], [0, 0, PI / 2 - 0.36])
    .add('shield', trim, [-0.94, 1.08, 0.48], [1.12, 1.47, 0.58], [0.08, -0.18, -0.04])
    .add('shield', enamel, [-0.94, 1.09, 0.57], [0.98, 1.35, 0.50], [0.08, -0.18, -0.04])
    .add('spade', trim, [-0.94, 1.16, 0.62], [0.40, 0.66, 0.39], [0.08, -0.18, 0]);
  return forge.geometry;
}

function contactMap() {
  const side = 32;
  const rgba = new Uint8Array(side * side * 4);
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      const radius = Math.hypot((x + 0.5) / side * 2 - 1, (y + 0.5) / side * 2 - 1);
      const softness = 1 - THREE.MathUtils.smoothstep(radius, 0.21, 1);
      rgba.set([39, 31, 34, Math.round(137 * softness)], (y * side + x) * 4);
    }
  }
  const texture = new THREE.DataTexture(rgba, side, side);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function createCrowd(scene) {
  const bodyLimit = { leader: 1, ally: 49, grunt: 128, runner: 112, armor: 72, boss: 1 };
  const shadowLimit = 198;
  const crowd = new THREE.Group();
  crowd.name = 'Instanced crossing battalions';
  scene.add(crowd);

  const batches = {};
  const colors = new THREE.Color();
  const body = new THREE.Object3D();
  for (const kind of Object.keys(bodyLimit)) {
    const geometry = kind === 'boss' ? guardian() : soldier(kind);
    const batch = new THREE.InstancedMesh(geometry, figurePaint, bodyLimit[kind]);
    batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    batch.setColorAt(0, colors);
    batch.instanceColor.setUsage(THREE.DynamicDrawUsage);
    batch.count = 0;
    batch.frustumCulled = false;
    batches[kind] = batch;
    crowd.add(batch);
  }

  const shade = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: contactMap(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
    shadowLimit,
  );
  shade.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shade.count = 0;
  shade.frustumCulled = false;
  crowd.add(shade);

  function place(kind, unit, turn, time) {
    const batch = batches[kind];
    if (batch.count >= bodyLimit[kind]) return;
    const boss = kind === 'boss';
    const size = boss ? 1.12 : kind === 'leader' ? 1.10 : kind === 'armor' ? 1.13 : kind === 'runner' ? 0.87 : 0.97;
    const beat = unit.x * 2.9 + unit.z * 0.66 + time * 11.3;
    const gait = Math.abs(Math.sin(beat)) * 0.039 * marchStrength.value;
    body.position.set(unit.x, gait, unit.z);
    body.rotation.set(0, turn, Math.sin(beat) * 0.042 * marchStrength.value);
    body.scale.setScalar(size);
    body.updateMatrix();
    batch.setMatrixAt(batch.count, body.matrix);
    const light = 0.89 + Math.sin((unit.id ?? unit.z * 3) * 1.7) * 0.075;
    const flash = unit.flash ? Math.min(0.45, unit.flash * 4.5) : 0;
    batch.setColorAt(batch.count++, colors.setRGB(light + flash, light + flash * 0.64, light + flash * 0.29));

    if (shade.count < shadowLimit) {
      body.position.set(unit.x + (boss ? 0.42 : 0.16), 0.024, unit.z + (boss ? 0.35 : 0.10));
      body.rotation.set(-PI / 2, 0, -0.55);
      body.scale.set(boss ? 3.55 : size * 1.0, boss ? 2.60 : size * 0.69, 1);
      body.updateMatrix();
      shade.setMatrixAt(shade.count++, body.matrix);
    }
  }

  return {
    update({ allies, enemies, time, moving }) {
      marchTime.value = time;
      marchStrength.value = moving ? 1 : 0.22;
      shade.count = 0;
      for (const batch of Object.values(batches)) batch.count = 0;
      for (let i = 0; i < allies.length; i++) {
        place(i === 0 ? 'leader' : 'ally', allies[i], PI, time);
      }
      for (const enemy of enemies) {
        if (enemy.hp <= 0 || enemy.z < -75 || enemy.z > 7) continue;
        place(enemy.kind, enemy, 0, time);
      }

      shade.instanceMatrix.needsUpdate = true;
      for (const batch of Object.values(batches)) {
        batch.instanceMatrix.needsUpdate = true;
        batch.instanceColor.needsUpdate = true;
      }
    },
  };
}

function randomFrom(seed) {
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function deckPattern() {
  const texture = loader.load(slateUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 13.3);
  texture.anisotropy = 8;
  return texture;
}

function xzPlane(width, length, elevation, along, material) {
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, length), material);
  plane.rotation.x = -PI / 2;
  plane.position.set(0, elevation, along);
  return plane;
}

function riverMaterial(clock) {
  return new THREE.ShaderMaterial({
    uniforms: {
      clock,
      blue: { value: new THREE.Color(0x3d98a1) },
      deep: { value: new THREE.Color(0x256775) },
      glint: { value: new THREE.Color(0xffd8a0) },
      mist: { value: new THREE.Color(0x7589a0) },
    },
    vertexShader: [
      'varying vec3 vWorld;',
      'void main() {',
      '  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;',
      '  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform float clock;',
      'uniform vec3 blue;',
      'uniform vec3 deep;',
      'uniform vec3 glint;',
      'uniform vec3 mist;',
      'varying vec3 vWorld;',
      'void main(){',
      '  vec2 p = vWorld.xz;',
      '  float wave1 = sin(p.y * 1.22 + sin(p.x * 0.51 + clock * 0.16) * 2.1 + p.x * 0.29 - clock * 0.8);',
      '  float wave2 = sin(p.y * 2.82 + cos(p.x * 0.79 - clock * 0.25) * 1.75 + clock * 1.25);',
      '  float wide = sin(p.y * 0.39 + p.x * 0.66 + clock * 0.45);',
      '  vec3 water = mix(deep, blue, 0.51 + 0.20 * wave1 + 0.12 * wide);',
      '  float glitter = smoothstep(0.84, 0.995, wave1) * smoothstep(0.41, 0.97, wave2);',
      '  float sunSide = mix(0.2, 1.0, smoothstep(3.0, 17.0, -p.x));',
      '  water = mix(water, glint, glitter * sunSide * 0.82);',
      '  float shore = smoothstep(11.5, 16.0, abs(p.x)) * (1.0 - smoothstep(16.0, 21.0, abs(p.x)));',
      '  water = mix(water, vec3(0.61,0.8,0.75), (0.22+0.78*shore) * smoothstep(0.67, 0.99, wave1) * (0.45+0.40*wave2));',
      '  water = mix(water, mist, smoothstep(35.0, 119.0, distance(cameraPosition.xz, p)) * 0.85);',
      '  gl_FragColor = vec4(water, 1.0);',
      '  #include <tonemapping_fragment>',
      '  #include <colorspace_fragment>',
      '}',
    ].join('\n'),
  });
}

function fireGlow() {
  const image=document.createElement('canvas');
  image.width=image.height=64;
  const ctx=image.getContext('2d'), glow=ctx.createRadialGradient(32,32,0,32,32,32);
  glow.addColorStop(0,'#fff7c4'); glow.addColorStop(.13,'rgba(255,202,98,.96)');
  glow.addColorStop(.38,'rgba(255,119,23,.40)'); glow.addColorStop(1,'rgba(244,80,10,0)');
  ctx.fillStyle=glow; ctx.fillRect(0,0,64,64);
  const map=new THREE.CanvasTexture(image);
  return new THREE.SpriteMaterial({map,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
}
let torchGlow;
function bridgeSegment(style) {
  const model = new Assembly();
  for (const sign of [-1, 1]) {
    const x = sign * 4.48;
    model.add('block', stone.pier, [x, -1.05, 0], [0.61, 2.25, 8.0])
      .add('block', stone.sandstone, [x, 0.18, 0], [0.54, 0.36, 7.98])
      .add('block', stone.sandstone, [x, 0.45, 0.03], [0.41, 0.28, 7.94])
      .add('block', stone.cornice, [x, 0.60, 0], [0.60, 0.16, 7.96])
      .add('block', stone.seam, [x - sign * 0.13, 0.358, 0], [0.41, 0.038, 8.0]);
    for (let slot = -3; slot <= 3; slot++) {
      const z = slot * 1.06;
      model.add('block', (slot + style + 4) % 3 ? stone.cornice : stone.ashlar, [x, 0.77, z], [0.48, 0.25, 0.62])
        .add('block', stone.seam, [x - sign * 0.20, 0.26, z - 0.37], [0.06, 0.22, 0.032]);
    }
    for (const z of [-2.7, 2.7]) {
      model.add('block', stone.pier, [x + sign * 0.13, 0.30, z], [0.69, 1.22, 0.53])
        .add('block', stone.cornice, [x + sign * 0.13, 0.92, z], [0.73, 0.16, 0.62]);
    }
    if (style % 2 === Number(sign === 1)) {
      model.add('hex', stone.bronze, [x, 1.11, 2.7], [0.285, 0.34, 0.285])
        .add('taper', 0xe49757, [x, 1.29, 2.7], [0.43, 0.11, 0.43])
        .add('shard', 0xffa04b, [x + 0.023, 1.46, 2.7], [0.24, 0.38, 0.24])
        .add('shard', 0xffd588, [x - 0.013, 1.39, 2.74], [0.14, 0.24, 0.14]);
      if (style === 2 || style === 3) {
        model.add('hex', stone.timber, [x + sign * 0.17, 1.50, -2.7], [0.071, 1.65, 0.075])
          .add('hex', stone.bronze, [x + sign * 0.17, 2.19, -2.7], [0.08, 0.77, 0.08], [PI / 2, 0, 0])
          .add('pennant', attire.jade, [x + sign * 0.20, 1.75, -2.45], [0.65, 0.9, 0.7], [0.06, PI / 2, 0])
          .add('spade', 0xe7c48b, [x + sign * 0.16, 1.81, -2.45], [0.21, 0.34, 0.19], [0.06, PI / 2, 0]);
      }
    }
  }
  const span=new THREE.Group();
  const mesh=model.mesh();
  mesh.material=masonryFinish;
  span.add(mesh);
  torchGlow ??= fireGlow();
  const side = style%2 ? 1 : -1;
  const flame = new THREE.Sprite(torchGlow);
  flame.position.set(side*4.48,1.52,2.7);
  flame.scale.set(1.07,1.33,1);
  span.add(flame);
  return span;
}

function fortress() {
  const castle = new Assembly();
  const z = -73;
  castle.add('block', 0x484b57, [0, -1.75, z - 4], [21.6, 4.0, 12.6])
    .add('block', stone.sandstone, [0, 4.91, z], [10.46, 2.28, 2.28])
    .add('block', stone.cornice, [0, 5.68, z + 1.14], [10.65, 0.24, 0.40])
    .add('block', 0x5a4947, [0, 1.68, z - 2.07], [5.9, 3.82, 0.26]);
  for (const sign of [-1, 1]) {
    const x = sign * 5.27;
    castle.add('block', stone.pier, [x, 2.77, z - 0.13], [3.35, 6.43, 4.25])
      .add('block', stone.sandstone, [x, 4.73, z + 0.03], [3.47, 2.50, 4.38])
      .add('block', stone.cornice, [x, 5.90, z], [3.70, 0.28, 4.52])
      .add('octagon', 0x686770, [x, 6.49, z - 0.15], [2.93, 1.13, 2.93])
      .add('cone', 0x714f45, [x, 7.83, z - 0.15], [3.28, 2.09, 3.28])
      .add('hex', stone.bronze, [x, 8.99, z - 0.15], [0.13, 0.5, 0.13])
      .add('block', stone.pier, [sign * 9.15, 1.58, z - 2.26], [4.94, 3.55, 3.5])
      .add('block', stone.cornice, [sign * 9.15, 3.40, z - 2.26], [4.9, 0.27, 3.72])
      .add('block', stone.seam, [x, 4.45, z + 2.16], [0.32, 0.97, 0.045])
      .add('pennant', attire.wine, [x + sign * 0.46, 3.58, z + 2.20], [0.81, 1.64, 0.72])
      .add('spade', 0xe6bf87, [x + sign * 0.46, 3.64, z + 2.24], [0.36, 0.68, 0.35]);
    for (let j = 0; j < 5; j++) {
      castle.add('block', stone.ashlar, [sign * (6.95 + j * 0.97), 3.78, z - 0.57], [0.59, 0.58, 0.62]);
    }
  }
  for (let j = -5; j <= 5; j++) {
    castle.add('block', j % 2 ? stone.cornice : stone.ashlar, [j * 0.81, 6.31, z + 0.97], [0.54, 0.53, 0.48]);
  }
  for (let j = -3; j <= 3; j++) {
    castle.add('block', stone.timber, [j * 0.78, 1.56, z - 1.90], [0.71, 3.37, 0.16]);
  }
  for (const y of [0.56, 2.49]) {
    castle.add('block', 0x4a4750, [0, y, z - 1.76], [5.0, 0.12, 0.102]);
  }
  for (let index = 0; index <= 12; index++) {
    const a = index * PI / 12;
    castle.add('block', index % 2 ? stone.ashlar : stone.cornice, [Math.cos(a) * 3.08, 1.60 + Math.sin(a) * 2.41, z + 1.19], [0.49, 0.64, 0.64], [0, 0, a - PI / 2]);
  }
  for (const side of [-1,1]) {
    for (let j=0;j<5;j++) {
      const angle=(j/5)*PI*2;
      castle.add('block',stone.seam,[side*5.27+Math.sin(angle)*1.43,6.54,z-.15+Math.cos(angle)*1.43],[.25,.62,.14],[0,angle,0]);
    }
    castle.add('pennant',attire.burgundy,[side*5.27+.47,8.99,z-.15],[.89,.4,1],[0,.08,-.12]);
    for(let j=0;j<4;j++) {
      castle.add('block',stone.seam,[side*(7.2+j),2.0,z-.46],[.13,.64,.08]);
    }
  }
  for(let j=-6;j<=6;j++){
    castle.add('block',0x393b42,[j*.396,1.64,z-1.68],[.047,3.2,.07]);
    for(const y of [.61,2.5]) castle.add('dome',stone.bronze,[j*.396,y,z-1.65],[.087,.087,.08]);
  }
  for (const side of [-1,1]) {
    const x=side*5.27;
    castle.add('octagon',stone.cornice,[x,7.03,z-.15],[3.18,.2,3.18])
      .add('block',stone.cornice,[x,2.24,z+.04],[3.56,.19,4.46])
      .add('pennant',0xab3c37,[x,4.12,z+2.29],[1.25,2.56,1])
      .add('spade',0xecc37b,[x,4.26,z+2.33],[.40,.94,.38]);
    for(let i=0;i<5;i++) {
      castle.add('block',stone.ashlar,[side*3.1,.19+i*.35,z+1.2],[.53,.32,.68]);
    }
  }
  castle.add('spade',stone.bronze,[0,4.43,z+1.59],[.78,1.12,.68])
    .add('spade',stone.seam,[0,4.43,z+1.65],[.45,.69,.40]);
  const mesh = castle.mesh();
  mesh.material = masonryFinish;
  return mesh;
}

function terrain() {
  const cliffs = new Assembly();
  const sand = [0x414958, 0x515e70, 0x596273, 0x647080, 0x566471];
  const turf = [0x576c55, 0x6f7d61, 0x657757];
  const random = randomFrom(229);

  for (const sign of [-1, 1]) {
    for (let index = 0; index < 28; index++) {
      const z = 14 - index * 5.4;
      const x = sign * (15.9 + Math.sin(index * 0.49 + sign) * 2.6 + random() * 3.3);
      const large = index % 5 === 0;
      cliffs.add('rock', sand[index % sand.length], [x, -6.21 + random(), z], [8.9 + random() * 8, 3.2 + random() * 4.2, 9 + random() * 12], [0.15, random() * PI, 0.19])
        .add('rock', sand[(index + 2) % sand.length], [x + sign * 2.9, -3.13 + random(), z - 3.8], [10 + (large ? 8.4 : 0), large ? 9.4 : 5.4 + random() * 4, 13 + random() * 12], [0, random() * 3, -sign * 0.13])
        .add('shard', turf[index % turf.length], [x - sign * 0.90, -3.61 + random(), z + 2], [3.4 + random() * 4.8, 1.1 + random() * 1.2, 4.7 + random() * 3.1], [0.16, index, 0.10]);
      for (let j = 0; j < 4; j++) {
        const px = x - sign * (2 + random() * 4);
        cliffs.add('shard', sand[j], [px,-3.7 + random()*1.1,z+j], [1.4+random()*2.8,3+random()*4,2+random()*3], [0.15,random()*2,sign*0.18]);
      }
      if (index % 3 !== 1) {
        for (let j=0;j<3;j++) {
          const px=x-sign*(1+random()*2), pz=z+random()*4, height=2+random()*3.8;
          const base=large ? 1.45 : 0.2;
          cliffs.add('hex', 0x423e3b,[px,base+height*.28,pz],[.18,height*.65,.18]);
          for (let tier=0;tier<4;tier++) {
            const width=height*(.34-tier*.064);
            cliffs.add('cone',tier%2 ? 0x354d4e : 0x2d4146,[px,base+height*(.3+tier*.17),pz],[width,height*.43,width],[0,tier*.61,0]);
          }
        }
      }
      if (index % 4 === 0) {
        cliffs.add('shard', sand[(index + 1) % sand.length], [sign * (8.0 + random() * 3), -5.95, z + 2.6], [2.3 + random() * 2, 2.3 + random() * 2.6, 2.2 + random() * 2.1], [0.31, index, 0.2]);
      }
    }
    for (let index = 0; index < 8; index++) {
      cliffs.add('rock', 0x526883, [sign * (18 + index * 8.5), -3.3, -95 - index * 7], [22 + random() * 15, 20 + random() * 11, 25 + random() * 9], [0.22, random() * 2.8, 0.20]);
    }
  }

  const mesh = cliffs.mesh();
  mesh.material = cliffFinish;
  return mesh;
}

function canyonSky() {
  const texture = loader.load(duskUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWorld(scene) {
  const set = new THREE.Group();
  set.name = 'Amber Gate canyon crossing';
  scene.add(set);
  scene.background = canyonSky();
  scene.fog = new THREE.Fog(0x91a3b6, 46, 175);

  const skyLight = new THREE.HemisphereLight(0xe0edff, 0xb08f80, 1.70);
  const sun = new THREE.DirectionalLight(0xffc68d, 2.4);
  sun.position.set(16, 10, -12);
  const fill = new THREE.DirectionalLight(0xffe2bd, 1.26);
  fill.position.set(-4, 7, 12);
  set.add(skyLight, sun, fill);

  const waterTime = { value: 0 };
  const flooring = deckPattern();
  set.add(
    xzPlane(180, 290, -6.20, -78, riverMaterial(waterTime)),
    xzPlane(deckWidth, 132, 0, -47, new THREE.MeshStandardMaterial({ map: flooring, bumpMap: flooring, bumpScale: 0.12, color: 0xd7dbe1, roughness: 0.46, metalness: 0.07 })),
    new Assembly().add('block', stone.pier, [0, -0.48, -47], [9.10, 0.92, 132]).mesh(),
    terrain(),
    fortress(),
  );

  const modules = [0, 1, 2, 3].map(bridgeSegment);
  const spans = Array.from({ length: 14 }, (_, index) => modules[index % modules.length].clone());
  set.add(...spans);

  function update(time, distance) {
    waterTime.value = time;
    flooring.offset.y = (distance * 0.106) % 1;
    const length = spans.length * 8;
    const cycle = ((distance % length) + length) % length;
    for (let i = 0; i < spans.length; i++) {
      spans[i].position.z = 16 - ((i * 8 + length - cycle) % length);
    }
  }

  update(0, 0);
  return { update };
}
