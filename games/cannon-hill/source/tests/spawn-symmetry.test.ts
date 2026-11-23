import {describe,expect,it} from 'vitest';
import {MAPS,generateTerrain,findSpawnPoints,spotScore} from '../src/game/data/maps';
import {COLS,ROWS,WORLD_W} from '../src/game/config/constants';
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
