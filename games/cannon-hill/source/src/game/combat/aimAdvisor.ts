import type {Battle} from './battle';

export type HintBand = readonly [number,number];
export type AimHint =
  | {kind:'thinking'|'moving'}
  | {kind:'blocked';direction:1|-1}
  | {kind:'range';direction:1|-1;angle:HintBand;power:HintBand};

interface Sample {
  angle: number;
  power: number;
  quality: number;
  usable: boolean;
}

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
    const sample = (angle: number, power: number): Sample => {
      const r=b.dryShot(f.idx,f.slot,direction>0?angle:180-angle,power);
      const damage=foes.reduce((sum,p)=>sum+(r.damage[p.idx]??0),0);
      const friendly=allies.reduce((sum,p)=>sum+(r.damage[p.idx]??0),0);
      let distance=2000;
      for(const p of r.impacts) distance=Math.min(distance,Math.hypot(p.x-foe.x,p.y-(foe.y-20)));
      // 직격 한 발보다 여러 입력에서 상대 근처에 닿는 구간을 찾는다.
      const quality=Math.min(90,damage) - 2*friendly + r.enemyGroundHit*25 - distance/5;
      return {angle,power,quality,usable:friendly<=damage+20 && (damage>0 || distance<=140)};
    };

    const seeds: Sample[] = [];
    for(let angle=15;angle<=85;angle+=10)for(let power=20;power<=100;power+=10){
      seeds.push(sample(angle,power));
      yield;
    }
    seeds.sort((a, other) => other.quality - a.quality);
    const checked = new Set<string>();
    let best: {angle: HintBand; power: HintBand; score: number} | undefined;
    for (const seed of seeds) {
      const angleStart = Math.floor(seed.angle / 10) * 10;
      // 구간 중앙에 좋은 샷이 오도록 5 단위로 배치한다.
      const powerStart = Math.min(85, Math.floor((seed.power - 5) / 5) * 5);
      const key = `${angleStart}:${powerStart}`;
      if (checked.has(key)) continue;
      if (checked.size >= 6) break;
      checked.add(key);

      let usable = 0;
      let score = 0;
      for (const angleOffset of [2, 5, 8]) {
        for (const powerOffset of [3, 7.5, 12]) {
          const result = sample(angleStart + angleOffset, powerStart + powerOffset);
          const weight = angleOffset === 5 && powerOffset === 7.5 ? 2 : 1;
          score += Math.max(-200, result.quality) * weight;
          if (result.usable) usable += weight;
          yield;
        }
      }
      if (!usable && !seed.usable) continue;
      score = score / 10 + usable * 12 + seed.quality * 0.15;
      if (!best || score > best.score) {
        best = {angle: [angleStart, angleStart+10], power: [powerStart, powerStart+15], score};
      }
    }
    return best ? {kind:'range', direction, angle:best.angle, power:best.power} : {kind:'blocked',direction};
  }
}
