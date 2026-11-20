import { copyFile, mkdir, readdir, unlink, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const source = fileURLToPath(new URL('../',import.meta.url));
const target = path.resolve(source,'..');
const assets = path.join(target,'assets');
if(path.basename(target)!=='billiards'||path.dirname(assets)!==target)throw new Error('Unexpected build destination');
await mkdir(assets,{recursive:true});
const builtAssets = await readdir(path.join(source,'dist','assets'));
await copyFile(path.join(source,'dist','index.html'),path.join(target,'index.html'));
for(const file of builtAssets)await copyFile(path.join(source,'dist','assets',file),path.join(assets,file));
// Remove obsolete Vite output files only, never original assets or source/artifacts.
for(const file of await readdir(assets))if(/^(index|three|PredictionWorker)-[A-Za-z0-9_-]+\.(js|css)$/.test(file)&&!builtAssets.includes(file))await unlink(path.join(assets,file));
await writeFile(path.join(target,'build-manifest.json'),JSON.stringify({version:'0.1.0',phase:1,files:['index.html',...builtAssets.map(f=>`assets/${f}`)]},null,2)+'\n');
console.log(`Staged ${builtAssets.length+1} static files into games/billiards/`);
