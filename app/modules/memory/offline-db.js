// modules/memory/offline-db.js

import { getCache, setCache } from "./cache-manager.js"

const DB_NAME = "scancraft-offline"
const STORE = "objects"
const VERSION = 1

let db = null

export async function initOfflineDB(){

db = await openDB()

}

function openDB(){

return new Promise((resolve,reject)=>{

const request = indexedDB.open(DB_NAME,VERSION)

request.onupgradeneeded = (e)=>{

const database = e.target.result

if(!database.objectStoreNames.contains(STORE)){

database.createObjectStore(STORE)

}

}

request.onsuccess = ()=> resolve(request.result)
request.onerror = ()=> reject(request.error)

})

}

export async function saveObject(objectName,data){

if(!db) return

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE,"readwrite")

const store = tx.objectStore(STORE)

const request = store.put(data,objectName)

request.onsuccess = ()=> resolve(true)
request.onerror = ()=> reject(request.error)

})

}

export async function getObject(objectName){

const cacheKey = "offline:"+objectName

let cached = await getCache(cacheKey)

if(cached) return cached

if(!db) return null

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE,"readonly")

const store = tx.objectStore(STORE)

const request = store.get(objectName)

request.onsuccess = async ()=>{

const data = request.result

if(data){

await setCache(cacheKey,data)

}

resolve(data || null)

}

request.onerror = ()=> reject(request.error)

})

}

export async function objectExists(objectName){

const obj = await getObject(objectName)

return !!obj

}

export async function deleteObject(objectName){

if(!db) return

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE,"readwrite")

const store = tx.objectStore(STORE)

const request = store.delete(objectName)

request.onsuccess = ()=> resolve(true)
request.onerror = ()=> reject(request.error)

})

}

export async function listObjects(){

if(!db) return []

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE,"readonly")

const store = tx.objectStore(STORE)

const request = store.getAllKeys()

request.onsuccess = ()=> resolve(request.result)
request.onerror = ()=> reject(request.error)

})

}

export async function clearOfflineDB(){

if(!db) return

return new Promise((resolve,reject)=>{

const tx = db.transaction(STORE,"readwrite")

const store = tx.objectStore(STORE)

const request = store.clear()

request.onsuccess = ()=> resolve(true)
request.onerror = ()=> reject(request.error)

})

}
