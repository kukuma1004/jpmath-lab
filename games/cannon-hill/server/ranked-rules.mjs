import { FRIEND_BALANCE_RULESET, FRIEND_FAST_CHARGE_RULESET, FRIEND_BRANCH, ROOM_LIST_LIMIT, ROOM_WAIT_MS, STARTING_RATING } from '../source/src/game/online/protocol.ts';

export function rankedRules(account) {
  const rootBranch = "root.child('" + FRIEND_BRANCH + "')";
  const room = rootBranch + ".child('rooms/' + $code)";
  const host = room + ".child('info/uid').val()";
  const guest = room + ".child('guest/uid').val()";
  const ranked = room + ".child('info/ranked').val() == true";
  const invite = room + ".child('info/rankInvite').val() == true";
  const teams = room + ".child('info/mode').val() == 'teams'";
  const started = room + ".child('wire/head').exists()";
  const finished = "(" + room + ".child('wire/head/done').val() == true)";
  const waiting = `now - ${room}.child('info/created').val() < ${ROOM_WAIT_MS}`;
  const participant = `(${host} == auth.uid || ${guest} == auth.uid || (${teams} && (${[1,2,3].map(i=>`${room}.child('seats/p${i}/uid').val() == auth.uid`).join(' || ')})))`;
  const valid = condition => ({'.validate':condition});
  const number = (lo,hi) => `newData.isNumber() && newData.val() % 1 == 0 && newData.val() >= ${lo} && newData.val() <= ${hi}`;
  const required = fields => `newData.hasChildren(${JSON.stringify(fields)})`;
  const child = (node,key) => `${node}.child('${key}').val()`;
  const verdict = (player) => `${room}.child('verdicts/' + ${player}).val()`;
  const gaveUp = (player) => `${room}.child('withdrawals/' + ${player}).val() == true`;
  const stats = ['wins','losses','draws'];
  const prior = (node,field,amount) => `((!${node}.child('${field}').exists() && ${amount} == ${field==='rating'?STARTING_RATING:0}) || ${child(node,field)} == ${amount})`;
  const ladder = (team) => {
    const records=team?'rankedTeamRecords':'rankedRecords';
    const results=team?'rankedTeamResults':'rankedResults';
    const indices=team?[0,1,2,3]:[0,1];
    const members=team?[host,...[1,2,3].map(i=>room + `.child('seats/p${i}/uid').val()`)]:[host,guest];
    const eligible=`${ranked} && ${team?`${teams} && ${invite}`:`!(${teams})`}`;
    const board = uid => `${rootBranch}.child('${records}/' + ${uid})`;
    const final = key => child('newData',key);
    const winner = final('winner');
    const before = i => final('before'+i);
    const after = i => final('after'+i);
    const canceled=`(${room}.child('wire/head/rankCanceled').val() == true || ${room}.child('withdrawals').exists())`;
    const agreed=`(${finished} && ${members.map(uid=>`${verdict(uid)} == ${winner}`).join(' && ')})`;
    const voluntary=`((${winner} == 0 && ${gaveUp(guest)}) || (${winner} == 1 && ${gaveUp(host)}))`;
    const consent=team?`${agreed} && !${canceled}`:
      `((${invite} && ${agreed} && !${canceled}) || (!(${invite}) && (${agreed} || ${voluntary})))`;
    const afterRating = i => {
      const side=i%2, other=1-side, threshold=team?400:200;
      const change=team?`(${before(side)} + ${before(side+2)} - ${before(other)} - ${before(other+2)})`:`(${before(side)} - ${before(other)})`;
      const above=`${change} >= ${threshold}`;
      const below=`${change} <= 0 - ${threshold}`;
      const close=`${change} > 0 - ${threshold} && ${change} < ${threshold}`;
      const win = (delta,condition) => `(${winner} == ${side} && ${condition} && ${after(i)} == ${before(i)} + ${delta})`;
      const loss = (delta,condition) => `(${winner} == ${other} && ${condition} && ((${before(i)} >= ${delta} && ${after(i)} == ${before(i)} - ${delta}) || (${before(i)} < ${delta} && ${after(i)} == 0)))`;
      return '(' + [
        `(${winner} == -1 && ${after(i)} == ${before(i)})`,
        win(16,above),win(32,below),win(24,close),loss(32,above),loss(16,below),loss(24,close),
      ].join(' || ')+')';
    };
    const linked = uid => `newData.parent().parent().child('${records}/' + ${uid} + '/lastGame').val() == $code`;
    const resultCode = child('newData','lastGame');
    const nextResult = `newData.parent().parent().child('${results}/' + ${resultCode})`;
    const oldResult = `${rootBranch}.child('${results}/' + ${resultCode})`;
    const finalWinner = child(nextResult,'winner');
    const seat = i => child(nextResult,'p'+i);
    const incremented = (field,condition) => {
      const out=child('newData',field);
      return `((${condition} && ${prior('data',field,`(${out} - 1)`)}) || (!(${condition}) && ${prior('data',field,out)}))`;
    };
    const resultSeat = i => `(${seat(i)} == $uid && ${child('newData','rating')} == ${child(nextResult,'after'+i)} && ${incremented('wins',`${finalWinner} == ${i%2}`)} && ${incremented('losses',`${finalWinner} == ${1-i%2}`)} && ${incremented('draws',`${finalWinner} == -1`)})`;
    return {
      [records]:{
        '.indexOn':['rating'],
        '.read':`${account} && query.orderByChild == 'rating' && query.limitToLast >= 1 && query.limitToLast <= 50`,
        $uid:{
          '.read':account,
          '.write':`${account} && newData.exists() && !${oldResult}.exists() && ${nextResult}.exists() && (${indices.map(i=>`${seat(i)} == auth.uid`).join(' || ')})`,
          '.validate':`${required(['nickname','rating',...stats,'lastGame'])} && (${indices.map(resultSeat).join(' || ')})`,
          nickname:valid(`newData.val() == ${rootBranch}.child('profiles/' + $uid).val()`),
          rating:valid(number(0,100000)),
          ...Object.fromEntries(stats.map(name=>[name,valid(number(0,1000000))])),
          lastGame:valid("newData.isString() && newData.val().matches(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/)"),
          $other:valid(false),
        },
      },
      [results]:{$code:{
        '.read':`${account} && ${participant}`,
        '.write':`${account} && ${eligible} && ${started} && ${participant} && ${members.map(uid=>`${uid} != null`).join(' && ')} && !data.exists() && newData.exists()`,
        '.validate':`${required(['winner','created',...indices.flatMap(i=>['p'+i,'before'+i,'after'+i])])} && ${consent} && ${indices.map(i=>`${linked(members[i])} && ${prior(board(members[i]),'rating',before(i))} && ${afterRating(i)}`).join(' && ')}`,
        winner:valid(number(-1,1)),
        ...Object.fromEntries(indices.flatMap(i=>[['p'+i,valid(`newData.val() == ${members[i]}`)],['before'+i,valid(number(0,100000))],['after'+i,valid(number(0,100000))]])),
        created:valid('newData.val() == now'),
        $other:valid(false),
      }},
    };
  };
  return {
    rooms:{
      verdicts:{'.read':`${account} && ${participant}`,$uid:{
        '.write':`${account} && ${ranked} && ${participant} && auth.uid == $uid && ${finished} && !data.exists() && newData.exists()`,
        '.validate':number(-1,1),
      }},
      withdrawals:{'.read':`${account} && ${participant}`,$uid:{
        '.write':`${account} && ${ranked} && ${participant} && auth.uid == $uid && ${started} && !${finished} && !data.exists() && newData.exists()`,
        '.validate':'newData.val() == true',
      }},
    },
    rankedQueue:{
      '.read':`${account} && query.orderByChild == 'created' && query.limitToLast >= 1 && query.limitToLast <= ${ROOM_LIST_LIMIT}`,
      '.indexOn':['created'],
      $code:{
        '.write':`${account} && ${ranked} && !(${invite}) && ((${host} == auth.uid && (!newData.exists() || (${waiting} && !${started} && ${guest} == null))) || (!newData.exists() && newData.parent().parent().child('rooms/' + $code + '/guest/uid').val() == auth.uid))`,
        '.validate':required(['created','ruleset']),
        created:valid(`newData.val() == ${room}.child('info/created').val()`),
        ruleset:valid(`newData.val() == ${room}.child('info/ruleset').val() && (newData.val() == ${FRIEND_BALANCE_RULESET} || newData.val() == ${FRIEND_FAST_CHARGE_RULESET})`),
        $other:valid(false),
      },
    },
    ...ladder(false),
    ...ladder(true),
  };
}
