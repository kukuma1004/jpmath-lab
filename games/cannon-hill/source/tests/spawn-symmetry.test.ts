import {describe,expect,it} from 'vitest';
import {MAPS,generateTerrain,findSpawnPoints,mapDef,spotScore} from '../src/game/data/maps';
import {CELL,CHAR_CENTER_Y,COLS,ROWS,WORLD_W} from '../src/game/config/constants';
import {Mat} from '../src/game/terrain/terrain';
import {Rng} from '../src/game/utils/rng';

describe('모든 전장의 무작위 대칭 시작',()=>{
  it.each(MAPS.map(m=>[m.id]))('%s: 여러 지형·배치 시드에서 1:1과 2:2의 조건이 같다',(id)=>{
    const def=MAPS.find(m=>m.id===id)!;
    for(const terrainSeed of [1,2,3,17,42,71,313,982451]){
      const t=generateTerrain(def,terrainSeed);
      let asymmetric=-1;
      for(let y=0;y<ROWS&&asymmetric<0;y++)for(let x=0;x<COLS/2;x++){
        if(t.cells[y*COLS+x]!==t.cells[y*COLS+COLS-1-x]){asymmetric=y*COLS+x;break;}
      }
      expect(asymmetric,`${id}/${terrainSeed}: 발판 재질·두께·지지점`).toBe(-1);
      for(let seed=0;seed<24;seed++)for(const count of [2,4] as const){
        const points=findSpawnPoints(t,def,new Rng(seed),count);
        expect(points).toHaveLength(count);
        expect(points).toEqual(findSpawnPoints(t,def,new Rng(seed),count));
        for(let i=0;i<count;i+=2){
          const a=points[i]!,b=points[i+1]!;
          expect(a.x+b.x).toBe(WORLD_W);expect(a.y).toBe(b.y);
          for(const p of [a,b]){expect(p.y).toBe(t.topSurface(p.x));expect(spotScore(t,p.x,p.y)).toBeGreaterThanOrEqual(0);}
        }
        if(count===4){
          expect((points[0]!.x-WORLD_W/2)*(points[2]!.x-WORLD_W/2)).toBeGreaterThan(0);
          expect(Math.abs(points[0]!.x-points[2]!.x)).toBeGreaterThanOrEqual(160);
          expect(Math.abs(points[0]!.x-points[2]!.x)).toBe(Math.abs(points[1]!.x-points[3]!.x));
        }
      }
    }
  });
});

it('솔바람 들판은 연속된 흙바닥과 열린 출발 사선을 갖는다',()=>{
  const def=mapDef('meadow');
  for(const seed of [1,17,313,982451]){
    const terrain=generateTerrain(def,seed);
    let high=Infinity,low=-Infinity;
    for(let cx=0;cx<COLS;cx++){
      const x=(cx+.5)*CELL, surface=terrain.topSurface(x);
      high=Math.min(high,surface);
      low=Math.max(low,surface);
      for(let cy=surface/CELL;cy<ROWS;cy++){
        const mat=terrain.get(cx,cy);
        if(mat!==Mat.Dirt && mat!==Mat.Bedrock) throw Error(`끊어진 흙바닥 ${seed}·${cx}·${cy}`);
      }
    }
    expect(low-high).toBeGreaterThanOrEqual(65);
    expect(low-high).toBeLessThan(85);
    for(let sample=0;sample<12;sample++){
      const sites=findSpawnPoints(terrain,def,new Rng(sample),4).sort((a,b)=>a.x-b.x);
      for(const [i,left] of sites.entries())for(const right of sites.slice(i+1)){
        for(let x=left.x;x<=right.x;x+=CELL){
          const u=(x-left.x)/(right.x-left.x);
          const y=left.y+(right.y-left.y)*u-CHAR_CENTER_Y;
          if(terrain.solidAt(x,y))throw Error(`시작 사선 차단 ${seed}·${sample}·${x}`);
        }
      }
    }
  }
});
