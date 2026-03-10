
// ================= IMPORTS =================

import { logAI } from "../utils/AILogger.js"

let databaseVectors = []
let databaseObjects = []

const DB_PATH = "/models/embeddings/object-db.json"

const MAX_RESULTS = 5


// ================= LOAD DATABASE =================

export async function loadObjectDatabase(){

if(databaseVectors.length) return

logAI("Loading object embedding database")

const response = await fetch(DB_PATH)

const data = await response.json()

databaseObjects = data.objects
databaseVectors = data.vectors

logAI("Embedding database loaded")

}


// ================= MAIN SEARCH =================

export async function findSimilarObjects(queryVector, topK = MAX_RESULTS){

if(!databaseVectors.length){

await loadObjectDatabase()

}

const scores = []

for(let i=0;i<databaseVectors.length;i++){

const sim = cosineSimilarity(queryVector, databaseVectors[i])

scores.push({

object: databaseObjects[i],
score: sim

})

}

scores.sort((a,b)=>b.score-a.score)

return scores.slice(0, topK)

}


// ================= COSINE SIMILARITY =================

function cosineSimilarity(a,b){

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


// ================= OBJECT GUESS =================

export function guessObject(matches){

if(!matches || matches.length === 0){

return{

name:"Unknown object",
confidence:0

}

}

const best = matches[0]

if(best.score < 0.45){

return{

name:"Unknown object",
confidence:best.score,
suggestions:matches.map(m=>m.object.name)

}

}

return{

name:best.object.name,
category:best.object.category,
brand:best.object.brand || null,
confidence:best.score,
similar:matches.map(m=>m.object.name)

}

}


// ================= CATEGORY RANKING =================

export function rankCategories(matches){

const categoryScores = {}

matches.forEach(m=>{

const cat = m.object.category || "unknown"

if(!categoryScores[cat]){

categoryScores[cat] = 0

}

categoryScores[cat] += m.score

})

const sorted = Object.entries(categoryScores)
.sort((a,b)=>b[1]-a[1])

return sorted.map(v=>v[0])

}


// ================= BRAND DETECTION =================

export function detectBrand(matches){

const brands = {}

matches.forEach(m=>{

if(!m.object.brand) return

if(!brands[m.object.brand]){

brands[m.object.brand] = 0

}

brands[m.object.brand] += m.score

})

const sorted = Object.entries(brands)
.sort((a,b)=>b[1]-a[1])

if(sorted.length === 0) return null

return sorted[0][0]

}
