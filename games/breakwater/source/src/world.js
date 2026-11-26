import { installShapes, ranger, knight } from './characters.js';
import steelUrl from './art/forged-steel.webp?inline';
import { chapterLand } from './chapter-land.js';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import slateUrl from './art/weathered-slate.jpg?inline';
import duskUrl from './art/mountain-sunset.jpg?inline';
const stormArt = import.meta.glob('./art/storm-sky.webp', { eager: true, query: '?inline', import: 'default' });

const loader = new THREE.TextureLoader();
const steelGrain = loader.load(steelUrl);
steelGrain.wrapS = steelGrain.wrapT = THREE.RepeatWrapping;
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

installShapes(shape, plaque);
const marchTime = { value: 0 };
const marchStrength = { value: 1 };
const figurePaint = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0.19 });
figurePaint.onBeforeCompile = shader => {
  shader.uniforms.steelGrain = { value: steelGrain };
  shader.uniforms.marchTime = marchTime;
  shader.fragmentShader = 'uniform sampler2D steelGrain; varying vec3 armourPoint; varying float isSteel;\n' + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
    #include <roughnessmap_fragment>
    float grain = texture2D(steelGrain, armourPoint.xy * 0.64 + armourPoint.z * vec2(0.19,0.28)).r;
    roughnessFactor = mix(.82, .27 + grain * .26, isSteel);
    diffuseColor.rgb *= mix(1., .86 + grain * .33, isSteel);
  `).replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(.015,.39,isSteel);');
  shader.uniforms.marchStrength = marchStrength;
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 armourPoint; varying float isSteel; attribute float stepSide;\nuniform float marchTime;\nuniform float marchStrength;')
    .replace('#include <begin_vertex>', [
      '#include <begin_vertex>',
      'armourPoint=position; isSteel=1.-smoothstep(.018,.058,max(color.r,max(color.g,color.b))-min(color.r,min(color.g,color.b)));',
      'vec3 origin = instanceMatrix[3].xyz;',
      'float phase = marchTime * 11.3 + origin.x * 2.9 + origin.z * 0.66;',
      'float foot = sin(phase) * stepSide * marchStrength;',
      'float shoulders = smoothstep(.39, .82, position.y) * (1. - abs(stepSide));',
      'float twist = .026 * sin(phase) * shoulders * marchStrength;',
      'transformed.x += twist * position.z;',
      'transformed.z -= twist * position.x;',
      'transformed.z += foot * 0.105;',
      'transformed.y += max(0.0, foot) * 0.083;',
    ].join('\n'));
};
figurePaint.customProgramCacheKey = () => 'gatefront-armoured-march';

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
  if(kind === 'leader' || kind === 'ally') return ranger(new Assembly(true),kind === 'leader');
  const heavy = kind === 'armor';
  const scout = kind === 'runner';
  const cloth = scout ? attire.scarlet : attire.burgundy;
  const plate = heavy ? attire.oldGold : 0xaa8d79;
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
  const pennant = attire.wine;
  build.add('pennant', pennant, [0, 0.60, -0.169], [0.43, 0.54, 0.55], [0.10, 0, 0]);
  // A fluted travelling cloak flares around the legs and folds up at the shoulders.
  for (let fold=-2;fold<=2;fold++) {
    const edge=Math.abs(fold);
    build.add('pennant',edge===1 ? 0x984556 : pennant,
      [fold*.081,.51+edge*.025,-.197+edge*.021],[.138,.68-edge*.043,.72],[.23,fold*.16,fold*.11]);
  }
  build.add('cone',plate,[0,1.075,.012],[.31,.22,.29])
    .add('octagon',attire.oldGold,[0,.981,.015],[.317,.028,.32]);
  if (!heavy && !scout) {
    build.add('shield', attire.oldGold, [-.22,.53,.208], [.34,.53,.39], [.08,.18,-.08])
      .add('shield', attire.wine, [-.22,.54,.243], [.28,.45,.33], [.08,.18,-.08])
      .add('spade', 0xdab279, [-.22,.54,.268], [.065,.23,.21]);
  }
  spear(build, kind);
  if (heavy) {
    for (const sign of [-1, 1]) {
      build.add('taper', plate, [sign * 0.23, 0.75, 0], [0.22, 0.17, 0.24], [0, 0, sign * 0.38]);
    }
  }
  if (scout) {
    build.add('spade', attire.scarlet, [0, 1.107, -0.016], [0.05, 0.16, 0.20], [0.2, PI / 2, 0]);
  }
  return build.geometry;
}

function guardian(stage = 0) {
  return knight(new Assembly(true),stage);
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

  const foundryArmor = figurePaint.clone();
  foundryArmor.roughness = .38;
  foundryArmor.onBeforeCompile = shader => {
    figurePaint.onBeforeCompile(shader);
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      float heat=smoothstep(.52,.90,vColor.r)* (1.-smoothstep(.20,.46,vColor.g));
      float rim=pow(1.-max(dot(normal,normalize(vViewPosition)),0.),3.);
      totalEmissiveRadiance+=heat*vec3(1.75,.44,.04)+rim*vec3(.16,.045,.014);
    `);
  };
  foundryArmor.customProgramCacheKey = () => 'foundry-forged-armor';
  const guardians = [batches.boss.geometry];
  let stage = 0;
  let windup = 0;
  let followThrough = 0;
  function setStage(index) {
    stage = index;
    guardians[index] ??= guardian(index);
    batches.boss.geometry = guardians[index];
    batches.boss.material = index === 2 ? foundryArmor : figurePaint;
  }

  function place(kind, unit, turn, time) {
    const batch = batches[kind];
    if (batch.count >= bodyLimit[kind]) return;
    const boss = kind === 'boss';
    const size = boss ? (stage === 2 ? 1.88 : stage === 6 ? 1.83 : 1.78) : kind === 'leader' ? 1.10 : kind === 'armor' ? 1.13 : kind === 'runner' ? 0.87 : 0.97;
    const beat = unit.x * 2.9 + unit.z * 0.66 + time * 11.3;
    const gait = Math.abs(Math.sin(beat)) * 0.039 * marchStrength.value;
    body.position.set(unit.x, gait, unit.z);
    body.rotation.set(boss ? -.09 * windup + .15 * followThrough : 0, turn + (boss ? -.17 * windup + .22 * followThrough : 0), Math.sin(beat) * (boss ? .012 : .026) * marchStrength.value);
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
    setStage,
    update({ allies, enemies, time, moving, bossAlarm }) {
      const charge = bossAlarm ? 1 - THREE.MathUtils.clamp(bossAlarm.ttl / 1.24, 0, 1) : 0;
      if (!bossAlarm && windup > .5) followThrough = 1;
      else followThrough *= Math.exp(-Math.max(0, time - marchTime.value) * 9);
      windup = charge;
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

function stormSea(clock) {
  const water = riverMaterial(clock);
  water.uniforms.blue.value.setHex(0x315965);
  water.uniforms.deep.value.setHex(0x143c46);
  water.uniforms.glint.value.setHex(0x738c94);
  water.vertexShader = water.vertexShader.replace('gl_Position =', `
    vWorld.y += .31*sin(vWorld.x*.90+vWorld.z*.66-clock*2.)+.21*cos(vWorld.z*1.23-clock*1.63);
    gl_Position =`);
  water.vertexShader='uniform float clock;\n'+water.vertexShader;
  water.uniforms.breakers = { value: rockSurface };
  water.fragmentShader='uniform sampler2D breakers;\n'+water.fragmentShader;
  water.fragmentShader=water.fragmentShader.replace('vec2 p = vWorld.xz;', `
    vec2 p = vWorld.xz;
    vec2 drift = vec2(clock * .024, -clock * .038);
    float chop = texture2D(breakers, p * .19 + drift).r;
    float ripple = texture2D(breakers, p.yx * .63 - drift).r;
    p += vec2(chop, ripple) * .72;
  `).replace('water = mix(water, mist,', `
    float fold=sin(p.x*.90+p.y*.66-clock*2.+.31*sin(p.y*2.12));
    float lace=sin(p.y*7.4+p.x*2.+clock*2.)*.12+cos(p.x*5.+p.y*1.3)*.12;
    float spray=smoothstep(.71,1.,fold+lace)*(.55+.45*sin(p.y*3.9+p.x*1.4));
    float crest=smoothstep(.71,1.,fold+lace+.29*(chop-.4));
    float broken=smoothstep(.17,.72,.63*chop+.41*ripple);
    water*=.78+.37*chop;
    water=mix(water,vec3(.57,.70,.71),spray*.36+crest*broken*.56);
    water = mix(water, mist,`);
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(140,180,76,94),water);
  mesh.rotation.x=-PI/2;
  mesh.position.set(0,-1.65,-62);
  return mesh;
}

function stormRain(clock) {
  const random=randomFrom(6742);
  const p=[], ends=[];
  for(let i=0;i<210;i++){
    const x=(random()-.5)*35, y=random()*19, z=9-random()*62;
    p.push(x,y,z,x+.091,y,z-.024); ends.push(0,.43);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
  g.setAttribute('tip',new THREE.Float32BufferAttribute(ends,1));
  return new THREE.LineSegments(g,new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,uniforms:{clock},
    vertexShader:`attribute float tip; uniform float clock; void main(){
      vec3 v=position; float shift=mod(clock*8.4,19.);
      float height=mod(v.y-shift+19.,19.);
      v.x+=(height-v.y)*.19; v.y=height+tip;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(v,1.);
    }`,
    fragmentShader:'void main(){gl_FragColor=vec4(.69,.81,.86,.18);}'
  }));
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

function mountainPass(frozen) {
  const cliffs = new Assembly();
  const lights = new Assembly();
  const random = randomFrom(frozen ? 613 : 791);
  const rocks = frozen ? [0x627a91,0x8399aa,0xa9bdc9] : [0x303340,0x41404a,0x594547];
  for (const side of [-1,1]) {
    for (let i=0;i<26;i++) {
      const z=12-i*4.7, x=side*(11+random()*2.6);
      const top=-1.1+random()*3.1, width=4.6+random()*2.2;
      cliffs.add('hex',rocks[i%3],[x,top-4,z],[width,8,width*1.24],[0,i*.61,0])
        .add('hex',rocks[(i+1)%3],[x+side*4,top-1,z-1],[width*1.35,9,width*1.36],[0,i*.53,0]);
      if(frozen) {
        cliffs.add('hex',0xe0e9e8,[x,top+.05,z],[width*1.02,.32,width*1.24],[0,i*.61,0]);
        for(let j=0;j<3;j++) {
          const h=1.3+random()*4;
          cliffs.add('shard',j%2 ? 0x91cddd : 0xc4edf0,[x+side*j*.67,top+h*.31,z+j*.26],[.7+random(),h,1.2],[.1,j,-side*(j-.6)*.26]);
        }
      } else {
        // Broken basalt shelves step down from the back pillars toward the lava.
        for(let ledge=0;ledge<3;ledge++) {
          const shelfX=x-side*(width*.34+ledge*.58), shelfY=top-1.2-ledge*1.24;
          cliffs.add('rock',rocks[(i+ledge)%3],[shelfX,shelfY,z+ledge*.64],
            [2.43-ledge*.34,2.6-ledge*.21,3.53],[.15,1.47*i+ledge,side*.27]);
        }
      }
      if(!frozen && i%3===0) {
        const fallX=x-side*width*.50;
        for(let j=0;j<4;j++) {
          const lipX=x-side*width*(.13+j*.105);
          lights.add('block',j===2 ? 0xffba39 : 0xff6714,[lipX,top+.11,z+.23+j*.06],[width*.13,.09,.34+j*.08],[0,side*.17,0]);
          cliffs.add('rock',rocks[j%3],[fallX+side*.3,top-1.8-j*.8,z-.62-j*.24],[1.38,2.0,1.75],[.11,j,.21]);
        }
        for(let j=0;j<4;j++) {
          lights.add('block',j%2 ? 0xff9c24 : 0xe34411,[fallX-side*.12,top-3.45,z+j*.18],[.32,7.1,.2],[0,0,-side*.053]);
        }
        lights.add('hex',0xff7917,[fallX,top+.09,z+.3],[1.9,.17,1.3]);
      }
    }
  }
  const group=new THREE.Group(), rock=cliffs.mesh();
  rock.material=cliffFinish;
  group.add(rock);
  if(!frozen) group.add(new THREE.Mesh(lights.geometry,new THREE.MeshBasicMaterial({vertexColors:true})));
  return group;
}

function stageCitadel(frozen) {
  const body=new Assembly(), glow=new Assembly();
  const z=-64, wall=frozen ? 0x526b83 : 0x393740, edge=frozen ? 0xa6bcc6 : 0x80614d;
  const light=frozen ? 0x99fbff : 0xffa222;
  body.add('block',wall,[0,-2,z-1],[24,4,10])
    .add('block',wall,[0,3.95,z-1],[11,8,3]);
  // A stepped portal follows the pitched arch and embeds the luminous grate.
  for(let j=-5;j<=5;j++) {
    const height=6.8-Math.max(0,Math.abs(j)-1)*.59;
    glow.add('block',j%2 ? light : (frozen ? 0x60ccf2 : 0xff7014),[j*.49,height*.5,z+.7],[.40,height,.24]);
    body.add('block',edge,[j*.49,height+.13,z+.89],[.53,.42,.48]);
  }
  for(const side of [-1,1]) {
    body.add('block',wall,[side*5.4,3.05,z],[3.8,6.1,4.6])
      .add('block',edge,[side*5.4,6.13,z],[4.05,.33,4.92])
      .add('pennant',frozen ? 0x226577 : 0x8a342d,[side*5.4,3.9,z+2.39],[1.7,3.48,1])
      .add('spade',frozen ? 0xc8f4ed : 0xe2a85c,[side*5.4,3.99,z+2.46],[.70,1.0,.56])
      .add('block',edge,[side*3.13,2.36,z+1.36],[.71,4.72,.97])
      .add('block',edge,[side*2.24,5.74,z+1.36],[.72,3.03,.98],[0,0,side*.67]);
    if(frozen) {
      for(let i=0;i<4;i++) {
        const x=side*(4+i*1.15), h=4.9+i*.96;
        body.add('hex',wall,[x,h*.5,z-2.1],[1.6,h,2.5])
          .add('shard',i%2 ? 0xc2e5ea : 0x84c2d6,[x,h+1.1,z-2.1],[1.98,4.7,2.32],[0,0,-side*.16]);
      }
    } else {
      for(let i=0;i<4;i++) {
        const x=side*(4+i*2.9), h=10.2-i*.78, pz=z-3.4-i*1.6;
        body.add('taper',wall,[x,h*.48,pz],[1.52,h,1.52])
          .add('octagon',edge,[x,h*.91,pz],[1.72,.26,1.72]);
        glow.add('octagon',0xff6825,[x,h*.94,pz],[1.30,.29,1.3]);
        body.add('octagon',wall,[x,h*.99,pz],[1.63,.42,1.63]);
        for(let j=0;j<4;j++) {
          body.add('rock',j%2 ? 0x414955 : 0x505866,[x+j*.51,h+.73+j*.9,pz-j*.5],[1.15+j*.39,1.64+j*.28,1.28+j*.42],[.4,i+j,.21]);
        }
      }
      for(let i=0;i<3;i++) {
        const x=side*(2.82+i*.46), y=6.0+i*.45;
        body.add('block',0x505463,[x,y,z+1.12],[.43,2.12,.61],[0,0,side*.70]);
        glow.add('block',0xff9230,[x,y+.24,z+1.46],[.15,.36,.08],[0,0,side*.70]);
      }
      for(let i=0;i<6;i++) {
        const x=side*(8+i*1.55);
        body.add('block',wall,[x,3.4,z-4],[.20,6.8,.28])
          .add('block',edge,[x+.72*side,4.55,z-4],[2.24,.17,.24],[0,0,side*.72]);
      }
      body.add('block',wall,[side*12,5.4,z-4],[9,.23,.66]);
      // Lower ore hoists frame the gate from a nearer terrace.
      const hoistX=side*8.5, hoistZ=z+15;
      for(const rail of [-.56,.56]) {
        body.add('block',wall,[hoistX+rail,1.6,hoistZ],[.20,5.1,.34]);
      }
      for(let j=0;j<4;j++) body.add('block',edge,[hoistX,.05+j*1.04,hoistZ],[1.48,.13,.24],[0,0,(j%2?1:-1)*.73]);
      body.add('block',edge,[hoistX-side*1.18,4.01,hoistZ],[3.72,.24,.44],[0,0,-side*.19])
        .add('block',wall,[hoistX-side*.93,3.53,hoistZ],[3.36,.18,.26],[0,0,-side*.48])
        .add('block',wall,[hoistX-side*2.78,3.08,hoistZ],[.073,2.44,.08])
        .add('taper',wall,[hoistX-side*2.78,1.82,hoistZ],[1.01,.54,1.01]);
      glow.add('octagon',0xff9435,[hoistX-side*2.78,2.08,hoistZ],[.91,.09,.92]);
      const x=side*10;
      body.add('block',wall,[x,3.75,z+2],[.39,7.5,.48])
        .add('block',edge,[x-side*1.85,7.43,z+2],[4.25,.32,.52],[0,0,side*.16])
        .add('block',wall,[x-side*3.75,6.03,z+2],[.09,2.12,.1])
        .add('hex',wall,[x-side*3.75,4.91,z+2],[1.32,.69,1.28]);
      glow.add('cone',light,[x-side*3.75,5.43,z+2],[1.04,.92,.96]);
      for(let j=0;j<4;j++) body.add('block',edge,[x,1+j*1.5,z+2],[1.3,.17,.22],[0,0,(j%2?1:-1)*.93]);
    }
  }
  const group=new THREE.Group(), shell=body.mesh();
  shell.material=masonryFinish;
  group.add(shell,new THREE.Mesh(glow.geometry,new THREE.MeshBasicMaterial({vertexColors:true})));
  return group;
}

function stageSurface(stage, time) {
  const frozen=stage===1;
  return new THREE.ShaderMaterial({
    uniforms:{ clock:time },
    vertexShader:'varying vec2 p; void main(){vec4 world=modelMatrix*vec4(position,1.);p=world.xz;gl_Position=projectionMatrix*viewMatrix*world;}',
    fragmentShader:`
      varying vec2 p; uniform float clock;
      void main(){
        vec2 q=p*.63;
        q+=.47*sin(q.yx*1.53+clock*.13)+.18*sin(q.yx*3.89);
        float a=sin(q.x+sin(q.y)), b=sin(q.y*.87+q.x*.34);
        float seam=1.-smoothstep(.015,.18,min(abs(a),abs(b)));
        vec3 color=${frozen ? 'mix(vec3(.14,.35,.51),vec3(.61,.89,.96),.30+.67*seam)' :
          'mix(mix(vec3(.32,.025,.008),vec3(.91,.16,.008),.5+.5*a*b),vec3(1.,.59,.065),seam)'};
        ${frozen ? '' : `
          float fleck=sin(q.x*4.2+sin(q.y*3.7))*cos(q.y*4.5+q.x);
          float crust=smoothstep(.12,.64,a*b+.19*fleck);
          color=mix(color,vec3(.093,.027,.023)*(1.+.39*fleck),crust*.88);
          color+=vec3(.48,.095,.005)*seam*seam;
        `}
        gl_FragColor=vec4(color,1.);
        #include <colorspace_fragment>
      }`,
  });
}

export function createWorld(scene) {
  const set = new THREE.Group();
  scene.add(set);
  const originalSky = canyonSky();
  const harborSky = stormArt['./art/storm-sky.webp'] ? loader.load(stormArt['./art/storm-sky.webp']) : originalSky;
  harborSky.colorSpace = THREE.SRGBColorSpace;
  scene.background = originalSky;
  scene.fog = new THREE.Fog(0x91a3b6, 46, 175);
  const skyLight = new THREE.HemisphereLight(0xe0edff, 0xb08f80, 1.70);
  const sun = new THREE.DirectionalLight(0xffc68d, 2.4);
  sun.position.set(16, 10, -12);
  const fill = new THREE.DirectionalLight(0xffe2bd, 1.26);
  fill.position.set(-4, 7, 12);
  set.add(skyLight, sun, fill);
  const waterTime={value:0}, flooring=deckPattern();
  const floor=new THREE.MeshStandardMaterial({map:flooring,bumpMap:flooring,bumpScale:.12,color:0xd7dbe1,roughness:.46,metalness:.07});
  const foundryFloor=floor.clone();
  foundryFloor.color.setHex(0xb8bfd0);
  foundryFloor.roughness=.70;
  foundryFloor.onBeforeCompile=shader=>{
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      vec2 p=vMapUv*vec2(9.05,9.92);
      float grit=texture2D(map,vMapUv).r;
      p+=.052*sin(p.yx*5.1)+.023*sin(p.yx*14.3);
      float fault=abs(sin(p.x*1.28+p.y*.59+1.48*sin(p.y*1.12)+.40*sin(p.x*2.95)));
      float hot=(1.-smoothstep(.006,.024,fault))*smoothstep(.05,.80,sin(p.y*1.51-p.x*.96)+.38*sin(p.x*3.71));
      totalEmissiveRadiance+=vec3(.97,.115,.012)*hot*(.6+grit);
      float edgeHeat=smoothstep(.30,.49,abs(fract(vMapUv.x)-.5));
      totalEmissiveRadiance+=vec3(.10,.019,.006)*edgeHeat*(.15+.85*grit);

    `);
  };
  const deck=xzPlane(deckWidth,132,0,-47,floor);
  set.add(deck,new Assembly().add('block',stone.pier,[0,-.48,-47],[9.1,.92,132]).mesh());
  const modules=[0,1,2,3].map(bridgeSegment);
  const spans=Array.from({length:14},(_,i)=>modules[i%4].clone());
  set.add(...spans);
  const stageGroups=[];
  const rails=masonryFinish.clone();
  rails.onBeforeCompile=masonryFinish.onBeforeCompile;
  rails.customProgramCacheKey=masonryFinish.customProgramCacheKey;
  for(const span of spans) span.children[0].material=rails;

  const wetFloor=floor.clone();
  wetFloor.roughness=.29;
  wetFloor.color.setHex(0x93999e);
  const roadTravel = { value: 0 };
  wetFloor.onBeforeCompile=shader=>{
    shader.uniforms.roadTravel = roadTravel;
    shader.fragmentShader = 'uniform float roadTravel;\n' + shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`
      #include <roughnessmap_fragment>
      float grain=texture2D(map,vMapUv).r;
      roughnessFactor=clamp(.12+grain*.86,.13,.66);
    `).replace('#include <emissivemap_fragment>',`
      #include <emissivemap_fragment>
      vec2 p=vec2(vMapUv.x, vMapUv.y + roadTravel);
      float grain2=texture2D(map,p).r;
      float rim=smoothstep(.23,.49,abs(p.x-.5));
      // Break the reflected sky and lanterns at the photographed paver joints.
      float detail=texture2D(map,p*vec2(1.71,2.24)).r;
      float stoneMask=smoothstep(.008,.068,grain2);
      float waterFilm=stoneMask*smoothstep(.013,.16,grain2+.32*detail);
      float ridges=.52+.48*sin(p.y*150.+detail*26.+p.x*11.);
      float reflectionPatch=smoothstep(.18,.84,.52+.30*sin(p.y*3.4+p.x*18.)+.23*sin(p.y*8.6-p.x*29.));
      totalEmissiveRadiance+=vec3(.059,.088,.108)*waterFilm*(.27+.73*reflectionPatch)*(.6+.4*ridges);
      float reflectionX=mix(.087,.913,step(.5,p.x));
      float stripe=exp(-abs(p.x-reflectionX+(.064*detail-.006))*19.);
      float pool=pow(.5+.5*cos(p.y*3.89+step(.5,p.x)*3.14),3.);
      totalEmissiveRadiance+=vec3(.99,.40,.076)*stripe*pool*waterFilm*(.12+.88*ridges);
      // Worn brass inlays and paired approach chevrons embedded in the road.
      float lane=abs(abs(p.x-.5)-.174);
      float brass=(1.-smoothstep(.001,.004,lane))*.44;
      float cx=abs(abs(p.x-.5)-.28);
      float arrow=abs(fract(p.y*2.2)-.51-cx*2.6);
      brass+= (1.-smoothstep(.012,.034,arrow))*(1.-smoothstep(.046,.061,cx))*.43;
      totalEmissiveRadiance+=vec3(.66,.40,.13)*brass*stoneMask;

    `);
  };
  const chapterColors = [
    [0xd7dbe1,0xffffff,0x91a3b6,0xffe2bd,0xb08f80,0xffc68d,0xe0edff],
    [0xb7d7e8,0xd0f0ff,0xb6d7e7,0xdbf6ff,0x87aeca,0xffc68d,0xe0edff],
    [0xada5a4,0x74656a,0x475975,0xdfe9ff,0x8c6559,0xffcaa1,0xb5d1ff],
    [0xb3bbb0,0xa6b4a2,0x94a79b,0xdceae5,0x8a8571,0xffdeb0,0xc9dcd6],
    [0xacb8bd,0xa6b1b9,0x758592,0xc5d9e8,0x677780,0xffcd9e,0xc5d9e8],
    [0xd3bca9,0xd4b397,0xc29085,0xffe5bf,0x988085,0xffbd83,0xd5c4d2],
    [0xc19d8c,0xb68d77,0xb89687,0xffe1c6,0x996e62,0xffcf9d,0xd8c3bc],
    [0xa3a3b3,0x9b90a2,0x645f76,0xd5d1e5,0x856d77,0xf5c1a8,0xbec8e0],
  ];
  function setStage(index) {
    if(!stageGroups[index]) {
      const group=new THREE.Group();
      if(index<3){
        group.add(xzPlane(180,290,index===0 ? -6.2 : -4.2,-78,index===0 ? riverMaterial(waterTime) : stageSurface(index,waterTime)),
          index===0 ? terrain() : mountainPass(index===1),index===0 ? fortress() : stageCitadel(index===1));
      }else{
        group.add(chapterLand(index,{Assembly,randomFrom,cliffFinish,masonryFinish,torchGlow}));
        if(index===4) group.add(stormSea(waterTime),stormRain(waterTime));
        else{
          const water=riverMaterial(waterTime);
          const color=index===5 ? 0x925f65 : index===6 ? 0x78493e : index===7 ? 0x38384e : 0x435d52;
          water.uniforms.blue.value.setHex(color);
          water.uniforms.deep.value.setHex(color).multiplyScalar(.53);
          group.add(xzPlane(180,290,-3.6,-78,water));
        }
      }
      stageGroups[index]=group;
      set.add(group);
    }
    stageGroups.forEach((group,i)=>{group.visible=i===index;});
    const [deckTint,railTint,fog,fillTint,ground,sunTint,sky]=chapterColors[index];
    deck.material=index===2 ? foundryFloor : index===4 ? wetFloor : floor;
    floor.color.setHex(deckTint);
    rails.color.setHex(railTint);
    scene.fog.color.setHex(fog);
    scene.fog.near=index===2 ? 58 : index===4 ? 32 : 46;
    scene.fog.far=index===4 ? 114 : 175;
    fill.color.setHex(fillTint);
    sun.color.setHex(sunTint);
    sun.intensity=index===4 ? 2.0 : 2.4;
    skyLight.color.setHex(sky);
    skyLight.groundColor.setHex(ground);
    scene.background=index===4 ? harborSky : originalSky;
    scene.backgroundIntensity=index===4 && harborSky===originalSky ? .53 : index===7 ? .62 : 1;
  }
  function update(time,distance) {
    waterTime.value=time;
    const travel = distance * .106;
    flooring.offset.y = travel % 1;
    roadTravel.value = travel - flooring.offset.y;
    const length=spans.length*8, cycle=((distance%length)+length)%length;
    for(let i=0;i<spans.length;i++) spans[i].position.z=16-((i*8+length-cycle)%length);
  }
  setStage(0);
  update(0,0);
  return {setStage,update};
}
