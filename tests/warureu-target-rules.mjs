import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { BRANCH, targetRules } from '../games/cannon-hill/server/target-rules.mjs';
import { ROUNDS, MAX_POWER, isCenter, koreaDay, summarize, targetFor, scoreShot, shotPosition } from '../games/cannon-hill/source/src/game/target/course.ts';

const day = koreaDay();
const namespace = 'demo-warureu-default-rtdb';
const query = { orderBy: '"rank"', limitToLast: '50' };
const boardPath = `${BRANCH}/${day}/board`;
const goodPowers = date => ROUNDS.map((_, index) =>
  Array.from({ length: MAX_POWER + 1 }, (_, power) => scoreShot(targetFor(date, index), power))
    .reduce((best, candidate) => Math.abs(candidate.offset) < Math.abs(best.offset) ? candidate : best).power);

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

function payload(user, date, powers) {
  const result = summarize(date, powers);
  const shots = Object.fromEntries(result.shots.map((shot, index) => [
    `s${index}`, { power: shot.power, value: shot.points * (ROUNDS.length + 1) + Number(isCenter(shot)) },
  ]));
  return {
    [`proof/${user.uid}`]: { day: date, rank: result.rank, ...shots },
    [`board/${user.uid}`]: { nickname: '표적연습', rank: result.rank, submittedAt: { '.sv': 'timestamp' } },
  };
}

test('every daily course can score above 980 points and drawing agrees with scoring', () => {
  for (let date = day; date < day + 65; date++) {
    const powers = goodPowers(date);
    assert.ok(summarize(date, powers).score > 9800);
    for (const [index, power] of powers.entries()) {
      const target = targetFor(date, index);
      const shot = scoreShot(target, power);
      assert.ok(Math.abs(shotPosition(power, target.wind, 1).x - target.distance - shot.offset) < 1e-8);
    }
  }
});

test('only the owner can register a validated set of ten shots or remove their own entry', async () => {
  const baseline = process.env.WARUREU_EMULATOR_RULES;
  const rules = baseline ? JSON.parse(await readFile(baseline, 'utf8')) : { rules: { '.read': false, '.write': false } };
  Object.assign(rules.rules, targetRules());
  const compiled = await db('.settings/rules', { admin: true, method: 'PUT', body: rules });
  assert.equal(compiled.status, 200, JSON.stringify(compiled.data));
  const [alice, bob] = await Promise.all([anonymous(), anonymous()]);
  const path = `${BRANCH}/${day}`;
  const board = `board/${alice.uid}`;
  const proof = `proof/${alice.uid}`;
  const powers = goodPowers(day);
  const valid = payload(alice, day, powers);
  const patch = (body, user = alice, at = path) => db(at, { method: 'PATCH', user, body });
  const deny = (result, message) => assert.ok([401, 403].includes(result.status), `${message}: HTTP ${result.status}`);
  const ok = (result, message) => assert.equal(result.status, 200, `${message}: ${JSON.stringify(result.data)}`);
  const missingShot = structuredClone(valid);
  delete missingShot[proof].s0;
  const wrongShot = structuredClone(valid);
  wrongShot[proof].s0.power = 0;
  const wrongScore = structuredClone(valid);
  wrongScore[board].rank = 1;
  const wrongTime = structuredClone(valid);
  wrongTime[board].submittedAt = 5;
  const wrongName = structuredClone(valid);
  wrongName[board].nickname = '<이름>';

  deny(await patch(missingShot), 'missing shot');
  deny(await patch(wrongShot), 'incorrect shot score');
  deny(await patch(wrongScore), 'mismatched total');
  deny(await patch(wrongTime), 'invalid timestamp');
  deny(await patch(wrongName), 'invalid nickname');
  deny(await patch({ [board]: valid[board] }), 'score without proof');
  deny(await patch(valid, bob), 'different owner');
  deny(await patch(valid, null), 'unauthenticated write');
  deny(await patch(payload(alice, day - 2, goodPowers(day - 2)), alice, `${BRANCH}/${day - 2}`), 'expired course');
  ok(await patch(valid), 'complete validated run');

  const published = await db(boardPath, { query });
  ok(published, 'public list');
  assert.deepEqual(Object.keys(published.data[alice.uid]).sort(), ['nickname', 'rank', 'submittedAt']);
  assert.equal(published.data[alice.uid].rank, summarize(day, powers).rank);
  deny(await db(boardPath), 'unbounded public list');
  deny(await db(`${path}/${proof}`, { user: bob }), 'private shot powers');
  deny(await db(`${path}/${proof}`), 'public shot powers');
  deny(await patch(payload(alice, day, [0, ...powers.slice(1)])), 'lower result overwrites best');
  deny(await patch({ [board]: null }), 'partial deletion');
  deny(await patch({ [board]: null, [proof]: null }, bob), 'cross-owner deletion');
  ok(await patch({ [board]: null, [proof]: null }), 'owner deletion');
  assert.equal((await db(boardPath, { query })).data, null);
});
