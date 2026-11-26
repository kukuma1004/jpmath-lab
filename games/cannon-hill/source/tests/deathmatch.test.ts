import { afterEach, describe, expect, it, vi } from 'vitest';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { character } from '../src/game/data/characters';
import { Mat } from '../src/game/terrain/terrain';
import { loadSettings, saveSettings } from '../src/game/settings';

function battle(team = false) {
  const chars=team?['general','archer','hwacha','alchemist']:['general','archer'];
  const b=new Battle(defaultConfig({chars,controllers:chars.map(()=>'human')}),true);
  for(let y=450;y<600;y++)for(let x=0;x<1200;x++)b.terrain.set(x,y,Mat.Bedrock);
  b.fighters.forEach((f,i)=>{f.x=300+i*500;f.y=900;f.airPeakY=900;});
  b.phase='AIM';b.timeLeft=30;b.turnNo=1;
  return b;
}
function until(b:Battle,ok:()=>boolean){for(let n=0;n<600&&!ok();n++)b.step();expect(ok()).toBe(true);}
afterEach(()=>vi.unstubAllGlobals());

describe('기본은 장수별 체력으로 싸우는 끝장전',()=>{
  it('40턴을 넘겨도 모두 살아 있으면 판정으로 끝내지 않는다',()=>{
    const b=battle();expect(b.cfg.turnLimit).toBe(0);
    expect(b.fighters.map(f=>f.hp)).toEqual(b.fighters.map(f=>character(f.charId).hp));
    expect(b.fighters[0]!.maxHp).not.toBe(b.fighters[1]!.maxHp);
    for(let n=0;n<45;n++){b.skipTurn();until(b,()=>b.phase==='AIM');}
    expect(b.turnNo).toBe(46);expect(b.winner).toBeNull();expect(b.endReason).toBe('');
  });
  it('2:2는 상대 한 명이 쓰러져도 계속하고 상대 전원이 쓰러지면 끝난다',()=>{
    const b=battle(true);
    b.applyDamage(b.fighters[1]!,b.fighters[1]!.maxHp,0,0,false,'blast',0);
    b.skipTurn();until(b,()=>b.phase==='AIM');
    expect(b.winner).toBeNull();expect(b.current).toBe(3);
    b.applyDamage(b.fighters[3]!,b.fighters[3]!.maxHp,0,0,false,'blast',0);
    b.skipTurn();until(b,()=>b.phase==='GAME_OVER');
    expect(b.winner).toBe(0);expect(b.endReason).toBe('hp');
  });
  it('오래된 턴 제한 설정은 끝장전으로 바꾸면서 음량·장수·전장은 보존한다',()=>{
    const store=new Map<string,string>();
    store.set('jpml.warureu.settings.v1',JSON.stringify({turnLimit:30,bgm:0.2,lastChars:['gumiho','turtle'],lastMap:'forest'}));
    vi.stubGlobal('localStorage',{getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>store.set(k,v)});
    const s=loadSettings();expect(s.turnLimit).toBe(0);expect(s.battleRules).toBe(2);
    expect(s.bgm).toBe(0.2);expect(s.lastChars.slice(0,2)).toEqual(['gumiho','turtle']);expect(s.lastMap).toBe('forest');
    s.turnLimit=20;saveSettings(s);expect(loadSettings().turnLimit).toBe(20);
  });
  it('새 설치는 저장값이 없어도 끝장전이 기본이다',()=>{
    vi.stubGlobal('localStorage',{getItem:()=>null});expect(loadSettings().turnLimit).toBe(0);
  });
});
