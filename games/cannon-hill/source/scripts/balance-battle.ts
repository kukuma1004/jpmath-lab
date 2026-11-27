import { AIActor } from '../src/game/ai/ai';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import type { Difficulty } from '../src/game/combat/types';
import { CHARACTERS } from '../src/game/data/characters';

export const characters = CHARACTERS.map(({id,name})=>({id,name}));

export function play(map:string, seed:number, chars:string[], difficulty:Difficulty, turnLimit:number, maxSteps:number) {
  const config=defaultConfig({mapId:map, seed, chars, difficulty, turnLimit, controllers:['ai','ai']});
  let battle=new Battle(config);
  if(battle.current!==0)battle=new Battle({...config,chars:[...chars].reverse()});
  const first=battle.current;
  battle.quiet=true;
  battle.recording=false;
  const actors=battle.fighters.map(fighter=>new AIActor(fighter.idx,difficulty,0));
  while(battle.winner===null&&battle.stepNo<maxSteps){
    if(battle.isPlayerPhase())actors[battle.current]?.update(battle,Infinity);
    battle.step();
  }
  return {map,seed,chars:battle.cfg.chars,first,winner:battle.winner,turns:battle.turnNo,
    reason:battle.endReason||'unfinished',stats:battle.fighters.map(fighter=>fighter.stats)};
}
