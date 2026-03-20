// modules/knowledge/rag-retriever.js

import Wiki from "./wiki.js"
import ProductDB from "./product-db.js"
import MaterialDB from "./material-db.js"
import Cache from "../memory/knowledge-cache.js"
import { EventBus } from "../core/events.js"

class RAGRetriever {

constructor(){
this.sources = ["wiki","products","materials"]
}

// 🔥 MAIN FUNCTION
async retrieve(query){

if(!query) return null

// ⚡ CACHE CHECK
const cached = Cache.get(query)
if(cached){
return cached
}

EventBus.emit("ragStart", {query})

try{

// 🧠 MULTI SOURCE FETCH
const [wiki, products, materials] = await Promise.all([
this.fetchWiki(query),
this.fetchProducts(query),
this.fetchMaterials(query)
])

// 🧠 MERGE KNOWLEDGE
const combined = this.combine({
wiki,
products,
materials
})

// 💾 CACHE
Cache.set(query, combined)

EventBus.emit("ragComplete", combined)

return combined

}catch(err){

EventBus.emit("ragError", err)
return null

}

}

// 📚 WIKI
async fetchWiki(query){
try{
return await Wiki.search(query)
}catch(e){
return null
}
}

// 🛒 PRODUCTS
async fetchProducts(query){
try{
return await ProductDB.search(query)
}catch(e){
return []
}
}

// 🧱 MATERIALS
async fetchMaterials(query){
try{
return await MaterialDB.get(query)
}catch(e){
return null
}
}

// 🧠 COMBINE DATA
combine({wiki, products, materials}){

return {
summary: wiki?.summary || "",
history: wiki?.history || "",
facts: wiki?.facts || [],
materials: materials || [],
products: products || [],
timestamp: Date.now()
}

}

}

export default new RAGRetriever()
