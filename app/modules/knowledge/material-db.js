// modules/knowledge/material-db.js

import Cache from "../memory/knowledge-cache.js"
import { EventBus } from "../core/events.js"

class MaterialDB {

constructor(){
this.db = this.loadDB()
}

// 🔥 LOAD JSON DB
loadDB(){

try{
return fetch("/models/materials/material-db.json")
.then(res => res.json())
}catch(e){
return {}
}

}

// 🔥 MAIN FUNCTION
async get(object){

if(!object) return null

const key = "material_" + object.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("materialDBStart", {object})

try{

const db = await this.db

// 🧠 DIRECT MATCH
let result = db[object.toLowerCase()]

// 🧠 FUZZY MATCH
if(!result){
result = this.fuzzySearch(object, db)
}

// 🧠 FALLBACK DEFAULT
if(!result){
result = this.defaultMaterial(object)
}

// 💾 CACHE
Cache.set(key, result)

EventBus.emit("materialDBComplete", result)

return result

}catch(err){

EventBus.emit("materialDBError", err)
return null

}

}

// 🔍 FUZZY SEARCH
fuzzySearch(object, db){

const key = Object.keys(db).find(k => object.toLowerCase().includes(k))

return db[key] || null

}

// 🧠 DEFAULT MATERIAL GUESS
defaultMaterial(object){

const o = object.toLowerCase()

if(o.includes("metal") || o.includes("car")) return ["steel","aluminum"]
if(o.includes("bottle")) return ["plastic","glass"]
if(o.includes("chair")) return ["wood","plastic"]
if(o.includes("phone")) return ["glass","metal","silicon"]

return ["unknown material"]

}

}

export default new MaterialDB()
