import { describe, expect, it } from 'vitest';
import { MatchController } from '../src/rules/MatchController';
import { PhysicsEngine } from '../src/physics/PhysicsEngine';
import { TABLE } from '../src/physics/config';
import { POOL_TABLE } from '../src/physics/pool';
import type { BallState, PhysicsEvent, ShotInput, ShotResult } from '../src/physics/types';

const hit=(target:string,cue='white',time=1):PhysicsEvent=>({type:'ball-ball',ballA:cue,ballB:target,time,sequence:0,speed:1});
const rail=(ballId='white',time=2):PhysicsEvent=>({type:'cushion',ballId,rail:'top',time,sequence:0,speed:1});
const pot=(ballId:string,time=3):PhysicsEvent=>({type:'pocket',ballId,pocketId:'tm',time,sequence:0,speed:1});
function result(balls:BallState[],events:PhysicsEvent[],input:Partial<ShotInput>={}):ShotResult{
 const after=structuredClone(balls);for(const e of events)if(e.type==='pocket'){const b=after.find(b=>b.id===e.ballId);if(b)b.pocketed=true;}
 return {input:{ballId:'white',angle:0,power:.5,tip:{x:0,y:0},...input},before:{balls:structuredClone(balls),time:0},after:{balls:after,time:10},events:events.map((e,i)=>({...e,sequence:i}))};
}
const cannon=(cue='white')=>[hit('red',cue),hit('red2',cue,2)];
const three=(cue='white')=>[hit('red',cue),rail(cue,2),rail(cue,3),rail(cue,4),hit(cue==='white'?'yellow':'white',cue,5)];

describe('full local carom match lifecycle',()=>{
 it('scores retained turns, tracks individual innings/runs, then ends at the target',()=>{
  const m=new MatchController({discipline:'four-ball',target:3});const balls=m.initialBalls();
  m.apply(result(balls,cannon()));m.apply(result(balls,cannon()));expect(m.state.players[0]).toMatchObject({score:2,innings:1,shots:2,run:2,highRun:2});
  m.apply(result(balls,[hit('red')]));expect(m.state.currentPlayer).toBe(1);expect(m.cueBall).toBe('yellow');
  m.apply(result(balls,cannon('yellow'),{ballId:'yellow'}));m.apply(result(balls,[],{ballId:'yellow'}));
  expect(m.state.players[1]).toMatchObject({score:1,innings:1,shots:2,highRun:1});expect(m.state.currentPlayer).toBe(0);
  const won=m.apply(result(balls,cannon()));expect(won.winner).toBe(0);expect(m.state).toMatchObject({status:'finished',winner:0});expect(m.state.players[0].innings).toBe(2);
  const snapshot=structuredClone(m.state);m.apply(result(balls,cannon()));expect(m.state).toEqual(snapshot);
 });
 it('never lets the domestic penalty take scores below zero',()=>{
  const m=new MatchController({discipline:'four-ball',fourBallFoul:'penalty'});m.apply(result(m.initialBalls(),[hit('yellow')]));expect(m.state.players[0].score).toBe(0);expect(m.state.players[0].fouls).toBe(1);expect(m.state.currentPlayer).toBe(1);
 });
 it('an ordinary 3-cushion target ends immediately when equal innings is disabled',()=>{
  const m=new MatchController({discipline:'three-cushion',target:1,equalInnings:false});m.apply(result(m.initialBalls(),three()));expect(m.state).toMatchObject({status:'finished',winner:0});
 });
 it('equalizing starts the second player from yellow opening and can finish in a draw',()=>{
  const m=new MatchController({discipline:'three-cushion',target:2,equalInnings:true});const balls=m.initialBalls();
  m.apply(result(balls,three()));const finish=m.apply(result(balls,three()));
  expect(finish.openingLayoutFor).toBe(1);expect(m.state).toMatchObject({status:'playing',currentPlayer:1,equalizing:true,openingRequired:true});
  const reply=m.initialBalls();expect(reply.find(b=>b.id==='yellow')!.position.z).toBe(.1825);expect(reply.find(b=>b.id==='white')!.position.z).toBe(0);
  m.apply(result(reply,three('yellow'),{ballId:'yellow'}));expect(m.state.status).toBe('playing');m.apply(result(reply,three('yellow'),{ballId:'yellow'}));
  expect(m.state).toMatchObject({status:'finished',winner:'draw'});expect(m.state.players.map(p=>p.innings)).toEqual([1,1]);
 });
 it('a failed equalizing inning awards the first player the match',()=>{
  const m=new MatchController({discipline:'three-cushion',target:1,equalInnings:true});m.apply(result(m.initialBalls(),three()));m.apply(result(m.initialBalls(),[],{ballId:'yellow'}));expect(m.state).toMatchObject({status:'finished',winner:0});
 });
 it('free practice provides points but neither finishes nor forces a handover',()=>{
  const m=new MatchController({discipline:'four-ball',mode:'practice',target:1});m.apply(result(m.initialBalls(),cannon()));m.apply(result(m.initialBalls(),[]));expect(m.state).toMatchObject({status:'playing',currentPlayer:0,winner:null});expect(m.state.players[0].score).toBe(1);
 });
 it('all initial discipline layouts are accepted by the physical engine without overlaps',()=>{
  for(const discipline of ['four-ball','three-cushion','eight-ball'] as const){const m=new MatchController({discipline});expect(()=>new PhysicsEngine(m.initialBalls(),discipline==='eight-ball'?POOL_TABLE:TABLE)).not.toThrow();}
 });
});

describe('full eight-ball match and break choices',()=>{
 function ballsAtLegalBreak(m:MatchController):BallState[]{const balls=m.initialBalls();balls.find(b=>b.id==='white')!.position.x=-.8;return balls;}
 function pool(){return new MatchController({discipline:'eight-ball',profile:'wpa'});}
 it('can complete a legal break, choose groups, clear all solids, and win on called 8',()=>{
  const m=pool();let balls=ballsAtLegalBreak(m);m.confirmPlacement();
  let shot=result(balls,[hit('ball-1'),pot('ball-10')]);m.apply(shot);balls=shot.after.balls;
  expect(m.state).toMatchObject({openTable:true,currentPlayer:0,breakShot:false});
  for(let n=1;n<=7;n++){shot=result(balls,[hit(`ball-${n}`),pot(`ball-${n}`)],{calledBall:`ball-${n}`,calledPocket:'tm'});m.apply(shot);balls=shot.after.balls;expect(m.state.currentPlayer).toBe(0);}
  expect(m.state.players[0]).toMatchObject({score:7,group:'solid',innings:1});expect(m.state.players[1]).toMatchObject({score:1,group:'stripe'});
  m.apply(result(balls,[hit('ball-8'),pot('ball-8')],{calledBall:'ball-8',calledPocket:'tm'}));expect(m.state).toMatchObject({status:'finished',winner:0});
 });
 it('a normal foul changes turn and gives anywhere ball-in-hand, with kitchen restriction surviving confirmation only when appropriate',()=>{
  const m=pool();m.confirmPlacement();expect(m.state.headStringRestriction).toBe(true);let balls=ballsAtLegalBreak(m);m.apply(result(balls,[hit('ball-1'),rail('ball-1'),rail('ball-2',3),rail('ball-3',4),rail('ball-4',5)]));
  expect(m.state.currentPlayer).toBe(1);m.apply(result(balls,[hit('ball-8')]));expect(m.state).toMatchObject({currentPlayer:0,ballInHand:true,ballInHandZone:'anywhere',headStringRestriction:false});m.confirmPlacement();expect(m.state.ballInHand).toBe(false);
 });
 it('illegal break blocks new adjudication until the entitled player selects a valid action',()=>{
  const m=pool(),balls=ballsAtLegalBreak(m);m.confirmPlacement();m.apply(result(balls,[hit('ball-1')]));expect(m.state.pendingChoice?.kind).toBe('illegal-break');expect(m.state.currentPlayer).toBe(1);
  expect(m.state.players[0].fouls).toBe(0);
  const count=m.state.shotNumber;m.apply(result(balls,[hit('ball-1'),pot('ball-1')]));expect(m.state.shotNumber).toBe(count);expect(()=>m.chooseBreak('spot')).toThrow();
  const choice=m.chooseBreak('rerack-self');expect(choice.rerack).toBe(true);expect(m.state).toMatchObject({currentPlayer:1,breakShot:true,ballInHand:true,ballInHandZone:'head-string'});
 });
 it('illegal-break acceptance leaves an open table and no mandatory ball-in-hand',()=>{
  const m=pool();m.confirmPlacement();m.apply(result(ballsAtLegalBreak(m),[hit('ball-1')]));const selected=m.chooseBreak('accept');expect(selected.rerack).toBeUndefined();expect(m.state).toMatchObject({currentPlayer:1,breakShot:false,ballInHand:false,openTable:true});
 });
 it('opponent rebreak action restores the original breaker',()=>{
  const m=pool();m.confirmPlacement();m.apply(result(ballsAtLegalBreak(m),[hit('ball-1')]));m.chooseBreak('rerack-opponent');expect(m.state).toMatchObject({currentPlayer:0,breakShot:true,ballInHand:true});
 });
 it('legal break-eight spot retains the same inning as the subsequent shot',()=>{
  const m=pool();m.confirmPlacement();let balls=ballsAtLegalBreak(m);m.apply(result(balls,[hit('ball-1'),pot('ball-8')]));expect(m.state.pendingChoice?.player).toBe(0);
  const action=m.chooseBreak('spot');expect(action.respots).toEqual(['ball-8']);expect(m.state.currentPlayer).toBe(0);
  m.apply(result(balls,[hit('ball-1'),pot('ball-1')],{calledBall:'ball-1',calledPocket:'tm'}));expect(m.state.players[0].innings).toBe(1);
 });
 it('foul break-eight spot belongs to the opponent and gives restricted placement',()=>{
  const m=pool();m.confirmPlacement();m.apply(result(ballsAtLegalBreak(m),[hit('ball-1'),pot('ball-8'),pot('white',4)]));const action=m.chooseBreak('spot');expect(action.respots).toEqual(['ball-8']);expect(m.state).toMatchObject({currentPlayer:1,ballInHand:true,ballInHandZone:'head-string',headStringRestriction:true});m.confirmPlacement();expect(m.state.headStringRestriction).toBe(true);
 });
 it('practice respots even an illegal ordinary 8 and suppresses competitive winner',()=>{
  const m=new MatchController({discipline:'eight-ball',mode:'practice',profile:'casual'});m.confirmPlacement();m.state.breakShot=false;m.state.headStringRestriction=false;
  const resultRule=m.apply(result(ballsAtLegalBreak(m),[hit('ball-8'),pot('ball-8')]));expect(resultRule.respots).toEqual(['ball-8']);expect(resultRule.winner).toBeUndefined();expect(m.state).toMatchObject({status:'playing',winner:null,currentPlayer:0});
 });
 it('reset clears stale groups, fouls, winners, choices and custom mutable names independently',()=>{
  const names:[string,string]=['A','B'];const m=new MatchController({discipline:'eight-ball',playerNames:names});names[0]='mutated';expect(m.state.players[0].name).toBe('A');
  m.state.players[0].group='solid';m.state.players[0].score=7;m.state.status='finished';m.state.winner=0;m.reset({discipline:'three-cushion',target:20});expect(m.state).toMatchObject({status:'playing',winner:null,openingRequired:true});expect(m.state.players[0]).toMatchObject({score:0,group:null,fouls:0});expect(m.config.target).toBe(20);
 });
});
