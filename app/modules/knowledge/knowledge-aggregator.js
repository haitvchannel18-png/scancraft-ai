// modules/knowledge/knowledge-aggregator.js

import ObjectInfo from "./object-info.js"
import HistorySearch from "./history-search.js"
import PriceSearch from "./price-search.js"
import MaterialDB from "./material-db.js"
import ProductDB from "./product-db.js"
import RAG from "./rag-retriever.js"
import Cache from "../memory/knowledge-cache.js"
import { EventBus } from "../core/events.js"

class KnowledgeAggregator {

constructor(){
this.sources = ["object","history","price","material","product","rag"]
}

// 🔥 MAIN FUNCTION
async aggregate(object){

if(!object) return null

const key = "knowledge_" + object.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("knowledgeStart", {object})

try{

// 🧠 MULTI SOURCE PARALLEL
const [
info,
history,
price,
material,
products,
rag
] = await Promise.all([
ObjectInfo.getInfo(object),
HistorySearch.search(object),
PriceSearch.getPrice(object),
MaterialDB.get(object),
ProductDB.search(object),
RAG.retrieve(object)
])

// 🧠 MERGE ALL DATA
const result = this.combine({
object,
info,
history,
price,
material,
products,
rag
})

// 💾 CACHE
Cache.set(key, result)

EventBus.emit("knowledgeComplete", result)

return result

}catch(err){

EventBus.emit("knowledgeError", err)
return null

}

}

// 🧠 COMBINE ENGINE
combine(data){

return {
object: data.object,

// 📌 BASIC
category: data.info?.category || "unknown",
use: data.info?.use || "",

// 📜 HISTORY
history: data.history?.summary || "",
timeline: data.history?.timeline || [],

// 💰 PRICE
price: data.price || {},

// 🧱 MATERIAL
materials: data.material || [],

// 🛒 PRODUCTS
products: data.products || [],

// 📚 KNOWLEDGE
summary:
data.info?.summary ||
data.rag?.summary ||
data.history?.summary || "",

facts:
data.info?.facts ||
data.rag?.facts || [],

// 🌐 SOURCE
source:
data.info?.source ||
data.rag?.source || "",

// 📊 CONFIDENCE
confidence: this.computeConfidence(data),

timestamp: Date.now()
}

}

// 📊 CONFIDENCE ENGINE
computeConfidence(data){

let score = 0

if(data.info) score += 0.2
if(data.history) score += 0.2
if(data.price) score += 0.2
if(data.material) score += 0.2
if(data.rag) score += 0.2

return Math.min(1, score)

}

}

export default new KnowledgeAggregator()
