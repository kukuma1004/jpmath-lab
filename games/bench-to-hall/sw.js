'use strict';
const CACHE='bench-to-hall-app-v5-economy-1';
const ART_CACHE='bench-to-hall-art-v1';
const ROOT=new URL('./',self.location.href);
const ASSETS=['index.html','manifest.webmanifest','icons/icon-16.png','icons/icon-32.png','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
const PATHS=new Set(ASSETS.map(p=>new URL(p,ROOT).pathname));
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(ASSETS.map(p=>new Request(new URL(p,ROOT),{cache:'reload'})));
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('bench-to-hall-app-')&&k!==CACHE).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==ROOT.origin)return;
 const artRoot=new URL('assets/afterlife/',ROOT).pathname;
 const careRoot=new URL('assets/care/',ROOT).pathname;
 const clubRoot=new URL('assets/club-life/',ROOT).pathname;
 const careFile=url.pathname.startsWith(careRoot)?url.pathname.slice(careRoot.length):'';
 const careArt=/^avatar-(?:[0-9]|1[0-9]|2[0-3])-moments-v1\.webp$/.test(careFile)||/^avatar-(?:1|3|5|6|9|11|14|16|17|19|21|22|23)-moments-extra-[ab]-v1\.webp$/.test(careFile);
 const clubArt=url.pathname.startsWith(clubRoot)&&/^club-(?:kia|samsung|lg|doosan|kt|ssg|lotte|hanwha|nc|kiwoom)-v1\.webp$/.test(url.pathname.slice(clubRoot.length));
 if(careArt||clubArt||url.pathname.startsWith(artRoot)&&/^avatar-(?:[0-9]|1[0-9]|2[0-3])-(?:studio|academy|founder|travel|model|active)-v1\.webp$/.test(url.pathname.slice(artRoot.length))){
  event.respondWith((async()=>{let cache;try{cache=await caches.open(ART_CACHE);const cached=await cache.match(event.request);if(cached)return cached}catch(error){}const response=await fetch(event.request);if(response.ok&&cache)try{await cache.put(event.request,response.clone());const keys=await cache.keys();await Promise.all(keys.slice(0,Math.max(0,keys.length-12)).map(k=>cache.delete(k)))}catch(error){}return response})());return;
 }
 const navigation=event.request.mode==='navigate'&&(url.pathname===ROOT.pathname||url.pathname===new URL('index.html',ROOT).pathname);
 if(navigation){event.respondWith((async()=>{
  try{const response=await fetch(event.request);if(response.ok){const cache=await caches.open(CACHE);await cache.put(new URL('index.html',ROOT),response.clone())}return response}
  catch(error){const cached=await caches.match(new URL('index.html',ROOT));if(cached)return cached;throw error}
 })());return}
 if(PATHS.has(url.pathname))event.respondWith((async()=>{
  const cached=await caches.match(url.pathname);if(cached)return cached;
  return fetch(event.request);
 })());
});
