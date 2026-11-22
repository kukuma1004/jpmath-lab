import { canPlaceBall, getPocketGeometry } from '../physics/pool';
import { shotSpeedLimit } from '../physics/config';
import type { BallState, ShotInput, Vec2 } from '../physics/types';
import { groupOf, numberOf, remainingGroup } from '../rules/events';
import type { AIRequest, Candidate } from './types';
import type { DifficultyConfig } from './difficulty';
import { angleTo,clamp,distance,mirroredPoints,pathClear,unit } from './geometry';

const tipVariants=[{x:0,y:0},{x:0,y:.35},{x:0,y:-.35},{x:.35,y:0},{x:-.35,y:0},{x:.25,y:-.25}];
export function cueId(request:AIRequest):string {return request.config.discipline==='eight-ball'?'white':request.state.currentPlayer===0?'white':'yellow';}
function legalPoolTargets(request:AIRequest):BallState[]{
  const group=request.state.players[request.state.currentPlayer].group;
  const live=request.balls.filter(b=>!b.pocketed&&b.id!=='white');
  if(!group)return live.filter(b=>numberOf(b.id,request.balls)!==8);
  const left=remainingGroup(request.balls,group);
  return left.length?left:live.filter(b=>numberOf(b.id,request.balls)===8);
}
export function placementOptions(request:AIRequest,budget:DifficultyConfig):Vec2[]{
  if(!request.state.ballInHand)return [];
  const table=request.table,zone=request.state.ballInHandZone==='head-string'?'kitchen':'anywhere';
  const points:Vec2[]=[];
  const add=(p:Vec2)=>{if(canPlaceBall(table,request.balls,'white',p,zone)&&!points.some(q=>distance(p,q)<.04))points.push(p);};
  const existing=request.balls.find(b=>b.id==='white');if(existing&&!existing.pocketed)add(existing.position);
  if(request.state.breakShot)for(const z of [0,-.12,.12,-.25,.25])add({x:-table.width*.33,z});
  else for(const ball of legalPoolTargets(request))for(const pocket of getPocketGeometry(table)){
    const u=unit(ball.position,pocket.throat.center);
    for(const distance of [.22,.38,.56])add({x:ball.position.x-u.x*distance,z:ball.position.z-u.z*distance});
  }
  for(let x=0;x<9;x++)for(let z=0;z<5;z++)add({x:-table.width*.42+x*table.width*.105,z:-table.height*.35+z*table.height*.175});
  return points.slice(0,budget.placementSamples);
}

export function generateCandidates(request:AIRequest,budget:DifficultyConfig):Candidate[]{
  const id=cueId(request),baseCue=request.balls.find(b=>b.id===id);
  if(!baseCue)return [];
  const generated:Candidate[]=[];
  const placements=request.state.ballInHand?placementOptions(request,budget):[undefined];
  const add=(angle:number,power:number,priority:number,rationale:string,placement?:Vec2,calledBall?:string,calledPocket?:string,tip={x:0,y:0},safety=false)=>{
    if(!Number.isFinite(angle))return;
    const shot:ShotInput={ballId:id,angle,power:clamp(power,.08,1),tip:{...tip},calledBall,calledPocket,safety};
    generated.push({shot,placement:placement?{...placement}:undefined,priority,rationale});
  };
  for(const placement of placements){
    const cue=placement??baseCue.position;
    if(request.config.discipline==='eight-ball'){
      if(request.state.breakShot){
        const apex=request.balls.find(b=>numberOf(b.id,request.balls)===1&&!b.pocketed)??legalPoolTargets(request)[0];
        if(apex)for(const power of [1,.93,.85])for(const offset of [-.032,.032,0,-.02,.02,-.008,.008])add(angleTo(cue,apex.position)+offset,power,10-(1-power),'브레이크 분산',placement);
        continue;
      }
      for(const ball of legalPoolTargets(request))for(const pocket of getPocketGeometry(request.table)){
        const toPocket=unit(ball.position,pocket.throat.center),ghost={x:ball.position.x-toPocket.x*2*request.table.ballRadius,z:ball.position.z-toPocket.z*2*request.table.ballRadius};
        const incoming=unit(cue,ghost),cut=incoming.x*toPocket.x+incoming.z*toPocket.z;
        if(cut<.07)continue;
        const objectClear=pathClear(ball.position,pocket.throat.center,request.balls,request.table.ballRadius,[id,ball.id]);
        const cueClear=pathClear(cue,ghost,request.balls,request.table.ballRadius,[id,ball.id]);
        const length=distance(cue,ghost)+distance(ball.position,pocket.throat.center)/Math.max(.2,cut);
        // Rolling-energy estimate merely seeds speeds. Every candidate is then physically simulated.
        const power=clamp((Math.sqrt(.32*length)+.34)/shotSpeedLimit(request.table)/.7,.08,.72);
        const priority=(objectClear?4:-3)+(cueClear?4:-3)+cut*3-length*.35+(numberOf(ball.id,request.balls)===8?1:0);
        for(const multiplier of [1,1.2,.85])add(angleTo(cue,ghost),power*multiplier,priority-Math.abs(multiplier-1)*.3,'직접 포켓과 다음 배치',placement,ball.id,pocket.pocket.id);
        for(let k=1;k<=budget.spinVariants;k++)add(angleTo(cue,ghost),power,priority-.25-k*.03,'포켓 후 수구 위치 제어',placement,ball.id,pocket.pocket.id,tipVariants[k]);
        if(budget.cushionDepth>0){
          for(const target of mirroredPoints(ghost,request.table,1).filter(p=>p.rails===1))add(angleTo(cue,target.point),Math.max(.35,power*1.35),priority-4,'쿠션 경유 포켓 후보',placement,ball.id,pocket.pocket.id);
        }
      }
      // A legal low-risk contact is useful when a direct pot is obstructed, not a random shot.
      for(const target of legalPoolTargets(request))for(const power of [.25,.45])add(angleTo(cue,target.position),power,-2,'안전한 목적구 접촉과 수비',placement,target.id,undefined,{x:0,y:0},true);
    }else{
      const targets=request.balls.filter(b=>!b.pocketed&&b.id!==id&&(request.config.discipline==='three-cushion'||b.color==='red'||b.color==='red2'));
      const firstTargets=request.config.discipline==='three-cushion'&&request.state.openingRequired?targets.filter(b=>b.color==='red'):targets;
      const three=request.config.discipline==='three-cushion';
      for(const first of firstTargets){
        const direct=angleTo(cue,first.position),maxCut=Math.asin(clamp(2*request.table.ballRadius/distance(cue,first.position),0,.98));
        for(const fraction of [0,-.25,.25,-.55,.55,-.8,.8,-.94,.94])for(const power of (three?[.6,.8,.95]:[.23,.36,.52,.72])){
          add(direct+fraction*maxCut,power,(three?2:4)-Math.abs(fraction)*.1,'목적구 두께와 파워 비교',placement);
        }
        const seconds=targets.filter(b=>b.id!==first.id);
        for(const second of seconds){
          const depth=budget.cushionDepth;
          const images=mirroredPoints(second.position,request.table,depth).filter(p=>three?p.rails>=3:p.rails<=depth);
          for(const image of images){
            const tangent=unit(first.position,image.point);
            for(const sign of [-1,1]){
              const normal={x:-tangent.z*sign,z:tangent.x*sign};
              const ghost={x:first.position.x-normal.x*2*request.table.ballRadius,z:first.position.z-normal.z*2*request.table.ballRadius};
              const incoming=unit(cue,ghost),normalSpeed=incoming.x*normal.x+incoming.z*normal.z;
              const tangentSpeed=incoming.x*tangent.x+incoming.z*tangent.z;
              if(normalSpeed<=.08||tangentSpeed<=.06)continue;
              const total=distance(cue,ghost)+distance(first.position,image.point)/Math.max(.2,tangentSpeed);
              const p=three?clamp(.35+Math.sqrt(total)*.14,.45,1):clamp(.14+Math.sqrt(total)*.13,.15,.75);
              const clear=pathClear(cue,ghost,request.balls,request.table.ballRadius,[id,first.id]);
              const priority=(three?6:8)+(clear?1:-4)-total*.22-image.rails*.08;
              for(const power of [p,p*1.2,p*.85])add(angleTo(cue,ghost),power,priority,'충돌 후 쿠션 조합',placement);
              for(let k=1;k<=budget.spinVariants;k++)add(angleTo(cue,ghost),p,priority-.2-k*.02,'쿠션 경로와 회전 제어',placement,undefined,undefined,tipVariants[k]);
            }
          }
        }
        if(three&&!request.state.openingRequired)for(const image of mirroredPoints(first.position,request.table,budget.cushionDepth).filter(p=>p.rails>0)){
          for(const power of [.65,.9])add(angleTo(cue,image.point),power,.5,'목적구 전 쿠션 경로',placement);
        }
      }
    }
  }
  // Preserve diverse angles/speeds/spins rather than spending the whole budget on one pocket.
  generated.sort((a,b)=>b.priority-a.priority);
  const seen=new Set<string>();
  return generated.filter(candidate=>{
    const s=candidate.shot,p=candidate.placement;
    const key=[Math.round(s.angle*1e6),Math.round(s.power*1e4),s.tip.x,s.tip.y,s.calledBall,s.calledPocket,p?.x.toFixed(3),p?.z.toFixed(3),s.safety].join('|');
    if(seen.has(key))return false;seen.add(key);return true;
  });
}
