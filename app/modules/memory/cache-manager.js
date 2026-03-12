// modules/memory/cache-manager.js

const DB_NAME = "scancraft-cache"
const STORE_NAME = "cache-store"
const DB_VERSION = 1

let db = null
let memoryCache = new Map()

export async function initCache(){

db = await openDB()

}

function openDB(){

return new Promise((resolve,reject)=>{

const request = indexedDB.open(DB_NAME,DB_VERSION)

request.onupgradeneeded = (event)=>{

const database = event.target.result

if(!database.objectStoreNames.contains(STORE_NAME)){

database.createObjectStore(STORE_NAME)

}

}

request.onsuccess = ()=> resolve(request.result)

request.onerror = ()=> reject(request.error)

})

}

export function setMemory(key,value){

memoryCache.set(key,{
data:value,
time:Date.now()
})

}

export function getMemory(key){

const item = memoryCache.get(key)

if(!item) return null

return item.data

}

export async function setCache(key,value){

setMemory(key,value)

if(!db) return

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE_NAME,"readwrite")

const store = tx.objectStore(STORE_NAME)

const request = store.put({
data:value,
time:Date.now()
},key)

request.onsuccess = ()=> resolve(true)

request.onerror = ()=> reject(request.error)

})

}

export async function getCache(key){

const mem = getMemory(key)

if(mem) return mem

if(!db) return null

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE_NAME,"readonly")

const store = tx.objectStore(STORE_NAME)

const request = store.get(key)

request.onsuccess = ()=>{

const result = request.result

if(!result){

resolve(null)
return

}

memoryCache.set(key,result)

resolve(result.data)

}

request.onerror = ()=> reject(request.error)

})

}

export async function deleteCache(key){

memoryCache.delete(key)

if(!db) return

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE_NAME,"readwrite")

const store = tx.objectStore(STORE_NAME)

const request = store.delete(key)

request.onsuccess = ()=> resolve(true)

request.onerror = ()=> reject(request.error)

})

}

export async function clearCache(){

memoryCache.clear()

if(!db) return

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE_NAME,"readwrite")

const store = tx.objectStore(STORE_NAME)

const request = store.clear()

request.onsuccess = ()=> resolve(true)

request.onerror = ()=> reject(request.error)

})

}

export function hasCache(key){

return memoryCache.has(key)

}

export function cacheSize(){

return memoryCache.size

}

export async function preloadCache(keys){

const results = {}

for(const key of keys){

results[key] = await getCache(key)

}

return results

}
