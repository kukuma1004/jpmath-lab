import {describe,expect,it} from 'vitest';
import {confirmedChargePower,onlineChargePower} from '../src/game/online/charge';

describe('온라인 충전 게이지',()=>{
  it.each([[0,0],[1200,50],[2400,100],[3600,50],[4800,0],[6000,50]])(
    '%dms에서 왕복 게이지는 %d가 된다',(ms,power)=>expect(onlineChargePower(ms)).toBe(power),
  );
  it('전송 시간이 조금 달라도 화면에서 고른 0.1 단위 힘으로 발사한다',()=>{
    expect(confirmedChargePower(1347,1510)).toBe(56.1);
    expect(confirmedChargePower(3123,3060)).toBe(69.9);
  });
  it('서버에서 관찰한 경과와 크게 다른 입력은 관찰한 시간으로 계산한다',()=>{
    expect(confirmedChargePower(2400,1200)).toBe(50);
    expect(confirmedChargePower(-1,1200)).toBe(50);
    expect(confirmedChargePower(25001,1200)).toBe(50);
  });
});
