import type {Battle} from './battle';

export type HintBand = readonly [number,number];
export type AimHint =
  | {kind:'thinking'|'moving'}
  | {kind:'blocked';direction:1|-1}
  | {kind:'range';direction:1|-1;angle:HintBand;power:HintBand};

/** 추천은 시작 범위만 제공한다. 정답 좌표·자동 조준·힘 보정은 하지 않는다. */
export class AimAdvisor {
  hint:AimHint|null=null;
  private key='';
  private owner:Battle|null=null;
  private search:Generator<void,AimHint,void>|null=null;

  reset():void {this.key='';this.owner=null;this.search=null;this.hint=null;}

  update(b:Battle,enabled:boolean,budgetMs=1.5,maxShots=10):AimHint|null {
    if(!enabled||!b.isPlayerPhase()){this.reset();return null;}
    const f=b.cur;
    if(!f.alive||!b.enemiesOf(f).some(p=>p.alive)){this.reset();return null;}
    if(!f.onGround||(b.input.move!==0&&f.moveLeft>0)){
      this.key='';this.search=null;this.hint={kind:'moving'};return this.hint;
    }
    const key=[b.turnNo,b.current,f.slot,b.wind,b.terrain.removedTotal,
      ...b.fighters.flatMap(p=>[p.charId,p.x.toFixed(1),p.y.toFixed(1),p.alive])].join(':');
    if(this.owner!==b||key!==this.key){
      this.owner=b;this.key=key;this.search=this.candidates(b);this.hint={kind:'thinking'};
    }
    if(!this.search)return this.hint;
    const start=performance.now();let n=0;
    while(n<maxShots&&performance.now()-start<budgetMs){
      const result=this.search.next();n++;
      if(result.done){this.hint=result.value;this.search=null;break;}
    }
    return this.hint;
  }

  private *candidates(b:Battle):Generator<void,AimHint,void> {
    const f=b.cur,foe=b.nearestEnemy(f),direction:1|-1=foe.x>=f.x?1:-1;
    const foes=b.enemiesOf(f).filter(p=>p.alive),allies=b.alliesOf(f).filter(p=>p.alive);
    let best:{angle:number;power:number;score:number;distance:number;damage:number;friendly:number}|null=null;
    // 10도·10힘 간격의 거친 후보만 조사하고 범위로 묶는다. 세밀한 명중값은 찾지 않는다.
    for(let angle=15;angle<=85;angle+=10)for(let power=20;power<=100;power+=10){
      const r=b.dryShot(f.idx,f.slot,direction>0?angle:180-angle,power);
      const damage=foes.reduce((sum,p)=>sum+(r.damage[p.idx]??0),0);
      const friendly=allies.reduce((sum,p)=>sum+(r.damage[p.idx]??0),0);
      let distance=2000;
      for(const p of r.impacts)distance=Math.min(distance,Math.hypot(p.x-foe.x,p.y-(foe.y-20)));
      const score=damage-2*friendly+r.enemyGroundHit*35-distance/7-r.flightTime*0.3;
      if(!best||score>best.score)best={angle,power,score,distance,damage,friendly};
      yield;
    }
    if(!best||(best.damage<=0&&best.distance>240)||best.friendly>best.damage+40)return {kind:'blocked',direction};
    const angleLo=Math.min(80,Math.floor(best.angle/10)*10);
    const powerLo=Math.min(85,Math.floor(best.power/15)*15);
    return {kind:'range',direction,angle:[angleLo,angleLo+10],power:[powerLo,powerLo+15]};
  }
}
