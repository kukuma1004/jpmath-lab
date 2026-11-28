import {get,limitToLast,orderByChild,query,ref,serverTimestamp,set,update,type Database} from '@firebase/database';
import {FRIEND_FAST_CHARGE_RULESET, FRIEND_BRANCH, ROOM_LIST_LIMIT, ROOM_WAIT_MS, type MatchSide, type Profile, type RankMode, type RatingChange} from './protocol';
import {rankAfter,startingRank} from './rank';

type RankedPlayer = {uid:string;nickname:string};
type Finish = Record<`before${number}`|`after${number}`,number>;
const recordsPath = (mode:RankMode) => mode==='teams'?'rankedTeamRecords':'rankedRecords';
export const resultsPath = (mode:RankMode) => mode==='teams'?'rankedTeamResults':'rankedResults';

export class FirebaseRank {
  constructor(private readonly db:Database) {}

  async waiting(now:number):Promise<{code:string;created:number}[]> {
    const list = await get(query(this.at('rankedQueue'),orderByChild('created'),limitToLast(ROOM_LIST_LIMIT)));
    const valid:{code:string;created:number}[]=[];
    list.forEach(node=>{
      const {created,ruleset}=node.val();
      if(ruleset===FRIEND_FAST_CHARGE_RULESET&&created>now-ROOM_WAIT_MS)valid.push({code:node.key!,created});
    });
    return valid;
  }

  async profile(player:RankedPlayer,mode:RankMode='duel'):Promise<Profile> {
    const record = await get(this.at(recordsPath(mode)+'/'+player.uid));
    return (record.val() as Profile|null) ?? startingRank(player.nickname);
  }

  async board(mode:RankMode='duel'):Promise<Profile[]> {
    const records=await get(query(this.at(recordsPath(mode)),orderByChild('rating'),limitToLast(50)));
    const rows:Profile[]=[];
    records.forEach(row=>{rows.push(row.val() as Profile);});
    return rows.sort((a,b)=>b.rating-a.rating||b.wins-a.wins||a.nickname.localeCompare(b.nickname,'ko'));
  }

  async confirm(code:string, uid:string, winner:-1|0|1):Promise<void> {
    const vote=this.at(`rooms/${code}/verdicts/${uid}`);
    if(!(await get(vote)).exists())await set(vote,winner);
  }

  async withdraw(code:string,uid:string):Promise<void> {
    const path=this.at(`rooms/${code}/withdrawals/${uid}`);
    if(!(await get(path)).exists())await set(path,true);
  }

  async settle(code:string, players:readonly RankedPlayer[], mode:RankMode='duel', invite=false):Promise<void> {
    const resultPath=resultsPath(mode)+'/'+code;
    const result=this.at(resultPath);
    const [finished,votes,withdrawals]=await Promise.all([
      get(result),get(this.at(`rooms/${code}/verdicts`)),get(this.at(`rooms/${code}/withdrawals`)),
    ]);
    if(finished.exists()||players.length!==(mode==='teams'?4:2)||invite&&withdrawals.exists())return;
    const [host,guest]=players;
    const home=votes.child(host!.uid).val() as MatchSide|-1|null;
    const unanimous=home!==null&&players.every(player=>votes.child(player.uid).val()===home);
    const winner=unanimous?home:invite?null:withdrawals.child(host!.uid).val()===true?1:
      withdrawals.child(guest!.uid).val()===true?0:null;
    if(winner===null)return;
    for(let attempt=0;attempt<3;attempt++) {
      const profiles=await Promise.all(players.map(player=>this.profile(player,mode)));
      const averages=mode==='teams'?[(profiles[0]!.rating+profiles[2]!.rating)/2,(profiles[1]!.rating+profiles[3]!.rating)/2]:profiles.map(profile=>profile.rating);
      const summary:Record<string,unknown>={winner,created:serverTimestamp()};
      const writes:Record<string,unknown>={[resultPath]:summary};
      for(const [i,player] of players.entries()) {
        const side=i%2;
        const profile=profiles[i]!;
        const next=rankAfter(profile,averages[1-side]!,winner===-1?'draw':winner===side?'win':'loss',averages[side]!);
        writes[recordsPath(mode)+'/'+player.uid]={...next,lastGame:code};
        summary['p'+i]=player.uid;
        summary['before'+i]=profile.rating;
        summary['after'+i]=next.rating;
      }
      try {
        await update(this.at(''),writes);
        return;
      } catch(error) {
        if((await get(result)).exists())return;
        if(attempt===2)throw error;
      }
    }
  }

  change(data:Finish, seat:number, mode:RankMode):RatingChange {
    const rival=1-seat%2;
    const opponent=mode==='teams'?(data[`before${rival}`]!+data[`before${rival+2}`]!)/2:data[`before${rival}`]!;
    return {before:data[`before${seat}`]!,after:data[`after${seat}`]!,opponent};
  }

  private at(path:string) {return ref(this.db,path?FRIEND_BRANCH+'/'+path:FRIEND_BRANCH);}
}
