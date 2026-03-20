// ==============================
// 💀 ScanCraft AI - Service Worker (ULTRA FINAL)
// ==============================

const CACHE_VERSION = "v3"
const STATIC_CACHE = "static-" + CACHE_VERSION
const DYNAMIC_CACHE = "dynamic-" + CACHE_VERSION

// ==============================
// 🔥 STATIC ASSETS
// ==============================

const STATIC_ASSETS = [

"/",
"/index.html",
"/style.css",
"/app.js",
"/manifest.json",

// 🎧 sounds (safe load)
"/sounds/scan/scan-start.mp3",
"/sounds/scan/scan-complete.mp3",
"/sounds/ui/click.mp3"

]

// ==============================
// 🚀 INSTALL
// ==============================

self.addEventListener("install", (event)=>{

console.log("🔥 SW Installing...")

event.waitUntil(

caches.open(STATIC_CACHE)
.then(cache=>{
return cache.addAll(STATIC_ASSETS)
})

)

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
if(key !== STATIC_CACHE && key !== DYNAMIC_CACHE){
console.log("🗑 Removing old cache:", key)
return caches.delete(key)
}
})
)
})

)

self.clients.claim()

})

// ==============================
// 📡 FETCH STRATEGY
// ==============================

self.addEventListener("fetch", (event)=>{

const req = event.request

if(req.method !== "GET") return

// ==============================
// 🔥 STATIC FILES → CACHE FIRST
// ==============================

if(
req.url.includes(".css") ||
req.url.includes(".js") ||
req.url.includes(".mp3") ||
req.url.includes(".json")
){

event.respondWith(

caches.match(req).then(cached=>{
return cached || fetch(req)
})

)

return
}

// ==============================
// 🌐 HTML → NETWORK FIRST
// ==============================

event.respondWith(

fetch(req)
.then(networkRes=>{

return caches.open(DYNAMIC_CACHE).then(cache=>{
cache.put(req, networkRes.clone())
return networkRes
})

})
.catch(()=>{

return caches.match(req).then(cached=>{
return cached || caches.match("/index.html")
})

})

)

})
