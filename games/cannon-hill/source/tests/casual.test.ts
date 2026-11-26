import { describe, expect, it } from 'vitest';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { CHARACTERS } from '../src/game/data/characters';
import { MAPS, findSpawnPoints, generateTerrain, spotScore } from '../src/game/data/maps';
import { DT, MAX_LAUNCH_SPEED, SETTLE_LIMIT } from '../src/game/config/constants';
import { Mat } from '../src/game/terrain/terrain';
import { Rng } from '../src/game/utils/rng';

function flat(char='general',mapId='sanseong') {
  const b=new Battle(defaultConfig({chars:[char,'archer'],mapId}),true);
  for(let cy=450;cy<600;cy++)for(let cx=0;cx<1200;cx++)b.terrain.set(cx,cy,Mat.Bedrock);
  b.fighters[0]!.x=400;b.fighters[1]!.x=600;
  for(const f of b.fighters){f.y=900;f.airPeakY=900;}
  b.current=0;b.phase='AIM';b.timeLeft=30;b.turnNo=1;b.wind=0;
  return b;
}
function until(b:Battle,fn:()=>boolean,max=1800){let n=0;while(n<max&&!fn()){b.step();n++;}expect(fn()).toBe(true);return n*DT;}

describe('탄의 기본 물리는 모든 장수가 같다',()=>{
  const paths=new Map<string,{x:number;y:number}[]>();
  for(const c of CHARACTERS)for(const slot of [0,1] as const){
    it(`${c.name} ${slot+1}번: 같은 각도·힘·바람이면 발사 궤도가 일치한다`,()=>{
      const b=new Battle(defaultConfig({chars:[c.id,'archer']}),true);
      b.current=0;b.phase='AIM';b.timeLeft=30;b.wind=5;
      b.fighters[0]!.x=300;b.fighters[0]!.y=900;
      b.fighters[1]!.x=2300;b.fighters[1]!.y=900;
      b.selectWeapon(slot);b.setAngle(70);b.fireNow(65);
      const vx=Math.cos(70*Math.PI/180)*MAX_LAUNCH_SPEED*0.65;
      const p=b.projectiles.reduce((best,p2)=>Math.abs(p2.vx-vx)<Math.abs(best.vx-vx)?p2:best);
      const samples=[];
      for(let i=0;i<40;i++){b.step();if(i%10===9)samples.push({x:p.x,y:p.y});}
      paths.set(`${c.id}/${slot}`,samples);
      const reference=paths.get('general/0')!;
      for(let i=0;i<samples.length;i++){expect(samples[i]!.x).toBeCloseTo(reference[i]!.x,8);expect(samples[i]!.y).toBeCloseTo(reference[i]!.y,8);}
    });
  }
  it('독술사 항아리와 화포탄은 최대 힘에서 동일한 장거리 탄착점을 가진다',()=>{
    const a=flat('general'),b=flat('alchemist');
    for(const s of [a,b]){s.fighters[0]!.x=160;s.fighters[1]!.x=2390;}
    const pa=a.dryShot(0,0,45,100).impacts[0]!,pb=b.dryShot(0,0,45,100).impacts[0]!;
    expect(pa.x).toBeGreaterThan(2100);expect(pb.x).toBeCloseTo(pa.x,8);expect(pb.y).toBeCloseTo(pa.y,8);
  });
});

describe('빠른 턴 전환과 큰 추락 피해',()=>{
  it('잔여 물체가 없으면 0.55초 안에 다음 조준이 열린다',()=>{
    const b=flat();b.phase='PHYSICS_SETTLING';
    const t=until(b,()=>b.phase==='AIM'&&b.current===1);
    expect(t).toBeLessThan(0.55);
  });
  it('정지 판정이 꼬여도 두 번째 긴 정착 대기 없이 차례를 넘긴다',()=>{
    const b=flat();b.phase='PHYSICS_SETTLING';b.isQuiet=()=>false;
    const t=until(b,()=>b.phase==='AIM'&&b.current===1);
    expect(t).toBeLessThan(SETTLE_LIMIT+0.8);
  });
  it('빠른 정착으로 내려놓더라도 400px 추락 피해가 빠지지 않는다',()=>{
    const b=flat();const f=b.fighters[0]!;f.y=500;f.airPeakY=500;f.onGround=false;
    b.phase='PHYSICS_SETTLING';b.settleT=SETTLE_LIMIT+DT;b.step();
    expect(f.onGround).toBe(true);expect(f.maxHp-f.hp).toBeGreaterThanOrEqual(230);
    expect(f.maxHp-f.hp).toBeLessThanOrEqual(420);
  });
  it('집중 진천뢰는 직격에서 500대 초반에 그치고, 60px 빗나가면 피해가 없다',()=>{
    const b=flat();b.selectWeapon(1);b.setAngle(5);b.fireNow(90);
    const damage=[];for(let i=0;i<90;i++){b.step();for(const e of b.drainEvents())if(e.type==='damage'&&e.target===1&&e.cause==='blast')damage.push(e.amount);}
    expect(damage[0]).toBeGreaterThanOrEqual(500);
    expect(damage[0]).toBeLessThanOrEqual(520);
    const miss=flat();miss.projectiles.push(miss.newProjectile(0,1,'jincheonroe',660,880,0,0));
    for(let i=0;i<90;i++)miss.step();expect(miss.fighters[1]!.hp).toBe(miss.fighters[1]!.maxHp);
  });
});

describe('무작위 대칭 배치와 낙사 다리',()=>{
  it.each(MAPS.map(m=>[m.id]))('%s는 같은 높이의 대칭 시작점을 무작위로 고른다',(id)=>{
    const def=MAPS.find(m=>m.id===id)!,t=generateTerrain(def,17);
    const layouts=new Set<string>(),heights=new Set<number>();let central=0,reverse=0;
    for(let seed=0;seed<64;seed++){
      const points=findSpawnPoints(t,def,new Rng(seed),2);
      expect(points).toEqual(findSpawnPoints(t,def,new Rng(seed),2));
      for(const p of points){expect(spotScore(t,p.x,p.y)).toBeGreaterThanOrEqual(0);expect(p.y).toBe(t.topSurface(p.x));}
      layouts.add(JSON.stringify(points));heights.add(points[0]!.y);
      expect(points[0]!.x+points[1]!.x).toBe(2400);expect(points[0]!.y).toBe(points[1]!.y);
      central+=points.some(p=>p.x>650&&p.x<1750)?1:0;reverse+=points[0]!.x>points[1]!.x?1:0;
    }
    expect(layouts.size).toBeGreaterThan(16);expect(heights.size).toBeGreaterThan(1);expect(central).toBeGreaterThan(24);
    expect(reverse).toBeGreaterThan(16);expect(reverse).toBeLessThan(48);
  });
  it('다리 발밑을 끊으면 체력이 가득 찬 상대도 추락선 아래에서 탈락한다',()=>{
    const b=new Battle(defaultConfig({mapId:'bridge',seed:42}));
    const [a,f]=b.fighters;a.x=280;a.y=b.terrain.topSurface(a.x);a.airPeakY=a.y;
    f.x=1200;f.y=b.terrain.topSurface(f.x);f.airPeakY=f.y;
    b.current=0;b.phase='TERRAIN_COLLAPSE';
    b.terrain.carveCircle(f.x,f.y,70,1);
    until(b,()=>b.phase==='GAME_OVER');
    expect(f.deathCause).toBe('fall');expect(b.winner).toBe(0);expect(b.endReason).toBe('fall');
  });
});
