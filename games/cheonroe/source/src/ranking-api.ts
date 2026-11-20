import type { Difficulty, HeroId } from './types';
import { compareRecords, validNickname, validRun, type PublicRecord, type RunRecord } from './ranking-model';

// Public browser Firebase configuration, shared with the site's existing arcade games.
const config={
  projectId:'jpmathlab',
  apiKey:'AIzaSyD9mHiQ8Cyh4zJKbyhW_oYZkcu3WPMYw3k',
  authDomain:'jpmathlab.firebaseapp.com',
  appId:'1:1061208248935:web:839fa3cc986bc687cebac2'
};
const base='https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app/cheonroeV1/season-20261120-1';
const appSdkUrl='https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
const authSdkUrl='https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
const heroes:HeroId[]=['rin','golem','ryu'];
const payloadFields=['nickname','hero','difficulty','score','durationMs','kills','graze','cleared','submittedAt'];
interface FirebaseUser {uid:string;getIdToken(forceRefresh?:boolean):Promise<string>;}
let session:Promise<FirebaseUser>|undefined;

function scope(difficulty:Difficulty,hero:HeroId):void {
  if((difficulty!=='normal'&&difficulty!=='story')||!heroes.includes(hero))throw new Error('랭킹 분류를 확인하지 못했어요. 다시 선택해 주세요.');
}

/** Reading the board never imports Auth or creates an anonymous account. */
async function identity():Promise<FirebaseUser> {
  if(!session)session=(async()=>{
    const [appSdk,authSdk]=await Promise.all([
      import(/* @vite-ignore */ appSdkUrl),import(/* @vite-ignore */ authSdkUrl)
    ]);
    const app=appSdk.getApps().find((candidate:{name:string})=>candidate.name==='cheonroe-ranking-v1')||appSdk.initializeApp(config,'cheonroe-ranking-v1');
    const auth=authSdk.getAuth(app);
    await auth.authStateReady();
    if(!auth.currentUser)await authSdk.signInAnonymously(auth);
    if(!auth.currentUser)throw new Error('No ranking identity');
    return auth.currentUser as FirebaseUser;
  })().catch(()=>{
    session=undefined;
    throw new Error('랭킹 로그인에 연결하지 못했어요. 다시 시도해 주세요.');
  });
  return session;
}

async function request(url:string,options:RequestInit={},allowConflict=false):Promise<Response> {
  let response:Response;
  try{response=await fetch(url,{credentials:'omit',cache:'no-store',...options,signal:AbortSignal.timeout(12000)});}
  catch{throw new Error('온라인 랭킹에 연결하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.');}
  if(allowConflict&&response.status===412)return response;
  if(response.status===401||response.status===403)throw new Error('온라인 랭킹을 사용할 수 없어요. 잠시 후 다시 시도해 주세요.');
  if(response.status===429)throw new Error('랭킹 요청이 많아요. 잠시 기다린 뒤 다시 시도해 주세요.');
  if(!response.ok)throw new Error('랭킹 요청에 실패했어요. 다시 시도해 주세요.');
  return response;
}

async function json(response:Response):Promise<unknown> {
  try{return await response.json();}
  catch{throw new Error('랭킹 응답을 읽지 못했어요. 다시 불러와 주세요.');}
}

function publicRecord(value:unknown,uid:string,difficulty:Difficulty,hero:HeroId):PublicRecord|null {
  if(!value||typeof value!=='object'||Array.isArray(value)||!/^[A-Za-z0-9_-]{1,128}$/.test(uid))return null;
  const data=value as Record<string,unknown>;
  if(Object.keys(data).length!==payloadFields.length||!Object.keys(data).every(key=>payloadFields.includes(key)))return null;
  if(!validRun(data)||data.difficulty!==difficulty||data.hero!==hero||typeof data.nickname!=='string'||!validNickname(data.nickname)||
    typeof data.submittedAt!=='number'||!Number.isSafeInteger(data.submittedAt)||data.submittedAt<=0)return null;
  return {hero:data.hero,difficulty:data.difficulty,score:data.score,durationMs:data.durationMs,kills:data.kills,graze:data.graze,cleared:data.cleared,
    nickname:data.nickname,submittedAt:data.submittedAt,uid};
}

export async function loadOnline(difficulty:Difficulty,hero:'all'|HeroId):Promise<PublicRecord[]> {
  const selected=hero==='all'?heroes:[hero];
  for(const id of selected)scope(difficulty,id);
  const query=new URLSearchParams({orderBy:JSON.stringify('score'),limitToLast:'100'});
  const boards=await Promise.all(selected.map(async id=>{
    const data=await json(await request(`${base}/${difficulty}/${id}.json?${query}`));
    if(data===null)return [];
    if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('랭킹 목록을 읽지 못했어요. 다시 불러와 주세요.');
    return Object.entries(data).map(([uid,value])=>publicRecord(value,uid,difficulty,id)).filter((row):row is PublicRecord=>row!==null);
  }));
  return boards.flat().sort(compareRecords).slice(0,100);
}

function payload(run:RunRecord,nickname:string) {
  return {nickname,hero:run.hero,difficulty:run.difficulty,score:run.score,durationMs:run.durationMs,kills:run.kills,graze:run.graze,cleared:run.cleared,
    submittedAt:{'.sv':'timestamp'}};
}

export async function publishOnline(run:RunRecord,nickname:string,onOwner:(uid:string)=>void):Promise<{kept:boolean;uid:string}> {
  if(!validRun(run))throw new Error('10초 이상 플레이한 완료 기록만 등록할 수 있어요.');
  if(!validNickname(nickname))throw new Error('별명은 한글, 영문, 숫자, 공백, _ . - 로 1~12자 입력해 주세요.');
  scope(run.difficulty,run.hero);
  const user=await identity();onOwner(user.uid);
  let token:string;
  try{token=await user.getIdToken();}catch{throw new Error('랭킹 로그인을 갱신하지 못했어요. 다시 등록해 주세요.');}
  const url=`${base}/${run.difficulty}/${run.hero}/${encodeURIComponent(user.uid)}.json?auth=${encodeURIComponent(token)}`;
  for(let attempt=0;attempt<3;attempt++) {
    const previousResponse=await request(url,{headers:{'X-Firebase-ETag':'true'}});
    const raw=await json(previousResponse);
    const previous=raw===null?null:publicRecord(raw,user.uid,run.difficulty,run.hero);
    if(raw!==null&&!previous)throw new Error('기존 기록을 확인하지 못했어요. 내 기록을 삭제한 뒤 다시 등록해 주세요.');
    const kept=!!previous&&previous.score>=run.score;
    if(kept&&previous!.nickname===nickname)return {kept:true,uid:user.uid};
    // Server rules also enforce the interval; this provides a useful message before a denied write.
    if(previous) {
      const serverHeader=previousResponse.headers.get('date');
      const serverNow=serverHeader?Date.parse(serverHeader):Date.now();
      const age=(Number.isFinite(serverNow)?serverNow:Date.now())-previous.submittedAt;
      if(age<10000)throw new Error(`기록은 10초 간격으로 갱신할 수 있어요. ${Math.max(1,Math.min(10,Math.ceil((10000-age)/1000)))}초 후 다시 시도해 주세요.`);
    }
    const etag=previousResponse.headers.get('etag');
    if(!etag)throw new Error('기록 갱신 상태를 확인하지 못했어요. 다시 등록해 주세요.');
    const response=await request(url,{method:'PUT',headers:{'Content-Type':'application/json','if-match':etag},body:JSON.stringify(payload(kept?previous!:run,nickname))},true);
    if(response.status!==412)return {kept,uid:user.uid};
  }
  throw new Error('다른 창에서 기록이 바뀌었어요. 랭킹을 새로 불러온 뒤 다시 등록해 주세요.');
}

export async function deleteOnline(difficulty:Difficulty,hero:HeroId):Promise<void> {
  scope(difficulty,hero);
  const user=await identity();
  let token:string;
  try{token=await user.getIdToken();}catch{throw new Error('랭킹 로그인을 갱신하지 못했어요. 다시 시도해 주세요.');}
  await request(`${base}/${difficulty}/${hero}/${encodeURIComponent(user.uid)}.json?auth=${encodeURIComponent(token)}`,{method:'DELETE'});
}
