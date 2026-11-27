import {describe,expect,it} from 'vitest';
import {rankAfter,rankTier,startingRank} from '../src/game/online/rank';
import {Battle,defaultConfig} from '../src/game/combat/battle';

describe('공개 랭크전',()=>{
  it.each([[0,'bronze'],[999,'bronze'],[1000,'silver'],[1149,'silver'],[1150,'gold'],[1300,'jade'],[1450,'royal']])(
    '%d 점에 해당하는 훈장을 표시한다',(points,id)=>expect(rankTier(points).id).toBe(id),
  );
  it('대등한 상대는 24점, 강한 상대를 이기면 32점이며 무승부는 점수가 유지된다',()=>{
    const p=startingRank('장수');
    expect(rankAfter(p,1000,'win')).toEqual({...p,rating:1024,wins:1});
    expect(rankAfter(p,1200,'win').rating).toBe(1032);
    expect(rankAfter(p,800,'loss').rating).toBe(968);
    expect(rankAfter(p,1280,'draw')).toEqual({...p,draws:1});
    expect(rankAfter({...p,rating:4},4,'loss').rating).toBe(0);
  });
  it('진행 중이던 친선방은 해당 버전의 무기 수치를 재현한다',()=>{
    const config=defaultConfig({chars:['mukyeong','mudang']});
    const old=new Battle({...config,legacyBalance:true},true);
    const current=new Battle(config,true);
    expect(old.weaponOf(old.fighters[0]!,0).damage).toBe(161);
    expect(current.weaponOf(current.fighters[0]!,0).damage).toBe(190);
    expect(old.weaponOf(old.fighters[1]!,0).homing?.range).toBe(310);
    expect(current.weaponOf(current.fighters[1]!,0).homing?.range).toBe(275);
  });
});
