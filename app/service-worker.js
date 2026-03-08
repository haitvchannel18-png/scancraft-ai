
const CACHE_NAME = "scancraft-ai-v1";

const ASSETS = [

"./",
"./index.html",
"./style.css",
"./app.js",

"./icons/icon-192.png",
"./icons/icon-512.png"

];


/* INSTALL */

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => {

return cache.addAll(ASSETS);

})

);

});


/* ACTIVATE */

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.filter(k => k !== CACHE_NAME)
.map(k => caches.delete(k))

);

})

);

});


/* FETCH */

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(res => {

return res || fetch(event.request);

})

);

});
