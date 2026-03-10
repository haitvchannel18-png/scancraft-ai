// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { getVectorDatabase } from "./embeddings-index.js"



// ================= CONFIG =================

const TOP_K = 8
const CONF_THRESHOLD = 0.32



// ================= CACHE =================

const similarityCache = new Map()



// ================= COSINE SIMILARITY =================

function cosineSimilarity(a, b){

let dot = 0
let normA = 0
let normB = 0

for(let i=0;i<a.length;i++){

dot += a[i]*b[i]
normA += a[i]*a[i]
normB += b[i]*b[i]

}

return dot / (Math.sqrt(normA)*Math.sqrt(normB))

}



// ================= EUCLIDEAN DISTANCE =================

function euclideanDistance(a,b){

let sum = 0

for(let i=0;i<a.length;i++){

sum += (a[i]-b[i])*(a[i]-b[i])

}

return Math.sqrt(sum)

}



// ================= VECTOR SEARCH =================

export async function similaritySearch(queryVector){

emit("vision:similarity:start")

const database = getVectorDatabase()

const cacheKey = hashVector(queryVector)

if(similarityCache.has(cacheKey)){

return similarityCache.get(cacheKey)

}

const results = []

for(const item of database){

const score = cosineSimilarity(
queryVector,
item.embedding
)

if(score > CONF_THRESHOLD){

results.push({

id:item.id,
name:item.name,
category:item.category,
confidence:score,
model:item.model || null,
thumbnail:item.thumbnail || null

})

}

}

results.sort((a,b)=>b.confidence-a.confidence)

const ranked = results.slice(0,TOP_K)

similarityCache.set(cacheKey, ranked)

emit("vision:similarity:complete", ranked)

return ranked

}



// ================= MULTI OBJECT SEARCH =================

export async function multiObjectSearch(vectors){

const aggregatedResults = []

for(const vector of vectors){

const res = await similaritySearch(vector)

aggregatedResults.push(...res)

}

return rankResults(aggregatedResults)

}



// ================= RANK RESULTS =================

export function rankResults(results){

const map = {}

results.forEach(r=>{

if(!map[r.id]){

map[r.id] = r

}else{

map[r.id].confidence =
Math.max(map[r.id].confidence,r.confidence)

}

})

const merged = Object.values(map)

merged.sort((a,b)=>b.confidence-a.confidence)

return merged.slice(0,TOP_K)

}



// ================= CATEGORY FILTER =================

export function filterByCategory(results, category){

return results.filter(r => r.category === category)

}



// ================= HASH VECTOR =================

function hashVector(vector){

let hash = 0

for(let i=0;i<vector.length;i++){

hash = ((hash<<5)-hash) + Math.floor(vector[i]*1000)
hash |= 0

}

return hash
}



// ================= CONFIDENCE LABEL =================

export function confidenceLabel(score){

if(score > 0.85) return "Very High Match"
if(score > 0.70) return "High Match"
if(score > 0.55) return "Probable Match"
if(score > 0.40) return "Possible Match"

return "Low Confidence"

}



// ================= CLEAR CACHE =================

export function clearSimilarityCache(){

similarityCache.clear()

emit("vision:similarity:cache-cleared")

}
