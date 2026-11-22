import * as THREE from 'three';
import type { TableConfig } from '../physics/types';
import { getRailSegments } from '../physics/pool';
import type { RailSegment } from '../physics/pool';
import { MaterialKit, labelTexture } from './MaterialKit';
import { block, cylinder, ring, roundedPath } from './Geometry';

/** Union of the bed opening and pocket holes, sampled once for the wooden cap cutout.
 * One continuous hole avoids overlapping Shape holes, which triangulate unreliably.
 */
function openingContour(table: TableConfig, innerW: number, innerH: number) {
  const path = new THREE.Path();
  for (let i = 0; i <= 720; i++) {
    const angle = i / 720 * Math.PI * 2;
    const dx = Math.cos(angle), dz = Math.sin(angle);
    let radius = Math.min(innerW / 2 / Math.max(1e-10, Math.abs(dx)), innerH / 2 / Math.max(1e-10, Math.abs(dz)));
    for (const pocket of table.pockets ?? []) {
      const projection = pocket.x * dx + pocket.z * dz;
      const r = pocket.radius + .009;
      const discriminant = projection * projection - (pocket.x * pocket.x + pocket.z * pocket.z - r * r);
      if (discriminant < 0) continue;
      const root = Math.sqrt(discriminant);
      // Keep the complete pocket well open through every frame layer. The lower
      // chassis aperture is narrower than the bed; connecting the circular well
      // to that opening prevents wood plates from showing beneath the pocket.
      radius = Math.max(radius, projection + root);
    }
    if (i === 0) path.moveTo(dx * radius, dz * radius); else path.lineTo(dx * radius, dz * radius);
  }
  path.closePath(); return path;
}

function pocketedCap(table: TableConfig, mats: MaterialKit) {
  const shape = roundedPath(table.width + .43, table.height + .43, .115);
  shape.holes.push(openingContour(table, table.width + .11, table.height + .11));
  const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: .065, bevelEnabled: false, steps: 1, curveSegments: 5 }), mats.walnut);
  mesh.rotation.x = -Math.PI / 2; mesh.position.y = .002; mesh.receiveShadow = true; mesh.castShadow = true;
  mesh.name = 'wood-cap-with-six-openings'; return mesh;
}

function pocketedFrame(table: TableConfig, width: number, height: number, innerW: number, innerH: number, depth: number, material: THREE.Material) {
  const shape = roundedPath(width, height, .11);
  shape.holes.push(openingContour(table, innerW, innerH));
  const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, steps: 1, curveSegments: 5 }), material);
  mesh.rotation.x = -Math.PI / 2; mesh.receiveShadow = true; mesh.castShadow = true;
  return mesh;
}

function cushion(segment: RailSegment, table: TableConfig, material: THREE.Material) {
  const width = segment.kind === 'jaw' ? .048 : .066;
  const out = { x: -segment.normal.x * width, z: -segment.normal.z * width };
  const { a, b } = segment;
  const vertices = new Float32Array([
    a.x, .002, a.z, b.x, .002, b.z,
    b.x, table.ballRadius, b.z, a.x, table.ballRadius, a.z,
    a.x + out.x, .007, a.z + out.z, b.x + out.x, .007, b.z + out.z,
    b.x + out.x, .068, b.z + out.z, a.x + out.x, .068, a.z + out.z,
  ]);
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1]), 2));
  const indices = [0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7, 3, 7, 6, 3, 6, 2, 0, 1, 5, 0, 5, 4, 0, 4, 7, 0, 7, 3, 1, 2, 6, 1, 6, 5];
  if ((b.x - a.x) * segment.normal.z - (b.z - a.z) * segment.normal.x > 0) {
    for (let i = 0; i < indices.length; i += 3) [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
  }
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material); mesh.name = `cushion-${segment.id}`;
  mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.userData.physicsSegment = segment; return mesh;
}

export function createPoolTable(table: TableConfig, mats: MaterialKit) {
  const root = new THREE.Group(); root.name = 'six-pocket-pool-table';
  const w = table.width, h = table.height;
  const chassis = pocketedFrame(table, w + .38, h + .38, w - .05, h - .05, .19, mats.darkWood);
  chassis.position.y = -.22; root.add(chassis);
  const apron = pocketedFrame(table, w + .42, h + .42, w + .04, h + .04, .13, mats.walnut);
  apron.position.y = -.145; root.add(apron);
  const lowerTrim = ring(w + .43, h + .43, w + .39, h + .39, .008, .11, mats.darkBrass);
  lowerTrim.position.y = -.143; root.add(lowerTrim);
  const upperTrim = ring(w + .44, h + .44, w + .40, h + .40, .008, .11, mats.brass);
  upperTrim.position.y = -.008; root.add(upperTrim);
  root.add(pocketedCap(table, mats));

  // Cloth extends under the rails, with six real circular apertures cut through it.
  // Pockets are at shared physical centers, rather than black decals over a solid plane.
  const bedShape = roundedPath(w + .25, h + .25, .025);
  for (const pocket of table.pockets ?? []) {
    const hole = new THREE.Path(); hole.absarc(pocket.x, -pocket.z, pocket.radius, 0, Math.PI * 2, true); bedShape.holes.push(hole);
  }
  const bed = new THREE.Mesh(new THREE.ShapeGeometry(bedShape, 20), mats.cloth);
  bed.name = 'cloth-with-six-through-holes'; bed.rotation.x = -Math.PI / 2; bed.receiveShadow = true; root.add(bed);
  const segments = getRailSegments(table);
  segments.forEach(segment => root.add(cushion(segment, table, mats.cushion)));
  root.userData.railSegments = segments;

  const pocketLeather = new THREE.MeshStandardMaterial({ color: 0x1a1714, roughness: .85, side: THREE.DoubleSide });
  const pocketInterior = new THREE.MeshStandardMaterial({ color: 0x090d0e, roughness: .98, side: THREE.BackSide });
  const bagMaterial = new THREE.MeshStandardMaterial({ color: 0x151715, roughness: 1, side: THREE.DoubleSide });
  for (const pocket of table.pockets ?? []) {
    const group = new THREE.Group(); group.name = `pocket-${pocket.id}`; group.position.set(pocket.x, 0, pocket.z);
    const lip = new THREE.Mesh(new THREE.RingGeometry(pocket.radius, pocket.radius + .012, 40), pocketLeather);
    lip.rotation.x = -Math.PI / 2; lip.position.y = .069; group.add(lip);
    const interior = new THREE.Mesh(new THREE.CylinderGeometry(pocket.radius, pocket.radius * .83, .21, 28, 1, true), pocketInterior);
    interior.position.y = -.052; group.add(interior);
    const bag = new THREE.Mesh(new THREE.SphereGeometry(pocket.radius * .87, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), bagMaterial);
    bag.scale.y = 1.7; bag.position.y = -.14; group.add(bag);
    root.add(group);
  }

  const diamonds = new THREE.InstancedMesh(new THREE.BoxGeometry(.012, .0018, .012), mats.ivory, 18);
  diamonds.name = 'ivory-pool-diamond-sights'; const dummy = new THREE.Object3D(); let n = 0;
  for (const sign of [-1, 1]) {
    for (const i of [1, 2, 3, 5, 6, 7]) {
      dummy.position.set(-w / 2 + w * i / 8, .073, sign * (h / 2 + .139));
      dummy.rotation.set(0, Math.PI / 4, 0); dummy.updateMatrix(); diamonds.setMatrixAt(n++, dummy.matrix);
    }
    for (let i = 1; i < 4; i++) {
      dummy.position.set(sign * (w / 2 + .139), .073, -h / 2 + h * i / 4);
      dummy.rotation.set(0, Math.PI / 4, 0); dummy.updateMatrix(); diamonds.setMatrixAt(n++, dummy.matrix);
    }
  }
  root.add(diamonds);
  const spotMaterial = new THREE.MeshBasicMaterial({ color: 0xa3b9bd, transparent: true, opacity: .42, depthWrite: false });
  for (const sign of [-1, 1]) {
    const spot = new THREE.Mesh(new THREE.RingGeometry(.003, .005, 12), spotMaterial);
    spot.rotation.x = -Math.PI / 2; spot.position.set(sign * w / 4, .001, 0); root.add(spot);
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = block(root, [.2, .51, .22], [sx * (w / 2 - .31), -.49, sz * (h / 2 - .15)], mats.darkWood, .025);
    leg.rotation.z = sx * -.065;
    block(root, [.21, .055, .235], [sx * (w / 2 - .29), -.74, sz * (h / 2 - .15)], mats.darkBrass, .012);
    cylinder(root, .087, .095, .025, [sx * (w / 2 - .29), -.78, sz * (h / 2 - .15)], mats.rubber);
  }
  block(root, [w - .55, .13, .13], [0, -.49, 0], mats.darkWood, .01);
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(.4, .1), new THREE.MeshBasicMaterial({ map: labelTexture('JP • BILLIARDS'), transparent: true, depthWrite: false }));
  badge.position.set(-.45, -.07, h / 2 + .219); root.add(badge);
  return root;
}
