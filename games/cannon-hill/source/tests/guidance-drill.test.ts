import { describe, expect, it } from 'vitest';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { DT } from '../src/game/config/constants';
import { Mat } from '../src/game/terrain/terrain';

function flat(char='mudang') {
  const b=new Battle(defaultConfig({chars:[char,'archer']}),true);
  for(let y=450;y<600;y++)for(let x=0;x<1200;x++)b.terrain.set(x,y,Mat.Bedrock);
  b.terrain.pending=[];
  b.fighters.forEach((f,i)=>{f.x=i?1700:400;f.y=900;f.airPeakY=900;});
  b.current=0;b.phase='AIM';b.timeLeft=30;b.turnNo=1;b.wind=0;
  return b;
}

describe('무당의 고각 하강 유도',()=>{
  it.each([false,true])('고각으로 빗나갈 탄을 적에게 꺾어 맞힌다 (좌우 반전 %s)',(mirror)=>{
    const b=flat(),normal=flat('general');
    for(const s of [b,normal])if(mirror)s.fighters.forEach(f=>{f.x=2400-f.x;});
    const angle=mirror?115:65;
    expect(normal.dryShot(0,0,angle,80).damage[1]).toBe(0);
    const predicted=b.dryShot(0,0,angle,80);
    expect(predicted.damage[1]).toBeGreaterThan(100);
    b.setAngle(angle);b.fireNow(80);
    let acquired=false,turned=false;
    for(let n=0;n<600&&b.projectiles.length;n++){
      b.step();
      for(const p of b.projectiles)if((p.seekTarget??-1)>=0){acquired=true;expect(p.lofted).toBe(true);turned ||= Math.abs(p.vx)>400;}
    }
    expect(acquired).toBe(true);expect(turned).toBe(true);
    expect(800-b.fighters[1]!.hp).toBeCloseTo(predicted.damage[1]!,0);
  });
  it('상승 중에는 유도하지 않고 같은 편을 표적으로 삼지 않는다',()=>{
    const b=flat();const p=b.newProjectile(0,1,'bujeok',1450,650,240,-600);
    b.stepProjectile(p,DT);expect(p.seekTarget).toBe(-1);expect(p.vx).toBe(240);
    const ally={...b.fighters[0]!,idx:2,x:1450,y:900};b.fighters.push(ally);
    b.fighters[1]!.alive=false;p.vy=100;b.stepProjectile(p,DT);expect(p.seekTarget).toBe(-1);
  });
  it('유도 중에도 성벽에 막힌다',()=>{
    const b=flat();
    for(let y=200;y<450;y++)for(let x=740;x<760;x++)b.terrain.set(x,y,Mat.Core);
    const p=b.newProjectile(0,1,'bujeok',1470,700,200,-500);p.vy=200;
    for(let n=0;n<300&&!p.dead;n++)b.stepProjectile(p,DT);
    expect(p.dead).toBe(true);expect(p.x).toBeLessThan(1525);expect(b.fighters[1]!.hp).toBe(800);
  });
});

function drill(id='drillBore') {
  const b=flat('driller');
  for(let y=300;y<450;y++)for(let x=500;x<800;x++)b.terrain.set(x,y,Mat.Rock);
  b.terrain.pending=[];
  const p=b.newProjectile(0,1,id,990,800,700,0);b.projectiles=[p];
  return {b,p};
}
describe('굴착대장의 실제 굴착',()=>{
  it('바위 속에 긴 터널을 남기고 약 280px 뒤에 터진다',()=>{
    const {b,p}=drill();
    for(let n=0;n<120&&!p.dead;n++)b.stepProjectile(p,DT);
    expect(p.dead).toBe(true);expect(p.pierced).toBeGreaterThanOrEqual(280);
    expect(p.x).toBeGreaterThan(1270);expect(p.x).toBeLessThan(1290);
    expect(b.terrain.solidAt(1130,802)).toBe(false);
    expect(b.fighters[0]!.stats.cellsDestroyed).toBeGreaterThan(1800);
  });
  it('2번은 1번보다 짧고 넓게 파며 파괴하는 지반이 더 많다',()=>{
    const a=drill(),b=drill('faultBreaker');
    for(const {b:sim,p} of [a,b])for(let n=0;n<120&&!p.dead;n++)sim.stepProjectile(p,DT);
    expect(b.p.x).toBeLessThan(a.p.x-140);
    expect(b.b.terrain.solidAt(1080,822)).toBe(false);
    expect(a.b.terrain.solidAt(1080,822)).toBe(true);
    expect(b.b.fighters[0]!.stats.cellsDestroyed).toBeGreaterThan(a.b.fighters[0]!.stats.cellsDestroyed);
  });
  it.each([Mat.Bedrock,Mat.Core])('기반암/핵 %s는 관통하지 못한다',(mat)=>{
    const {b,p}=drill();for(let y=300;y<450;y++)for(let x=540;x<550;x++)b.terrain.set(x,y,mat);
    for(let n=0;n<120&&!p.dead;n++)b.stepProjectile(p,DT);
    expect(p.dead).toBe(true);expect(p.x).toBeLessThan(1081);expect(b.terrain.matAt(1085,802)).toBe(mat);
  });
  it('굴착 중 복제와 저장 복원 뒤에도 같은 궤도와 지형을 재현한다',()=>{
    const {b,p}=drill();for(let n=0;n<12;n++)b.stepProjectile(p,DT);
    const before=b.serialize();b.dryShot(0,0,45,60);expect(b.serialize()).toBe(before);
    const clone=b.clone(),restored=Battle.deserialize(b.serialize());
    for(const s of [b,clone,restored])for(let n=0;n<120&&!s.projectiles[0]!.dead;n++)s.stepProjectile(s.projectiles[0]!,DT);
    expect(clone.projectiles).toEqual(b.projectiles);expect(restored.projectiles).toEqual(b.projectiles);
    expect(clone.terrain.checksum()).toBe(b.terrain.checksum());expect(restored.terrain.checksum()).toBe(b.terrain.checksum());
  });
});
