import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { canonical, digest, mergeRules, unrelatedRules, assertUnchanged } from '../games/cheonroe/server/deploy-rules.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FRAGMENT = path.join(ROOT, 'games/cheonroe/server/ranking.rules.fragment.json');
const DATABASE_HOST = process.env.FIREBASE_DATABASE_EMULATOR_HOST;
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST;
const NAMESPACE = 'demo-cheonroe-default-rtdb';
const SEASON = 'season-20261120-1';
const PRIVATE = path.join(ROOT, '.dream-loop/cheonroe/server');
const checked = [];
let totalCases = 0;
let alice, bob, rulesHash;

function check(name, fn) {
  totalCases += 1;
  test(name, async () => { await fn(); checked.push(name); });
}
function loopback(host, name) {
  assert.ok(host && /^(127\.0\.0\.1|localhost):\d+$/.test(host), `${name} must point to a loopback emulator; production fallback is forbidden.`);
  return `http://${host}`;
}
async function request(suffix, { user, admin = false, method = 'GET', body, query = {} } = {}) {
  const url = new URL(`${loopback(DATABASE_HOST, 'FIREBASE_DATABASE_EMULATOR_HOST')}/${suffix}.json`);
  url.searchParams.set('ns', NAMESPACE);
  if (user) url.searchParams.set('auth', user.token);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, JSON.stringify(value));
  const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...(admin ? { Authorization: 'Bearer owner' } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}
async function anonymousUser() {
  const response = await fetch(`${loopback(AUTH_HOST, 'FIREBASE_AUTH_EMULATOR_HOST')}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-only`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  const data = await response.json();
  assert.equal(response.status, 200, 'Anonymous emulator authentication must succeed.');
  assert.ok(data.localId && data.idToken, 'Emulator must issue a user and ID token.');
  return { uid: data.localId, token: data.idToken };
}
const lane = (hero = 'rin', difficulty = 'normal', season = SEASON) => `cheonroeV1/${season}/${difficulty}/${hero}`;
const recordPath = (user, hero = 'rin', difficulty = 'normal', season = SEASON) => `${lane(hero, difficulty, season)}/${user.uid}`;
const record = (overrides = {}) => ({ nickname: '검수전사', hero: 'rin', difficulty: 'normal', score: 12345, durationMs: 78000, kills: 24, graze: 12, cleared: false, submittedAt: { '.sv': 'timestamp' }, ...overrides });
async function ok(result, message) { assert.ok([200, 204].includes(result.status), `${message}: expected success, got HTTP ${result.status}`); return result.data; }
async function denied(result, message) { assert.ok([401, 403].includes(result.status), `${message}: expected permission denial, got HTTP ${result.status}`); }
async function clear() { await ok(await request('cheonroeV1', { admin: true, method: 'DELETE' }), 'Reset emulator-only ranking fixtures'); }
async function fixture(overrides = {}, user = alice) {
  await clear();
  await ok(await request(recordPath(user), { admin: true, method: 'PUT', body: record({ submittedAt: Date.now() - 20000, ...overrides }) }), 'Seed emulator-only aged record');
}
async function invalidRecord(name, overrides, location = {}) {
  await clear();
  const hero = location.hero || 'rin', difficulty = location.difficulty || 'normal', season = location.season || SEASON;
  await denied(await request(recordPath(alice, hero, difficulty, season), { user: alice, method: 'PUT', body: record(overrides) }), name);
}

before(async () => {
  loopback(DATABASE_HOST, 'FIREBASE_DATABASE_EMULATOR_HOST');
  loopback(AUTH_HOST, 'FIREBASE_AUTH_EMULATOR_HOST');
  const fragment = JSON.parse(await readFile(FRAGMENT, 'utf8'));
  let document = { rules: { '.read': false, '.write': false, ...fragment } };
  if (process.env.CHEONROE_MERGED_RULES) {
    document = JSON.parse(await readFile(process.env.CHEONROE_MERGED_RULES, 'utf8'));
    assert.equal(digest(document.rules.cheonroeV1), digest(fragment.cheonroeV1), 'Merged emulator rules must contain the exact current fragment.');
  }
  rulesHash = digest(fragment.cheonroeV1);
  await ok(await request('.settings/rules', { admin: true, method: 'PUT', body: document }), 'Compile and install emulator rules');
  alice = await anonymousUser();
  bob = await anonymousUser();
  await clear();
});

check('merge keeps all unrelated branches and metadata byte-equivalent under canonical hashing', () => {
  const current = { rules: { '.read': false, '.write': false, unrelated: { '$uid': { '.read': 'auth.uid == $uid' } }, cheonroeV1: { old: true } }, metadata: { preserved: true } };
  const fragment = { cheonroeV1: { '.read': false, next: { '.write': false } } };
  const before = structuredClone(current), result = mergeRules(current, fragment);
  assert.equal(digest(unrelatedRules(result)), digest(unrelatedRules(current)));
  assert.deepEqual(current, before);
  assert.deepEqual(result.metadata, current.metadata);
  assert.deepEqual(result.rules.cheonroeV1, fragment.cheonroeV1);
  assert.equal(canonical({ z: 1, a: { y: 2, b: 3 } }), canonical({ a: { b: 3, y: 2 }, z: 1 }));
});
check('merge rejects unrelated fragment branches and concurrent changes', () => {
  const current = { rules: { '.read': false, unchanged: { value: 1 } } };
  assert.throws(() => mergeRules(current, { cheonroeV1: {}, unrelated: {} }), /only the cheonroeV1/);
  assert.throws(() => mergeRules(current, { rules: { cheonroeV1: {} } }), /only the cheonroeV1/);
  assert.throws(() => assertUnchanged(current, { rules: { '.read': false, unchanged: { value: 2 } } }), /concurrently/);
  assert.doesNotThrow(() => assertUnchanged(current, structuredClone(current)));
});
check('anonymous player can write/read own record; server timestamp resolves', async () => {
  await clear();
  await ok(await request(recordPath(alice), { user: alice, method: 'PUT', body: record() }), 'Write own record');
  const value = await ok(await request(recordPath(alice), { user: alice }), 'Read own record');
  assert.equal(value.nickname, '검수전사');
  assert.equal(value.score, 12345);
  assert.equal(typeof value.submittedAt, 'number');
  assert.ok(Math.abs(value.submittedAt - Date.now()) < 5000);
});
check('public leaderboard allows bounded score queries for each hero/difficulty', async () => {
  await clear();
  for (const difficulty of ['normal', 'story']) for (const hero of ['rin', 'golem', 'ryu']) {
    await ok(await request(recordPath(alice, hero, difficulty), { user: alice, method: 'PUT', body: record({ hero, difficulty }) }), 'Write valid hero/difficulty');
    for (const limit of [1, 20, 100]) {
      const data = await ok(await request(lane(hero, difficulty), { query: { orderBy: 'score', limitToLast: limit } }), 'Read bounded public leaderboard');
      assert.equal(Object.keys(data).length, 1);
      assert.equal(data[alice.uid].hero, hero);
    }
  }
});
check('unbounded and broad queries, wrong ordering, wrong season/hero/difficulty are denied', async () => {
  await fixture();
  for (const suffix of ['cheonroeV1', `cheonroeV1/${SEASON}`, `cheonroeV1/${SEASON}/normal`, lane(), recordPath(alice)]) await denied(await request(suffix), 'Unbounded or private direct read');
  for (const query of [{ orderBy: 'score' }, { orderBy: 'score', limitToLast: 101 }, { orderBy: 'score', limitToFirst: 20 }]) await denied(await request(lane(), { query }), `Forbidden public query ${JSON.stringify(query)}`);
  // REST rejects omitted ordering and unknown unindexed ordering before security-rule evaluation.
  for (const query of [{ limitToLast: 20 }, { orderBy: 'nickname', limitToLast: 20 }, { orderBy: 'score', limitToLast: 0 }]) {
    const response = await request(lane(), { query });
    assert.ok([400, 401, 403].includes(response.status), `Invalid query must return no data: ${JSON.stringify(query)}`);
  }
  for (const suffix of [lane('bad'), lane('rin', 'bad'), lane('rin', 'normal', 'old-season')]) await denied(await request(suffix, { query: { orderBy: 'score', limitToLast: 20 } }), 'Wrong board partition');
});
check('cross-user read/write/delete and unauthenticated writes are denied', async () => {
  await fixture();
  await denied(await request(recordPath(alice), { user: bob }), 'Cross-user direct read');
  await denied(await request(recordPath(alice), { user: bob, method: 'PUT', body: record({ score: 23456 }) }), 'Cross-user write');
  await denied(await request(recordPath(alice), { user: bob, method: 'DELETE' }), 'Cross-user delete');
  await denied(await request(recordPath(bob), { method: 'PUT', body: record() }), 'Unauthenticated write');
});
check('owner can delete own record immediately without deleting another player', async () => {
  await clear();
  await ok(await request(recordPath(alice), { user: alice, method: 'PUT', body: record() }), 'Write Alice');
  await ok(await request(recordPath(bob), { user: bob, method: 'PUT', body: record({ nickname: '다른전사' }) }), 'Write Bob');
  await ok(await request(recordPath(alice), { user: alice, method: 'DELETE' }), 'Delete own record');
  assert.equal((await request(recordPath(alice), { user: alice })).data, null);
  assert.equal((await request(recordPath(bob), { user: bob })).data.nickname, '다른전사');
});
check('invalid score values are denied', async () => {
  for (const score of [-1, 0, 1.5, 10000000, '12345', null]) await invalidRecord(`Invalid score ${JSON.stringify(score)}`, { score });
});
check('nickname rejects blank, excessive length, HTML, slash, newline and unsupported symbols', async () => {
  for (const nickname of ['', '   ', 'abcdefghijklmn', '<script>', 'foo/bar', 'ab\ncd', '전사😀']) await invalidRecord('Invalid nickname', { nickname });
  await clear();
  await ok(await request(recordPath(alice), { user: alice, method: 'PUT', body: record({ nickname: '전사_A-1. 7' }) }), 'Allowed Korean/ASCII nickname');
});
check('invalid hero/difficulty values and mismatched board metadata are denied', async () => {
  for (const hero of ['other', 'golem', 3, null]) await invalidRecord('Mismatched hero', { hero });
  for (const difficulty of ['other', 'story', 3, null]) await invalidRecord('Mismatched difficulty', { difficulty });
  await invalidRecord('Invalid hero path', { hero: 'other' }, { hero: 'other' });
  await invalidRecord('Invalid difficulty path', { difficulty: 'other' }, { difficulty: 'other' });
  await invalidRecord('Old season write', {}, { season: 'season-old' });
});
check('unknown fields and missing required fields are denied, including child PATCH', async () => {
  await invalidRecord('Unexpected property', { administrator: true });
  for (const field of ['nickname', 'hero', 'difficulty', 'score', 'durationMs', 'kills', 'graze', 'cleared', 'submittedAt']) await invalidRecord('Missing required property', { [field]: null });
  await fixture();
  await denied(await request(recordPath(alice), { user: alice, method: 'PATCH', body: { injected: true, score: 20000, submittedAt: { '.sv': 'timestamp' } } }), 'Child PATCH injection');
});
check('duration, kill, graze and cleared fields enforce types and numeric bounds', async () => {
  for (const durationMs of [9999, 3600001, 10000.5, '10000']) await invalidRecord('Invalid duration', { durationMs });
  for (const kills of [-1, 1001, 0.1, '24']) await invalidRecord('Invalid kills', { kills });
  for (const graze of [-1, 100001, 0.1, '12']) await invalidRecord('Invalid graze', { graze });
  for (const cleared of [0, 1, 'true', 'false']) await invalidRecord('Invalid cleared flag', { cleared });
});
check('timestamp must equal server now; old and future timestamps are rejected', async () => {
  for (const submittedAt of [1, Date.now() - 60000, Date.now() + 60000, 'now']) await invalidRecord('Invalid timestamp', { submittedAt });
});
check('immediate score update is denied by the ten-second cooldown', async () => {
  await clear();
  await ok(await request(recordPath(alice), { user: alice, method: 'PUT', body: record() }), 'First score submission');
  await denied(await request(recordPath(alice), { user: alice, method: 'PUT', body: record({ score: 23456 }) }), 'Immediate score improvement');
});
check('higher score succeeds after cooldown, lower scores remain denied', async () => {
  await fixture();
  await ok(await request(recordPath(alice), { user: alice, method: 'PUT', body: record({ score: 23456, kills: 30 }) }), 'Higher score after cooldown');
  await fixture({ score: 23456 });
  await denied(await request(recordPath(alice), { user: alice, method: 'PUT', body: record({ score: 12345 }) }), 'Lower score after cooldown');
});
check('equal score permits nickname change only when run statistics match', async () => {
  await fixture();
  await ok(await request(recordPath(alice), { user: alice, method: 'PUT', body: record({ nickname: '새이름' }) }), 'Equal score rename after cooldown');
  for (const overrides of [{ durationMs: 79000 }, { kills: 25 }, { graze: 13 }, { cleared: true }]) {
    await fixture();
    await denied(await request(recordPath(alice), { user: alice, method: 'PUT', body: record(overrides) }), 'Equal score altered run stats');
  }
});
check('minimum and maximum valid field bounds succeed', async () => {
  await clear();
  await ok(await request(recordPath(alice), { user: alice, method: 'PUT', body: record({ score: 1, durationMs: 10000, kills: 0, graze: 0, cleared: false }) }), 'Minimum record bounds');
  await clear();
  await ok(await request(recordPath(alice), { user: alice, method: 'PUT', body: record({ score: 9999999, durationMs: 3600000, kills: 1000, graze: 100000, cleared: true }) }), 'Maximum record bounds');
});

after(async () => {
  if (DATABASE_HOST && AUTH_HOST) {
    await clear();
    await mkdir(PRIVATE, { recursive: true });
    await writeFile(path.join(PRIVATE, 'rules-test-results.json'), `${JSON.stringify({ checkedAt: new Date().toISOString(), emulatorOnly: true, namespace: NAMESPACE, fragmentSha256: rulesHash, totalCases, passedCases: checked.length, allPassed: checked.length === totalCases, checks: checked }, null, 2)}\n`);
  }
});
