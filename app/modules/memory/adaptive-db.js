// modules/memory/adaptive-db.js

import { getCache, setCache } from "./cache-manager.js"

const PREFIX = "adaptive:"
const STATS_KEY = "adaptive:stats"

let stats = {}

export async function initAdaptiveDB(){

const stored = await getCache(STATS_KEY)

if(stored){
stats = stored
}

}

export async function recordObjectUsage(objectName){

if(!objectName) return

const name = normalize(objectName)

if(!stats[name]){
stats[name] = {
count:0,
lastUsed:0
}
}

stats[name].count++
stats[name].lastUsed = Date.now()

await setCache(STATS_KEY,stats)

}

export function getObjectStats(objectName){

const name = normalize(objectName)

return stats[name] || null

}

export function getTopObjects(limit=10){

const list = Object.entries(stats)

list.sort((a,b)=> b[1].count - a[1].count)

return list.slice(0,limit).map(x=>x[0])

}

export function getRecentlyUsed(limit=10){

const list = Object.entries(stats)

list.sort((a,b)=> b[1].lastUsed - a[1].lastUsed)

return list.slice(0,limit).map(x=>x[0])

}

export async function boostPriority(objectName){

const name = normalize(objectName)

if(!stats[name]){
stats[name] = {
count:1,
lastUsed:Date.now()
}
}else{
stats[name].count += 5
stats[name].lastUsed = Date.now()
}

await setCache(STATS_KEY,stats)

}

export function normalize(name){

return name
.toLowerCase()
.replace(/[_\-]/g," ")
.trim()

}
