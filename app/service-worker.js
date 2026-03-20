// ==============================
// 💀 ScanCraft AI - Service Worker (FINAL)
// ==============================

const CACHE_VERSION = "v2"
const CACHE_NAME = "scancraft-" + CACHE_VERSION

// 🔥 static assets
const STATIC_ASSETS = [

"/",
"/index.html",
"/style.css",
"/app.js",

// 🎧 sounds
"/sounds/ai/typing.mp3",
"/sounds/ai/thinking.mp3",
"/sounds/ai/response.mp3",
"/sounds/ai/listening.mp3",

"/sounds/ui/click.mp3",
"/sounds/ui/hover.mp3",
"/sounds/ui/open-panel.mp3",

"/sounds/scan/detect.mp3",
"/sounds/scan/scan-start.mp3",
"/sounds/scan/scan-complete.mp3",

"/sounds/editor/brush.mp3",
"/sounds/editor/paint.mp3",
"/sounds/editor/texture.mp3",

"/sounds/ambience/background.mp3"

]

// ==============================
// 🚀 INSTALL
// ==============================

self.addEventListener("install", (event)=>{

console.log("🔥 SW Installing...")

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>{
return cache.addAll(STATIC_ASSETS)
})

)

// ⚡ activate immediately
self.skipWaiting()

})

// ==============================
// ⚡ ACTIVATE
// ==============================

self.addEventListener("activate", (event)=>{

console.log("⚡ SW Activated")

event.waitUntil(

caches.keys().then(keys=>{

return Promise.all(

keys.map(key=>{
if(key !== CACHE_NAME){
console.log("🗑 Removing old cache:", key)
return caches.delete(key)
}
})

)

})

)

// 🔥 take control immediately
self.clients.claim()

})

// ==============================
// 📡 FETCH (SMART STRATEGY)
// ==============================

self.addEventListener("fetch", (event)=>{

const req = event.request

// 🔥 skip non-GET
if(req.method !== "GET") return

event.respondWith(

caches.match(req).then(cached=>{

// ==============================
// ⚡ CACHE FIRST (STATIC FILES)
// ==============================

if(cached){
return cached
}

// ==============================
// 🌐 NETWORK FIRST (DYNAMIC)
// ==============================

return fetch(req)
.then(networkRes=>{

// ⚠️ skip invalid responses
if(!networkRes || networkRes.status !== 200){
return networkRes
}

// 💾 dynamic caching
return caches.open(CACHE_NAME).then(cache=>{

cache.put(req, networkRes.clone())

return networkRes

})

})
.catch(()=>{

// ==============================
// ❌ OFFLINE FALLBACK
// ==============================

if(req.destination === "document"){
return caches.match("/index.html")
}

// fallback text
return new Response("⚠️ Offline Mode", {
headers:{ "Content-Type":"text/plain" }
})

})

})

)

})
