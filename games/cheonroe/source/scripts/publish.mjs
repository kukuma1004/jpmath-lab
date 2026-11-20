import {readFile,copyFile,cp,unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),game=path.resolve(source,'..');
let previous='';try{previous=await readFile(path.join(game,'index.html'),'utf8');}catch{}
const current=await readFile(path.join(source,'dist/index.html'),'utf8');
await cp(path.join(source,'dist/assets'),path.join(game,'assets'),{recursive:true});
await copyFile(path.join(source,'dist/index.html'),path.join(game,'index.html'));
// Remove only obsolete build hashes previously referenced by this game's own entry.
for(const match of previous.matchAll(/\.\/assets\/([A-Za-z0-9_-]+\.(?:js|css))/g)){
  const name=match[1];if(!current.includes(`./assets/${name}`)&&/^(?:index|three)-[A-Za-z0-9_-]+\.(?:js|css)$/.test(name))await unlink(path.join(game,'assets',name)).catch(()=>{});
}
console.log('Published the verified build to games/cheonroe/; original images and source preserved.');
