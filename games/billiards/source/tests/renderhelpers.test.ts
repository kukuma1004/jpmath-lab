import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { POOL_TABLE, getPocketGeometry, getRailSegments } from '../src/physics/pool';
import { createPoolTable } from '../src/render/PoolTableFactory';
import { disposeModel } from '../src/render/Geometry';
import type { MaterialKit } from '../src/render/MaterialKit';

function materialStub() {
  const material = new THREE.MeshStandardMaterial();
  return { walnut: material, darkWood: material, darkBrass: material, brass: material,
    cloth: material, cushion: material, ivory: material, rubber: material } as unknown as MaterialKit;
}

describe('rendered pool geometry agrees with physical contacts', () => {
  it('has a real six-hole cloth mesh and one visual face for every physical jaw/rail', () => {
    // Only the badge uses a browser canvas; supply a minimal canvas for this geometry test.
    const original = globalThis.document;
    (globalThis as unknown as { document: unknown }).document = { createElement: () => ({ width: 0, height: 0,
      getContext: () => ({ clearRect() {}, fillText() {}, fillStyle: '', textAlign: '', textBaseline: '', font: '' }) }) };
    try {
      const table = createPoolTable(POOL_TABLE, materialStub());
      const cloth = table.getObjectByName('cloth-with-six-through-holes') as THREE.Mesh;
      const shape = (cloth.geometry as THREE.ShapeGeometry).parameters.shapes as THREE.Shape;
      expect(shape.holes).toHaveLength(6);
      for (const segment of getRailSegments(POOL_TABLE)) {
        const mesh = table.getObjectByName(`cushion-${segment.id}`) as THREE.Mesh;
        expect(mesh).toBeDefined();
        const p = mesh.geometry.getAttribute('position');
        expect([p.getX(0), p.getZ(0)]).toEqual([expect.closeTo(segment.a.x, 6), expect.closeTo(segment.a.z, 6)]);
        expect([p.getX(1), p.getZ(1)]).toEqual([expect.closeTo(segment.b.x, 6), expect.closeTo(segment.b.z, 6)]);
      }
      for (const g of getPocketGeometry(POOL_TABLE)) {
        expect(table.getObjectByName(`pocket-${g.pocket.id}`)?.position.x).toBe(g.pocket.x);
        expect(table.getObjectByName(`pocket-${g.pocket.id}`)?.position.z).toBe(g.pocket.z);
      }
      table.updateMatrixWorld(true);
      const ray = new THREE.Raycaster();
      for (const g of getPocketGeometry(POOL_TABLE)) {
        // Offset from the hemisphere's degenerate pole/seam vertices.
        ray.set(new THREE.Vector3(g.pocket.x + .003, 1, g.pocket.z + .001), new THREE.Vector3(0, -1, 0));
        const hits = ray.intersectObject(table, true);
        // No top-down ray through the aperture may hit the wooden frame or cloth.
        expect(hits.length).toBeGreaterThan(0);
        expect(hits[0].object.parent?.name).toBe(`pocket-${g.pocket.id}`);
        expect(hits[0].point.y).toBeLessThan(0);
      }
      disposeModel(table, {});
    } finally { (globalThis as unknown as { document: unknown }).document = original; }
  });

  it('disposes model-local resources once and retains the shared material kit', () => {
    const root = new THREE.Group(), shared = new THREE.MeshStandardMaterial(), local = new THREE.MeshStandardMaterial();
    const geometry = new THREE.BoxGeometry(), texture = new THREE.Texture(); local.map = texture;
    root.add(new THREE.Mesh(geometry, shared), new THREE.Mesh(geometry, local));
    const counts = { geometry: 0, shared: 0, local: 0, texture: 0 };
    geometry.addEventListener('dispose', () => counts.geometry++); shared.addEventListener('dispose', () => counts.shared++);
    local.addEventListener('dispose', () => counts.local++); texture.addEventListener('dispose', () => counts.texture++);
    disposeModel(root, { shared });
    expect(counts).toEqual({ geometry: 1, shared: 0, local: 1, texture: 1 });
  });
});
