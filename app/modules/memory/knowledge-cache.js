// modules/memory/knowledge-cache.js

import { getCache,setCache } from "./cache-manager.js"
import { getObject,saveObject } from "./offline-db.js"

const PREFIX = "knowledge:"

export async function getKnowledge(objectName){

const key = PREFIX + objectName.toLowerCase()

// 1️⃣ check fast cache
let cached = await getCache(key)

if(cached) return cached

// 2️⃣ check offline DB
let offline = await getObject(objectName)

if(offline){

await setCache(key,offline)

return offline

}

return null

}

export async function storeKnowledge(objectName,data){

const key = PREFIX + objectName.toLowerCase()

await setCache(key,data)

await saveObject(objectName,data)

}

export async function hasKnowledge(objectName){

const key = PREFIX + objectName.toLowerCase()

const cached = await getCache(key)

if(cached) return true

const offline = await getObject(objectName)

return !!offline

}

export async function clearKnowledge(objectName){

const key = PREFIX + objectName.toLowerCase()

await setCache(key,null)

}

export async function preloadKnowledge(objects){

const results = {}

for(const obj of objects){

results[obj] = await getKnowledge(obj)

}

return results

}

export function normalizeName(name){

return name
.toLowerCase()
.replace(/\s+/g," ")
.trim()

}
