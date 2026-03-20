// modules/knowledge/object-info.js

import Cache from "../memory/knowledge-cache.js"
import Wiki from "./wiki.js"
import MaterialDB from "./material-db.js"
import { EventBus } from "../core/events.js"

class ObjectInfo {

constructor(){
this.basicDB = {
chair:{category:"furniture",use:"sitting"},
bottle:{category:"container",use:"liquid storage"},
laptop:{category:"electronics",use:"computing"},
car:{category:"vehicle",use:"transport"},
phone:{category:"electronics",use:"communication"}
}
}

// 🔥 MAIN FUNCTION
async getInfo(label){

if(!label) return null

const key = "object_" + label.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("objectInfoStart", {label})

try{

// 🧠 BASIC INFO
const basic = this.basicDB[label.toLowerCase()] || {}

// 🧠 WIKI DATA
const wiki = await Wiki.search(label)

// 🧠 MATERIAL DATA
const materials = await MaterialDB.get(label)

// 🧠 MERGE
const result = this.build({
label,
basic,
wiki,
materials
})

// 💾 CACHE
Cache.set(key, result)

EventBus.emit("objectInfoComplete", result)

return result

}catch(err){

EventBus.emit("objectInfoError", err)

return {
name: label,
category: "unknown",
use: "unknown"
}

}

}

// 🧠 BUILD PROFILE
build({label, basic, wiki, materials}){

return {
name: label,
category: basic.category || "unknown",
use: basic.use || "general purpose",
summary: wiki?.summary || "",
facts: wiki?.facts || [],
materials: materials || [],
image: wiki?.image || null,
source: wiki?.source || "",
timestamp: Date.now()
}

}

}

export default new ObjectInfo()
