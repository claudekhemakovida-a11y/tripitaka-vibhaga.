// Offline support: the app and answers are fetched fresh when online and served from cache when offline.
const CACHE="tvib-v5";
const CORE=["./","index.html","answers.json","logo-art2.png","buddha-hd.jpg","icon-192.png","icon-512.png","manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  const same=u.origin===location.origin;
  if(same){ // network first, fall back to cache
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("index.html"))));
  }else if(/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(u.host)){ // cache first for fonts and libraries
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c));return res})));
  }});
