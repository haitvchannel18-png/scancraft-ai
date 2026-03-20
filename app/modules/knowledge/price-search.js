// modules/knowledge/price-search.js

import Cache from "../memory/knowledge-cache.js"
import ProductDB from "./product-db.js"
import WebSearch from "./web-search.js"
import { EventBus } from "../core/events.js"

class PriceSearch {

constructor(){
this.currency = "INR"
}

// 🔥 MAIN FUNCTION
async getPrice(query){

if(!query) return null

const key = "price_" + query.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("priceSearchStart", {query})

try{

// 🧠 STEP 1 — PRODUCT DB
let products = await ProductDB.search(query)

// 🧠 STEP 2 — EXTRACT PRICES
let prices = this.extractPrices(products)

// 🧠 STEP 3 — WEB FALLBACK
if(prices.length === 0){
const web = await WebSearch.search(query + " price")
prices = this.extractFromWeb(web)
}

// 🧠 STEP 4 — ANALYZE RANGE
const result = this.computeRange(prices)

// 💾 CACHE
Cache.set(key, result)

EventBus.emit("priceSearchComplete", result)

return result

}catch(err){

EventBus.emit("priceSearchError", err)
return null

}

}

// 💰 EXTRACT FROM PRODUCTS
extractPrices(products){

return products
.map(p => this.parsePrice(p.price))
.filter(Boolean)

}

// 🌍 WEB EXTRACTION
extractFromWeb(web){

if(!web || !web.related) return []

return web.related
.map(item => this.parsePrice(item.text))
.filter(Boolean)

}

// 🧠 PARSE PRICE
parsePrice(text){

if(!text) return null

const match = text.match(/₹\s?\d+/)

return match ? parseInt(match[0].replace(/[₹\s]/g,"")) : null

}

// 📊 RANGE CALCULATION
computeRange(prices){

if(!prices.length){
return {
min: null,
max: null,
average: null,
confidence: 0
}
}

const min = Math.min(...prices)
const max = Math.max(...prices)
const avg = Math.round(prices.reduce((a,b)=>a+b,0)/prices.length)

return {
currency: this.currency,
min,
max,
average: avg,
confidence: Math.min(1, prices.length / 5)
}

}

}

export default new PriceSearch()
