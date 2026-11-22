import { copyFile, mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const source = fileURLToPath(new URL('../',import.meta.url));
const target = path.resolve(source,'..');
const assets = path.join(target,'assets');
if(path.basename(target)!=='billiards'||path.dirname(assets)!==target)throw new Error('Unexpected build destination');
await mkdir(assets,{recursive:true});
const builtAssets = await readdir(path.join(source,'dist','assets'));
const retainedAssets = JSON.parse(await readFile(path.join(target,'retained-assets.json'),'utf8'));
await copyFile(path.join(source,'dist','index.html'),path.join(target,'index.html'));
for(const file of builtAssets)await copyFile(path.join(source,'dist','assets',file),path.join(assets,file));
// Remove obsolete Vite output files only, never original assets or source/artifacts.
for(const file of await readdir(assets))if(/^(index|three|PredictionWorker|Worker)-[A-Za-z0-9_-]+\.(js|css)$/.test(file)&&!builtAssets.includes(file)&&!retainedAssets.includes(`assets/${file}`))await unlink(path.join(assets,file));
await writeFile(path.join(target,'build-manifest.json'),JSON.stringify({version:'1.0.0',phase:6,physicsHz:240,shotControl:'two-press-oscillating-power',files:['index.html',...builtAssets.map(f=>`assets/${f}`)]},null,2)+'\n');
console.log(`Staged ${builtAssets.length+1} static files into games/billiards/`);
