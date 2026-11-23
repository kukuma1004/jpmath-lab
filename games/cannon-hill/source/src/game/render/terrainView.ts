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
    for(let x=332;x<2070;x+=6){
      const y=yAt(x),ny=yAt(x+6);
      if(t.matAt(x,y)!==Mat.Wood||t.matAt(x+6,ny)!==Mat.Wood)continue;
      const sag=4*Math.sin(((x-332)%72)/72*Math.PI);
      g.lineStyle(5,0x382833,0.9);g.lineBetween(x,y-40+sag,x+6,ny-40+sag);
      g.lineStyle(2.5,0xd9b977,1);g.lineBetween(x,y-41+sag,x+6,ny-41+sag);
      if((x-332)%72===0){
        g.lineStyle(6,0x443038,1);g.lineBetween(x,y-9,x,y-47);
        g.lineStyle(3,0xb58a51,1);g.lineBetween(x-1,y-10,x-1,y-47);
        g.lineStyle(2,0xe5cd98,0.95);g.lineBetween(x-5,y-38,x+4,y-38);g.lineBetween(x-5,y-34,x+4,y-34);
        g.lineStyle(1.5,0x9b7b58,0.85);g.lineBetween(x,y-36,x+30,yAt(x+30)-9);
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
    this.drawBridgeRails();
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
