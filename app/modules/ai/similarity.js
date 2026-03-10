// ================= IMPORTS =================

import { extractFeatures } from "../vision-search/feature-extractor.js"
import { findSimilarObjects } from "../vision-search/similarity-engine.js"

import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= STATE =================

let similarityResults = []
let currentObject = null



// ================= MAIN ENTRY =================

export async function runSimilaritySearch(image){

try{

emit("similarity:start")

// 1️⃣ extract visual features

const features = await extractFeatures(image)


// 2️⃣ similarity search

const matches = await findSimilarObjects(features)


// 3️⃣ ranking

similarityResults = rankResults(matches)

emit("similarity:complete", similarityResults)

return similarityResults

}catch(err){

console.error("Similarity search failed", err)

emit("similarity:error")

return []

}

}



// ================= RANKING =================

function rankResults(results){

return results
.sort((a,b)=> b.score - a.score)
.slice(0, CONFIG.MAX_SIMILAR_RESULTS || 5)

}



// ================= SET OBJECT =================

export function setSimilarityObject(object){

currentObject = object

emit("similarity:object:set", object)

}



// ================= GET BEST MATCH =================

export function getBestMatch(){

if(!similarityResults || similarityResults.length === 0){

return null

}

return similarityResults[0]

}



// ================= FILTER CATEGORY =================

export function filterByCategory(category){

return similarityResults.filter(item => item.category === category)

}



// ================= CONFIDENCE =================

export function computeSimilarityConfidence(result){

if(!result) return 0

const base = result.score || 0

return Math.min(base,1)

}



// ================= SUMMARY =================

export function summarizeSimilarity(){

return similarityResults.map(r => {

return `${r.label} (${Math.round(r.score*100)}%)`

})

}



// ================= RELATED OBJECTS =================

export function getRelatedObjects(){

return similarityResults.map(r => ({

name:r.label,
score:r.score,
category:r.category

}))

}



// ================= RESET =================

export function resetSimilarity(){

similarityResults = []
currentObject = null

emit("similarity:reset")

}
