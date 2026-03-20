// app/service-worker.js

const CACHE_NAME = "scancraft-v1"

// 🔥 important files
const ASSETS = [

"/",
"/index.html",
"/style.css",
"/app.js",

// sounds
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

// =============================
// 🔥 INSTALL
// =============================

self.addEventListener("install", (e)=>{

e.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>cache.addAll(ASSETS))

)

})

// =============================
// 🔥 FETCH (CACHE FIRST)
// =============================

self.addEventListener("fetch", (e)=>{

e.respondWith(

caches.match(e.request)
.then(res=>{

return res || fetch(e.request)
.then(networkRes=>{

// cache dynamic files
return caches.open(CACHE_NAME).then(cache=>{
cache.put(e.request, networkRes.clone())
return networkRes
})

})

})

)

})

// =============================
// 🔥 UPDATE
// =============================

self.addEventListener("activate",(e)=>{

e.waitUntil(

caches.keys().then(keys=>{
return Promise.all(
keys.filter(k=>k!==CACHE_NAME)
.map(k=>caches.delete(k))
)
})

)

})
