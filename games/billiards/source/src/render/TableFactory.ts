import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { TableConfig } from '../physics/types';
import { MaterialKit, labelTexture } from './MaterialKit';

function roundedPath(width: number, height: number, radius: number) {
  const path = new THREE.Shape();
  const x = -width / 2, y = -height / 2;
  path.moveTo(x + radius, y);
  path.lineTo(x + width - radius, y); path.quadraticCurveTo(x + width, y, x + width, y + radius);
  path.lineTo(x + width, y + height - radius); path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  path.lineTo(x + radius, y + height); path.quadraticCurveTo(x, y + height, x, y + height - radius);
  path.lineTo(x, y + radius); path.quadraticCurveTo(x, y, x + radius, y);
  return path;
}

function ring(width: number, height: number, innerW: number, innerH: number, depth: number, radius: number, material: THREE.Material) {
  const shape = roundedPath(width, height, radius);
  const hole = roundedPath(innerW, innerH, .035);
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .005, bevelThickness: .004, curveSegments: 5 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true; mesh.castShadow = true;
  return mesh;
}

function block(parent: THREE.Object3D, size: [number, number, number], pos: [number, number, number], material: THREE.Material, radius = .008) {
  const geo = new RoundedBoxGeometry(...size, 2, radius);
  const mesh = new THREE.Mesh(geo, material); mesh.position.set(...pos);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
  return mesh;
}

function cylinder(parent: THREE.Object3D, rt: number, rb: number, height: number, pos: [number, number, number], material: THREE.Material, segments = 20) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, height, segments), material);
  mesh.position.set(...pos); mesh.castShadow = true; parent.add(mesh); return mesh;
}

export function createTable(table: TableConfig, mats: MaterialKit) {
  const root = new THREE.Group(); root.name = 'carom-table';
  const w = table.width, h = table.height;
  const chassis = ring(w + .38, h + .38, w - .05, h - .05, .19, .11, mats.darkWood);
  chassis.position.y = -.22; root.add(chassis);
  const apron = ring(w + .42, h + .42, w + .04, h + .04, .13, .11, mats.walnut);
  apron.position.y = -.145; root.add(apron);
  const lowerTrim = ring(w + .43, h + .43, w + .39, h + .39, .008, .11, mats.darkBrass);
  lowerTrim.position.y = -.143; root.add(lowerTrim);
  const upperTrim = ring(w + .44, h + .44, w + .40, h + .40, .008, .11, mats.brass);
  upperTrim.position.y = -.008; root.add(upperTrim);
  const cap = ring(w + .43, h + .43, w + .11, h + .11, .065, .115, mats.walnut);
  cap.position.y = .002; root.add(cap);

  const bed = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mats.cloth);
  bed.name = 'cloth'; bed.rotation.x = -Math.PI / 2; bed.receiveShadow = true; root.add(bed);
  // The inner nose lies exactly on the physical rail plane. Wedge cloth rises outwards.
  const cushionSection = new THREE.Shape();
  cushionSection.moveTo(0, .029); cushionSection.lineTo(.058, .070); cushionSection.lineTo(.069, .009); cushionSection.lineTo(.005, .003); cushionSection.closePath();
  const cushionGeo = new THREE.ExtrudeGeometry(cushionSection, { depth: w, bevelEnabled: false, curveSegments: 1 });
  for (const zSign of [-1, 1]) {
    const cushion = new THREE.Mesh(cushionGeo, mats.cushion);
    // Local x is outward from the nose, local z runs along rail length.
    cushion.rotation.y = zSign > 0 ? -Math.PI / 2 : Math.PI / 2;
    cushion.position.set(zSign > 0 ? w / 2 : -w / 2, 0, zSign * h / 2);
    cushion.castShadow = true; cushion.receiveShadow = true; root.add(cushion);
  }
  const shortGeo = new THREE.ExtrudeGeometry(cushionSection, { depth: h, bevelEnabled: false, curveSegments: 1 });
  for (const sign of [-1, 1]) {
    const cushion = new THREE.Mesh(shortGeo, mats.cushion);
    cushion.rotation.y = sign > 0 ? 0 : Math.PI;
    cushion.position.set(sign * w / 2, 0, sign > 0 ? -h / 2 : h / 2);
    cushion.castShadow = true; cushion.receiveShadow = true; root.add(cushion);
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    block(root, [.065, .061, .065], [sx * (w / 2 + .034), .035, sz * (h / 2 + .034)], mats.cushion, .007);
  }

  const diamondGeo = new THREE.BoxGeometry(.012, .0018, .012);
  const diamondCount = 22;
  const diamonds = new THREE.InstancedMesh(diamondGeo, mats.ivory, diamondCount);
  diamonds.name = 'ivory-diamond-sights';
  const dummy = new THREE.Object3D(); let n = 0;
  for (const sign of [-1, 1]) {
    for (let i = 1; i < 8; i++) {
      dummy.position.set(-w / 2 + w * i / 8, .073, sign * (h / 2 + .135));
      dummy.rotation.set(0, Math.PI / 4, 0); dummy.updateMatrix(); diamonds.setMatrixAt(n++, dummy.matrix);
    }
    for (let i = 1; i < 5; i++) {
      dummy.position.set(sign * (w / 2 + .135), .073, -h / 2 + h * i / 5);
      dummy.rotation.set(0, Math.PI / 4, 0); dummy.updateMatrix(); diamonds.setMatrixAt(n++, dummy.matrix);
    }
  }
  root.add(diamonds);

  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = block(root, [.2, .51, .22], [sx * (w / 2 - .31), -.49, sz * (h / 2 - .15)], mats.darkWood, .025);
    leg.rotation.z = sx * -.065;
    block(root, [.21, .055, .235], [sx * (w / 2 - .29), -.74, sz * (h / 2 - .15)], mats.darkBrass, .012);
    cylinder(root, .087, .095, .025, [sx * (w / 2 - .29), -.78, sz * (h / 2 - .15)], mats.rubber);
  }
  block(root, [w - .55, .13, .13], [0, -.49, 0], mats.darkWood, .01);
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(.4, .1), new THREE.MeshBasicMaterial({ map: labelTexture('JP • BILLIARDS'), transparent: true, depthWrite: false }));
  badge.position.set(0, -.07, h / 2 + .219); root.add(badge);
  // Two blue chalk cubes in a brass tray, entirely outside the playing surface.
  block(root, [.09, .007, .055], [-w / 2 + .12, .074, h / 2 + .14], mats.darkBrass, .003);
  const chalk = new THREE.MeshStandardMaterial({ color: 0x5b9ebc, roughness: .96 });
  block(root, [.024, .021, .024], [-w / 2 + .106, .087, h / 2 + .14], chalk, .002);
  block(root, [.024, .021, .024], [-w / 2 + .138, .087, h / 2 + .14], chalk, .002);
  return root;
}

export function createRoom(mats: MaterialKit) {
  const room = new THREE.Group(); room.name = 'quiet-billiards-club';
  const dummy = new THREE.Object3D();
  const floorGeo = new THREE.BoxGeometry(.31, .018, 2.14);
  const floor = new THREE.InstancedMesh(floorGeo, mats.floor, 112);
  const tint = new THREE.Color(); let index = 0;
  let column = 0;
  for (let x = -4; x < 4; x += .312, column++) for (let z = -4; z < 4; z += 2.142) {
    dummy.position.set(x, -.815, z + ((column % 2) ? 1.071 : 0));
    dummy.rotation.y = 0; dummy.updateMatrix(); floor.setMatrixAt(index, dummy.matrix);
    tint.setHSL(.082 + (index % 5) * .003, .1, .42 + (index % 4) * .028); floor.setColorAt(index++, tint);
  }
  floor.count = index; floor.receiveShadow = true; room.add(floor);
  // A restrained club wall, rail and panel seams provide scale in the cue view.
  block(room, [8, 3, .12], [0, .6, -3.15], mats.wall, .002);
  block(room, [8, .035, .08], [0, -.02, -3.05], mats.darkBrass, .003);
  block(room, [8, .1, .1], [0, -.73, -3.04], mats.darkWood, .005);
  for (let x = -3.5; x <= 3.5; x += .7) {
    block(room, [.025, .59, .035], [x, -.39, -3.06], mats.darkWood, .003);
  }
  for (const sx of [-1, 1]) {
    const chair = new THREE.Group(); chair.position.set(sx * 2.3, -.79, -.35); chair.rotation.y = sx * -.17;
    block(chair, [.5, .09, .47], [0, .43, 0], mats.leather, .04);
    block(chair, [.49, .45, .09], [0, .69, -.21], mats.leather, .035);
    for (const x of [-.19, .19]) for (const z of [-.17, .17]) cylinder(chair, .018, .014, .4, [x, .2, z], mats.darkWood, 10);
    room.add(chair);
    const sideTable = new THREE.Group(); sideTable.position.set(sx * 2.3, -.79, .65);
    cylinder(sideTable, .23, .23, .035, [0, .59, 0], mats.walnut, 32);
    cylinder(sideTable, .026, .04, .56, [0, .3, 0], mats.darkBrass);
    cylinder(sideTable, .18, .19, .025, [0, .025, 0], mats.darkBrass);
    room.add(sideTable);
  }
  const rack = new THREE.Group(); rack.position.set(-2.3, -.3, -2.95);
  block(rack, [1.08, .08, .14], [0, -.36, 0], mats.walnut, .01);
  block(rack, [1.08, .04, .12], [0, .66, 0], mats.walnut, .01);
  for (let i = 0; i < 5; i++) cylinder(rack, .006, .012, 1.35, [-.4 + i * .2, .21, .025], i % 2 ? mats.ivory : mats.walnut, 8);
  room.add(rack);
  const wallSign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .4), new THREE.MeshBasicMaterial({ map: labelTexture('THE QUIET CLUB'), transparent: true }));
  wallSign.position.set(.7, .95, -3.078); room.add(wallSign);
  // Practical fixtures sit beyond the playing view, never obstructing top camera.
  for (const x of [-.9, .9]) {
    cylinder(room, .002, .002, .65, [x, 2.25, -1.8], mats.rubber, 8);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.23, .17, 24, 1, true), mats.darkBrass);
    shade.position.set(x, 1.85, -1.8); room.add(shade);
    const underside = new THREE.Mesh(new THREE.CircleGeometry(.21, 24), mats.light);
    underside.rotation.x = Math.PI / 2; underside.position.set(x, 1.769, -1.8); room.add(underside);
  }
  return room;
}

export function createCue(mats: MaterialKit) {
  const cue = new THREE.Group(); cue.name = 'cue';
  const shaft = new THREE.MeshStandardMaterial({ color: 0xc9ab77, roughness: .3, metalness: .0 });
  const whiteFerrule = new THREE.MeshStandardMaterial({ color: 0xf0e3c4, roughness: .24 });
  const blueTip = new THREE.MeshStandardMaterial({ color: 0x63adbc, roughness: .96 });
  function segment(from: number, to: number, frontR: number, backR: number, mat: THREE.Material) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(frontR, backR, to - from, 16), mat);
    mesh.rotation.z = -Math.PI / 2; mesh.position.x = (from + to) / 2;
    mesh.castShadow = true; cue.add(mesh);
  }
  segment(-.006, 0, .0057, .0057, blueTip);
  segment(-.025, -.006, .0057, .0059, whiteFerrule);
  segment(-.66, -.025, .0059, .0092, shaft);
  segment(-.67, -.66, .0092, .0094, mats.brass);
  segment(-.91, -.67, .0094, .0114, mats.darkWood);
  segment(-1.18, -.91, .0114, .0135, mats.rubber);
  segment(-1.39, -1.18, .0135, .0154, mats.walnut);
  segment(-1.403, -1.39, .0154, .0154, mats.brass);
  segment(-1.425, -1.403, .0155, .016, mats.rubber);
  return cue;
}
