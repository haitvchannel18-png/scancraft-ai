// modules/knowledge/product-db.js

import Cache from "../memory/knowledge-cache.js"
import WebSearch from "./web-search.js"
import { EventBus } from "../core/events.js"

class ProductDB {

constructor(){
this.localDB = {} // can preload later
}

// 🔥 MAIN SEARCH
async search(query){

if(!query) return []

const key = "product_" + query.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("productSearchStart", {query})

try{

// 🧠 1. LOCAL DB SEARCH
let results = this.searchLocal(query)

// 🧠 2. WEB FALLBACK
if(results.length === 0){
results = await this.searchWeb(query)
}

// 🧠 3. RANK PRODUCTS
const ranked = this.rank(results)

// 💾 CACHE
Cache.set(key, ranked)

EventBus.emit("productSearchComplete", ranked)

return ranked

}catch(err){

EventBus.emit("productSearchError", err)
return []

}

}

// 📦 LOCAL SEARCH
searchLocal(query){

const lower = query.toLowerCase()

return Object.values(this.localDB).filter(p =>
p.name.toLowerCase().includes(lower)
)

}

// 🌍 WEB SEARCH (fallback)
async searchWeb(query){

const data = await WebSearch.search(query + " product")

if(!data) return []

return (data.related || []).map(item => ({
name: item.text,
source: item.url,
price: this.estimatePrice(item.text),
confidence: 0.6
}))

}

// 📊 RANKING ENGINE
rank(products){

return products
.map(p => ({
...p,
score: this.computeScore(p)
}))
.sort((a,b)=>b.score - a.score)
.slice(0,5)

}

// 🧠 SCORE CALCULATION
computeScore(product){

let score = product.confidence || 0.5

if(product.price) score += 0.2
if(product.name) score += 0.2

return Math.min(1, score)

}

// 💰 PRICE ESTIMATION (basic NLP)
estimatePrice(text){

const match = text.match(/₹\s?\d+/)

return match ? match[0] : "unknown"

}

// ➕ ADD PRODUCT (learning system)
addProduct(product){

this.localDB[product.id] = product

}

}

export default new ProductDB()
