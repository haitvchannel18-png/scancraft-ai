// modules/knowledge/history-db.js

import Cache from "../memory/knowledge-cache.js"
import { EventBus } from "../core/events.js"

class HistoryDB {

constructor(){
this.db = this.loadDB()
}

// 🔥 LOAD JSON
async loadDB(){
try{
const res = await fetch("/models/history/history-db.json")
return await res.json()
}catch(e){
return {}
}
}

// 🔥 MAIN FUNCTION
async get(object){

if(!object) return null

const key = "history_" + object.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("historyDBStart", {object})

try{

const db = await this.db

// 🧠 DIRECT MATCH
let result = db[object.toLowerCase()]

// 🧠 FUZZY MATCH
if(!result){
result = this.fuzzy(object, db)
}

// 🧠 DEFAULT FALLBACK
if(!result){
result = this.generateFallback(object)
}

// 💾 CACHE
Cache.set(key, result)

EventBus.emit("historyDBComplete", result)

return result

}catch(err){

EventBus.emit("historyDBError", err)
return null

}

}

// 🔍 FUZZY SEARCH
fuzzy(object, db){

const key = Object.keys(db).find(k =>
object.toLowerCase().includes(k)
)

return db[key] || null

}

// 🧠 FALLBACK GENERATION
generateFallback(object){

return {
object,
origin: "unknown",
timeline: [],
summary: `${object} ka exact history available nahi hai, lekin yeh ek commonly used object hai jo modern usage me develop hua hai.`,
evolution: "Gradual improvements over time"
}

}

}

export default new HistoryDB()
