import Phaser from 'phaser';
import { CELL, WORLD_H, WORLD_W } from '../config/constants';
import type { MapDef } from '../data/maps';
import type { Terrain } from '../terrain/terrain';
import { TerrainPainter } from './terrainPainter';

const TILE = 240;
let uid = 0;

/** 지형을 조각(타일)으로 나눠 바뀐 조각만 다시 그린다 */
export class TerrainView {
  painter: TerrainPainter;
  private tiles: { tex: Phaser.Textures.CanvasTexture; img: Phaser.GameObjects.Image; x: number; y: number }[] = [];
  private cols = Math.ceil(WORLD_W / TILE);
  private rows = Math.ceil(WORLD_H / TILE);
  private img: ImageData;
  private id = ++uid;

  constructor(private scene: Phaser.Scene, layer: Phaser.GameObjects.Layer, public terrain: Terrain, def: MapDef, seed: number) {
    this.painter = new TerrainPainter(terrain, def, seed);
    this.img = new ImageData(TILE, TILE);
    for (let ty = 0; ty < this.rows; ty++) {
      for (let tx = 0; tx < this.cols; tx++) {
        const key = `terrain_${this.id}_${tx}_${ty}`;
        const tex = scene.textures.createCanvas(key, TILE, TILE)!;
        const img = scene.add.image(tx * TILE, ty * TILE, key).setOrigin(0, 0).setDepth(10);
        layer.add(img);
        this.tiles.push({ tex, img, x: tx * TILE, y: ty * TILE });
      }
    }
    for (let i = 0; i < this.tiles.length; i++) this.drawTile(i);
    terrain.dirty.length = 0;
  }

  private drawTile(i: number): void {
    const t = this.tiles[i]!;
    this.painter.paint(this.img, t.x, t.y);
    t.tex.context.putImageData(this.img, 0, 0);
    t.tex.refresh();
  }

  /** 바뀐 영역만 다시 그린다(한 프레임에 너무 많으면 다음 프레임으로 미룬다) */
  flush(maxTiles = 10): void {
    const d = this.terrain.dirty;
    if (!d.length) return;
    const want = new Set<number>();
    for (const r of d) {
      const x0 = Math.floor((r.x0 * CELL) / TILE), x1 = Math.floor(((r.x1 + 1) * CELL) / TILE);
      const y0 = Math.floor((r.y0 * CELL) / TILE), y1 = Math.floor(((r.y1 + 1) * CELL) / TILE);
      for (let ty = Math.max(0, y0); ty <= Math.min(this.rows - 1, y1); ty++)
        for (let tx = Math.max(0, x0); tx <= Math.min(this.cols - 1, x1); tx++) want.add(ty * this.cols + tx);
    }
    d.length = 0;
    let n = 0;
    const later: number[] = [];
    for (const i of want) {
      if (n < maxTiles) { this.drawTile(i); n++; }
      else later.push(i);
    }
    // 남은 조각은 다음에 다시 그리도록 영역으로 되돌려 둔다
    for (const i of later) {
      const tx = i % this.cols, ty = Math.floor(i / this.cols);
      d.push({ x0: (tx * TILE) / CELL, y0: (ty * TILE) / CELL, x1: ((tx + 1) * TILE) / CELL - 1, y1: ((ty + 1) * TILE) / CELL - 1 });
    }
  }

  destroy(): void {
    for (const t of this.tiles) {
      t.img.destroy();
      this.scene.textures.remove(t.tex.key);
    }
    this.tiles = [];
  }
}
