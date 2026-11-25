import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { BRANCH, targetRules } from '../games/cannon-hill/server/target-rules.mjs';
import { ROUNDS, MAX_POWER, MIN_SLOPE, MAX_SLOPE, isCenter, summarize, scoreShot, heightAt } from '../games/cannon-hill/source/src/game/target/course.ts';

const namespace = 'demo-warureu-default-rtdb';
const query = { orderBy: '"rank"', limitToLast: '50' };
const boardPath = `${BRANCH}/board`;
const aims = ROUNDS.map(target => {
  let best = {power: 0, slope: MIN_SLOPE, points: 0};
  for (let slope = MIN_SLOPE; slope <= MAX_SLOPE; slope += 4) {
    for (let power = 1; power <= MAX_POWER; power++) {
      const shot = scoreShot(target, {power, slope});
      if (shot.points > best.points) best = shot;
    }
  }
  return {power: best.power, slope: best.slope};
});

function localService(host) {
  assert.match(host ?? '', /^(127\.0\.0\.1|localhost):\d+$/);
  return `http://${host}`;
}

async function db(path, options = {}) {
  const host = localService(process.env.FIREBASE_DATABASE_EMULATOR_HOST);
  const url = new URL(`${host}/${path}.json`);
  url.search = new URLSearchParams({ ns: namespace, ...options.query });
  if (options.user) url.searchParams.set('auth', options.user.token);
  const response = await fetch(url, {
    method: options.method,
    headers: { 'Content-Type': 'application/json', ...(options.admin ? { Authorization: 'Bearer owner' } : {}) },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  return { status: response.status, data: await response.json() };
}

async function anonymous() {
  const host = localService(process.env.FIREBASE_AUTH_EMULATOR_HOST);
  const response = await fetch(`${host}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-only`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ returnSecureToken: true }),
  });
  assert.equal(response.status, 200);
  const user = await response.json();
  return { uid: user.localId, token: user.idToken };
}

function payload(user, values) {
  const result = summarize(values);
  const shots = Object.fromEntries(result.shots.map((shot, index) => [
    `s${index}`, { power: shot.power, slope: shot.slope, value: shot.points * (ROUNDS.length + 1) + Number(isCenter(shot)) },
  ]));
  return {
    [`proof/${user.uid}`]: { rank: result.rank, ...shots },
    [`board/${user.uid}`]: { nickname: '표적연습', rank: result.rank, submittedAt: { '.sv': 'timestamp' } },
  };
}

test('the ten-shot course is reachable and angle, power and walls affect the same rendered arc', () => {
  const result = summarize(aims);
  assert.ok(result.score > 9800);
  for (const [index, shot] of result.shots.entries()) {
    const target = ROUNDS[index];
    assert.equal(shot.impactX, target.distance);
    assert.equal(shot.impactHeight, heightAt(target.distance, shot, target.wind));
    assert.ok(shot.points > 975);
  }
  assert.equal(scoreShot(ROUNDS[3], {power: 950, slope: 35}).stop, 'wall');
  assert.equal(scoreShot(ROUNDS[0], {power: 120, slope: 50}).stop, 'floor');
  assert.notEqual(scoreShot(ROUNDS[0], {power: 490, slope: 100}).offset, scoreShot(ROUNDS[0], {power: 490, slope: 102}).offset);
  assert.equal(summarize([{power: 500, slope: 100}]), null);
  assert.equal(summarize([{power: 500, slope: 500}, ...aims.slice(1)]), null);
});

test('only the owner can register a validated set of ten shots or remove their own entry', async () => {
  const baseline = process.env.WARUREU_EMULATOR_RULES;
  const rules = baseline ? JSON.parse(await readFile(baseline, 'utf8')) : { rules: { '.read': false, '.write': false } };
  Object.assign(rules.rules, targetRules());
  const compiled = await db('.settings/rules', { admin: true, method: 'PUT', body: rules });
  assert.equal(compiled.status, 200, JSON.stringify(compiled.data));
  const [alice, bob] = await Promise.all([anonymous(), anonymous()]);
  const path = BRANCH;
  const board = `board/${alice.uid}`;
  const proof = `proof/${alice.uid}`;
  const valid = payload(alice, aims);
  const patch = (body, user = alice, at = path) => db(at, { method: 'PATCH', user, body });
  const deny = (result, message) => assert.ok([401, 403].includes(result.status), `${message}: HTTP ${result.status}`);
  const ok = (result, message) => assert.equal(result.status, 200, `${message}: ${JSON.stringify(result.data)}`);
  const missingShot = structuredClone(valid);
  delete missingShot[proof].s0;
  const wrongShot = structuredClone(valid);
  wrongShot[proof].s0.power = 0;
  const wrongAngle = structuredClone(valid);
  wrongAngle[proof].s0.slope = MAX_SLOPE + 1;
  const blocked = structuredClone(valid);
  Object.assign(blocked[proof].s3, {power: 950, slope: 35});
  const wrongScore = structuredClone(valid);
  wrongScore[board].rank = 1;
  const wrongTime = structuredClone(valid);
  wrongTime[board].submittedAt = 5;
  const wrongName = structuredClone(valid);
  wrongName[board].nickname = '<이름>';

  deny(await patch(missingShot), 'missing shot');
  deny(await patch(wrongShot), 'incorrect shot score');
  deny(await patch(wrongAngle), 'out of bounds angle');
  deny(await patch(blocked), 'a shot that hit a wall cannot score');
  deny(await patch(wrongScore), 'mismatched total');
  deny(await patch(wrongTime), 'invalid timestamp');
  deny(await patch(wrongName), 'invalid nickname');
  deny(await patch({ [board]: valid[board] }), 'score without proof');
  deny(await patch(valid, bob), 'different owner');
  deny(await patch(valid, null), 'unauthenticated write');
  const mixed = aims.map((aim, index) => index === 3 ? {power: 950, slope: 35} : index === 0 ? {power: 0, slope: 100} : aim);
  ok(await patch(payload(bob, mixed), bob), 'verified floor and wall misses');
  ok(await patch(valid), 'complete validated run');

  const published = await db(boardPath, { query });
  ok(published, 'public list');
  assert.deepEqual(Object.keys(published.data[alice.uid]).sort(), ['nickname', 'rank', 'submittedAt']);
  assert.equal(published.data[alice.uid].rank, summarize(aims).rank);
  deny(await db(boardPath), 'unbounded public list');
  deny(await db(`${path}/${proof}`, { user: bob }), 'private shot powers');
  deny(await db(`${path}/${proof}`), 'public shot powers');
  deny(await patch(payload(alice, mixed)), 'lower result overwrites best');
  deny(await patch(valid), 'identical score overwrites best');
  deny(await patch({ [board]: null }), 'partial deletion');
  deny(await patch({ [board]: null, [proof]: null }, bob), 'cross-owner deletion');
  ok(await patch({ [board]: null, [proof]: null }), 'owner deletion');
  assert.deepEqual(Object.keys((await db(boardPath, { query })).data), [bob.uid]);
  ok(await patch({ [`board/${bob.uid}`]: null, [`proof/${bob.uid}`]: null }, bob), 'remove the other fixture');
});
