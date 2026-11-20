import type { Difficulty, GameState, HeroId } from './types';

export interface RunRecord {
  hero:HeroId;
  difficulty:Difficulty;
  score:number;
  durationMs:number;
  kills:number;
  graze:number;
  cleared:boolean;
}

export interface PublicRecord extends RunRecord {
  nickname:string;
  submittedAt:number;
  uid:string;
}

const integerBetween=(value:unknown,min:number,max:number):value is number=>
  typeof value==='number'&&Number.isInteger(value)&&value>=min&&value<=max;

export function validNickname(name:string):boolean {
  return typeof name==='string'&&/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{1,12}$/.test(name)&&/[^ ]/.test(name);
}

export function validRun(value:unknown):value is RunRecord {
  if(!value||typeof value!=='object'||Array.isArray(value))return false;
  const run=value as Record<string,unknown>;
  return (run.hero==='rin'||run.hero==='golem'||run.hero==='ryu')&&
    (run.difficulty==='normal'||run.difficulty==='story')&&
    integerBetween(run.score,1,9999999)&&integerBetween(run.durationMs,10000,3600000)&&
    integerBetween(run.kills,0,1000)&&integerBetween(run.graze,0,100000)&&typeof run.cleared==='boolean';
}

/** Only an ended, meaningful run can become a publishable record. No rounding of score/stats. */
export function fromState(state:GameState):RunRecord|null {
  if((state.phase!=='gameover'&&state.phase!=='victory')||state.time<10||state.score<=0)return null;
  const run:RunRecord={hero:state.hero,difficulty:state.difficulty,score:state.score,
    durationMs:Math.floor(state.time*1000),kills:state.stats.kills,graze:state.graze,
    // Only a run that started at chapter one and beat the final guardian counts as cleared.
    cleared:state.phase==='victory'&&(state.startStage??0)===0};
  return validRun(run)?run:null;
}

/** Deterministic order, including ties received in arbitrary Firebase object order. */
export function compareRecords(a:PublicRecord,b:PublicRecord):number {
  return b.score-a.score||a.submittedAt-b.submittedAt||(a.uid<b.uid?-1:a.uid>b.uid?1:0);
}
