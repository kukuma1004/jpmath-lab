import { describe, expect, it } from 'vitest';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { CHAR_CENTER_Y, DT, GRAVITY, MAX_LAUNCH_SPEED } from '../src/game/config/constants';
import { Mat } from '../src/game/terrain/terrain';

function flat(char='mudang') {
  const b=new Battle(defaultConfig({chars:[char,'archer']}),true);
  for(let y=450;y<600;y++)for(let x=0;x<1200;x++)b.terrain.set(x,y,Mat.Bedrock);
  b.terrain.pending=[];
  b.fighters.forEach((f,i)=>{f.x=i?1700:400;f.y=900;f.airPeakY=900;});
  b.current=0;b.phase='AIM';b.timeLeft=30;b.turnNo=1;b.wind=0;
  return b;
}

describe('무당의 진행 방향 유도',()=>{
  it.each([
    {relative:65,power:83,mirror:false}, {relative:65,power:83,mirror:true},
  ])('$relative°에서 빗나갈 탄을 꺾어 맞히면 일반 피해를 준다 (좌우 반전 $mirror)',({relative,power,mirror})=>{
    const b=flat(),normal=flat('general');
    for(const s of [b,normal])if(mirror)s.fighters.forEach(f=>{f.x=2400-f.x;});
    const angle=mirror?180-relative:relative;
    expect(b.dryShot(0,0,angle,80).damage[1]).toBe(0);
    expect(normal.dryShot(0,0,angle,power).damage[1]).toBe(0);
    const predicted=b.dryShot(0,0,angle,power);
    expect(predicted.damage[1]).toBe(126);
    b.setAngle(angle);b.fireNow(power);
    let acquired=false;
    for(let n=0;n<600&&b.projectiles.length;n++){
      b.step();
      acquired ||= b.projectiles.some(p => p.seekTarget === 1);
    }
    expect(acquired).toBe(true);
    expect(b.fighters[1]!.maxHp-b.fighters[1]!.hp).toBeCloseTo(predicted.damage[1]!,0);
    const hit = b.drainEvents().find(e => e.type === 'damage' && e.target === 1 && e.cause === 'blast');
    expect(hit).toMatchObject({amount:126, crit:false});
  });
  it('궤적을 바꾸지 않고 직격하면 부적탄도 치명타가 난다', () => {
    const b = flat();
    const target = b.fighters[1]!;
    target.x = 600;
    b.setAngle(3);
    b.fireNow(90);
    for (let i = 0; i < 60 && b.projectiles.length; i++) b.step();
    const hit = b.drainEvents().find(e => e.type === 'damage' && e.target === 1 && e.cause === 'blast');
    expect(hit).toMatchObject({amount:145, crit:true});
  });
  it('표적을 포착해도 속도나 방향이 그대로면 치명타가 난다', () => {
    const b = flat();
    const target = b.fighters[1]!;
    const p = b.newProjectile(0, 1, 'bujeok', target.x - 21, target.y - CHAR_CENTER_Y, 600, -GRAVITY * DT);
    p.age = .4;
    b.stepProjectile(p, DT);
    expect(p.seekTarget).toBe(target.idx);
    expect(p.homingAdjusted).toBe(false);
    const hit = b.drainEvents().find(e => e.type === 'damage' && e.target === 1 && e.cause === 'blast');
    expect(hit).toMatchObject({amount:145, crit:true});
  });
  it('유도 후 표적을 놓쳐도 저장과 복원 뒤에 치명타가 돌아오지 않는다', () => {
    const b = flat();
    const target = b.fighters[1]!;
    const p = b.newProjectile(0, 1, 'bujeok', target.x - 200, target.y - 60, 600, 0);
    p.age = .4;
    b.projectiles = [p];
    b.stepProjectile(p, DT);
    expect(p.homingAdjusted).toBe(true);
    target.x = p.x - 90;
    b.stepProjectile(p, DT);
    expect(p.seekTarget).toBe(-1);
    const restored = Battle.deserialize(b.serialize());
    const shell = restored.projectiles[0]!;
    const foe = restored.fighters[1]!;
    foe.x = shell.x - 6;
    foe.y = shell.y + CHAR_CENTER_Y;
    restored.stepProjectile(shell, DT);
    expect(shell.seekTarget).toBe(-1);
    const hit = restored.drainEvents().find(e => e.type === 'damage' && e.target === 1 && e.cause === 'blast');
    expect(hit).toMatchObject({amount:126, crit:false});
  });
  it.each([false, true])('힘이 크게 모자란 탄은 적까지 끌려가지 않는다 (좌우 반전 %s)', mirror => {
    const b = flat();
    if (mirror) b.fighters.forEach(f => { f.x = 2400 - f.x; });
    expect(b.dryShot(0, 0, mirror ? 155 : 25, 67).damage[1]).toBe(0);
  });
  it('막 발사한 탄은 그대로 날리고, 유도가 시작돼도 같은 편을 표적으로 삼지 않는다',()=>{
    const b=flat();const p=b.newProjectile(0,1,'bujeok',1450,650,240,-600);
    b.stepProjectile(p,DT);expect(p.seekTarget).toBe(-1);expect(p.vx).toBe(240);
    const ally={...b.fighters[0]!,idx:2,x:1450,y:900};b.fighters.push(ally);
    b.fighters[1]!.alive=false;p.age=.4;b.stepProjectile(p,DT);expect(p.seekTarget).toBe(-1);
  });
  it('상승 중에도 적을 포착하고 더 가까워진 다른 장수에게 갑자기 바꾸지 않는다', () => {
    const b = flat();
    const target = b.fighters[1]!;
    const p = b.newProjectile(0, 1, 'bujeok', 1400, 838, 600, -80);
    p.age = .4;
    b.stepProjectile(p, DT);
    expect(p.seekTarget).toBe(target.idx);
    expect(p.vy).toBeLessThan(0);
    const other = {...target, idx: 2, x: 1460};
    b.fighters.push(other);
    b.stepProjectile(p, DT);
    expect(p.seekTarget).toBe(target.idx);
    target.alive = false;
    b.stepProjectile(p, DT);
    expect(p.seekTarget).toBe(other.idx);
  });
  it('포착 범위에 들어와도 등 뒤나 옆으로 크게 빗나간 적에게 급선회하지 않는다', () => {
    const b = flat();
    for (const [vx, vy] of [[-500, 0], [0, -500]] as const) {
      const p = b.newProjectile(0, 1, 'bujeok', 1490, 800, vx, vy);
      p.age = .5;
      b.stepProjectile(p, DT);
      expect(p.seekTarget).toBe(-1);
      expect(p.vx).toBe(vx);
    }
  });
  it('앞으로 날아가도 가까워지기 전에는 표적을 포착하지 않는다', () => {
    const b = flat();
    const target = b.fighters[1]!;
    const p = b.newProjectile(0, 1, 'bujeok', target.x - 330, target.y - 34, 600, 0);
    p.age = .4;
    b.stepProjectile(p, DT);
    expect(p.seekTarget).toBe(-1);
    for (let i = 0; i < 8 && p.seekTarget !== target.idx; i++) b.stepProjectile(p, DT);
    expect(p.seekTarget).toBe(target.idx);
  });
  it('유도 중에도 성벽에 막힌다',()=>{
    const b=flat();
    for(let y=200;y<450;y++)for(let x=740;x<760;x++)b.terrain.set(x,y,Mat.Core);
    const p=b.newProjectile(0,1,'bujeok',1470,700,200,-500);p.vy=200;
    for(let n=0;n<300&&!p.dead;n++)b.stepProjectile(p,DT);
    expect(p.dead).toBe(true);expect(p.x).toBeLessThan(1525);expect(b.fighters[1]!.hp).toBe(b.fighters[1]!.maxHp);
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
  it.each([false, true])('얇은 벽의 반대편에서 터져 엄폐 뒤 상대를 맞힌다 (좌우 반전 %s)', (mirror) => {
    const b = flat('driller');
    const xAt = (left: number) => mirror ? 2400 - left : left;
    b.fighters[0]!.x = xAt(620);
    b.fighters[1]!.x = xAt(970);
    const left = mirror ? 1474 : 820;
    for (let x = left; x < left + 106; x += 2) {
      for (let y = 650; y < 900; y += 2) b.terrain.set(x / 2, y / 2, Mat.Rock);
    }
    const angle = mirror ? 168 : 12;
    const dry = b.dryShot(0, 0, angle, 80);
    expect(dry.impacts).toHaveLength(2);
    expect(dry.impacts[1]!.x).toBeCloseTo(xAt(926), -1);
    expect(dry.damage[1]).toBeGreaterThan(100);
    b.setAngle(angle);
    b.fireNow(80);
    for (let i = 0; i < 360 && b.projectiles.length; i++) b.step();
    expect(b.projectiles).toHaveLength(0);
    expect(b.fighters[1]!.maxHp - b.fighters[1]!.hp).toBeCloseTo(dry.damage[1]!, 0);
  });
  it('저장에 남은 지반 붕괴탄은 복원 뒤에도 기존 굴착을 끝낸다',()=>{
    const {b}=drill('faultBreaker');
    const restored=Battle.deserialize(b.serialize());
    const p=restored.projectiles[0]!;
    for(let n=0;n<120&&!p.dead;n++)restored.stepProjectile(p,DT);
    expect(p.dead).toBe(true);
    expect(p.pierced).toBeGreaterThanOrEqual(110);
    expect(restored.terrain.solidAt(1080,822)).toBe(false);
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

describe('굴착대장의 명중용 철편', () => {
  it.each([false, true])('같은 발사 속도의 세 발 중 옆탄이 조준 오차를 받아준다 (좌우 반전 %s)', (mirror) => {
    const b = flat('driller');
    b.fighters[0]!.x = mirror ? 1990 : 410;
    b.fighters[1]!.x = mirror ? 900 : 1500;
    const angle = mirror ? 156 : 24;
    const power = 86;
    expect(b.dryShot(0, 0, angle, power).damage[1]).toBe(0);
    expect(b.dryShot(0, 1, angle, power).damage[1]).toBe(120);

    b.setAngle(angle);
    b.selectWeapon(1);
    b.fireNow(power);
    expect(b.projectiles).toHaveLength(3);
    for (const p of b.projectiles) {
      expect(Math.hypot(p.vx, p.vy)).toBeCloseTo(MAX_LAUNCH_SPEED * power / 100, 5);
    }
    for (let n = 0; n < 360 && b.projectiles.length; n++) b.step();
    expect(b.fighters[1]!.maxHp - b.fighters[1]!.hp).toBe(120);
  });

  it('철편은 벽 앞에서 터지고 땅속으로 들어가지 않는다', () => {
    const {b, p} = drill('ironScatter');
    for (let n = 0; n < 120 && !p.dead; n++) b.stepProjectile(p, DT);
    expect(p.dead).toBe(true);
    expect(p.pierced).toBe(0);
    expect(p.x).toBeLessThan(1002);
    expect(b.terrain.solidAt(1080, 802)).toBe(true);
  });
});
