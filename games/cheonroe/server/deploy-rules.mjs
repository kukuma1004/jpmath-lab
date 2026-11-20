import { createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const PRIVATE = path.join(ROOT, '.dream-loop/cheonroe/server');
const DATABASE = 'https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app';
const ENDPOINT = `${DATABASE}/.settings/rules.json`;
export const BRANCH = 'cheonroeV1';

export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export const digest = value => createHash('sha256').update(canonical(value)).digest('hex');
export function unrelatedRules(document) {
  if (!document || typeof document.rules !== 'object' || Array.isArray(document.rules)) throw Error('Expected a Firebase rules document.');
  return Object.fromEntries(Object.entries(document.rules).filter(([key]) => key !== BRANCH));
}
export function mergeRules(current, fragment) {
  if (!fragment || Object.keys(fragment).length !== 1 || !Object.hasOwn(fragment, BRANCH) || !fragment[BRANCH] || typeof fragment[BRANCH] !== 'object' || Array.isArray(fragment[BRANCH])) throw Error('Fragment must contain only the cheonroeV1 rules branch.');
  const unrelatedBefore = digest(unrelatedRules(current));
  const merged = structuredClone(current);
  merged.rules[BRANCH] = structuredClone(fragment[BRANCH]);
  if (digest(unrelatedRules(merged)) !== unrelatedBefore) throw Error('Unrelated rules changed during merge; refusing deployment.');
  return merged;
}
export function assertUnchanged(expected, current) {
  if (digest(expected) !== digest(current)) throw Error('Rules changed concurrently; deployment aborted before writing. Run a fresh dry-run.');
}

async function findCli() {
  const configured = process.env.CHEONROE_FIREBASE_TOOLS;
  if (configured) { await access(path.join(configured, 'lib/auth.js')); return configured; }
  const cache = path.join(process.env.LOCALAPPDATA || path.join(homedir(), 'AppData/Local'), 'npm-cache/_npx');
  for (const entry of await readdir(cache, { withFileTypes: true }).catch(() => [])) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(cache, entry.name, 'node_modules/firebase-tools');
    try { await access(path.join(candidate, 'lib/auth.js')); return candidate; } catch { /* Try another installed CLI. */ }
  }
  throw Error('Firebase CLI unavailable. Set CHEONROE_FIREBASE_TOOLS to its installed package directory.');
}

async function authenticatedRequest() {
  const require = createRequire(import.meta.url);
  const auth = require(path.join(await findCli(), 'lib/auth.js'));
  const account = auth.getGlobalDefaultAccount();
  if (!account?.tokens?.refresh_token) throw Error('Firebase CLI login required.');
  const { access_token: token } = await auth.getAccessToken(account.tokens.refresh_token, [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/firebase',
    'https://www.googleapis.com/auth/userinfo.email',
  ]);
  if (!token) throw Error('Firebase CLI did not return an access token.');
  return async function request({ method = 'GET', body, ifMatch } = {}) {
    const response = await fetch(ENDPOINT, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Firebase-ETag': 'true', ...(ifMatch ? { 'If-Match': ifMatch } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    // Administrative responses may contain private rules. Never include response bodies or credentials in errors.
    if (!response.ok) throw Error(response.status === 412 ? 'Rules changed concurrently; conditional deployment rejected (412).' : `Firebase rules ${method} failed (${response.status}).`);
    let data;
    try { data = await response.json(); } catch { throw Error('Firebase rules endpoint returned invalid JSON.'); }
    return { data, etag: response.headers.get('etag') };
  };
}

function rootIsGuarded(rules) {
  const denies = value => value === undefined || value === false || value === 'false';
  return denies(rules['.read']) && denies(rules['.write']);
}

async function privateSnapshot(name, data) {
  await mkdir(PRIVATE, { recursive: true });
  const filename = path.join(PRIVATE, `${new Date().toISOString().replace(/[:.]/g, '-')}-${name}-${randomUUID().slice(0, 8)}.json`);
  await writeFile(filename, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  return path.relative(ROOT, filename).split(path.sep).join('/');
}

export async function run(args = process.argv.slice(2)) {
  if (args.some(arg => !['--apply', '--dry-run', '--inspect-only'].includes(arg)) || args.includes('--apply') && (args.includes('--dry-run') || args.includes('--inspect-only'))) throw Error('Usage: node games/cheonroe/server/deploy-rules.mjs [--dry-run|--inspect-only|--apply]');
  const apply = args.includes('--apply');
  const request = await authenticatedRequest();
  const initial = await request();
  const unrelated = unrelatedRules(initial.data);
  const snapshot = await privateSnapshot('before', initial.data);
  const summary = {
    mode: apply ? 'apply' : args.includes('--inspect-only') ? 'inspect-only' : 'dry-run',
    branch: BRANCH,
    existingBranch: Object.hasOwn(initial.data.rules, BRANCH),
    unrelatedBranches: Object.keys(unrelated).sort(),
    unrelatedSha256: digest(unrelated),
    rootGuarded: rootIsGuarded(initial.data.rules),
    conditionalWriteAvailable: Boolean(initial.etag),
    snapshot,
  };
  if (args.includes('--inspect-only')) { console.log(JSON.stringify(summary, null, 2)); return summary; }
  const fragment = JSON.parse(await readFile(path.join(HERE, 'ranking.rules.fragment.json'), 'utf8'));
  const merged = mergeRules(initial.data, fragment);
  summary.fragmentSha256 = digest(fragment[BRANCH]);
  summary.unrelatedPreserved = digest(unrelatedRules(merged)) === summary.unrelatedSha256;
  summary.branchAlreadyMatches = digest(initial.data.rules[BRANCH] ?? null) === digest(fragment[BRANCH]);
  if (!summary.rootGuarded) throw Error('An ancestor read/write rule can override ranking restrictions. Refusing to modify existing ancestor rules or deploy under a permissive root.');
  if (!apply || summary.branchAlreadyMatches) {
    summary.written = false;
    console.log(JSON.stringify(summary, null, 2));
    return summary;
  }
  // Always inspect a fresh full document immediately before writing; abort on ANY concurrent branch change.
  const fresh = await request();
  assertUnchanged(initial.data, fresh.data);
  // Prefer the latest ETag if this endpoint supports conditional rule updates. Without ETag, the immediate
  // fresh-read digest comparison above is the available concurrency guard; readback still verifies every branch.
  await request({ method: 'PUT', body: merged, ifMatch: fresh.etag || initial.etag });
  const after = await request();
  summary.readbackSnapshot = await privateSnapshot('after', after.data);
  if (digest(unrelatedRules(after.data)) !== summary.unrelatedSha256) throw Error('Readback detected changed unrelated rules. Do not redeploy automatically; inspect the private snapshots.');
  if (digest(after.data.rules[BRANCH]) !== digest(fragment[BRANCH])) throw Error('Cheonroe rules readback mismatch. Inspect private snapshots before any retry.');
  summary.written = true;
  summary.readbackVerified = true;
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => { console.error(error.message); process.exitCode = 1; });
}
