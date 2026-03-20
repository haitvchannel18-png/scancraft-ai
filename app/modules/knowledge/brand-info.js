// modules/knowledge/brand-info.js

import Cache from "../memory/knowledge-cache.js"
import Wiki from "./wiki.js"
import WebSearch from "./web-search.js"
import { EventBus } from "../core/events.js"

class BrandInfo {

constructor(){
this.brandDB = {
apple:{category:"electronics",country:"USA"},
samsung:{category:"electronics",country:"South Korea"},
nike:{category:"fashion",country:"USA"},
sony:{category:"electronics",country:"Japan"},
marico:{category:"FMCG",country:"India"}
}
}

// 🔥 MAIN FUNCTION
async getBrandInfo(label){

if(!label) return null

const key = "brand_" + label.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("brandInfoStart", {label})

try{

// 🧠 DETECT BRAND NAME
const brand = this.extractBrand(label)

// 🧠 BASIC INFO
const basic = this.brandDB[brand] || {}

// 🧠 WIKI
const wiki = await Wiki.search(brand)

// 🌍 WEB FALLBACK
const web = await WebSearch.search(brand + " company")

// 🧠 MERGE
const result = this.build(brand, basic, wiki, web)

// 💾 CACHE
Cache.set(key, result)

EventBus.emit("brandInfoComplete", result)

return result

}catch(err){

EventBus.emit("brandInfoError", err)

return {
brand: "unknown",
category: "",
country: ""
}

}

}

// 🧠 EXTRACT BRAND
extractBrand(text){

const lower = text.toLowerCase()

const found = Object.keys(this.brandDB).find(b =>
lower.includes(b)
)

return found || text.split(" ")[0]

}

// 🧠 BUILD RESULT
build(brand, basic, wiki, web){

return {
brand,
category: basic.category || "unknown",
country: basic.country || "unknown",
summary: wiki?.summary || web?.summary || "",
facts: wiki?.facts || [],
source: wiki?.source || web?.source || "",
timestamp: Date.now()
}

}

}

export default new BrandInfo()
