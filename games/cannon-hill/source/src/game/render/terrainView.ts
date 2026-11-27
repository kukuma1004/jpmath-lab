import Phaser from 'phaser';
import { CELL, WORLD_H, WORLD_W } from '../config/constants';
import type { MapDef } from '../data/maps';
import { Mat, type Terrain } from '../terrain/terrain';
import { TerrainPainter } from './terrainPainter';

const TILE = 240;
let uid = 0;

/** 지형을 조각(타일)으로 나눠 바뀐 조각만 다시 그린다 */
export class TerrainView {
  painter: TerrainPainter;
  private tiles: { tex: Phaser.Textures.CanvasTexture; img: Phaser.GameObjects.Image; x: number; y: number }[] = [];
  private pendingTiles = new Set<number>();
  private cols = Math.ceil(WORLD_W / TILE);
  private rows = Math.ceil(WORLD_H / TILE);
  private img: ImageData;
  private id = ++uid;
  private bridgeRails: Phaser.GameObjects.Graphics | null = null;

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

  private drawTile(i: number): void {
    const t = this.tiles[i]!;
    this.painter.paint(this.img, t.x, t.y);
    t.tex.context.putImageData(this.img, 0, 0);
    this.painter.dressSurface(t.tex.context, t.x, t.y, TILE);
    t.tex.refresh();
  }

  /** 바뀐 영역만 다시 그린다(한 프레임에 너무 많으면 다음 프레임으로 미룬다) */
  flush(maxTiles = 10, budgetMs = Infinity): void {
    const d = this.terrain.dirty;
    if (!d.length && !this.pendingTiles.size) return;
    const changed = d.length > 0;
    const deadline = performance.now() + budgetMs;
    const want = this.pendingTiles;
    for (const r of d) {
      const x0 = Math.floor((r.x0 * CELL - 32) / TILE), x1 = Math.floor(((r.x1 + 1) * CELL + 32) / TILE);
      const y0 = Math.floor((r.y0 * CELL - 32) / TILE), y1 = Math.floor(((r.y1 + 1) * CELL + 32) / TILE);
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
    if (changed) this.drawBridgeRails();
  }

  destroy(): void {
    this.bridgeRails?.destroy();
    for (const t of this.tiles) {
      t.img.destroy();
      this.scene.textures.remove(t.tex.key);
    }
    this.tiles = [];
  }
}
