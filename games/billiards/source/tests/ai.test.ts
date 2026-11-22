import {describe,expect,it} from 'vitest';
import {planShot} from '../src/ai/ShotPlanner';
import {DIFFICULTY} from '../src/ai/difficulty';
import {generateCandidates} from '../src/ai/candidates';
import {PhysicsEngine} from '../src/physics/PhysicsEngine';
import {TABLE,FIXED_DT} from '../src/physics/config';
import {POOL_TABLE,createPoolRack,canPlaceBall} from '../src/physics/pool';
import {makeBall} from '../src/physics/presets';
import {MatchController} from '../src/rules/MatchController';
import {EightBallRules} from '../src/rules/EightBallRules';
import {FourBallRules} from '../src/rules/FourBallRules';
import type {AIRequest} from '../src/ai/types';

function request(discipline:AIRequest['config']['discipline']='four-ball',difficulty:AIRequest['config']['difficulty']='expert'):AIRequest{
 const match=new MatchController({discipline,mode:'ai',difficulty,profile:discipline==='eight-ball'?'wpa':'domestic'});
 match.state.ballInHand=false;match.state.headStringRestriction=false;match.state.breakShot=false;match.state.openingRequired=false;
 return {requestId:9,balls:match.initialBalls(),table:discipline==='eight-ball'?POOL_TABLE:TABLE,config:match.config,state:match.state,seed:1234};
}
function finish(req:AIRequest,shot:ReturnType<typeof planShot>['shot'],placement?:{x:number,z:number}){
 const engine=new PhysicsEngine(req.balls,req.table);if(placement)expect(engine.placeBall('white',placement,req.state.ballInHandZone==='head-string'?'kitchen':'anywhere')).toBe(true);
 const before=engine.snapshot();expect(engine.strike(shot)).toBe(true);
 for(let i=0;i<240*35&&!engine.settled;i++)engine.step(FIXED_DT);
 expect(engine.settled).toBe(true);expect(engine.safetyStops).toBe(0);
 return {input:shot,before,after:engine.snapshot(),events:engine.events};
}
function simplePool():AIRequest{
 const req=request('eight-ball');const rack=createPoolRack();
 for(const b of rack)if(!['white','ball-1','ball-8','ball-9'].includes(b.id))b.pocketed=true;
 rack.find(b=>b.id==='white')!.position={x:0,z:.1};rack.find(b=>b.id==='ball-1')!.position={x:0,z:-.35};
 rack.find(b=>b.id==='ball-8')!.position={x:.8,z:.3};rack.find(b=>b.id==='ball-9')!.position={x:-.8,z:.3};
 req.balls=rack;req.state.players[0].group='solid';req.state.players[1].group='stripe';req.state.openTable=false;
 return req;
}
describe('bounded non-cheating billiards AI',()=>{
 it('uses materially different search, cushion, spin and positional budgets at four levels',()=>{
  expect(Object.values(DIFFICULTY).map(v=>v.candidates)).toEqual([18,40,76,120]);
  expect(DIFFICULTY.easy.spinVariants).toBe(0);expect(DIFFICULTY.expert.cushionDepth).toBeGreaterThan(DIFFICULTY.normal.cushionDepth);
  expect(DIFFICULTY.expert.positionWeight).toBeGreaterThan(DIFFICULTY.easy.positionWeight);
 });
 it('finds a called side-pocket pot using exactly the shared physics engine',()=>{
  const req=simplePool(),output=planShot(req);
  expect(output.error).toBeUndefined();expect(output.simulated).toBeGreaterThan(1);expect(output.shot.calledBall).toBe('ball-1');
  const result=finish(req,output.shot);const rule=new EightBallRules().evaluate(result,{config:req.config,state:req.state,cueBall:'white'});
  expect(rule.foul).toBeNull();expect(rule.scored).toBe(true);expect(result.events.some(e=>e.type==='pocket'&&e.ballId==='ball-1'&&e.pocketId===output.shot.calledPocket)).toBe(true);
 },20000);
 it('repeats the same decision with the same state and seed without mutating input',()=>{
  const req=request('four-ball','easy'),before=JSON.stringify(req);const a=planShot(req),b=planShot(req);
  expect(a.error).toBeUndefined();expect(a.shot).toEqual(b.shot);expect(a.simulated).toBe(b.simulated);expect(a.score).toBe(b.score);expect(JSON.stringify(req)).toBe(before);
 },20000);
 it('finds a double-red carom in a favourable layout with rule-checked contacts',()=>{
  const req=request();req.balls=[makeBall('white','white',-.6,0),makeBall('yellow','yellow',-.7,.4),makeBall('red','red',-.1,.025),makeBall('red2','red2',.3,-.2)];
  const output=planShot(req);expect(output.error).toBeUndefined();
  const result=finish(req,output.shot),rule=new FourBallRules().evaluate(result,{config:req.config,state:req.state,cueBall:'white'});
  expect(rule.foul).toBeNull();expect(rule.scored).toBe(true);
 },20000);
 it('explores physical multi-cushion candidates while obeying the red-direct opening constraint',()=>{
  const req=request('three-cushion','expert');req.state.openingRequired=true;
  const generated=generateCandidates(req,DIFFICULTY.expert);
  expect(generated.some(c=>c.rationale==='충돌 후 쿠션 조합')).toBe(true);
  expect(generated.some(c=>Math.abs(c.shot.tip.x)+Math.abs(c.shot.tip.y)>0)).toBe(true);
  const output=planShot(req);expect(output.error).toBeUndefined();
  const result=finish(req,output.shot);const first=result.events.find(e=>e.type==='ball-ball'&&(e.ballA==='white'||e.ballB==='white'));
  expect(first?.type).toBe('ball-ball');if(first?.type==='ball-ball')expect(first.ballA==='red'||first.ballB==='red').toBe(true);
 },20000);
 it('returns a legal placement before a ball-in-hand shot',()=>{
  const req=simplePool();req.state.ballInHand=true;req.state.ballInHandZone='anywhere';req.balls.find(b=>b.id==='white')!.pocketed=true;
  req.config.difficulty='normal';const output=planShot(req);expect(output.error).toBeUndefined();expect(output.placement).toBeDefined();
  expect(canPlaceBall(req.table,req.balls,'white',output.placement!)).toBe(true);
  expect(finish(req,output.shot,output.placement).events.some(e=>e.type==='ball-ball')).toBe(true);
 },20000);
 it('selects only an available break choice and does not simulate a shot before it is resolved',()=>{
  const req=request('eight-ball');req.state.pendingChoice={kind:'break-foul',player:0,breaker:1,options:[{id:'ball-in-hand',label:'BIH'}]};
  const output=planShot(req);expect(output.choice).toBe('ball-in-hand');expect(output.simulated).toBe(0);
 });
 it('simulates an actual sixteen-ball break and satisfies the legal-break rail/pot condition',()=>{
  const req=request('eight-ball','expert');req.balls=createPoolRack();req.state.breakShot=true;req.state.ballInHand=true;req.state.ballInHandZone='head-string';req.state.headStringRestriction=true;
  const output=planShot(req);
  expect(output.error).toBeUndefined();expect(output.placement!.x).toBeLessThan(-POOL_TABLE.width/4);
  const result=finish(req,output.shot,output.placement);const rails=new Set(result.events.filter(e=>e.type==='cushion'&&e.ballId!=='white').map(e=>e.type==='cushion'?e.ballId:''));
  const objectPot=result.events.some(e=>e.type==='pocket'&&e.ballId!=='white');expect(objectPot||rails.size>=4).toBe(true);
 },30000);
});
