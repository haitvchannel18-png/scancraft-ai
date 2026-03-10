// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { extractFeatures } from "./feature-extractor.js"
import { similaritySearch } from "./similarity-search.js"



// ================= CONFIG =================

const MAX_RESULTS = 10



// ================= IMAGE SEARCH =================

export async function imageSearch(imageData){

emit("vision:image-search:start")

try{

// Extract visual features
const features = await extractFeatures(imageData)

if(!features){

throw new Error("Feature extraction failed")

}

// Run similarity engine
const matches = await similaritySearch(features)

const results = formatResults(matches)

emit("vision:image-search:complete", results)

return results

}catch(err){

console.error("Image search failed", err)

emit("vision:image-search:error")

return []

}

}



// ================= FORMAT RESULTS =================

function formatResults(matches){

const results = []

for(const item of matches){

results.push({

id:item.id,
name:item.name,
category:item.category || "object",
confidence:item.confidence,
confidenceLabel:getConfidenceLabel(item.confidence),
thumbnail:item.thumbnail || null,
model:item.model || null

})

}

return results.slice(0,MAX_RESULTS)

}



// ================= CONFIDENCE LABEL =================

function getConfidenceLabel(score){

if(score > 0.9) return "Extremely Similar"

if(score > 0.8) return "Highly Similar"

if(score > 0.65) return "Very Similar"

if(score > 0.5) return "Similar"

if(score > 0.4) return "Possible Match"

return "Low Match"

}



// ================= MULTI IMAGE SEARCH =================

export async function multiImageSearch(images){

const allResults = []

for(const img of images){

const res = await imageSearch(img)

allResults.push(...res)

}

return mergeResults(allResults)

}



// ================= MERGE RESULTS =================

function mergeResults(results){

const map = {}

for(const r of results){

if(!map[r.id]){

map[r.id] = r

}else{

map[r.id].confidence =
Math.max(map[r.id].confidence, r.confidence)

}

}

const merged = Object.values(map)

merged.sort((a,b)=>b.confidence-a.confidence)

return merged.slice(0,MAX_RESULTS)

}



// ================= PRODUCT SEARCH =================

export async function searchProducts(imageData){

const objects = await imageSearch(imageData)

return objects.map(o=>({

name:o.name,
confidence:o.confidence,
category:o.category

}))

}



// ================= CATEGORY SEARCH =================

export function filterByCategory(results, category){

return results.filter(r=>r.category === category)

}



// ================= BEST MATCH =================

export function bestMatch(results){

if(!results || results.length === 0){

return null

}

return results[0]

}
