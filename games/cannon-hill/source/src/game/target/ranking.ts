import { COURSE_LENGTH, MAX_SCORE, TARGET_RANK_BRANCH, courseFromSeed, isCenter, summarize, validNickname, type TargetResult } from './course';
import { firebaseProject } from '../online/firebaseConfig';

const BOARD_BRANCHES = {arc: TARGET_RANK_BRANCH, random: 'warureuTargetV3', legacy: 'warureuTargetV2'} as const;
export type BoardCourse = keyof typeof BOARD_BRANCHES;
const boardBase = (course: BoardCourse) => `${firebaseProject.databaseURL}/${BOARD_BRANCHES[course]}`;
const SDK = 'https://www.gstatic.com/firebasejs/12.16.0';
const config = firebaseProject;
const rankFactor = COURSE_LENGTH + 1;
const APP_NAME = 'warureu-target-v1';
interface User { uid: string; getIdToken(): Promise<string> }
let session: Promise<User> | undefined;

export interface RecordRow {
  uid: string;
  nickname: string;
  score: number;
  centers: number;
  rank: number;
  submittedAt: number;
}

function decode(uid: string, raw: unknown): RecordRow | null {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(uid) || !raw || typeof raw !== 'object') return null;
  const {rank, nickname, submittedAt} = raw as Record<string, unknown>;
  if (typeof rank !== 'number' || !Number.isSafeInteger(rank) || rank < 1 || rank > MAX_SCORE * rankFactor + COURSE_LENGTH ||
      typeof nickname !== 'string' || !validNickname(nickname) || typeof submittedAt !== 'number' ||
      !Number.isSafeInteger(submittedAt) || submittedAt <= 0) return null;
  return {uid, nickname, rank, submittedAt, score:Math.floor(rank / rankFactor), centers:rank % rankFactor};
}

async function identity(create: boolean): Promise<User | null> {
  if (session) return session;
  const versioned = (name: string) => `${SDK}/firebase-${name}.js`;
  const [appSdk, authSdk] = await Promise.all([
    import(/* @vite-ignore */ versioned('app')), import(/* @vite-ignore */ versioned('auth')),
  ]);
  const app = appSdk.getApps().find((candidate: {name: string}) => candidate.name === APP_NAME) ?? appSdk.initializeApp(config, APP_NAME);
  const auth = authSdk.getAuth(app);
  await auth.authStateReady();
  if (auth.currentUser) return auth.currentUser as User;
  if (!create) return null;
  session ??= authSdk.signInAnonymously(auth).then((result: {user:User}) => result.user).catch(() => {
    session = undefined;
    throw new Error('순위 등록에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.');
  });
  return session!;
}

async function request(endpoint: string, init?: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(endpoint, {...init, cache:'no-store', credentials:'omit', signal:AbortSignal.timeout(8000)});
  } catch {
    throw new Error('온라인 순위에 연결하지 못했어요. 개인 기록은 이 기기에 남아 있어요.');
  }
  if (!response.ok) throw new Error('온라인 순위 요청에 실패했어요. 잠시 후 다시 시도해 주세요.');
  return response;
}

export async function loadBoard(course: BoardCourse): Promise<RecordRow[]> {
  const params = new URLSearchParams({orderBy: JSON.stringify('rank'), limitToLast:'50'});
  const raw: unknown = await (await request(`${boardBase(course)}/board.json?${params}`)).json();
  if (raw === null) return [];
  if (typeof raw !== 'object' || Array.isArray(raw)) throw new Error('순위 목록을 읽지 못했어요.');
  return Object.entries(raw).map(([uid, value]) => decode(uid, value)).filter((row): row is RecordRow => row !== null)
    .sort((a, b) => b.rank - a.rank || a.submittedAt - b.submittedAt || a.uid.localeCompare(b.uid));
}

export async function publishScore(result: TargetResult, nickname: string): Promise<{uid: string; kept: boolean}> {
  const seed = result.seed;
  if (seed === undefined) throw new Error('포격 코스 10발을 완료한 기록을 등록할 수 있어요.');
  const verified = summarize(result.shots, seed);
  if (!verified || verified.rank < 1 || verified.rank !== result.rank) throw new Error('10발을 마친 득점 기록을 등록할 수 있어요.');
  if (!validNickname(nickname)) throw new Error('별명은 한글, 영문, 숫자, 공백, _ . - 로 1~12자 입력해 주세요.');

  const user = (await identity(true))!;
  const token = encodeURIComponent(await user.getIdToken());
  const base = boardBase('arc');
  const rowUrl = `${base}/board/${encodeURIComponent(user.uid)}.json?auth=${token}`;
  const previous = decode(user.uid, await (await request(rowUrl)).json());
  // Firebase rejects concurrent lower scores atomically. This read avoids unnecessary writes.
  if (previous && previous.rank >= verified.rank) return {uid:user.uid, kept:true};

  const targets = courseFromSeed(seed);
  const proof = Object.fromEntries(verified.shots.map((shot, index) => {
    const {distance, height, wind, wall} = targets[index]!;
    return [`s${index}`, {
      power:shot.power, slope:shot.slope, value:shot.points * rankFactor + Number(isCenter(shot)),
      distance, height, wind, wallX:wall?.distance ?? 0, wallY:wall?.height ?? 0,
    }];
  }));
  await request(`${base}.json?auth=${token}`, {
    method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({
      [`proof/${user.uid}`]:{rank:verified.rank, seed, ...proof},
      [`board/${user.uid}`]:{nickname, rank:verified.rank, submittedAt:{'.sv':'timestamp'}},
    }),
  });
  return {uid:user.uid, kept:false};
}

export async function deleteScore(course: BoardCourse): Promise<void> {
  const user = await identity(false);
  if (!user) throw new Error('기록을 등록한 브라우저에서 삭제할 수 있어요.');
  const token = encodeURIComponent(await user.getIdToken());
  await request(`${boardBase(course)}.json?auth=${token}`, {
    method:'PATCH', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({[`proof/${user.uid}`]:null, [`board/${user.uid}`]:null}),
  });
}
