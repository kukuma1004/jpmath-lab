import { PhysicsEngine } from '../physics/PhysicsEngine';
import { FIXED_DT } from '../physics/config';
import type { BallState, PhysicsEvent, ShotInput, ShotResult, Vec2 } from '../physics/types';
import { EightBallRules } from '../rules/EightBallRules';
import { FourBallRules } from '../rules/FourBallRules';
import { ThreeCushionRules } from '../rules/ThreeCushionRules';
import { groupOf, numberOf, otherBall, remainingGroup } from '../rules/events';
import type { DisciplineRules, RuleContext, RuleOutcome } from '../rules/types';
import { DIFFICULTY } from './difficulty';
import type { DifficultyConfig } from './difficulty';
import { cueId, generateCandidates } from './candidates';
import { angleTo,clamp,distance,pathClear,rng } from './geometry';
import type { AIRequest, AIResponse, Candidate } from './types';
export type { AIRequest, AIResponse } from './types';

interface Evaluated { candidate:Candidate; score:number; outcome:RuleOutcome; result:ShotResult; complete:boolean }
const RULES:Record<AIRequest['config']['discipline'],DisciplineRules>={
  'four-ball':new FourBallRules(),'three-cushion':new ThreeCushionRules(),'eight-ball':new EightBallRules(),
};
function normalizeShot(shot:ShotInput):ShotInput {
  const len=Math.hypot(shot.tip.x,shot.tip.y),f=len>.7?.7/len:1;
  return {...shot,power:clamp(shot.power,.08,1),tip:{x:shot.tip.x*f,y:shot.tip.y*f}};
}

function poolPosition(request:AIRequest,balls:BallState[],group:ReturnType<typeof groupOf>):number {
  const cue=balls.find(b=>b.id==='white');if(!cue||cue.pocketed)return -4;
  let live=group?remainingGroup(balls,group):balls.filter(b=>!b.pocketed&&numberOf(b.id,balls)>0&&numberOf(b.id,balls)!==8);
  if(!live.length)live=balls.filter(b=>!b.pocketed&&numberOf(b.id,balls)===8);
  let best=-2;
  for(const ball of live)for(const pocket of request.table.pockets??[]){
    const ghostDirection={x:ball.position.x-pocket.x,z:ball.position.z-pocket.z},len=Math.hypot(ghostDirection.x,ghostDirection.z)||1;
    const ghost={x:ball.position.x+ghostDirection.x/len*2*request.table.ballRadius,z:ball.position.z+ghostDirection.z/len*2*request.table.ballRadius};
    const clear=pathClear(cue.position,ghost,balls,request.table.ballRadius,['white',ball.id])&&pathClear(ball.position,pocket,balls,request.table.ballRadius,['white',ball.id]);
    if(clear)best=Math.max(best,1.5-distance(cue.position,ghost)*.45-distance(ball.position,pocket)*.25);
  }
  return best;
}
function caromPosition(request:AIRequest,balls:BallState[]):number {
  const cue=balls.find(b=>b.id===cueId(request));if(!cue)return 0;
  const targets=balls.filter(b=>b.id!==cue.id&&(request.config.discipline==='three-cushion'||b.color==='red'||b.color==='red2'));
  const spread=targets.length>=2?distance(targets[0].position,targets[1].position):1;
  const near=targets.reduce((sum,b)=>sum+distance(cue.position,b.position),0)/Math.max(1,targets.length);
  // Gathering in four-ball and a usable non-frozen cue position improve the next inning.
  return request.config.discipline==='four-ball'?2.2-spread-near*.4:1-near*.2;
}

/** All success/foul decisions consume the same engine event stream as actual play. */
function scoreShot(request:AIRequest,result:ShotResult,outcome:RuleOutcome,complete:boolean,budget:DifficultyConfig):number {
  if(!complete)return -100000;
  const shooter=request.state.currentPlayer;
  if(outcome.winner!==undefined)return outcome.winner===shooter?100000:outcome.winner==='draw'?1000:-100000;
  let score=outcome.scored?1000+Math.max(0,outcome.points)*15:0;
  if(outcome.foul)score-=1600*budget.foulWeight;
  if(outcome.choice)score-=300;
  const id=cueId(request),hits=new Set(result.events.map(e=>otherBall(e,id)).filter(Boolean));
  if(request.config.discipline==='eight-ball'){
    if(request.state.breakShot){
      const rails=new Set(result.events.filter(e=>e.type==='cushion'&&e.ballId!=='white').map(e=>e.type==='cushion'?e.ballId:''));
      score+=Math.min(4,rails.size)*12;
      score+=result.events.filter(e=>e.type==='pocket'&&e.ballId!=='white'&&e.ballId!=='ball-8').length*30;
      score+=result.after.balls.filter(b=>!b.pocketed&&b.id!=='white').reduce((s,b)=>s+Math.abs(b.position.z)*.3,0);
    }
    const group=outcome.assignedGroup??request.state.players[shooter].group;
    score+=poolPosition(request,result.after.balls,group)*budget.positionWeight*45;
    if(result.input.safety&&!outcome.foul){
      const opponentGroup=group?group==='solid'?'stripe':'solid':null;
      score-=poolPosition(request,result.after.balls,opponentGroup)*budget.positionWeight*20;
    }
  }else{
    score+=hits.size*15;
    if(request.config.discipline==='three-cushion'){
      const events=result.events.filter(e=>e.type==='ball-ball'||e.type==='cushion');
      let count=0;const seen=new Set<string>();
      for(const event of events){const hit=otherBall(event,id);if(hit)seen.add(hit);if(seen.size>=2)break;if(event.type==='cushion'&&event.ballId===id)count++;}
      score+=Math.min(3,count)*5;
    }
    score+=caromPosition(request,result.after.balls)*budget.positionWeight*30;
  }
  // Similar outcomes favour gentle, controllable shots instead of blind maximum power.
  score-=result.input.power*2;
  return score;
}

function runSimulation(request:AIRequest,candidate:Candidate,budget:DifficultyConfig):Evaluated {
  const engine=new PhysicsEngine(request.balls,request.table);
  const context:RuleContext={config:request.config,state:structuredClone(request.state),cueBall:cueId(request)};
  if(candidate.placement){
    if(!engine.placeBall('white',candidate.placement,request.state.ballInHandZone==='head-string'?'kitchen':'anywhere'))throw new Error('AI placement was rejected by physics');
    context.state.ballInHand=false;
  }
  const before=engine.snapshot();
  const shot=normalizeShot(candidate.shot);
  if(!engine.strike(shot))throw new Error('AI shot was rejected by physics');
  // Fixed operation budgets keep the chosen result independent of worker scheduling speed.
  for(let step=0;step<Math.ceil(budget.simulationSeconds/FIXED_DT)&&!engine.settled;step++)engine.step(FIXED_DT);
  const complete=engine.settled&&engine.safetyStops===0;
  const result:ShotResult={input:shot,before,after:engine.snapshot(),events:engine.events};
  const outcome=RULES[request.config.discipline].evaluate(result,context);
  return {candidate:{...candidate,shot},score:scoreShot(request,result,outcome,complete,budget),outcome,result,complete};
}

/** Synchronous pure planning API used inside a dedicated Worker and deterministic tests. */
export function planShot(request:AIRequest):AIResponse {
  const start=performance.now(),budget=DIFFICULTY[request.config.difficulty]??DIFFICULTY.normal;
  const id=cueId(request),cue=request.balls.find(b=>b.id===id);
  const target=request.balls.find(b=>b.id!==id&&!b.pocketed);
  const fallback:ShotInput={ballId:id,angle:cue&&target?angleTo(cue.position,target.position):0,power:.35,tip:{x:0,y:0}};
  const response=(changes:Partial<AIResponse>):AIResponse=>({requestId:request.requestId,shot:fallback,candidates:0,simulated:0,elapsedMs:performance.now()-start,score:0,rationale:'현재 배치를 분석했습니다.',...changes});
  if(request.state.status==='finished')return response({rationale:'종료된 경기에는 샷을 선택하지 않습니다.',error:'match-finished'});
  if(request.state.pendingChoice){
    const options=request.state.pendingChoice.options;
    const choice=(['ball-in-hand','spot','accept','rerack-self','rerack-opponent'] as const).find(value=>options.some(option=>option.id===value));
    return response({choice,rationale:'브레이크 처리 규칙에 따라 다음 배치를 선택합니다.'});
  }
  try{
    const candidates=generateCandidates(request,budget);
    if(!candidates.length)return response({error:'no-valid-candidate',rationale:'합법적인 샷 후보 또는 수구 배치를 찾지 못했습니다.'});
    const evaluations:Evaluated[]=[];
    let simulated=0;
    const liveBalls=request.balls.filter(ball=>!ball.pocketed).length;
    // Full pool racks cost O(n²) contact pairs. Reduce breadth rather than stopping
    // a simulation early or blocking the UI; the worker still finishes every rollout.
    const candidateLimit=request.config.discipline==='eight-ball'&&liveBalls>8?Math.max(12,Math.floor(budget.candidates*8/liveBalls)+8):budget.candidates;
    const refinementLimit=request.config.discipline==='eight-ball'&&liveBalls>8?Math.ceil(budget.refine/2):budget.refine;
    let selected=candidates.slice(0,candidateLimit);
    if(request.state.breakShot){
      // Cover placement and cut-angle families before refining one central break.
      const groups=new Map<string,Candidate[]>();
      for(const c of candidates){const key=c.placement?`${c.placement.x},${c.placement.z}`:'current';const group=groups.get(key)??[];group.push(c);groups.set(key,group);}
      selected=[];
      for(let round=0;selected.length<Math.min(candidateLimit,candidates.length);round++)for(const group of groups.values()){
        if(group[round])selected.push(group[round]);if(selected.length>=candidateLimit)break;
      }
    }
    for(const candidate of selected){
      evaluations.push(runSimulation(request,candidate,budget));simulated++;
    }
    evaluations.sort((a,b)=>b.score-a.score);
    // Better levels refine actual good simulations, not only adding less random noise.
    const leaders=evaluations.slice(0,Math.min(4,evaluations.length));
    for(let k=0;k<refinementLimit;k++){
      const leader=leaders[k%leaders.length],side=(Math.floor(k/leaders.length)%2===0?-1:1),round=Math.floor(k/(leaders.length*2));
      const angleDelta=[.0025,.0008,.00025][Math.min(round,2)]*side;
      const candidate={...leader.candidate,shot:{...leader.candidate.shot,angle:leader.candidate.shot.angle+angleDelta,power:clamp(leader.candidate.shot.power*(1+side*.045),.08,1)}};
      evaluations.push(runSimulation(request,candidate,budget));simulated++;
    }
    evaluations.sort((a,b)=>b.score-a.score);
    const best=evaluations[0],random=rng(request.seed);
    const shot=normalizeShot({...best.candidate.shot,angle:best.candidate.shot.angle+(random()*2-1)*budget.angleError,power:best.candidate.shot.power*(1+(random()*2-1)*budget.powerError)});
    // Evaluate the exact execution input too; no pre-noise success claim is returned as proof.
    const final=runSimulation(request,{...best.candidate,shot},budget);simulated++;
    return response({shot:final.candidate.shot,placement:final.candidate.placement,candidates:candidates.length,simulated,score:final.score,
      rationale:final.outcome.foul?'파울 위험이 남는 배치에서 가능한 경로를 비교했습니다.':final.outcome.scored?`${best.candidate.rationale} · 물리 시뮬레이션 득점 후보`:`${best.candidate.rationale} · 다음 배치를 고려한 샷`,
      error:final.complete?undefined:'simulation-horizon-or-safety-stop'});
  }catch(error){
    return response({error:error instanceof Error?error.message:String(error),rationale:'샷 계산 중 유효하지 않은 상태를 발견했습니다.'});
  }
}
