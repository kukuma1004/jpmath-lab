import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
const DECK_HALF = 4.6;
const cloudBlue = 0xb3dde6;
const metal = {
  chalk: 0xe8eddb,
  ivory: 0xfaf5dd,
  white: 0xfffaf0,
  teal: 0x078b88,
  mint: 0x3fdac3,
  pool: 0x26b4b1,
  steel: 0x55747e,
  blue: 0x2d5060,
  navy: 0x1b303e,
  fabric: 0x304a50,
  ink: 0x172636,
  charcoal: 0x372e3e,
  darkRed: 0x913c4a,
  coral: 0xf47765,
  tangerine: 0xff9c45,
  amber: 0xe3ab5b,
  yellow: 0xffda75,
};

const forms = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cushion: new RoundedBoxGeometry(1, 1, 1, 1, 0.17),
  armor: new RoundedBoxGeometry(1, 1, 1, 2, 0.20),
  ring: new THREE.TorusGeometry(0.39, 0.105, 6, 24),
  wrap: new THREE.TorusGeometry(0.39, 0.114, 6, 4, Math.PI * 0.18),
  sphere: new THREE.SphereGeometry(0.5, 12, 8),
  drum: new THREE.CylinderGeometry(0.5, 0.5, 1, 10),
  hex: new THREE.CylinderGeometry(0.5, 0.5, 1, 6),
  tapered: new THREE.CylinderGeometry(0.36, 0.5, 1, 8),
  bell: new THREE.CylinderGeometry(0.5, 0.34, 1, 8),
  rock: new THREE.DodecahedronGeometry(0.5, 0),
  peak: new THREE.IcosahedronGeometry(0.5, 0),
};
const turn = [Math.PI / 2, 0, 0];
const neutralMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.83,
});
const strideClock = { value: 0 };
const figureMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.56,
});
figureMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uStrideClock = strideClock;
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nattribute float stepSide;\nattribute float figureLight;\nuniform float uStrideClock;\nvarying float vFigureLight;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\n'
      + 'float stride = sin(uStrideClock * 11.5 + 1.8 * modelMatrix[3].x + 0.55 * modelMatrix[3].z);\n'
      + 'float footfall = stride * stepSide;\n'
      + 'transformed.z += footfall * 0.115;\n'
      + 'transformed.y += max(0.0, footfall) * 0.075;\n'
      + 'vFigureLight = figureLight;');
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying float vFigureLight;')
    .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n'
      + 'totalEmissiveRadiance += diffuseColor.rgb * vFigureLight;');
};
figureMaterial.customProgramCacheKey = () => 'breakwater-figures-v1';

class ModelBuilder {
  constructor(figure = false) {
    this.figure = figure;
    this.parts = [];
    this.transform = new THREE.Object3D();
  }

  add(shape, color, point, size, angles = [0, 0, 0], stride = 0, light = 0, faceted = false) {
    const source = forms[this.figure && shape === 'cushion' ? 'armor' : shape];
    const part = source.index ? source.toNonIndexed() : source.clone();
    this.transform.position.set(...point);
    this.transform.rotation.set(...angles);
    this.transform.scale.set(...size);
    this.transform.updateMatrix();
    part.applyMatrix4(this.transform.matrix);
    part.deleteAttribute('uv');

    const count = part.attributes.position.count;
    const tint = new THREE.Color(color);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const shade = faceted ? 0.79 + 0.24 * (Math.sin(Math.floor(i / 3) * 12.99) * 0.5 + 0.5) : 1;
      colors.set([tint.r * shade, tint.g * shade, tint.b * shade], i * 3);
    }
    part.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    if (this.figure) {
      part.setAttribute('stepSide', new THREE.Float32BufferAttribute(new Float32Array(count).fill(stride), 1));
      part.setAttribute('figureLight', new THREE.Float32BufferAttribute(new Float32Array(count).fill(light), 1));
    }
    this.parts.push(part);
    return this;
  }

  mesh() {
    const mesh = new THREE.Mesh(mergeGeometries(this.parts), this.figure ? figureMaterial : neutralMaterial);
    for (const part of this.parts) part.dispose();
    return mesh;
  }
}

function shadowTexture() {
  const width = 32;
  const pixels = new Uint8Array(width * width * 4);
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const distance = Math.hypot((x + 0.5) / width * 2 - 1, (y + 0.5) / width * 2 - 1);
      const alpha = Math.round(164 * (1 - THREE.MathUtils.smoothstep(distance, 0.39, 1.0)));
      pixels.set([24, 42, 50, alpha], (y * width + x) * 4);
    }
  }
  const texture = new THREE.DataTexture(pixels, width, width);
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const shadowPlane = new THREE.PlaneGeometry(1, 1);
const shadowInk = new THREE.MeshBasicMaterial({
  map: shadowTexture(),
  transparent: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -1,
});
const figureCache = new Map();

function allyModel(leader) {
  const m = new ModelBuilder(true);
  const shell = leader ? metal.mint : metal.teal;
  const helmet = leader ? metal.white : 0xf2f3e7;

  for (const side of [-1, 1]) {
    const x = side * 0.145;
    m.add('cushion', metal.fabric, [x, 0.35, 0.01], [0.21, 0.31, 0.2], [0, 0, side * 0.08], side)
      .add('cushion', shell, [x, 0.24, 0.085], [0.17, 0.18, 0.105], [0, 0, side * 0.08], side)
      .add('cushion', metal.ink, [x, 0.109, 0.08], [0.223, 0.17, 0.305], [0, 0, 0], side)
      .add('box', metal.steel, [x, 0.062, 0.16], [0.177, 0.055, 0.13], [0, 0, 0], side);
  }

  m.add('cushion', metal.fabric, [0, 0.508, -0.02], [0.43, 0.25, 0.29])
    .add('cushion', metal.ink, [0, 0.577, 0.008], [0.49, 0.104, 0.32])
    .add('cushion', shell, [0, 0.771, -0.005], [0.545, 0.377, 0.35])
    .add('cushion', metal.teal, [0, 0.812, 0.13], [0.42, 0.252, 0.136], [0.18, 0, 0])
    .add('cushion', metal.chalk, [0, 0.815, -0.24], [0.4, 0.37, 0.22])
    .add('cushion', metal.blue, [0, 0.735, -0.311], [0.29, 0.15, 0.09])
    .add('cushion', metal.yellow, [0, 0.847, -0.368], [0.25, 0.063, 0.049], [0, 0, 0], 0, 1.45)
    .add('box', metal.steel, [0, 0.923, -0.319], [0.225, 0.043, 0.08])
    .add('drum', metal.navy, [0.112, 1.017, -0.269], [0.038, leader ? 0.32 : 0.18, 0.038], [0, 0, 0.12])
    .add('sphere', metal.yellow, [0.097, leader ? 1.167 : 1.103, -0.269], [0.043, 0.043, 0.043]);

  for (const side of [-1, 1]) {
    m.add('cushion', shell, [side * 0.304, 0.83, 0.015], [0.218, 0.218, 0.26], [0, 0, side * 0.26])
      .add('cushion', metal.fabric, [side * 0.305, 0.714, 0.086], [0.145, 0.254, 0.15], [-0.58, 0, side * 0.11])
      .add('cushion', helmet, [side * 0.264, 0.691, 0.217], [0.134, 0.152, 0.21], [0.06, side * 0.2, 0])
      .add('cushion', metal.ink, [side * 0.23, 0.682, 0.293], [0.107, 0.124, 0.114]);
  }

  m.add('cushion', metal.ink, [0, 1.104, 0.014], [0.425, 0.359, 0.449])
    .add('sphere', helmet, [0, 1.205, -0.018], [0.478, 0.364, 0.478])
    .add('cushion', helmet, [0, 1.121, -0.087], [0.483, 0.192, 0.358])
    .add('cushion', shell, [0, 1.214, -0.21], [0.125, 0.202, 0.111], [0.19, 0, 0])
    .add('cushion', metal.navy, [0, 1.169, 0.197], [0.354, 0.127, 0.113])
    .add('cushion', metal.mint, [0, 1.187, 0.252], [0.195, 0.027, 0.025], [0, 0, 0], 0, 0.5);

  const gunX = 0.21;
  m.add('cushion', metal.blue, [gunX, 0.696, 0.311], [0.169, 0.143, 0.421])
    .add('cushion', metal.navy, [gunX, 0.725, 0.427], [0.144, 0.127, 0.261])
    .add('cushion', metal.chalk, [gunX, 0.749, 0.422], [0.12, 0.024, 0.263])
    .add('box', metal.ink, [gunX, 0.773, 0.346], [0.064, 0.038, 0.074])
    .add('hex', metal.steel, [gunX, 0.708, 0.566], [0.124, 0.194, 0.124], turn)
    .add('drum', metal.ink, [gunX, 0.708, 0.659], [0.077, 0.04, 0.077], turn)
    .add('cushion', metal.ink, [gunX, 0.605, 0.334], [0.101, 0.131, 0.126], [0.15, 0, 0]);

  if (leader) {
    m.add('cushion', metal.yellow, [-0.256, 0.849, -0.149], [0.093, 0.126, 0.079], [0, 0, 0.24]);
  }
  return m.mesh();
}

function robotGrunt(armored) {
  const m = new ModelBuilder(true);
  const shell = armored ? metal.tangerine : metal.coral;
  const width = armored ? 1.2 : 1;
  for (const side of [-1, 1]) {
    const x = side * 0.178 * width;
    m.add('bell', metal.charcoal, [x, 0.32, -0.018], [0.198, 0.429, 0.179], [side * 0.22, 0, side * 0.16], side)
      .add('cushion', shell, [x, 0.24, 0.09], [0.194, 0.195, 0.13], [0, 0, side * 0.1], side)
      .add('cushion', metal.charcoal, [x, 0.085, 0.053], [0.23, 0.135, 0.302], [0, 0, 0], side)
      .add('cushion', shell, [side * 0.33 * width, 0.828, 0], [0.29 * width, 0.26, 0.30], [0, 0, -side * 0.36], -side * 0.24)
      .add('cushion', metal.charcoal, [side * 0.398 * width, 0.66, 0.116], [0.171, 0.32, 0.187], [-0.57, 0, -side * 0.12], -side * 0.65)
      .add('cushion', shell, [side * 0.397 * width, 0.583, 0.231], [0.22, 0.193, 0.231], [-0.37, 0, 0], -side * 0.85);
  }

  m.add('cushion', metal.charcoal, [0, 0.525, 0], [0.496 * width, 0.238, 0.279])
    .add('cushion', metal.darkRed, [0, 0.787, -0.005], [0.562 * width, 0.408, 0.344])
    .add('cushion', shell, [0, 0.818, 0.1], [0.543 * width, 0.284, 0.203], [0.198, 0, 0])
    .add('cushion', metal.charcoal, [0, 1.125, 0.014], [0.445, 0.323, 0.406])
    .add('cushion', shell, [0, 1.251, -0.01], [0.461, 0.185, 0.408])
    .add('cushion', metal.ink, [0, 1.125, 0.207], [0.365, 0.13, 0.075])
    .add('cushion', metal.yellow, [0, 1.128, 0.251], [0.283, 0.044, 0.025], [0, 0, 0], 0, 0.75)
    .add('hex', metal.charcoal, [0, 0.791, 0.203], [0.177, 0.055, 0.177], turn)
    .add('hex', metal.yellow, [0, 0.791, 0.236], [0.109, 0.034, 0.109], turn, 0, 0.55);

  if (armored) {
    m.add('cushion', metal.ink, [-0.48, 0.757, 0.326], [0.42, 0.649, 0.159], [0.1, 0, 0.08])
      .add('cushion', metal.tangerine, [-0.48, 0.758, 0.407], [0.351, 0.565, 0.091], [0.1, 0, 0.08])
      .add('box', metal.charcoal, [-0.479, 0.752, 0.459], [0.23, 0.078, 0.018], [0.1, 0, -0.48])
      .add('box', metal.charcoal, [-0.491, 0.873, 0.47], [0.23, 0.064, 0.017], [0.1, 0, -0.48])
      .add('box', metal.charcoal, [-0.463, 0.628, 0.445], [0.23, 0.064, 0.017], [0.1, 0, -0.48]);
  }
  return m.mesh();
}

function runnerModel() {
  const m = new ModelBuilder(true);
  m.add('cushion', metal.charcoal, [0, 0.444, -0.056], [0.61, 0.342, 0.78])
    .add('sphere', metal.darkRed, [0, 0.58, -0.131], [0.692, 0.408, 0.732], [-0.18, 0, 0])
    .add('cushion', metal.coral, [0, 0.625, 0.007], [0.493, 0.197, 0.527], [-0.26, 0, 0])
    .add('cushion', metal.ink, [0, 0.478, 0.378], [0.473, 0.212, 0.313], [0.2, 0, 0])
    .add('cushion', metal.coral, [0, 0.574, 0.386], [0.478, 0.129, 0.245], [0.25, 0, 0])
    .add('cushion', metal.yellow, [0, 0.488, 0.538], [0.369, 0.042, 0.03], [0, 0, 0], 0, 0.9);
  for (const side of [-1, 1]) {
    for (const front of [-1, 1]) {
      const x = side * 0.307;
      const z = front * 0.246;
      m.add('sphere', metal.coral, [x, 0.422, z], [0.233, 0.224, 0.232])
        .add('cushion', metal.charcoal, [side * 0.378, 0.295, z - front * 0.05], [0.117, 0.289, 0.116], [front * 0.48, 0, side * 0.44], side * front)
        .add('cushion', metal.ink, [side * 0.44, 0.113, z + front * 0.01], [0.139, 0.197, 0.137], [front * -0.43, 0, -side * 0.19], side * front)
        .add('cushion', metal.darkRed, [side * 0.435, 0.045, z + front * 0.066], [0.165, 0.089, 0.162], [0, 0, 0], side * front);
    }
  }
  return m.mesh();
}

function bossModel() {
  const m = new ModelBuilder(true);
  const casing = 0x2b414e;
  const orange = metal.tangerine;
  for (const side of [-1, 1]) {
    const x = side * 0.59;
    m.add('cushion', metal.ink, [x, 0.211, 0.35], [0.9, 0.397, 1.408])
      .add('cushion', casing, [x, 0.362, 0.415], [0.816, 0.245, 1.123], [0.12, 0, 0])
      .add('cushion', orange, [x, 0.533, 0.04], [0.65, 0.597, 0.72], [-0.06, 0, 0])
      .add('cushion', casing, [x, 0.86, -0.018], [0.565, 0.837, 0.622], [0, 0, side * 0.18])
      .add('hex', metal.ink, [x, 0.762, 0.401], [0.49, 0.162, 0.49], turn)
      .add('hex', metal.amber, [x, 0.762, 0.498], [0.299, 0.062, 0.299], turn)
      .add('cushion', orange, [side * 1.433, 2.39, -0.024], [1.06, 0.832, 1.174], [0, 0, side * -0.25])
      .add('cushion', metal.ink, [side * 1.53, 1.918, -0.002], [0.755, 1.007, 0.725], [0, 0, side * 0.145])
      .add('hex', metal.steel, [side * 1.562, 1.985, 0.416], [0.56, 0.22, 0.56], turn)
      .add('cushion', casing, [side * 1.595, 1.339, 0.258], [0.846, 0.851, 1.071], [-0.3, 0, side * 0.1])
      .add('cushion', orange, [side * 1.62, 1.397, 0.628], [0.742, 0.581, 0.521], [-0.28, 0, side * 0.1])
      .add('cushion', metal.ink, [side * 1.624, 1.203, 0.764], [0.729, 0.37, 0.437], [-0.32, 0, 0])
      .add('hex', metal.navy, [side * 1.617, 1.306, 0.977], [0.428, 0.212, 0.428], turn)
      .add('drum', metal.coral, [side * 1.617, 1.306, 1.09], [0.267, 0.071, 0.267], turn, 0, 0.85)
      .add('drum', metal.ink, [side * 1.617, 1.306, 1.133], [0.139, 0.028, 0.139], turn)
      .add('drum', casing, [side * 0.805, 2.99, -0.56], [0.337, 0.68, 0.337], [0.14, 0, 0])
      .add('drum', metal.steel, [side * 0.805, 3.322, -0.517], [0.399, 0.155, 0.399], [0.14, 0, 0]);
    for (let i = 0; i < 3; i++) {
      m.add('box', metal.ink, [side * 1.435 + (i - 1) * 0.219, 2.426, 0.561], [0.092, 0.437, 0.035], [0, 0, -0.49]);
    }
  }

  m.add('cushion', metal.ink, [0, 1.185, -0.06], [1.49, 0.468, 0.94])
    .add('cushion', casing, [0, 1.558, -0.058], [1.675, 0.776, 1.004])
    .add('cushion', casing, [0, 2.235, -0.094], [2.26, 1.322, 1.281], [0.123, 0, 0])
    .add('cushion', metal.steel, [0, 2.475, -0.082], [1.84, 0.445, 1.233], [0.11, 0, 0])
    .add('cushion', orange, [0, 2.049, 0.527], [1.591, 0.687, 0.405], [0.17, 0, 0])
    .add('hex', metal.ink, [0, 2.077, 0.771], [0.75, 0.199, 0.75], turn)
    .add('hex', metal.coral, [0, 2.077, 0.887], [0.498, 0.071, 0.498], turn, 0, 1.25)
    .add('hex', metal.yellow, [0, 2.077, 0.938], [0.278, 0.051, 0.278], turn, 0, 1.3)
    .add('cushion', metal.ink, [0, 2.735, 0.033], [0.856, 0.36, 0.679])
    .add('cushion', orange, [0, 3.069, 0.184], [1.055, 0.636, 1.012], [0.145, 0, 0])
    .add('cushion', casing, [0, 3.232, 0.087], [1.091, 0.424, 0.85], [0.117, 0, 0])
    .add('cushion', metal.ink, [0, 3.076, 0.698], [0.878, 0.261, 0.198], [0.175, 0, 0])
    .add('cushion', metal.yellow, [0, 3.129, 0.802], [0.665, 0.077, 0.057], [0.175, 0, 0], 0, 1.2)
    .add('cushion', metal.darkRed, [0, 2.99, 0.77], [0.447, 0.055, 0.072]);
  for (let i = 0; i < 4; i++) {
    m.add('cushion', metal.ink, [(i - 1.5) * 0.24, 1.687, 0.48], [0.165, 0.062, 0.087], [0.11, 0, 0]);
  }
  return m.mesh();
}

function getFigure(kind) {
  if (figureCache.has(kind)) return figureCache.get(kind);
  const model = kind === 'boss' ? bossModel()
    : kind === 'runner' ? runnerModel()
      : kind === 'armor' ? robotGrunt(true)
        : kind === 'grunt' ? robotGrunt(false)
          : allyModel(kind === 'leader');
  figureCache.set(kind, model.geometry);
  return model.geometry;
}

function figure(kind, ally) {
  const root = new THREE.Group();
  const body = new THREE.Mesh(getFigure(kind), figureMaterial);
  body.name = kind;
  body.rotation.y = ally ? Math.PI : 0;
  const shadow = new THREE.Mesh(shadowPlane, shadowInk);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.027;
  if (kind === 'boss') {
    shadow.scale.set(6.3, 3.4, 1);
    shadow.position.z = -0.17;
  } else {
    shadow.scale.set(1.76, 0.73, 1);
    shadow.rotation.z = -0.71;
    shadow.position.x = 0.44;
    shadow.position.z = 0.23;
  }
  root.add(shadow, body);
  root.userData.body = body;
  root.userData.figureKind = kind;
  return root;
}

export function createAlly(leader = false) {
  return figure(leader ? 'leader' : 'ally', true);
}

export function createEnemy(kind = 'grunt') {
  return figure(kind, false);
}

export function animateUnit(group, time, phase = 0, moving = true) {
  const { body, figureKind } = group.userData;
  if (!body) return;
  if (figureKind === 'boss') {
    body.position.y = Math.sin(time * 5.1 + phase) * 0.065;
    body.rotation.z = Math.sin(time * 4.1 + phase) * 0.045;
  } else {
    const frequency = moving ? 11.5 : 3.2;
    const swing = moving ? 0.05 : 0.013;
    const step = Math.sin(time * frequency + phase);
    body.position.y = Math.abs(step) * swing;
    body.rotation.z = step * swing * 0.69;
  }
}

function xzPlane(width, height, y, z, material, x = 0) {
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(x, y, z);
  return plane;
}

function roadMaterial(distance) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xb6a99e,
    roughness: 0.94,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uDeckTravel = distance;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vDeck;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvDeck = position.xy;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vDeck;\nuniform float uDeckTravel;')
      .replace('#include <color_fragment>', '#include <color_fragment>\n'
        + 'vec2 coord = vec2(vDeck.x, vDeck.y + uDeckTravel);\n'
        + 'float grain = fract(sin(dot(floor(coord * 52.0), vec2(127.1, 311.7))) * 43758.5453);\n'
        + 'float level = 0.93 + sin(coord.y * 0.24) * sin(coord.x * 1.9 + coord.y * 0.13) * 0.035;\n'
        + 'float laneJoint = smoothstep(0.016, 0.044, abs(abs(coord.x) - 2.57));\n'
        + 'float expansionJoint = smoothstep(0.012, 0.061, abs(mod(coord.y + 4.0, 8.0) - 4.0));\n'
        + 'float lightEdge = smoothstep(3.82, 4.03, abs(coord.x));\n'
        + 'float shoulder = smoothstep(4.11, 4.18, abs(coord.x));\n'
        + 'float dashes = 1.0 - smoothstep(0.65, 0.74, abs(mod(coord.y + 2.0, 4.0) - 2.0));\n'
        + 'float divider = (1.0 - smoothstep(0.041, 0.061, abs(coord.x))) * dashes;\n'
        + 'float edge = (1.0 - smoothstep(0.044, 0.061, abs(abs(coord.x) - 4.038)));\n'
        + 'float mottling = sin(coord.x*2.83+sin(coord.y*1.81))*sin(coord.y*3.42+coord.x) + 0.45*sin(coord.x*9.5+coord.y*8.5); diffuseColor.rgb *= level + mottling*0.034 + (grain - 0.5) * 0.14;\n'
        + 'diffuseColor.rgb *= mix(0.54, 1.0, expansionJoint) * mix(0.72, 1.0, laneJoint);\n'
        + 'diffuseColor.rgb *= 1.0 - lightEdge * 0.095 - shoulder * 0.175;\n'
        + 'diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.69, 0.54, 0.32), divider * 0.87);\n'
        + 'diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.76, 0.81, 0.77), edge * 0.91);');
  };
  material.customProgramCacheKey = () => 'breakwater-road-v1';
  return material;
}

function oceanMaterial(waveClock) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uWaveTime: waveClock,
      uDeep: { value: new THREE.Color(0x10618a) },
      uShallow: { value: new THREE.Color(0x26bdba) },
      uHaze: { value: new THREE.Color(0xa5d8e3) },
      uFoam: { value: new THREE.Color(0xccf7ee) },
    },
    vertexShader: [
      'varying vec3 vSea;',
      'void main() {',
      '  vec4 world = modelMatrix * vec4(position, 1.0);',
      '  vSea = world.xyz;',
      '  gl_Position = projectionMatrix * viewMatrix * world;',
      '}',
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vSea;',
      'uniform vec3 uDeep;',
      'uniform vec3 uShallow;',
      'uniform vec3 uHaze;',
      'uniform vec3 uFoam;',
      'uniform float uWaveTime;',
      'void main() {',
      '  float t = uWaveTime;',
      '  vec2 p = vSea.xz;',
      '  float a = sin(p.y * 1.45 + p.x * 0.42 + sin(p.x * 0.8 - t * 1.05) - t * 1.34);',
      '  float b = sin(p.y * 2.4 - p.x * 0.21 + sin(p.x * 1.45 + p.y * 0.25) + t * 0.89);',
      '  float longWaves = sin(p.y * 0.36 + p.x * 0.5 - t * 0.6) * 0.5 + 0.5;',
      '  float shallow = 1.0 - smoothstep(5.8, 22.0, abs(p.x));',
      '  vec3 water = mix(uDeep, uShallow, clamp(0.03 + shallow * 0.44 + longWaves * 0.25 + a * 0.075, 0.0, 1.0));',
      '  float streaks = smoothstep(0.9, 0.997, a) * smoothstep(0.24, 0.98, b);',
      '  float pierFoam = 1.0 - smoothstep(0.08, 1.2, abs(abs(p.x) - 4.9 - sin(p.y * 1.3 - t) * 0.39));',
      '  float softWake = smoothstep(0.28, 0.79, sin(p.y * 3.6 + p.x * 0.94 - t * 1.3) * 0.5 + 0.5);',
      '  water = mix(water, uFoam, streaks * 0.71 + pierFoam * softWake * 0.66);',
      '  float ripples = sin(4.7*p.y + 2.2*sin(1.34*p.x + 0.42*p.y) + sin(p.x*2.41 - t) - t*1.65);',
      '  float sunPath = exp(-0.10*abs(p.x + 11.0 + p.y*0.065));',
      '  float sparkle = smoothstep(0.68, 0.99, ripples) * smoothstep(0.14, 0.83, b);',
      '  water += vec3(0.85,0.52,0.15) * sunPath * sparkle + vec3(0.13,0.25,0.25)*sparkle;',
      '  float fog = smoothstep(44.0, 163.0, length(p - cameraPosition.xz));',
      '  gl_FragColor = vec4(mix(water, uHaze, fog), 1.0);',
      '  #include <colorspace_fragment>',
      '}',
    ].join('\n'),
  });
}

function railSection(variant) {
  const m = new ModelBuilder();
  for (const side of [-1, 1]) {
    const x = side * (DECK_HALF - 0.05);
    m.add('box', metal.blue, [side * 4.63, -0.305, 0], [0.28, 0.827, 8.0])
      .add('box', metal.steel, [side * 4.63, -0.073, 0], [0.35, 0.164, 8.0])
      .add('box', metal.navy, [side * 4.759, -0.6, 0], [0.13, 0.195, 8])
      .add('cushion', metal.chalk, [x, 0.704, 0], [0.106, 0.104, 8])
      .add('box', metal.steel, [x, 0.453, 0], [0.065, 0.064, 8]);
    for (const z of [-3.17, -1.23, 0.77, 2.77]) {
      m.add('cushion', metal.blue, [x, 0.306, z], [0.145, 0.63, 0.1])
        .add('box', metal.ink, [x, 0.021, z], [0.221, 0.115, 0.19])
        .add('box', metal.steel, [side * 4.742, -0.276, z], [0.08, 0.716, 0.14]);
    }
    for (const z of [-3.1, 1.8]) {
      m.add('cushion', metal.ink, [side * 4.81, -0.594, z], [0.2, 0.358, 0.691])
        .add('box', metal.amber, [side * 4.905, -0.51, z], [0.05, 0.089, 0.53])
        .add('box', metal.steel, [side * 4.86, -0.208, z], [0.087, 0.113, 0.528]);
    }
    const bollardZ = variant ? 1.03 : -2.9;
    m.add('cushion', metal.ink, [side * 4.314, 0.05, bollardZ], [0.323, 0.122, 0.447])
      .add('drum', metal.blue, [side * 4.314, 0.22, bollardZ], [0.166, 0.327, 0.166])
      .add('drum', metal.yellow, [side * 4.314, 0.381, bollardZ], [0.185, 0.116, 0.185]);
    for (let i = 0; i < 3; i++) {
      m.add('box', 0xa48d66, [side * 4.245, 0.013, bollardZ + 0.32 + i * 0.142], [0.252, 0.024, 0.046], [0, side * -0.46, 0]);
    }
    if ((variant === 0 && side === -1) || (variant === 1 && side === 1)) {
      const z = 2.81;
      const ringX = side * 4.45;
      m.add('ring', metal.ivory, [ringX, 0.49, z - 1.42], [0.72, 0.72, 0.72], [0, side * 1.15, 0]);
      for (let band = 0; band < 4; band++) {
        m.add('wrap', 0xeb603b, [ringX, 0.49, z - 1.42], [0.72, 0.72, 0.72], [0, side * 1.15, band * Math.PI / 2]);
      }
      m.add('box', metal.navy, [side * 4.68, -0.027, z], [0.405, 0.206, 0.753])
        .add('cushion', metal.blue, [side * 4.747, 0.216, z], [0.312, 0.41, 0.595])
        .add('box', metal.amber, [side * 4.747, 0.428, z], [0.33, 0.074, 0.561])
        .add('box', metal.ink, [side * 4.747, 0.239, z + 0.305], [0.249, 0.208, 0.053]);
      for (let i = 0; i < 3; i++) {
        m.add('box', metal.steel, [side * 4.748, 0.18 + i * 0.06, z + 0.336], [0.194, 0.02, 0.019]);
      }
    }
  }
  return m.mesh();
}

function pierArch(m, z, tint) {
  for (const side of [-1, 1]) {
    const x = side * 5.02;
    m.add('cushion', metal.ink, [x, -0.098, z], [0.74, 2.445, 1.47])
      .add('box', metal.blue, [x, 2.393, z], [0.35, 4.7, 0.63], [0, 0, side * 0.07])
      .add('box', tint, [x - side * 0.25, 2.35, z + 0.327], [0.167, 4.19, 0.11], [0, 0, side * 0.07])
      .add('box', metal.steel, [x - side * 0.495, 3.916, z], [0.26, 1.92, 0.35], [0, 0, side * -0.62])
      .add('box', metal.ink, [x - side * 0.73, 4.77, z + 0.44], [0.318, 0.41, 0.156])
      .add('box', metal.yellow, [x - side * 0.73, 4.799, z + 0.529], [0.183, 0.171, 0.045]);
    for (const height of [0.9, 1.9, 2.8, 3.7]) {
      m.add('box', tint, [x + side * (0.29 - height * 0.06), height, z + 0.365], [0.299, 0.134, 0.116]);
    }
  }
  m.add('box', metal.navy, [0, 4.86, z], [9.76, 0.39, 0.69])
    .add('box', metal.steel, [0, 5.263, z], [9.76, 0.206, 0.497])
    .add('box', tint, [0, 4.721, z + 0.37], [9.39, 0.079, 0.108]);
  for (const x of [-3.6, -1.78, 0, 1.78, 3.6]) {
    m.add('box', 0xffc451, [x, 4.82, z + 0.41], [0.58, 0.095, 0.09]);
  }
  for (let i = -5; i < 5; i++) {
    m.add('box', tint, [i * 0.89 + 0.38, 5.07, z + 0.17], [0.11, 0.94, 0.123], [0, 0, (i % 2 ? -1 : 1) * 1.1]);
  }
}

function marineBeacon(m, x, z, height) {
  m.add('drum', metal.navy, [x, -0.98, z], [0.56, 1.49, 0.56])
    .add('drum', metal.tangerine, [x, -0.47, z], [0.55, 0.32, 0.55])
    .add('cushion', metal.steel, [x, height + 0.22, z], [0.63, 0.65, 0.63])
    .add('cushion', metal.ink, [x, height + 0.49, z], [0.74, 0.12, 0.74])
    .add('box', 0xffe08a, [x, height + 0.25, z + 0.329], [0.48, 0.29, 0.065])
    .add('box', metal.yellow, [x + Math.sign(x) * -0.33, height + 0.25, z], [0.046, 0.187, 0.38])
    .add('drum', metal.steel, [x + 0.16, height + 0.8, z], [0.051, 0.61, 0.051])
    .add('sphere', metal.coral, [x + 0.16, height + 1.095, z], [0.128, 0.128, 0.128]);
  if (height > 0) {
    m.add('drum', metal.chalk, [x, height * 0.5 - 0.18, z], [0.27, height + 0.57, 0.27]);
  }
}

function ship(x, z, yaw, color) {
  const m = new ModelBuilder();
  m.add('cushion', metal.ink, [0, -1.795, 0], [2.34, 0.8, 5.42])
    .add('tapered', metal.ink, [0, -1.79, -2.7], [2.243, 1.179, 0.908], [Math.PI / 2, Math.PI / 2, 0])
    .add('cushion', color, [0, -1.43, 0], [2.429, 0.32, 5.18])
    .add('cushion', metal.chalk, [0, -1.226, 0], [2.075, 0.169, 4.8])
    .add('cushion', metal.ivory, [0, -0.635, 1.644], [1.68, 1.049, 1.49])
    .add('cushion', metal.ink, [0, -0.429, 1.644], [1.725, 0.388, 1.56])
    .add('cushion', metal.ivory, [0, -0.138, 1.644], [1.988, 0.22, 1.65])
    .add('drum', metal.blue, [0, 0.367, 1.765], [0.135, 0.92, 0.135])
    .add('box', metal.steel, [0, 0.679, 1.765], [0.829, 0.076, 0.099])
    .add('sphere', metal.tangerine, [0, 0.831, 1.765], [0.159, 0.159, 0.159]);
  for (const crateX of [-0.53, 0.53]) {
    for (const crateZ of [-1.51, -0.61]) {
      m.add('cushion', crateX < 0 ? color : metal.steel, [crateX, -0.924, crateZ], [0.91, 0.53, 0.769]);
      for (let line = -1; line < 2; line++) {
        m.add('box', metal.blue, [crateX + line * 0.22, -0.666, crateZ], [0.034, 0.044, 0.66]);
      }
    }
  }
  const mesh = m.mesh();
  mesh.position.set(x, 0, z);
  mesh.rotation.y = yaw;
  return mesh;
}

function createFarCoast() {
  const m = new ModelBuilder();
  for (let index = 0; index < 28; index++) {
    const side = index % 2 ? 1 : -1;
    const x = side * (13 + (index % 13) * 4.9);
    const z = -88 - (index % 7) * 10.8;
    const size = 10 + (index % 5) * 3.84;
    m.add('rock', [0x578f95, 0x659c9c, 0x4b8b91][index % 3], [x, -0.86, z],
      [size * 1.52, size * 0.66, size * 1.61], [index * 0.72, index * 1.8, index * 0.4], 0, 0, true)
      .add('peak', [0x8ab6ab, 0x699f90, 0x7dad9f][index % 3], [x + 2.7, size * 0.18, z - 3],
        [size * 1.32, size * 0.62, size * 1.13], [index * 0.82, index * 0.84, index * 0.32], 0, 0, true);
  }
  m.add('drum', metal.ink, [-13.3, -0.87, -88], [7.4, 1.758, 7.4])
    .add('tapered', metal.chalk, [-13.3, 3.96, -88], [3.07, 9.78, 3.07])
    .add('tapered', metal.coral, [-13.3, 6.64, -88], [2.764, 1.638, 2.764])
    .add('drum', metal.navy, [-13.3, 8.87, -88], [3.229, 0.391, 3.229])
    .add('drum', metal.yellow, [-13.3, 9.38, -88], [2.29, 0.791, 2.29])
    .add('tapered', metal.coral, [-13.3, 10.234, -88], [3.04, 0.98, 3.04]);
  m.add('box', 0x4a7883, [15.4, -0.643, -85.1], [15, 2.83, 12.6])
    .add('cushion', 0xc2d0bb, [16.4, 1.968, -85.1], [7.22, 5.389, 5.14])
    .add('box', metal.blue, [16.4, 4.678, -85.1], [7.499, 0.27, 5.266]);
  for (const x of [11.4, 21.2]) {
    m.add('box', metal.steel, [x, 6.67, -87.2], [0.513, 13.1, 0.53])
      .add('box', metal.blue, [x - 1.37, 11.24, -87.2], [5.731, 0.326, 0.512], [0, 0, -0.51])
      .add('box', metal.amber, [x + 1.438, 12.93, -87.2], [7.124, 0.31, 0.42], [0, 0, 0.28]);
  }
  return m.mesh();
}

function buildWaterSide() {
  const m = new ModelBuilder();
  for (let index = 0; index < 18; index++) {
    const side = index % 2 ? 1 : -1;
    const x = side * (6.24 + (index % 5) * 0.69);
    const z = -8.3 - index * 3.17;
    const scale = 0.7 + (index % 4) * 0.41;
    for (let crest = 0; crest < 4; crest++) {
      const angle = index * 1.73 + crest * 1.57;
      const radius = (0.76 + crest * 0.03) * scale;
      m.add('sphere', crest % 2 ? 0xa5e1db : 0xd1f2e7,
        [x + Math.cos(angle) * radius, -1.923, z + Math.sin(angle) * radius],
        [scale * 1.12, 0.084, scale * 0.33], [0, -angle + Math.PI / 2, 0]);
    }
    m.add('rock', index % 3 === 1 ? 0x7a9b9a : 0x466e75, [x, -1.64, z], [2.2 * scale, 1.43 * scale, 2.48 * scale], [index * 1.6, index * 0.69, index * 0.2], 0, 0, true);
  }
  marineBeacon(m, 5.67, -14, 0.12);
  marineBeacon(m, -5.72, -24, 0.37);
  marineBeacon(m, 5.82, -39, 0.45);
  marineBeacon(m, -6.12, -54, 0.7);
  return m.mesh();
}

function coastalSky() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, 210);
  sky.addColorStop(0, '#429ebb');
  sky.addColorStop(0.52, '#84d1df');
  sky.addColorStop(1, '#d1ebdf');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1024, 640);
  const glow = ctx.createRadialGradient(28, 20, 0, 28, 20, 285);
  glow.addColorStop(0, '#fff8d9');
  glow.addColorStop(0.12, '#ffe4ae');
  glow.addColorStop(0.38, 'rgba(255,210,165,.66)');
  glow.addColorStop(1, 'rgba(255,220,176,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1024, 640);
  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath();
    ctx.moveTo(0, 640);
    for (let x = 0; x <= 1024; x += 4) {
      const slope = 19 * Math.sin(x * 0.009 + layer) + 11 * Math.cos(x * 0.021 - layer);
      const ridge = Math.sin(x * 0.068 + layer) * 2.8 + Math.sin(x * 0.175) * 0.8;
      ctx.lineTo(x, 91 + layer * 17 + slope + ridge);
    }
    ctx.lineTo(1024, 640);
    ctx.closePath();
    ctx.fillStyle = ['#89c5d1', '#76b2bf', '#619fab'][layer];
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createWorld(scene) {
  const environment = new THREE.Group();
  environment.name = 'Breakwater causeway';
  scene.add(environment);
  scene.background = coastalSky();
  scene.fog = new THREE.Fog(cloudBlue, 43, 141);

  const dome = new THREE.HemisphereLight(0xe0f5ff, 0x72747c, 1.36);
  const key = new THREE.DirectionalLight(0xffdda8, 2.9);
  key.position.set(-12, 17, 8);
  const rim = new THREE.DirectionalLight(0xe4fbff, 1.22);
  rim.position.set(8, 8, -15);
  environment.add(dome, key, rim);

  const waveClock = { value: 0 };
  const deckTravel = { value: 0 };
  environment.add(
    xzPlane(350, 300, -1.98, -100, oceanMaterial(waveClock)),
    xzPlane(9.2, 124, 0.0, -49, roadMaterial(deckTravel)),
    createFarCoast(),
    buildWaterSide(),
  );
  const hull = new ModelBuilder()
    .add('box', 0x75908e, [0, -0.378, -49], [9.24, 0.706, 124])
    .add('box', 0x587681, [0, -0.707, -49], [8.82, 0.186, 124])
    .mesh();
  const arches = new ModelBuilder();
  pierArch(arches, -48, 0xafc4b7);
  pierArch(arches, -76, 0x8ca9a1);
  environment.add(hull, arches.mesh());

  const boats = [
    { mesh: ship(-7.97, -25.2, -0.12, 0xfc9a60), tilt: -0.24 },
    { mesh: ship(10.4, -43.8, 0.31, 0x68c7ba), tilt: 1.88 },
  ];
  for (const boat of boats) environment.add(boat.mesh);

  const sectionModels = [railSection(0), railSection(1)];
  const railCount = 15;
  const rails = Array.from({ length: railCount }, (_, index) => {
    const mesh = sectionModels[index % sectionModels.length].clone();
    mesh.frustumCulled = true;
    environment.add(mesh);
    return mesh;
  });

  function update(time, distance) {
    const travel = ((distance % (railCount * 8)) + railCount * 8) % (railCount * 8);
    waveClock.value = time;
    strideClock.value = time;
    deckTravel.value = travel;
    for (let i = 0; i < railCount; i++) {
      rails[i].position.z = 10 - ((i * 8 + railCount * 8 - travel) % (railCount * 8));
    }
    for (const boat of boats) {
      const wave = time * 1.13 + boat.tilt;
      boat.mesh.position.y = Math.sin(wave) * 0.095;
      boat.mesh.rotation.z = Math.sin(wave) * 0.026;
      boat.mesh.rotation.x = Math.cos(wave) * 0.018;
    }
  }
  update(0, 0);
  return { update };
}
