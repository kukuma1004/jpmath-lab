import { STARTING_RATING, type Profile } from './protocol';

export const RANKS = [
  {id:'bronze', title:'동장', min:0, mark:'◆'},
  {id:'silver', title:'은장', min:1000, mark:'✦'},
  {id:'gold', title:'금장', min:1150, mark:'✹'},
  {id:'jade', title:'비취장', min:1300, mark:'✧'},
  {id:'royal', title:'어사장', min:1450, mark:'❖'},
] as const;

export function rankTier(points:number) {
  for(let i=RANKS.length-1;i>0;i--)if(points>=RANKS[i]!.min)return RANKS[i]!;
  return RANKS[0];
}

export function rankBadge(points:number, label = false):string {
  const tier=rankTier(points);
  return `<span class="rank-medal rank-${tier.id}" aria-label="${tier.title}" title="${tier.title} · ${points}점"><span aria-hidden="true">${tier.mark}</span>${label?` ${tier.title}`:''}</span>`;
}

export function startingRank(nickname:string):Profile {
  return {nickname,rating:STARTING_RATING,wins:0,losses:0,draws:0};
}

export function rankAfter(profile:Profile, opponent:number, result:'win'|'loss'|'draw'):Profile {
  const difference = profile.rating-opponent;
  const stake = difference>=200 ? (result==='win'?16:32) : difference<=-200 ? (result==='win'?32:16) : 24;
  return {
    ...profile,
    rating:Math.max(0, profile.rating+(result==='win'?stake:result==='loss'?-stake:0)),
    wins:profile.wins+Number(result==='win'),
    losses:profile.losses+Number(result==='loss'),
    draws:profile.draws+Number(result==='draw'),
  };
}
