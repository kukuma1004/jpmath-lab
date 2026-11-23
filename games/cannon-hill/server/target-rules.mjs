import {
  BASE_RANGE, WIND_RANGE, DISTANCE_SCALE, KOREA_OFFSET_MS, DAY_MS, FINISH_GRACE_MS,
  DAY_DISTANCE_PERIOD, DAY_DISTANCE_SHIFT, DAY_WIND_PERIOD, MAX_POWER, MAX_SCORE, MAX_SHOT_SCORE, CENTER_SCORE, ROUNDS,
} from '../source/src/game/target/course.ts';

export const BRANCH = 'warureuTargetV1';
const owner = "auth != null && auth.uid == $uid && auth.token.firebase.sign_in_provider == 'anonymous'";
const koreaTime = `(now + ${KOREA_OFFSET_MS})`;
const currentDay = `((${koreaTime} - ${koreaTime} % ${DAY_MS}) / ${DAY_MS})`;
const canFinish = `(($day == ${currentDay} + '') || (${koreaTime} % ${DAY_MS} < ${FINISH_GRACE_MS} && $day == (${currentDay} - 1) + ''))`;
const rank = "newData.child('rank').val()";
const board = "newData.parent().parent().child('board/' + $uid)";
const proof = "newData.parent().parent().child('proof/' + $uid)";
const shots = ROUNDS.map((_, index) => `s${index}`);

function proofShot(index) {
  const [distance, wind] = ROUNDS[index];
  const day = "newData.parent().parent().child('day').val()";
  const dailyWind = wind === 0 ? '0' : `(${wind} + ${day} % ${DAY_WIND_PERIOD} - 2)`;
  const target = `(${distance} + (${day} % ${DAY_DISTANCE_PERIOD} - 6) * ${DAY_DISTANCE_SHIFT})`;
  const power = "newData.parent().child('power').val()";
  const landing = `(${power} * ${power} * (${BASE_RANGE} + ${WIND_RANGE} * ${dailyWind}))`;
  const value = "newData.val()";
  const factor = ROUNDS.length + 1;
  const center = `(${value} % ${factor})`;
  const points = `((${value} - ${center}) / ${factor})`;
  const delta = `(${landing} - ${target} * ${DISTANCE_SCALE})`;
  // Each rounded tenth has a half-tenth boundary. Check both sides of the reported score.
  const within = minimum => {
    const threshold = `((${MAX_SHOT_SCORE} - (${minimum})) * ${DISTANCE_SCALE / 10} + ${DISTANCE_SCALE / 20})`;
    return `(${delta} > 0 - ${threshold} && ${delta} < ${threshold})`;
  };
  const consistent = `(${points} == 0 || ${within(points)}) && !${within(`${points} + 1`)}`;
  const centered = `((${points} >= ${CENTER_SCORE} && ${center} == 1) || (${points} < ${CENTER_SCORE} && ${center} == 0))`;
  return {
    '.validate': "newData.hasChildren(['power', 'value'])",
    power: {'.validate': `newData.isNumber() && ${value} % 1 == 0 && ${value} >= 0 && ${value} <= ${MAX_POWER}`},
    value: {'.validate': `newData.isNumber() && ${value} % 1 == 0 && ${value} >= 0 && ${points} <= ${MAX_SHOT_SCORE} && ${centered} && ${consistent}`},
    '$other': {'.validate': false},
  };
}

export function targetRules() {
  const maxRank = MAX_SCORE * (ROUNDS.length + 1) + ROUNDS.length;
  const rankRule = {'.validate': `newData.isNumber() && newData.val() % 1 == 0 && newData.val() >= 1 && newData.val() <= ${maxRank}`};
  const ownWrite = (peer, condition) => `${owner} && ((!newData.exists() && !${peer}.exists()) || (${canFinish} && newData.exists() && (${condition})))`;
  return { [BRANCH]: { '$day': {
    board: {
      '.read': "$day.matches(/^[1-9][0-9]{3,6}$/) && query.orderByChild == 'rank' && query.limitToLast >= 1 && query.limitToLast <= 100",
      '.indexOn': ['rank'],
      '$uid': {
        '.read': owner,
        '.write': ownWrite(proof, `!data.exists() || (${rank} > data.child('rank').val() && now - data.child('submittedAt').val() >= 10000)`),
        '.validate': `newData.hasChildren(['rank', 'nickname', 'submittedAt']) && ${rank} == ${proof}.child('rank').val()`,
        rank: rankRule,
        nickname: {'.validate': 'newData.isString() && newData.val().matches(/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{1,12}$/) && newData.val().matches(/.*[^ ].*/) '},
        submittedAt: {'.validate': 'newData.isNumber() && newData.val() == now'},
        '$other': {'.validate': false},
      },
    },
    proof: { '$uid': {
      '.read': owner,
      '.write': ownWrite(board, `!data.exists() || ${rank} > data.child('rank').val()`),
      '.validate': `newData.hasChildren(${JSON.stringify(['day', 'rank', ...shots])}) && ${rank} == ${board}.child('rank').val() && ${rank} == ${shots.map(key => `newData.child('${key}/value').val()`).join(' + ')}`,
      day: {'.validate': "newData.isNumber() && newData.val() + '' == $day"},
      rank: rankRule,
      ...Object.fromEntries(shots.map((key, index) => [key, proofShot(index)])),
      '$other': {'.validate': false},
    }},
  }}};
}
