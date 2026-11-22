import { describe, expect, it } from 'vitest';
import { FourBallRules } from '../src/rules/FourBallRules';
import { ThreeCushionRules } from '../src/rules/ThreeCushionRules';
import { EightBallRules } from '../src/rules/EightBallRules';
import { MatchController } from '../src/rules/MatchController';
import { createPoolRack } from '../src/physics/pool';
import type { BallState, PhysicsEvent, ShotInput, ShotResult } from '../src/physics/types';
import type { Discipline, RuleContext } from '../src/rules/types';

const hit = (target: string, time = 1, cue = 'white'): PhysicsEvent => ({ type: 'ball-ball', ballA: cue, ballB: target, time, sequence: 0, speed: 1 });
const rail = (ballId = 'white', time = 2, side: 'left'|'right'|'top'|'bottom' = 'top'): PhysicsEvent => ({ type: 'cushion', ballId, rail: side, time, sequence: 0, speed: 1 });
const pot = (ballId: string, time = 3, pocketId = 'tm'): PhysicsEvent => ({ type: 'pocket', ballId, time, pocketId, sequence: 0, speed: 1 });
function shot(balls: BallState[], events: PhysicsEvent[], input: Partial<ShotInput> = {}): ShotResult {
  const after = structuredClone(balls);
  events.forEach(event => { if(event.type === 'pocket') { const ball = after.find(b => b.id === event.ballId); if(ball) { ball.pocketed = true; ball.pocketId = event.pocketId; } } });
  return { input: { ballId: 'white', angle: 0, power: .5, tip: { x: 0, y: 0 }, ...input }, before: { balls: structuredClone(balls), time: 0 }, after: { balls: after, time: 8 }, events: events.map((e,i)=>({...e,sequence:i})) };
}
function context(discipline: Discipline): RuleContext {
  const match = new MatchController({ discipline, profile: discipline === 'eight-ball' ? 'wpa' : 'domestic' });
  if(discipline === 'three-cushion')match.state.openingRequired=false;
  if(discipline === 'eight-ball'){ match.state.breakShot=false;match.state.ballInHand=false;match.state.headStringRestriction=false; }
  return { config: match.config, state: match.state, cueBall: match.cueBall };
}
function poolBalls(): BallState[] { const balls=createPoolRack(); balls.find(b=>b.id==='white')!.position.x=-.8; return balls; }
function carom(discipline: 'four-ball'|'three-cushion') { return new MatchController({discipline}).initialBalls(); }
function poolGroup(ctx: RuleContext, balls: BallState[], clear = false): void {
  ctx.state.openTable=false;ctx.state.players[0].group='solid';ctx.state.players[1].group='stripe';
  if(clear)for(const ball of balls)if((ball.number??0)>=1&&(ball.number??0)<=7)ball.pocketed=true;
}

describe('domestic four-ball profile',()=>{
  const rules=new FourBallRules();
  it('scores only contacts made directly by the current cue with both red balls, retaining the turn',()=>{
    const ctx=context('four-ball'),balls=carom('four-ball');
    expect(rules.evaluate(shot(balls,[hit('red'),hit('red2',2)]),ctx)).toMatchObject({scored:true,points:1,retainTurn:true,foul:null});
    expect(rules.evaluate(shot(balls,[hit('red'),hit('red',2),hit('red2',3,'red')]),ctx).scored).toBe(false);
  });
  it.each(['turn','penalty'] as const)('opponent cue contact invalidates a cannon under %s option',option=>{
    const ctx=context('four-ball');ctx.config.fourBallFoul=option;
    expect(rules.evaluate(shot(carom('four-ball'),[hit('red'),hit('red2',2),hit('yellow',3)]),ctx)).toMatchObject({scored:false,points:option==='penalty'?-1:0,retainTurn:false,foul:'상대 수구 접촉'});
  });
  it('lets an explicitly disabled opponent-cue rule retain an otherwise valid cannon',()=>{
    const ctx=context('four-ball');ctx.config.fourBallFoul='off';
    expect(rules.evaluate(shot(carom('four-ball'),[hit('yellow'),hit('red',2),hit('red2',3)]),ctx)).toMatchObject({scored:true,points:1,retainTurn:true});
  });
  it('rejects the wrong cue and supports the second player using yellow',()=>{
    const ctx=context('four-ball');ctx.cueBall='yellow';ctx.state.currentPlayer=1;
    expect(rules.evaluate(shot(carom('four-ball'),[hit('red'),hit('red2',2)]),ctx).foul).not.toBeNull();
    expect(rules.evaluate(shot(carom('four-ball'),[hit('red',1,'yellow'),hit('red2',2,'yellow')],{ballId:'yellow'}),ctx).scored).toBe(true);
  });
});

describe('three-cushion ordered contact adjudication',()=>{
  const rules=new ThreeCushionRules();
  it.each([0,1,2])('rejects %i cue cushions before second distinct object even if later cushions reach three',count=>{
    const ctx=context('three-cushion');
    const before=Array.from({length:count},(_,i)=>rail('white',2+i));
    const after=Array.from({length:4},(_,i)=>rail('white',7+i));
    expect(rules.evaluate(shot(carom('three-cushion'),[hit('red'),...before,hit('yellow',6),...after]),ctx).scored).toBe(false);
  });
  it.each([3,4])('counts %i cue contacts even on the same rail',count=>{
    const events=[hit('red'),...Array.from({length:count},(_,i)=>rail('white',i+2)),hit('yellow',9)];
    expect(rules.evaluate(shot(carom('three-cushion'),events),context('three-cushion'))).toMatchObject({scored:true,points:1,retainTurn:true});
  });
  it('counts cushions before the first object on an ordinary shot, while ignoring other-ball cushions',()=>{
    const balls=carom('three-cushion'),ctx=context('three-cushion');
    expect(rules.evaluate(shot(balls,[rail('white',.1),rail('white',.2),hit('yellow',.3),rail('white',.4),hit('red',.5)]),ctx).scored).toBe(true);
    expect(rules.evaluate(shot(balls,[hit('red'),rail('red',2),rail('red',3),rail('yellow',4),hit('yellow',5)]),ctx).scored).toBe(false);
  });
  it('does not treat a repeated hit on the same object as the second object',()=>{
    const events=[hit('red'),hit('red',1.5),rail('white',2),rail('white',3),rail('white',4),hit('yellow',5)];
    expect(rules.evaluate(shot(carom('three-cushion'),events),context('three-cushion')).scored).toBe(true);
  });
  it('sorts by physical time then stable sequence, not by array presentation',()=>{
    const result=shot(carom('three-cushion'),[hit('red',.1),rail('white',.2),rail('white',.3),rail('white',.4),hit('yellow',.5)]);
    result.events.reverse();expect(rules.evaluate(result,context('three-cushion')).scored).toBe(true);
  });
  it('requires a direct red-first opening and then accepts a properly completed opening cannon',()=>{
    const ctx=context('three-cushion');ctx.state.openingRequired=true;
    const rails=[rail('white',2),rail('white',3),rail('white',4)];
    expect(rules.evaluate(shot(carom('three-cushion'),[rail('white',.1),hit('red'),...rails,hit('yellow',5)]),ctx).foul).not.toBeNull();
    expect(rules.evaluate(shot(carom('three-cushion'),[hit('yellow'),...rails,hit('red',5)]),ctx).foul).not.toBeNull();
    expect(rules.evaluate(shot(carom('three-cushion'),[hit('red'),...rails,hit('yellow',5)]),ctx).scored).toBe(true);
  });
});

describe('WPA 2026 eight-ball non-break shots',()=>{
  const rules=new EightBallRules();
  it('establishes groups only on a legal called pot, preserving already sunk balls',()=>{
    const ctx=context('eight-ball'),balls=poolBalls();
    const events=[hit('ball-9'),pot('ball-1'),pot('ball-10',4)];
    expect(rules.evaluate(shot(balls,events,{calledBall:'ball-1',calledPocket:'tm'}),ctx)).toMatchObject({scored:true,retainTurn:true,assignedGroup:'solid'});
    const miss=rules.evaluate(shot(balls,events,{calledBall:'ball-2',calledPocket:'tm'}),ctx);expect(miss.assignedGroup).toBeUndefined();expect(miss.retainTurn).toBe(false);expect(miss.foul).toBeNull();
  });
  it('scratch on an otherwise correct open-table called pot leaves groups open and gives ball in hand',()=>{
    const ctx=context('eight-ball');
    const result=rules.evaluate(shot(poolBalls(),[hit('ball-1'),pot('ball-1'),pot('white',4)],{calledBall:'ball-1',calledPocket:'tm'}),ctx);
    expect(result).toMatchObject({scored:false,ballInHand:true,ballInHandZone:'anywhere'});expect(result.assignedGroup).toBeUndefined();
  });
  it('rejects the 8 as first object on a normal open table',()=>{
    const result=rules.evaluate(shot(poolBalls(),[hit('ball-8'),rail()]),context('eight-ball'));
    expect(result.foul).toContain('첫');expect(result.ballInHand).toBe(true);
  });
  it('uses legal simultaneous contact as first when an opponent ball is indistinguishable in time',()=>{
    const ctx=context('eight-ball'),balls=poolBalls();poolGroup(ctx,balls);
    expect(rules.evaluate(shot(balls,[hit('ball-9',1),hit('ball-1',1),rail('white',2)]),ctx).foul).toBeNull();
    expect(rules.evaluate(shot(balls,[hit('ball-9',1),hit('ball-1',1.01),rail('white',2)]),ctx).ballInHand).toBe(true);
  });
  it('requires a rail after legal first contact if no object ball is pocketed',()=>{
    const ctx=context('eight-ball'),balls=poolBalls();poolGroup(ctx,balls);
    expect(rules.evaluate(shot(balls,[rail('white',.2),hit('ball-1',1)]),ctx).foul).toContain('쿠션');
    expect(rules.evaluate(shot(balls,[hit('ball-1'),rail('ball-9',2)]),ctx).foul).toBeNull();
    expect(rules.evaluate(shot(balls,[hit('ball-1'),pot('ball-9',2)]),ctx).foul).toBeNull();
  });
  it('does not credit a collision against an object already frozen on that rail at the same instant',()=>{
    const ctx=context('eight-ball'),balls=poolBalls();poolGroup(ctx,balls);balls.find(b=>b.id==='ball-1')!.position.z=-1.27/2+.028575;
    expect(rules.evaluate(shot(balls,[hit('ball-1'),rail('ball-1',1)]),ctx).ballInHand).toBe(true);
    expect(rules.evaluate(shot(balls,[hit('ball-1'),rail('ball-1',2)]),ctx).foul).toBeNull();
  });
  it('a safety relinquishes the turn even if a called ball drops',()=>{
    const ctx=context('eight-ball'),balls=poolBalls();poolGroup(ctx,balls);
    expect(rules.evaluate(shot(balls,[hit('ball-1'),pot('ball-1')],{calledBall:'ball-1',calledPocket:'tm',safety:true}),ctx)).toMatchObject({scored:false,retainTurn:false,foul:null});
  });
  it('a casual profile can accept an uncalled regular pot without changing WPA call requirements',()=>{
    const balls=poolBalls(),ctx=context('eight-ball');ctx.config.profile='casual';ctx.config.callShots=false;
    expect(rules.evaluate(shot(balls,[hit('ball-1'),pot('ball-1')]),ctx).scored).toBe(true);
    ctx.config.profile='wpa';expect(rules.evaluate(shot(balls,[hit('ball-1'),pot('ball-1')]),ctx).scored).toBe(false);
  });
  it.each(['early','same-shot-last','wrong-pocket','scratch','safety'] as const)('loses for an illegal 8: %s',reason=>{
    const balls=poolBalls(),ctx=context('eight-ball');poolGroup(ctx,balls,reason!=='early'&&reason!=='same-shot-last');
    if(reason==='same-shot-last')for(const b of balls)if((b.number??0)>=1&&(b.number??0)<=6)b.pocketed=true;
    const events=[hit(reason==='same-shot-last'?'ball-7':'ball-8'),...(reason==='same-shot-last'?[pot('ball-7',2)]:[]),pot('ball-8',3),...(reason==='scratch'?[pot('white',4)]:[])];
    const result=rules.evaluate(shot(balls,events,{calledBall:'ball-8',calledPocket:reason==='wrong-pocket'?'br':'tm',safety:reason==='safety'}),ctx);
    expect(result.winner).toBe(1);expect(result.foul).not.toBeNull();
  });
  it('wins only when the group was clear before the shot and the 8 drops where called',()=>{
    const balls=poolBalls(),ctx=context('eight-ball');poolGroup(ctx,balls,true);
    expect(rules.evaluate(shot(balls,[hit('ball-8'),pot('ball-8')],{calledBall:'ball-8',calledPocket:'tm'}),ctx)).toMatchObject({scored:true,winner:0,foul:null});
  });
  it('a scratch while shooting at 8 is a foul, not automatic loss, when 8 remains on the table',()=>{
    const balls=poolBalls(),ctx=context('eight-ball');poolGroup(ctx,balls,true);
    const result=rules.evaluate(shot(balls,[hit('ball-8'),pot('white')],{calledBall:'ball-8',calledPocket:'tm'}),ctx);
    expect(result.ballInHand).toBe(true);expect(result.winner).toBeUndefined();
  });
  it('allows temporary claim of an already emptied group while the table is still open',()=>{
    const balls=poolBalls(),ctx=context('eight-ball');for(const b of balls)if((b.number??0)>=1&&(b.number??0)<=7)b.pocketed=true;
    const result=rules.evaluate(shot(balls,[hit('ball-8'),pot('ball-8')],{calledBall:'ball-8',calledPocket:'tm'}),ctx);
    expect(result).toMatchObject({winner:0,assignedGroup:'solid'});
  });
  it('enforces head-string placement and leave-and-return first contact using physical evidence',()=>{
    const balls=poolBalls(),ctx=context('eight-ball');ctx.state.headStringRestriction=true;balls.find(b=>b.id==='ball-1')!.position={x:-.8,z:.2};
    const direct=rules.evaluate(shot(balls,[hit('ball-1'),rail('ball-1',2)]),ctx);expect(direct.ballInHand).toBe(true);
    const crossed={...rail('white',.5),position:{x:.9,z:-.6}};
    expect(rules.evaluate(shot(balls,[crossed,hit('ball-1'),rail('ball-1',2)]),ctx).foul).toBeNull();
    const contact={...hit('ball-1'),positionB:{x:-.4,z:.2}};
    expect(rules.evaluate(shot(balls,[contact,rail('ball-1',2)]),ctx).foul).toBeNull();
    balls.find(b=>b.id==='white')!.position.x=-.635;expect(rules.evaluate(shot(balls,[contact,rail('ball-1',2)]),ctx).foul).toContain('놓아야');
  });
});

describe('WPA and casual break distinctions',()=>{
  const rules=new EightBallRules();
  function ctx(){const c=context('eight-ball');c.state.breakShot=true;return c;}
  it('requires four distinct object balls on rails if nothing drops, not four contacts by one ball',()=>{
    const balls=poolBalls();
    expect(rules.evaluate(shot(balls,[hit('ball-1'),...Array.from({length:4},(_,i)=>rail('ball-1',2+i))]),ctx()).choice?.kind).toBe('illegal-break');
    const result=rules.evaluate(shot(balls,[hit('ball-1'),...Array.from({length:4},(_,i)=>rail(`ball-${i+1}`,2+i))]),ctx());expect(result.foul).toBeNull();expect(result.choice).toBeUndefined();expect(result.retainTurn).toBe(false);
  });
  it('a legal object pot retains the turn but leaves the table open despite a nominal call',()=>{
    expect(rules.evaluate(shot(poolBalls(),[hit('ball-9'),pot('ball-1')],{calledBall:'ball-1',calledPocket:'tm'}),ctx())).toMatchObject({scored:true,retainTurn:true,points:0});
    expect(rules.evaluate(shot(poolBalls(),[hit('ball-9'),pot('ball-1')]),ctx()).assignedGroup).toBeUndefined();
  });
  it('offers the breaker spot or rebreak on a legal break 8, not an automatic win',()=>{
    const result=rules.evaluate(shot(poolBalls(),[hit('ball-8'),pot('ball-8')]),ctx());expect(result.winner).toBeUndefined();expect(result.choice).toMatchObject({kind:'break-eight',player:0});expect(result.choice?.options.map(o=>o.id)).toEqual(['spot','rerack-self']);
  });
  it('offers the opponent 8-spot with kitchen ball-in-hand or rebreak when 8 and cue drop',()=>{
    const result=rules.evaluate(shot(poolBalls(),[hit('ball-1'),pot('ball-8'),pot('white',4)]),ctx());expect(result.winner).toBeUndefined();expect(result.choice).toMatchObject({kind:'break-eight-foul',player:1});
  });
  it('break scratch gets a head-string hand-in-ball choice without a false instant loss',()=>{
    const result=rules.evaluate(shot(poolBalls(),[hit('ball-1'),pot('white')]),ctx());expect(result.choice?.options).toEqual([{id:'ball-in-hand',label:expect.any(String)}]);expect(result.winner).toBeUndefined();
  });
  it('the casual profile respots break 8 immediately and uses anywhere ball-in-hand for a break foul',()=>{
    const c=ctx();c.config.profile='casual';
    expect(rules.evaluate(shot(poolBalls(),[hit('ball-1'),pot('ball-8'),pot('white',4)]),c)).toMatchObject({respots:['ball-8'],ballInHand:true,ballInHandZone:'anywhere'});
  });
});
