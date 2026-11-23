import { describe, expect, it } from 'vitest';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { CHARACTERS, TRAIT } from '../src/game/data/characters';
import { Mat } from '../src/game/terrain/terrain';

function flat(chars = ['alchemist', 'archer']) {
  const b = new Battle(defaultConfig({ chars }), true);
  for (let y = 450; y < 600; y++) for (let x = 0; x < 1200; x++) b.terrain.set(x, y, Mat.Bedrock);
  b.terrain.pending = [];
  b.fighters.forEach((f, i) => { f.x = i % 2 ? 900 : 400; f.y = 900; f.airPeakY = 900; });
  b.phase = 'AIM'; b.current = 0; b.turnNo = 1; b.timeLeft = 30; b.wind = 0;
  return b;
}

function until(b: Battle, ok: () => boolean) {
  for (let n=0;n<1800 && !ok();n++) b.step();
  expect(ok(), `${b.phase} ${b.current} ${b.turnNo}`).toBe(true);
}

function gasBattle(target = 'archer') {
  const b = flat(['alchemist', target]);
  b.shotNo = 1;
  b.phase = 'PROJECTILE_FLIGHT';
  b.projectiles.push(b.newProjectile(0, 1, 'poisonCloud', 900, 880, 0, 0));
  b.step();
  expect(b.clouds).toHaveLength(1);
  return b;
}

function nextOwnTurn(b: Battle, player: number) {
  b.skipTurn();
  until(b, () => b.phase === 'AIM' || b.phase === 'GAME_OVER');
  if (b.phase === 'AIM' && b.current !== player) {
    b.skipTurn();
    until(b, () => b.phase === 'AIM' || b.phase === 'GAME_OVER');
  }
}

describe('기세 없이 고르는 두 종류 탄', () => {
  it('화포장군 2번은 직격이 더 세고, 넓은 땅파기는 1번이 더 크다', () => {
    const hit=(id:string)=>{
      const b=flat(['general','archer']);
      for(let y=450;y<580;y++) for(let x=0;x<1200;x++) b.terrain.set(x,y,Mat.Dirt);
      b.terrain.pending=[];b.phase='PROJECTILE_FLIGHT';
      b.projectiles.push(b.newProjectile(0,1,id,900,880,0,0));b.step();
      return {damage:b.fighters[1]!.maxHp-b.fighters[1]!.hp,carved:b.fighters[0]!.stats.cellsDestroyed};
    };
    const wide=hit('hwapo'),focused=hit('jincheonroe');
    expect(focused.damage).toBeGreaterThan(wide.damage*1.5);
    expect(wide.carved).toBeGreaterThan(focused.carved*2);
  });
  it.each(CHARACTERS.map(c => [c.id]))('%s는 첫 차례부터 두 탄을 자유롭게 고르고 고른 탄으로 발사한다', (id) => {
    const b = flat([id!, 'archer']);
    b.selectWeapon(1); expect(b.cur.slot).toBe(1);
    b.selectWeapon(0); expect(b.cur.slot).toBe(0);
    b.selectWeapon(1); b.fireNow(60);
    expect(b.projectiles[0]!.weaponId).toBe(CHARACTERS.find(c => c.id === id)!.special);
    expect(b.cur.slot).toBe(1);
    expect(b.cur.stats.shots).toBe(1);
  });

  it('2번을 연속으로 쓰고 다음 자기 차례에도 유지하다 1번으로 돌아간다', () => {
    const b = flat(['general', 'archer']);
    for (const slot of [1, 1, 0, 1] as const) {
      expect(b.current).toBe(0);
      b.selectWeapon(slot); b.setAngle(165); b.fireNow(80);
      expect(b.cur.slot).toBe(slot);
      until(b, () => b.phase === 'AIM' && b.current === 1);
      b.skipTurn(); until(b, () => b.phase === 'AIM' && b.current === 0);
      expect(b.cur.slot).toBe(slot);
    }
    expect(b.fighters[0]!.stats.shots).toBe(4);
  });

  it('구형 전투 저장값에 독구름 필드가 없어도 복원된다', () => {
    const old = JSON.parse(flat().serialize());delete old.clouds;
    const b = Battle.deserialize(JSON.stringify(old));
    expect(b.clouds).toEqual([]);b.selectWeapon(1);expect(b.cur.slot).toBe(1);
  });
});

describe('독무는 자기 차례에만 작용하고 걸어 나와 피할 수 있다', () => {
  it('첫 착탄 뒤 실시간 프레임으로 독 피해가 누적되지 않고 차례가 오면 48 피해', () => {
    const b = gasBattle(); const f = b.fighters[1]!, hp = f.hp;
    for(let i=0;i<15;i++) b.step();expect(f.hp).toBe(hp);
    until(b, () => b.phase === 'AIM' && b.current === 1);
    expect(f.hp).toBe(hp-48);expect(b.clouds[0]!.turns[1]).toBe(2);
  });

  it('구름 밖으로 나온 상대는 다음 자기 차례에 피해를 받지 않는다', () => {
    const b = gasBattle();until(b, () => b.phase === 'AIM' && b.current === 1);
    const f=b.cur,hp=f.hp;
    expect(b.walk(f,140)).toBeGreaterThan(130);
    expect(b.inCloud(f,b.clouds[0]!)).toBe(false);
    nextOwnTurn(b,1);expect(f.hp).toBe(hp);
  });

  it('독술사는 독 피해를 줄이고 구름은 각 장수의 세 차례 뒤 사라진다', () => {
    const b=gasBattle('alchemist'),f=b.fighters[1]!,hp=f.hp;
    until(b,()=>b.phase==='AIM' && b.current===1);
    expect(hp-f.hp).toBe(Math.round(48*TRAIT.poisonResistance));
    for(let n=0;n<8 && b.clouds.length;n++) {b.skipTurn();until(b,()=>b.phase==='AIM');}
    expect(b.clouds).toHaveLength(0);
  });

  it('독구름 복제와 직렬화는 차례 수를 보존하고 서로 영향을 주지 않는다', () => {
    const b=gasBattle(),copy=b.clone(),restored=Battle.deserialize(b.serialize());
    expect(copy.hash()).toBe(b.hash());expect(restored.hash()).toBe(b.hash());
    copy.clouds[0]!.turns[1]=0;expect(b.clouds[0]!.turns[1]).toBe(3);
    for(let i=0;i<300;i++){b.step();restored.step();}
    expect(restored.hash()).toBe(b.hash());
  });

  it('차례 시작 독 피해로 쓰러지면 사망한 장수의 입력을 기다리지 않고 게임이 끝난다', () => {
    const b=gasBattle();b.fighters[1]!.hp=20;
    until(b,()=>b.phase==='GAME_OVER');
    expect(b.winner).toBe(0);expect(b.fighters[1]!.alive).toBe(false);
  });

  it('독무 AI 예상 발사는 원본 전투나 독구름을 바꾸지 않는다', () => {
    const b=flat(),before=b.hash();
    b.dryShot(0,1,45,60);
    expect(b.hash()).toBe(before);expect(b.clouds).toHaveLength(0);
  });
});
