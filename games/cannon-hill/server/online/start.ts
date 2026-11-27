import { createReadStream, statSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { ONLINE_API } from '../../source/src/game/online/protocol';
import { OnlineAuthority, RequestError } from './authority';

const host = process.env.WARUREU_HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 8787);
const root = resolve(process.env.WARUREU_WEB_DIR ?? 'dist');
const webOrigin = process.env.WARUREU_WEB_ORIGIN;
const games = new OnlineAuthority(resolve(process.env.WARUREU_DATA_DIR ?? '.online-data'));
const attempts = new Map<string,{count:number;until:number}>();
const types: Record<string,string> = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.png':'image/png', '.webp':'image/webp',
  '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json',
};

async function readBody(req: IncomingMessage): Promise<Record<string,unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const buffer of req) {
    size += buffer.length;
    if (size > 4096) throw new RequestError(413,'요청이 너무 길어요.');
    chunks.push(buffer);
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (data && typeof data === 'object' && !Array.isArray(data)) return data;
  } catch { /* Invalid JSON is handled below. */ }
  throw new RequestError(400,'요청값을 확인해 주세요.');
}

function json(res: ServerResponse, value: unknown, status = 200): void {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify(value));
}

function staticFile(req: IncomingMessage, res: ServerResponse, pathname: string): void {
  if (req.method !== 'GET' && req.method !== 'HEAD') throw new RequestError(405,'지원하지 않는 요청이에요.');
  const file = resolve(root,'.'+decodeURIComponent(pathname==='/' ? '/index.html' : pathname));
  if (!file.startsWith(root+sep)) throw new RequestError(404,'페이지를 찾지 못했어요.');
  let stat;
  try { stat = statSync(file); } catch { throw new RequestError(404,'페이지를 찾지 못했어요.'); }
  if (!stat.isFile()) throw new RequestError(404,'페이지를 찾지 못했어요.');
  res.writeHead(200,{
    'Content-Type':types[extname(file)] ?? 'application/octet-stream','Content-Length':stat.size,
    'Cache-Control':pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  if (req.method === 'HEAD') res.end();
  else createReadStream(file).on('error',() => res.destroy()).pipe(res);
}

function rateLimit(req: IncomingMessage): void {
  const client = req.socket.remoteAddress ?? 'local';
  const now = Date.now();
  const slot = attempts.get(client);
  if (!slot || slot.until <= now) {
    attempts.set(client,{count:1,until:now+60_000});
    return;
  }
  if (slot.count++ >= 12) throw new RequestError(429,'로그인 시도가 많아요. 잠시 후 다시 시도해 주세요.');
}

const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','same-origin');
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (!url.pathname.startsWith(ONLINE_API+'/')) {
      staticFile(req,res,url.pathname);
      return;
    }
    const origin = req.headers.origin;
    if (origin && origin !== webOrigin && origin !== `http://${req.headers.host}` && origin !== `https://${req.headers.host}`) {
      throw new RequestError(403,'허용되지 않은 게임 주소예요.');
    }
    if (origin && origin === webOrigin) {
      res.setHeader('Access-Control-Allow-Origin',origin);
      res.setHeader('Vary','Origin');
    }
    if (req.method === 'OPTIONS') {
      res.writeHead(204,{'Access-Control-Allow-Headers':'content-type, authorization','Access-Control-Allow-Methods':'GET, POST, OPTIONS'});
      res.end();
      return;
    }
    const action = url.pathname.slice(ONLINE_API.length+1);
    if (action === 'health' && req.method === 'GET') { json(res,{ok:true}); return; }
    if ((action === 'register' || action === 'login') && req.method === 'POST') {
      rateLimit(req);
      json(res,await games.authenticate(await readBody(req),action==='register'));
      return;
    }
    const token = req.headers.authorization?.replace(/^Bearer /,'') ?? '';
    const player = games.who(token);
    if (req.method === 'GET') {
      if (action === 'state') {
        const n = Number(url.searchParams.get('cursor'));
        json(res,games.state(player,url.searchParams.get('code'),Number.isSafeInteger(n) && n>=0 ? n : 0));
      } else if (action === 'ranking') json(res,games.rankings());
      else throw new RequestError(404,'찾을 수 없는 요청이에요.');
      return;
    }
    if (req.method !== 'POST') throw new RequestError(405,'지원하지 않는 요청이에요.');
    const body = await readBody(req);
    if (action === 'create' || action === 'join' || action === 'queue') games.lobby(player,action,body);
    else if (action === 'leave') games.leave(player,body.code);
    else if (action === 'command') games.command(player,body);
    else if (action === 'logout') games.signOut(token);
    else throw new RequestError(404,'찾을 수 없는 요청이에요.');
    json(res,{ok:true});
  } catch (error) {
    if (error instanceof RequestError) json(res,{error:error.message},error.status);
    else {
      console.error('Warureu server request failed', error instanceof Error ? error.name : 'unknown');
      json(res,{error:'서버에서 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'},500);
    }
  }
});
const step = setInterval(() => {
  try { games.tick(); } catch (error) {
    console.error('Warureu server tick failed', error instanceof Error ? error.name : 'unknown');
  }
},16);
const sweep = setInterval(() => {
  const now=Date.now();
  for (const [client,limit] of attempts) if (limit.until<=now) attempts.delete(client);
},60_000);
server.on('close',() => {clearInterval(step); clearInterval(sweep);});
server.listen(port,host,() => {
  const address=server.address();
  if (address && typeof address!=='string') console.log(`와르르 온라인 http://${host}:${address.port}/`);
});
