import { FRIEND_BALANCE_RULESET, FRIEND_FAST_CHARGE_RULESET, FRIEND_BRANCH, ROOM_LIST_LIMIT, ROOM_WAIT_MS, STARTING_RATING } from '../source/src/game/online/protocol.ts';

export function rankedRules(account) {
  const rootBranch = "root.child('" + FRIEND_BRANCH + "')";
  const room = rootBranch + ".child('rooms/' + $code)";
  const host = room + ".child('info/uid').val()";
  const guest = room + ".child('guest/uid').val()";
  const ranked = room + ".child('info/ranked').val() == true";
  const started = room + ".child('wire/head').exists()";
  const finished = "(" + room + ".child('wire/head/done').val() == true)";
  const waiting = `now - ${room}.child('info/created').val() < ${ROOM_WAIT_MS}`;
  const participant = `(${host} == auth.uid || ${guest} == auth.uid)`;
  const valid = condition => ({'.validate':condition});
  const number = (lo,hi) => `newData.isNumber() && newData.val() % 1 == 0 && newData.val() >= ${lo} && newData.val() <= ${hi}`;
  const required = fields => `newData.hasChildren(${JSON.stringify(fields)})`;
  const child = (node,key) => `${node}.child('${key}').val()`;
  const verdict = (player) => `${room}.child('verdicts/' + ${player}).val()`;
  const gaveUp = (player) => `${room}.child('withdrawals/' + ${player}).val() == true`;
  const board = uid => `${rootBranch}.child('rankedRecords/' + ${uid})`;
  const final = key => child('newData',key);
  const resultWinner = final('winner');
  const consent = `(${finished} && ${verdict(host)} == ${resultWinner} && ${verdict(guest)} == ${resultWinner})`;
  const authorizedResult = `(${consent} || (${resultWinner} == 0 && ${gaveUp(guest)}) || (${resultWinner} == 1 && ${gaveUp(host)}))`;
  const stats = ['wins','losses','draws'];
  const before = i => final('before'+i);
  const after = i => final('after'+i);
  const prior = (node,field,amount) => `((!${node}.child('${field}').exists() && ${amount} == ${field==='rating'?STARTING_RATING:0}) || ${child(node,field)} == ${amount})`;
  const afterRating = i => {
    const other=1-i;
    const change=`(${before(i)} - ${before(other)})`;
    const win = (delta,condition) => `(${resultWinner} == ${i} && ${condition} && ${after(i)} == ${before(i)} + ${delta})`;
    const loss = (delta,condition) => `(${resultWinner} == ${other} && ${condition} && ((${before(i)} >= ${delta} && ${after(i)} == ${before(i)} - ${delta}) || (${before(i)} < ${delta} && ${after(i)} == 0)))`;
    return '(' + [
      `(${resultWinner} == -1 && ${after(i)} == ${before(i)})`,
      win(16,`${change} >= 200`),win(32,`${change} <= 0 - 200`),win(24,`${change} > 0 - 200 && ${change} < 200`),
      loss(32,`${change} >= 200`),loss(16,`${change} <= 0 - 200`),loss(24,`${change} > 0 - 200 && ${change} < 200`),
    ].join(' || ')+')';
  };
  const linked = uid => `newData.parent().parent().child('rankedRecords/' + ${uid} + '/lastGame').val() == $code`;
  const resultCode = child('newData','lastGame');
  const nextResult = `newData.parent().parent().child('rankedResults/' + ${resultCode})`;
  const oldResult = `${rootBranch}.child('rankedResults/' + ${resultCode})`;
  const finalWinner = child(nextResult,'winner');
  const seat = i => child(nextResult,'p'+i);
  const incremented = (field,condition) => {
    const out=child('newData',field);
    return `((${condition} && ${prior('data',field,`(${out} - 1)`)}) || (!(${condition}) && ${prior('data',field,out)}))`;
  };
  const resultSeat = i => `(${seat(i)} == $uid && ${child('newData','rating')} == ${child(nextResult,'after'+i)} && ${incremented('wins',`${finalWinner} == ${i}`)} && ${incremented('losses',`${finalWinner} == ${1-i}`)} && ${incremented('draws',`${finalWinner} == -1`)})`;
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
        '.write':`${account} && ${ranked} && ((${host} == auth.uid && (!newData.exists() || (${waiting} && !${started} && ${guest} == null))) || (!newData.exists() && newData.parent().parent().child('rooms/' + $code + '/guest/uid').val() == auth.uid))`,
        '.validate':required(['created','ruleset']),
        created:valid(`newData.val() == ${room}.child('info/created').val()`),
        ruleset:valid(`newData.val() == ${room}.child('info/ruleset').val() && (newData.val() == ${FRIEND_BALANCE_RULESET} || newData.val() == ${FRIEND_FAST_CHARGE_RULESET})`),
        $other:valid(false),
      },
    },
    rankedRecords:{
      '.indexOn':['rating'],
      '.read':`${account} && query.orderByChild == 'rating' && query.limitToLast >= 1 && query.limitToLast <= 50`,
      $uid:{
        '.read':account,
        '.write':`${account} && newData.exists() && !${oldResult}.exists() && ${nextResult}.exists() && (${seat(0)} == auth.uid || ${seat(1)} == auth.uid)`,
        '.validate':`${required(['nickname','rating',...stats,'lastGame'])} && (${resultSeat(0)} || ${resultSeat(1)})`,
        nickname:valid(`newData.val() == ${rootBranch}.child('profiles/' + $uid).val()`),
        rating:valid(number(0,100000)),
        ...Object.fromEntries(stats.map(name=>[name,valid(number(0,1000000))])),
        lastGame:valid("newData.isString() && newData.val().matches(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/)"),
        $other:valid(false),
      },
    },
    rankedResults:{$code:{
      '.read':`${account} && ${participant}`,
      '.write':`${account} && ${ranked} && ${started} && ${participant} && ${guest} != null && !data.exists() && newData.exists()`,
      '.validate':`${required(['winner','p0','p1','before0','before1','after0','after1','created'])} && ${authorizedResult} && ${linked(host)} && ${linked(guest)} && ${prior(board(host),'rating',before(0))} && ${prior(board(guest),'rating',before(1))} && ${afterRating(0)} && ${afterRating(1)}`,
      winner:valid(number(-1,1)),
      p0:valid(`newData.val() == ${host}`),p1:valid(`newData.val() == ${guest}`),
      before0:valid(number(0,100000)),before1:valid(number(0,100000)),
      after0:valid(number(0,100000)),after1:valid(number(0,100000)),
      created:valid('newData.val() == now'),
      $other:valid(false),
    }},
  };
}
