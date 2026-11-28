import Phaser from 'phaser';
import { CELL, COLS, ROWS, WORLD_H, WORLD_W } from '../config/constants';
import type { MapDef } from '../data/maps';
import { Mat, type Terrain } from '../terrain/terrain';
import { TerrainPainter } from './terrainPainter';

const TILE = 240;
// Surface relief and grass can extend past the edge of the collision mask.
const EDGE_PAD = 32;
const CAMERA_PAD = 128; // Includes the maximum screen shake at wide zoom.
let uid = 0;

type TileView = { tex: Phaser.Textures.CanvasTexture; img: Phaser.GameObjects.Image; painted: boolean };

/** 지형을 조각(타일)으로 나눠 바뀐 조각만 다시 그린다 */
export class TerrainView {
  painter: TerrainPainter;
  private tiles = new Map<number, TileView>();
  private pendingTiles = new Set<number>();
  private cols = Math.ceil(WORLD_W / TILE);
  private rows = Math.ceil(WORLD_H / TILE);
  private left = 0;
  private right = this.cols - 1;
  private top = 0;
  private bottom = this.rows - 1;
  private img: ImageData;
  private id = ++uid;
  private bridgeRails: Phaser.GameObjects.Graphics | null = null;

  constructor(private scene: Phaser.Scene, private layer: Phaser.GameObjects.Layer, public terrain: Terrain, def: MapDef, seed: number) {
    this.painter = new TerrainPainter(terrain, def, seed);
    this.img = new ImageData(TILE, TILE);
    for (let i = 0; i < this.cols * this.rows; i++) this.drawTile(i);
    if(def.id==='bridge'){
      this.bridgeRails=scene.add.graphics().setDepth(9);layer.add(this.bridgeRails);this.drawBridgeRails();
    }
    terrain.dirty.length = 0;
  }

  /** 난간은 목재 발판이 남은 곳에만 붙인다. 끊긴 다리 위에 장식이 떠 있지 않게 한다. */
  private drawBridgeRails():void {
    const g=this.bridgeRails;if(!g)return;g.clear();
    const t=this.terrain;
    const yAt=(x:number)=>600+90*Math.sin((x-320)/1760*Math.PI);
    const supported = (x: number) => t.matAt(x, yAt(x)) === Mat.Wood;
    const anchors = [332];
    for (let x = 404; x < 2068; x += 72) anchors.push(x);
    anchors.push(2068);
    for (const [index, anchor] of anchors.entries()) {
      const end = anchors[index + 1];
      if (supported(anchor)) {
        const y = yAt(anchor);
        const pier = index === 0 || index === anchors.length - 1;
        const width = pier ? 18 : 5;
        if (pier) {
          g.lineStyle(7, 0x412a31); g.lineBetween(anchor - 15, y - 9, anchor, y - 32);
          g.fillStyle(0x4c332d); g.fillEllipse(anchor, y - 49, width + 6, 9);
          g.fillStyle(0xe2ad6b); g.fillEllipse(anchor - 1, y - 51, width, 5);
        }
        g.lineStyle(width + 2, 0x442a2b); g.lineBetween(anchor, y - 6, anchor, y - 47);
        g.lineStyle(width * .55, 0xbc8548); g.lineBetween(anchor - 1, y - 7, anchor - 1, y - 47);
        for (const height of [33, 37, 41]) {
          g.lineStyle(3, 0xe2ad66); g.lineBetween(anchor - width / 2, y - height, anchor + width / 2, y - height + 2);
        }
      }
      if (end === undefined || !supported(anchor) || !supported(end)) continue;
      let continuous = true;
      for (let x = anchor; x <= end; x += CELL) {
        if (!supported(x)) { continuous = false; break; }
      }
      if (!continuous) continue;
      const ropeY = (x: number) => yAt(x) - 40 + 4 * Math.sin((x - anchor) / (end - anchor) * Math.PI);
      for (let x = anchor; x < end; x += 6) {
        const next = Math.min(end, x + 6), y = ropeY(x), ny = ropeY(next);
        g.lineStyle(5, 0x4b302c); g.lineBetween(x, y, next, ny);
        g.lineStyle(3, 0xd8a265); g.lineBetween(x, y - 1.4, next, ny - 1.4);
        g.lineStyle(1.5, 0xffdb91); g.lineBetween(x + 1, y - 2.5, Math.min(next, x + 3), y - 1);
      }
    }
  }

  private hasTerrainNear(x: number, y: number): boolean {
    const x0 = Math.max(0, (x - EDGE_PAD) / CELL), x1 = Math.min(COLS, (x + TILE + EDGE_PAD) / CELL);
    const y0 = Math.max(0, (y - EDGE_PAD) / CELL), y1 = Math.min(ROWS, (y + TILE + EDGE_PAD) / CELL);
    const cells = this.terrain.cells;
    for (let cy = y0; cy < y1; cy++) {
      const row = cy * COLS;
      for (let cx = x0; cx < x1; cx++) if (cells[row + cx]) return true;
    }
    return false;
  }

  private drawTile(i: number): void {
    const x = (i % this.cols) * TILE, y = Math.floor(i / this.cols) * TILE;
    let tile = this.tiles.get(i);
    if (!this.hasTerrainNear(x, y)) {
      if (tile) {
        tile.painted = false;
        tile.img.setVisible(false);
      }
      return;
    }
    if (!tile) {
      const key = `terrain_${this.id}_${i}`;
      const tex = this.scene.textures.createCanvas(key, TILE, TILE)!;
      const img = this.scene.add.image(x, y, key).setOrigin(0, 0).setDepth(10);
      this.layer.add(img);
      tile = {tex, img, painted: false};
      this.tiles.set(i, tile);
    }
    this.painter.paint(this.img, x, y);
    tile.tex.context.putImageData(this.img, 0, 0);
    this.painter.dressSurface(tile.tex.context, x, y, TILE);
    tile.tex.refresh();
    tile.painted = true;
    tile.img.setVisible(this.inView(i));
  }

  private inView(i: number): boolean {
    const x = i % this.cols, y = Math.floor(i / this.cols);
    return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
  }

  setView(x0: number, y0: number, x1: number, y1: number): void {
    const left = Math.max(0, Math.floor((x0 - CAMERA_PAD) / TILE));
    const right = Math.min(this.cols - 1, Math.floor((x1 + CAMERA_PAD) / TILE));
    const top = Math.max(0, Math.floor((y0 - CAMERA_PAD) / TILE));
    const bottom = Math.min(this.rows - 1, Math.floor((y1 + CAMERA_PAD) / TILE));
    if (left === this.left && right === this.right && top === this.top && bottom === this.bottom) return;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    for (const [i, tile] of this.tiles) tile.img.setVisible(tile.painted && this.inView(i));
  }

  /** 바뀐 영역만 다시 그린다(한 프레임에 너무 많으면 다음 프레임으로 미룬다) */
  flush(maxTiles = 10, budgetMs = Infinity): void {
    const d = this.terrain.dirty;
    if (!d.length && !this.pendingTiles.size) return;
    const deadline = performance.now() + budgetMs;
    const want = this.pendingTiles;
    let railsChanged = false;
    for (const r of d) {
      const x0 = Math.floor((r.x0 * CELL - EDGE_PAD) / TILE), x1 = Math.floor(((r.x1 + 1) * CELL + EDGE_PAD) / TILE);
      const y0 = Math.floor((r.y0 * CELL - EDGE_PAD) / TILE), y1 = Math.floor(((r.y1 + 1) * CELL + EDGE_PAD) / TILE);
      if (this.bridgeRails && r.x0 * CELL <= 2068 && (r.x1 + 1) * CELL >= 332 &&
          r.y0 * CELL <= 690 && (r.y1 + 1) * CELL >= 600) railsChanged = true;
      for (let ty = Math.max(0, y0); ty <= Math.min(this.rows - 1, y1); ty++)
        for (let tx = Math.max(0, x0); tx <= Math.min(this.cols - 1, x1); tx++) want.add(ty * this.cols + tx);
    }
    d.length = 0;
    let n = 0;
    for (const i of want) {
      if (n >= maxTiles || (n > 0 && performance.now() >= deadline)) break;
      this.drawTile(i);
      want.delete(i);
      n++;
    }
    if (railsChanged) this.drawBridgeRails();
  }

  destroy(): void {
    this.bridgeRails?.destroy();
    for (const t of this.tiles.values()) {
      t.img.destroy();
      this.scene.textures.remove(t.tex.key);
    }
    this.tiles.clear();
  }
}
