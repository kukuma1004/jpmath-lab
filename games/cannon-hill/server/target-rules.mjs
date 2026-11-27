import {
  BASE_RANGE, WIND_RANGE, FLOOR_HEIGHT, WALL_SPAN, MIN_SLOPE, MAX_SLOPE, SLOPE_SCALE, MAX_POWER, MAX_SCORE,
  MAX_SHOT_SCORE, CENTER_SCORE, COURSE_LENGTH, MAX_COURSE_SEED, COURSE_ROLLS, COURSE_STRIDES, NEAR_DISTANCE,
  BANDS, WALL_POSITION_PERCENT, WALL_POSITION_SPREAD, WALL_HEIGHT_RANGE_PERCENT, WALL_HEIGHT_TARGET_PERCENT, TARGET_RANK_BRANCH,
} from '../source/src/game/target/course.ts';

export const BRANCH = TARGET_RANK_BRANCH;
const owner = "auth != null && auth.uid == $uid && auth.token.firebase.sign_in_provider == 'anonymous'";
const rank = "newData.child('rank').val()";
const board = "newData.parent().parent().child('board/' + $uid)";
const proof = "newData.parent().parent().child('proof/' + $uid)";
const shots = COURSE_ROLLS.map((_, index) => `s${index}`);
const floorDiv = (value, divisor) => `((${value} - ${value} % ${divisor}) / ${divisor})`;
const field = name => `newData.parent().child('${name}').val()`;
const tierAt = (seed, index, stride) => `((${seed} % ${COURSE_LENGTH} + ${index * stride}) % ${COURSE_LENGTH})`;

function courseFields(index) {
  const seed = "newData.parent().parent().child('seed').val()";
  const strideIndex = `(${floorDiv(seed, 10)} % ${COURSE_STRIDES.length})`;
  const roll = `((${seed} * ${COURSE_ROLLS[index]} + ${(index + 1) * 104729}) % ${MAX_COURSE_SEED + 1})`;
  const forTier = make => '(' + COURSE_STRIDES.map((stride, i) => {
    const tier = tierAt(seed, index, stride);
    return `(${strideIndex} == ${i} && (${make(tier)}))`;
  }).join(' || ') + ')';
  const check = expression => ({'.validate': `newData.isNumber() && (${expression})`});
  const wallHeight = `((${field('height')} + ${BANDS[2]}) * ${WALL_HEIGHT_TARGET_PERCENT} + ${field('distance')} * ${WALL_HEIGHT_RANGE_PERCENT} + 99)`;
  return {
    distance: check(forTier(tier => `newData.val() == ${NEAR_DISTANCE} + ${tier} * 120 + ${roll} % 91`)),
    height: check(`newData.val() == ${floorDiv(roll, 91)} % 181 - 58`),
    wind: check(`newData.val() == ${floorDiv(roll, 16471)} % 13 - 6`),
    wallX: check(`newData.val() == ${floorDiv(`(${field('distance')} * ${WALL_POSITION_PERCENT})`, 100)} + ${floorDiv(roll, 214123)} % ${WALL_POSITION_SPREAD}`),
    wallY: check(`newData.val() == ${floorDiv(wallHeight, 100)}`),
  };
}

function proofShot(index) {
  const [distance, height, wind, wallX, wallY] = ['distance', 'height', 'wind', 'wallX', 'wallY'].map(field);
  const power = "newData.parent().child('power').val()";
  const slope = "(newData.parent().child('slope').val() / " + SLOPE_SCALE + ")";
  const strength = `(${power} / ${MAX_POWER})`;
  const curvature = `((1 + ${slope} * ${slope}) / (2 * (${BASE_RANGE} + ${WIND_RANGE} * ${wind}) * ${strength} * ${strength}))`;
  const arcAt = x => `(${x} * ${slope} - ${x} * ${x} * ${curvature})`;
  const targetHeight = arcAt(distance);
  const clearWall = `${arcAt(wallX)} > ${wallY} && ${arcAt(`(${wallX} + ${WALL_SPAN})`)} > ${wallY}`;
  const reachable = `(${power} > 0 && ${targetHeight} >= ${FLOOR_HEIGHT} && ${clearWall})`;
  const value = "newData.val()";
  const factor = COURSE_LENGTH + 1;
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
    '.validate': "newData.hasChildren(['power', 'slope', 'value', 'distance', 'height', 'wind', 'wallX', 'wallY'])",
    ...courseFields(index),
    power: {'.validate': `newData.isNumber() && ${value} % 1 == 0 && ${value} >= 0 && ${value} <= ${MAX_POWER}`},
    slope: {'.validate': `newData.isNumber() && ${value} % 1 == 0 && ${value} >= ${MIN_SLOPE} && ${value} <= ${MAX_SLOPE}`},
    value: {'.validate': `newData.isNumber() && ${value} % 1 == 0 && ${value} >= 0 && ${points} <= ${MAX_SHOT_SCORE} && ${centered} && (${consistent})`},
    '$other': {'.validate': false},
  };
}

export function targetRules() {
  const maxRank = MAX_SCORE * (COURSE_LENGTH + 1) + COURSE_LENGTH;
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
      '.validate': `newData.hasChildren(${JSON.stringify(['rank', 'seed', ...shots])}) && ${rank} == ${board}.child('rank').val() && ${rank} == ${shots.map(key => `newData.child('${key}/value').val()`).join(' + ')}`,
      rank: rankRule,
      seed: {'.validate': `newData.isNumber() && newData.val() % 1 == 0 && newData.val() >= 1 && newData.val() <= ${MAX_COURSE_SEED}`},
      ...Object.fromEntries(shots.map((key, index) => [key, proofShot(index)])),
      '$other': {'.validate': false},
    }},
  }};
}
