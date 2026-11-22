import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function roundedPath(width: number, height: number, radius: number) {
  const path = new THREE.Shape();
  const x = -width / 2, y = -height / 2;
  path.moveTo(x + radius, y);
  path.lineTo(x + width - radius, y); path.quadraticCurveTo(x + width, y, x + width, y + radius);
  path.lineTo(x + width, y + height - radius); path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  path.lineTo(x + radius, y + height); path.quadraticCurveTo(x, y + height, x, y + height - radius);
  path.lineTo(x, y + radius); path.quadraticCurveTo(x, y, x + radius, y);
  return path;
}

export function ring(width: number, height: number, innerW: number, innerH: number, depth: number, radius: number, material: THREE.Material) {
  const shape = roundedPath(width, height, radius);
  shape.holes.push(roundedPath(innerW, innerH, .035));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .005, bevelThickness: .004, curveSegments: 5 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true; mesh.castShadow = true;
  return mesh;
}

export function block(parent: THREE.Object3D, size: [number, number, number], pos: [number, number, number], material: THREE.Material, radius = .008) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, radius), material);
  mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}

export function cylinder(parent: THREE.Object3D, rt: number, rb: number, height: number, pos: [number, number, number], material: THREE.Material, segments = 20) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, height, segments), material);
  mesh.position.set(...pos); mesh.castShadow = true; parent.add(mesh); return mesh;
}

/** Dispose model-local resources without destroying a shared material/texture kit. */
export function disposeModel(root: THREE.Object3D, shared: object) {
  const protectedResources = new Set(Object.values(shared));
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (protectedResources.has(material)) continue;
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof THREE.Texture && !protectedResources.has(value)) textures.add(value);
    }
  });
  geometries.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose());
}
