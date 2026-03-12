// modules/vision-search/similarity-search.js

import { EventBus } from "../core/events.js"

let embeddingsDB = []
let loaded = false

const DB_PATH = "/models/embeddings/object-db.json"



export async function loadEmbeddings(){

if(loaded) return

const res = await fetch(DB_PATH)

embeddingsDB = await res.json()

loaded = true

EventBus.emit("embeddingDBLoaded", embeddingsDB.length)

}



export async function searchSimilar(queryEmbedding, topK = 5){

if(!loaded){
await loadEmbeddings()
}

const results = []

for(const item of embeddingsDB){

const score = cosineSimilarity(queryEmbedding, item.embedding)

results.push({
label: item.label,
score: score,
metadata: item.metadata || {}
})

}

results.sort((a,b)=>b.score - a.score)

return results.slice(0, topK)

}



function cosineSimilarity(a,b){

let dot = 0
let normA = 0
let normB = 0

for(let i=0;i<a.length;i++){

dot += a[i]*b[i]
normA += a[i]*a[i]
normB += b[i]*b[i]

}

return dot / (Math.sqrt(normA) * Math.sqrt(normB))

}
