// ================= IMPORTS =================

import { extractEmbedding } from "../detection/clip.js"
import { emit } from "../core/events.js"


// ================= CONFIG =================

const FEATURE_SIZE = 512


// ================= FEATURE EXTRACTION =================

export async function extractFeatures(imageData){

emit("vision:feature-extraction-start")

try{

const embedding = await extractEmbedding(imageData)

const normalized = normalizeVector(embedding)

emit("vision:feature-extraction-complete")

return normalized

}catch(err){

console.error("Feature extraction failed",err)

emit("vision:feature-error")

return null

}

}



// ================= NORMALIZE VECTOR =================

function normalizeVector(vector){

let norm = 0

for(let i=0;i<vector.length;i++){

norm += vector[i] * vector[i]

}

norm = Math.sqrt(norm)

const normalized = new Float32Array(vector.length)

for(let i=0;i<vector.length;i++){

normalized[i] = vector[i] / norm

}

return normalized

}



// ================= FEATURE HASH =================

export function generateFeatureHash(features){

let hash = 0

for(let i=0;i<features.length;i++){

hash = ((hash << 5) - hash) + Math.floor(features[i] * 1000)

hash |= 0

}

return "feat_" + Math.abs(hash)

}



// ================= FEATURE COMPRESSION =================

export function compressFeatures(features){

const compressed = []

for(let i=0;i<features.length;i+=4){

compressed.push(

(features[i] + features[i+1] + features[i+2] + features[i+3]) / 4

)

}

return new Float32Array(compressed)

}



// ================= FEATURE DISTANCE =================

export function cosineSimilarity(a,b){

let dot = 0
let normA = 0
let normB = 0

for(let i=0;i<a.length;i++){

dot += a[i] * b[i]
normA += a[i] * a[i]
normB += b[i] * b[i]

}

return dot / (Math.sqrt(normA) * Math.sqrt(normB))

}



// ================= FEATURE STORAGE =================

const featureCache = {}

export function cacheFeatures(id,features){

featureCache[id] = features

emit("vision:feature-cached",id)

}

export function getCachedFeatures(id){

return featureCache[id]

}



// ================= FEATURE MATCH =================

export function matchFeatures(features,database){

let bestMatch = null
let bestScore = -Infinity

database.forEach(item=>{

const score = cosineSimilarity(
features,
item.features
)

if(score > bestScore){

bestScore = score
bestMatch = item

}

})

emit("vision:feature-match",bestMatch)

return {

match:bestMatch,
score:bestScore

}

}
