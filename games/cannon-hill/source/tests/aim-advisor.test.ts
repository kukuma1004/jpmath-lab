import {describe,expect,it,vi} from 'vitest';
import {Battle,defaultConfig} from '../src/game/combat/battle';
import {AimAdvisor,type AimHint} from '../src/game/combat/aimAdvisor';
import {Mat} from '../src/game/terrain/terrain';
import {CHARACTERS} from '../src/game/data/characters';

function flat(id='general',reverse=false){
  const b=new Battle(defaultConfig({chars:[id,'archer']}),true);
  for(let y=450;y<600;y++)for(let x=0;x<1200;x++)b.terrain.set(x,y,Mat.Bedrock);
  b.terrain.pending=[];b.fighters.forEach((f,i)=>{f.x=i?1600:400;if(reverse)f.x=2400-f.x;f.y=900;f.airPeakY=900;});
  b.current=0;b.phase='AIM';b.turnNo=1;b.timeLeft=30;b.wind=0;return b;
}
function ready(a:AimAdvisor,b:Battle){
  let hint:AimHint|null=null;
  for(let i=0;i<30;i++){hint=a.update(b,true,1e6,10);if(hint?.kind!=='thinking')break;}
  return hint;
}

describe('정답 대신 제공하는 넓은 조준 시작 범위',()=>{
  it.each([false,true])('좌우 상대 방향에 맞춰 각도 10도·힘 15의 구간만 반환한다 (%s)',reverse=>{
    const b=flat('general',reverse),a=new AimAdvisor(),before=b.serialize();
    const hint=ready(a,b);expect(hint?.kind).toBe('range');
    if(hint?.kind!=='range')return;
    expect(hint.direction).toBe(reverse?-1:1);
    expect(hint.angle[1]-hint.angle[0]).toBe(10);expect(hint.angle[0]%10).toBe(0);
    expect(hint.power[1]-hint.power[0]).toBe(15);expect(hint.power[0]%5).toBe(0);
    expect(Object.keys(hint).sort()).toEqual(['angle','direction','kind','power']);
    expect(b.serialize()).toBe(before);
  });
  it.each(CHARACTERS.flatMap(c=>[0,1].map(slot=>[c.id,slot] as const)))('%s %s번 탄도 같은 방식의 시작 범위로 안내한다',(id,slot)=>{
    const b=flat(id),a=new AimAdvisor();b.selectWeapon(slot as 0|1);const before=b.serialize();
    const hint=ready(a,b);expect(hint?.kind).toBe('range');expect(b.serialize()).toBe(before);
  });
  it('안내를 본 뒤에도 플레이어가 고른 각도·힘 그대로 발사한다',()=>{
    const b=flat(),a=new AimAdvisor();b.setAngle(22);b.cur.lastPower=33;ready(a,b);
    expect(b.cur.angle).toBe(22);expect(b.cur.lastPower).toBe(33);expect(b.cur.power).toBe(0);
    b.fireNow(41);expect(b.cur.angle).toBe(22);expect(b.cur.lastPower).toBe(41);
    expect(b.projectiles[0]!.vx).toBeCloseTo(Math.cos(22*Math.PI/180)*1100*.41,8);
  });
  it('한 프레임의 계산을 나누고, 각도·충전 변화는 재검색하지 않는다',()=>{
    const b=flat(),a=new AimAdvisor(),spy=vi.spyOn(b,'dryShot');
    expect(a.update(b,true,1e6,2)?.kind).toBe('thinking');expect(spy).toHaveBeenCalledTimes(2);
    ready(a,b);const n=spy.mock.calls.length;expect(n).toBe(72);
    b.setAngle(70);b.phase='CHARGE';b.cur.power=35;a.update(b,true,1e6,10);expect(spy).toHaveBeenCalledTimes(n);
  });
  it('탄·바람·위치·차례가 바뀌면 현재 조건으로 다시 찾는다',()=>{
    const b=flat(),a=new AimAdvisor(),spy=vi.spyOn(b,'dryShot');ready(a,b);
    b.selectWeapon(1);ready(a,b);expect(spy.mock.calls.slice(-72).every(call=>call[1]===1)).toBe(true);
    const n=spy.mock.calls.length;b.wind=8;ready(a,b);expect(spy.mock.calls.length).toBe(n+72);
    b.cur.x+=80;ready(a,b);expect(spy.mock.calls.length).toBe(n+144);
    b.turnNo++;ready(a,b);expect(spy.mock.calls.length).toBe(n+216);
  });
  it('움직이는 중에는 기다리고, 중지 후의 위치로 안내한다',()=>{
    const b=flat(),a=new AimAdvisor(),spy=vi.spyOn(b,'dryShot');b.input.move=1;
    expect(a.update(b,true)?.kind).toBe('moving');expect(spy).not.toHaveBeenCalled();
    b.cur.x+=100;b.input.move=0;expect(ready(a,b)?.kind).toBe('range');
  });
  it('막힌 진로에서는 명중 범위 대신 이동 안내를 한다',()=>{
    const b=flat(),a=new AimAdvisor();for(let y=0;y<450;y++)for(let x=225;x<232;x++)b.terrain.set(x,y,Mat.Core);
    expect(ready(a,b)?.kind).toBe('blocked');
  });
  it('꺼져 있거나 비행 중·승부가 끝난 때는 계산과 표시를 멈춘다',()=>{
    const b=flat(),a=new AimAdvisor(),spy=vi.spyOn(b,'dryShot');expect(a.update(b,false)).toBeNull();
    b.phase='PROJECTILE_FLIGHT';expect(a.update(b,true)).toBeNull();expect(spy).not.toHaveBeenCalled();
    b.phase='AIM';b.fighters[1]!.alive=false;expect(a.update(b,true)).toBeNull();
  });
});
