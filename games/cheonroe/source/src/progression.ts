import type { HeroId } from './types';

/** Growth belongs to this run. Pickup power remains a separate, temporary weapon level. */
export const AWAKENING_MAX=8;
const NAMES=['초심','기운 개방','연계','각성','쌍성','비전','극의','천뢰'];
const rankOf=(rank:number)=>Math.max(1,Math.min(AWAKENING_MAX,Math.floor(Number.isFinite(rank)?rank:1)));
export function awakeningName(rank:number):string {return NAMES[rankOf(rank)-1];}

const HERO_GROWTH:Record<HeroId,{support:string;signature:string;charge:string[];every:number}>={
  rin:{support:'홍련 꽃불',signature:'추적 홍련',charge:['꽃잎 부채','홍련 부채','연화 난무','홍련 추적','쌍련 추적','비전 만개','극의 화무','천뢰 홍련'],every:.76},
  golem:{support:'철갑 포대',signature:'폭쇄 관통창',charge:['광선 축포','기운 광포','연계 광창','폭쇄 광창','쌍성 광창','비전 천공','극의 멸창','천뢰 천공'],every:.7},
  ryu:{support:'폭뢰 권령',signature:'파성 충격파',charge:['권기 파동','폭뢰 파동','연타 파동','파성 폭권','쌍성 폭권','비전 진각','극의 패권','천뢰 패왕'],every:.74},
  hanui:{support:'바람 깃궁',signature:'창천 화살비',charge:['바람 시위','기운 강궁','연계 천궁','창천 화살비','쌍성 화살비','비전 풍림','극의 천궁','천뢰 신궁'],every:.8},
  arang:{support:'동행 도깨비불',signature:'혼령 삼킴',charge:['원혼 채찍','기운 흑발','연계 원혼','혼령 삼킴','쌍성 원혼','비전 곡성','극의 해원','천뢰 해원'],every:.82}
};

function unlockAt(hero:HeroId,rank:number):string {
  const h=HERO_GROWTH[hero];
  switch(rank){
    case 1:return '기본 무공 · 마당 돌파마다 이번 출격의 각성 상승';
    case 2:return `${h.support} 1기 합류 · 차지 속도 증가`;
    case 3:return `${h.support} 연계 가속 · 공격력 32% 증가`;
    case 4:return `${h.signature} 개방 · 호위 2기`;
    case 5:return `${h.signature} 위력 강화 · 공격력 64% 증가`;
    case 6:return `${h.support} 3기 · 비전 공격 연속 발동`;
    case 7:return `${h.signature} 재사용 단축 · 공격력 96% 증가`;
    default:return `${h.support} 4기 · ${h.charge[7]} 완성`;
  }
}

export function getAwakening(hero:HeroId,rank:number,power=1):{
  rank:number;name:string;damageMultiplier:number;chargeRate:number;supportCount:number;supportEvery:number;
  signatureEvery:number;chargeName:string;unlock:string;nextUnlock:string;
} {
  const r=rankOf(rank),h=HERO_GROWTH[hero],pw=Math.max(1,Math.min(4,Math.floor(Number.isFinite(power)?power:1)));
  const supportCount=r<2?0:r<4?1:r<6?2:r<8?3:4;
  return {rank:r,name:awakeningName(r),damageMultiplier:1+.16*(r-1),chargeRate:1+.1*(r-1),supportCount,
    supportEvery:Math.max(.4,h.every-(r-2)*.045),signatureEvery:r<4?0:Math.max(2.6,4.8-(r-4)*.48),
    chargeName:h.charge[r-1],unlock:unlockAt(hero,r),
    nextUnlock:r<AWAKENING_MAX?`${r+1}단 ${awakeningName(r+1)} · ${unlockAt(hero,r+1)}`:`천뢰 완성 · 사격 ${pw}단과 함께 전력 전개`};
}

/** Stable offsets shared by simulation and renderer; every orb has a different silhouette position. */
export function supportPositions(hero:HeroId,rank:number):{x:number;y:number}[] {
  const n=getAwakening(hero,rank).supportCount;
  const rows=n===1?[-46]:n===2?[-52,52]:n===3?[-76,0,76]:n===4?[-96,-34,34,96]:[];
  const lean=hero==='golem'?10:hero==='hanui'?-8:0;
  return rows.map((y,i)=>({x:-50-(i%2)*18+lean,y}));
}
