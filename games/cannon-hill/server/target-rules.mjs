import {
  BASE_RANGE, WIND_RANGE, FLOOR_HEIGHT, WALL_SPAN, MIN_SLOPE, MAX_SLOPE, SLOPE_SCALE, MAX_POWER, MAX_SCORE,
  MAX_SHOT_SCORE, CENTER_SCORE, ROUNDS,
} from '../source/src/game/target/course.ts';

export const BRANCH = 'warureuTargetV2';
const owner = "auth != null && auth.uid == $uid && auth.token.firebase.sign_in_provider == 'anonymous'";
const rank = "newData.child('rank').val()";
const board = "newData.parent().parent().child('board/' + $uid)";
const proof = "newData.parent().parent().child('proof/' + $uid)";
const shots = ROUNDS.map((_, index) => `s${index}`);

function proofShot(index) {
  const {distance, height, wind, wall} = ROUNDS[index];
  const power = "newData.parent().child('power').val()";
  const slope = "(newData.parent().child('slope').val() / " + SLOPE_SCALE + ")";
  const strength = `(${power} / ${MAX_POWER})`;
  const curvature = `((1 + ${slope} * ${slope}) / (${2 * (BASE_RANGE + WIND_RANGE * wind)} * ${strength} * ${strength}))`;
  const arcAt = x => `(${x} * ${slope} - ${x * x} * ${curvature})`;
  const targetHeight = arcAt(distance);
  const clearWall = wall ? ` && ${arcAt(wall.distance)} > ${wall.height} && ${arcAt(wall.distance + WALL_SPAN)} > ${wall.height}` : '';
  const reachable = `(${power} > 0 && ${targetHeight} >= ${FLOOR_HEIGHT}${clearWall})`;
  const value = "newData.val()";
  const factor = ROUNDS.length + 1;
  const center = `(${value} % ${factor})`;
  const points = `((${value} - ${center}) / ${factor})`;
  const delta = `(${targetHeight} - (${height}))`;
  // Each rounded tenth has a half-tenth boundary. Check both sides of the reported score.
  const within = minimum => {
    const threshold = `((${MAX_SHOT_SCORE} - (${minimum}) + 0.5) / 10)`;
    return `(${delta} > 0 - ${threshold} && ${delta} < ${threshold})`;
  };
  const consistent = `(!${reachable} && ${points} == 0) || (${reachable} && (${points} == 0 || ${within(points)}) && !${within(`${points} + 1`)})`;
  const centered = `((${points} >= ${CENTER_SCORE} && ${center} == 1) || (${points} < ${CENTER_SCORE} && ${center} == 0))`;
  return {
    '.validate': "newData.hasChildren(['power', 'slope', 'value'])",
    power: {'.validate': `newData.isNumber() && ${value} % 1 == 0 && ${value} >= 0 && ${value} <= ${MAX_POWER}`},
    slope: {'.validate': `newData.isNumber() && ${value} % 1 == 0 && ${value} >= ${MIN_SLOPE} && ${value} <= ${MAX_SLOPE}`},
    value: {'.validate': `newData.isNumber() && ${value} % 1 == 0 && ${value} >= 0 && ${points} <= ${MAX_SHOT_SCORE} && ${centered} && (${consistent})`},
    '$other': {'.validate': false},
  };
}

export function targetRules() {
  const maxRank = MAX_SCORE * (ROUNDS.length + 1) + ROUNDS.length;
  const rankRule = {'.validate': `newData.isNumber() && newData.val() % 1 == 0 && newData.val() >= 1 && newData.val() <= ${maxRank}`};
  const ownWrite = (peer, condition) => `${owner} && ((!newData.exists() && !${peer}.exists()) || (newData.exists() && (${condition})))`;
  return { [BRANCH]: {
    board: {
      '.read': "query.orderByChild == 'rank' && query.limitToLast >= 1 && query.limitToLast <= 100",
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
      '.validate': `newData.hasChildren(${JSON.stringify(['rank', ...shots])}) && ${rank} == ${board}.child('rank').val() && ${rank} == ${shots.map(key => `newData.child('${key}/value').val()`).join(' + ')}`,
      rank: rankRule,
      ...Object.fromEntries(shots.map((key, index) => [key, proofShot(index)])),
      '$other': {'.validate': false},
    }},
  }};
}
