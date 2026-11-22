import{it,expect,describe}from'vitest';
import{GameManager}from'../src/game/GameManager';
import{planShot}from'../src/ai/ShotPlanner';
import{makeBall}from'../src/physics/presets';
import{FIXED_DT}from'../src/physics/config';
import type{Discipline}from'../src/rules/types';
import {mkdirSync,writeFileSync} from 'node:fs';
const finish=(g:GameManager)=>{for(let i=0;i<240*60&&g.busy;i++)g.update(FIXED_DT);expect(g.busy).toBe(false);expect(g.engine.safetyStops).toBe(0);};
describe('physics to competitive lifecycle',()=>{
 it('a real two-red contact finishes the local match and replay preserves final competitive state',()=>{
  const g=new GameManager();g.newMatch({mode:'local',discipline:'four-ball',target:1});
  g.engine.reset([makeBall('white','white',-.6,0),makeBall('yellow','yellow',-.7,.4),makeBall('red','red',-.1,.025),makeBall('red2','red2',.3,-.2)]);
  const plan=planShot({requestId:1,balls:g.engine.snapshot().balls,table:g.engine.table,config:{...g.match.config,difficulty:'expert'},state:structuredClone(g.match.state),seed:1234});
  expect(plan.error).toBeUndefined();expect(g.shoot(plan.shot)).toBe(true);finish(g);
  expect(g.match.state.status).toBe('finished');expect(g.match.state.winner).toBe(0);expect(g.lastOutcome?.scored).toBe(true);
  const match=structuredClone(g.match.state),physical=g.engine.snapshot();expect(g.replay()).toBe(true);finish(g);
  expect(g.phase).toBe('finished');expect(g.match.state).toEqual(match);expect(g.engine.snapshot()).toEqual(physical);
 },15000);
 it('a physical miss switches cues and blocks human input during the actual AI turn',()=>{
  const g=new GameManager();g.newMatch({mode:'ai',discipline:'four-ball'});g.angle=Math.PI;g.power=.2;g.shoot();finish(g);
  expect(g.match.state.currentPlayer).toBe(1);expect(g.cueBall).toBe('yellow');expect(g.pressShot()).toBe(false);
  expect(g.beginThinking()).toBe(true);const p=planShot({requestId:1,balls:g.engine.snapshot().balls,table:g.engine.table,config:g.match.config,state:g.match.state,seed:2});
  expect(p.error).toBeUndefined();expect(g.executeAI(p.shot)).toBe(true);g.update(.7);finish(g);expect(g.match.state.shotNumber).toBe(2);
 },15000);
});
describe('complete initial-table bot matches through shared shot interface',()=>{
 for(const discipline of ['four-ball','three-cushion','eight-ball'] as Discipline[])it(`plays ${discipline} from opening until an actual rules result`,()=>{
  const g=new GameManager();g.newMatch({mode:'local',discipline,target:1,difficulty:'expert',profile:discipline==='eight-ball'?'wpa':'domestic'});
  const trace:unknown[]=[],started=performance.now();let finalTurnState=structuredClone(g.match.state);
  for(let turn=0;turn<120&&g.match.state.status!=='finished';turn++){
   const p=planShot({requestId:turn,balls:g.engine.snapshot().balls,table:g.engine.table,config:g.match.config,state:structuredClone(g.match.state),seed:turn*971+7103});
   expect(p.error,`turn${turn}: ${p.rationale}`).toBeUndefined();
   if(p.choice){g.chooseBreak(p.choice);continue;}
   if(g.match.state.ballInHand){expect(p.placement).toBeDefined();expect(g.placeCue(p.placement!)).toBe(true);}
   finalTurnState=structuredClone(g.match.state);expect(g.shoot(p.shot)).toBe(true);finish(g);trace.push({turn,current:g.match.state.currentPlayer,scores:g.match.state.players.map(p=>p.score),outcome:g.lastOutcome?.message,simulations:p.simulated});
  }
  expect(g.match.state.status).toBe('finished');expect(g.match.state.winner).not.toBeNull();
  mkdirSync('../artifacts/bot-matches',{recursive:true});writeFileSync(`../artifacts/bot-matches/${discipline}.json`,JSON.stringify({discipline,from:'initial regulation layout',config:g.match.config,final:g.match.state,finalTurnState,finalShot:g.lastShot,elapsedMs:performance.now()-started,shots:g.shotCount,safetyStops:g.engine.safetyStops,trace},null,2)+'\n');
 },180000);
});
