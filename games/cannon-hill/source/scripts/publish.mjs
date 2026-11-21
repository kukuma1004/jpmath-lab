// 검증한 빌드(dist)를 공개 폴더(games/cannon-hill)로 옮긴다. 원본(source)은 그대로 둔다.
import { readFile, copyFile, cp, unlink, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const game = path.resolve(source, '..');
const current = await readFile(path.join(source, 'dist/index.html'), 'utf8');
await cp(path.join(source, 'dist/assets'), path.join(game, 'assets'), { recursive: true });
await copyFile(path.join(source, 'dist/index.html'), path.join(game, 'index.html'));
// 그려 받은 그림(public/art → dist/art)
await cp(path.join(source, 'dist/art'), path.join(game, 'art'), { recursive: true });
// 이번 빌드가 쓰지 않는 예전 해시 파일만 지운다
for (const name of await readdir(path.join(game, 'assets'))) {
  if (/^(?:index|phaser)-[A-Za-z0-9_-]+\.(?:js|css)$/.test(name) && !current.includes(`./assets/${name}`)) {
    await unlink(path.join(game, 'assets', name)).catch(() => {});
  }
}
console.log('games/cannon-hill/ 에 빌드를 옮겼습니다.');
