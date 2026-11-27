import {get,limitToLast,orderByChild,query,ref,serverTimestamp,set,update,type Database} from '@firebase/database';
import {FRIEND_FAST_CHARGE_RULESET, FRIEND_BRANCH, ROOM_LIST_LIMIT, ROOM_WAIT_MS, type Profile, type RatingChange} from './protocol';
import {rankAfter,startingRank} from './rank';

type RankedPlayer = {uid:string;nickname:string};
type Finish = {winner:-1|0|1;p0:string;p1:string;before0:number;before1:number;after0:number;after1:number};

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

  async profile(player:RankedPlayer):Promise<Profile> {
    const record = await get(this.at('rankedRecords/'+player.uid));
    return (record.val() as Profile|null) ?? startingRank(player.nickname);
  }

  async board():Promise<Profile[]> {
    const records=await get(query(this.at('rankedRecords'),orderByChild('rating'),limitToLast(50)));
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

  async settle(code:string, players:readonly [RankedPlayer, RankedPlayer]):Promise<void> {
    const result=this.at('rankedResults/'+code);
    const [finished,votes,withdrawals]=await Promise.all([
      get(result),get(this.at(`rooms/${code}/verdicts`)),get(this.at(`rooms/${code}/withdrawals`)),
    ]);
    if(finished.exists())return;
    const [host,guest]=players;
    const home=votes.child(host.uid).val(), away=votes.child(guest.uid).val();
    const hostLeft=withdrawals.child(host.uid).val()===true;
    const guestLeft=withdrawals.child(guest.uid).val()===true;
    const winner=home!==null&&home===away?home as -1|0|1:hostLeft?1:guestLeft?0:null;
    if(winner===null)return;
    for(let attempt=0;attempt<3;attempt++) {
      const [a,b]=await Promise.all(players.map(player=>this.profile(player)));
      const nextA=rankAfter(a!,b!.rating,winner===-1?'draw':winner===0?'win':'loss');
      const nextB=rankAfter(b!,a!.rating,winner===-1?'draw':winner===1?'win':'loss');
      try {
        await update(this.at(''),{
          ['rankedRecords/'+host.uid]:{...nextA,lastGame:code},
          ['rankedRecords/'+guest.uid]:{...nextB,lastGame:code},
          ['rankedResults/'+code]:{winner,p0:host.uid,p1:guest.uid,
            before0:a!.rating,before1:b!.rating,after0:nextA.rating,after1:nextB.rating,created:serverTimestamp()},
        });
        return;
      } catch(error) {
        if((await get(result)).exists())return;
        if(attempt===2)throw error;
      }
    }
  }

  change(data:Finish, seat:0|1):RatingChange {
    return seat===0?{before:data.before0,after:data.after0,opponent:data.before1}:
      {before:data.before1,after:data.after1,opponent:data.before0};
  }

  private at(path:string) {return ref(this.db,path?FRIEND_BRANCH+'/'+path:FRIEND_BRANCH);}
}
