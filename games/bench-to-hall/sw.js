'use strict';
const CACHE='bench-to-hall-app-v3-finale-1';
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
