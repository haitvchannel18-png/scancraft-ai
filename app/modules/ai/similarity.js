// modules/ai/similarity.js

import VectorDB from "../vision-search/vector-db.js"
import { EventBus } from "../core/events.js"

class SimilarityAI {

constructor(){
this.topK = 5
this.threshold = 0.3
}

// 🔥 MAIN FUNCTION
async findSimilar(vector){

if(!vector){
return []
}

EventBus.emit("similaritySearchStart")

try{

// 🔎 SEARCH VECTOR DB
const results = await VectorDB.search(vector, this.topK)

// 🎯 FILTER + SORT
const filtered = results
.filter(r => r.score > this.threshold)
.sort((a,b)=>b.score - a.score)

// 🧠 ENHANCED OUTPUT
const enhanced = filtered.map(r => ({
label: r.label,
score: r.score,
category: r.category || "unknown",
confidence: this.normalizeScore(r.score)
}))

EventBus.emit("similaritySearchDone", enhanced)

return enhanced

}catch(err){

EventBus.emit("similarityError", err)

return []

}

}

// 📊 NORMALIZE SCORE
normalizeScore(score){

// smooth curve normalization
return Math.min(1, Math.pow(score, 1.2))

}

// 🧠 CATEGORY GUESS (fallback)
inferCategory(similarObjects){

const counts = {}

for(const obj of similarObjects){

const cat = obj.category || "unknown"
counts[cat] = (counts[cat] || 0) + 1

}

let best = "unknown"
let max = 0

for(const k in counts){
if(counts[k] > max){
max = counts[k]
best = k
}
}

return best

}

// 🔥 HYBRID SIMILARITY (advanced)
mergeWithDetection(detectionLabel, similarObjects){

const labels = similarObjects.map(o=>o.label)

if(labels.includes(detectionLabel)){
return detectionLabel
}

// fallback: best similar
return similarObjects[0]?.label || detectionLabel

}

}

export default new SimilarityAI()
