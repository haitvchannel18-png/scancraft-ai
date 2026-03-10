// ================= IMPORT =================

import { extractFeatures } from "../vision-search/feature-extractor.js"
import { findSimilarObjects } from "../vision-search/similarity-engine.js"
import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= CONFIG =================

const SIMILARITY_THRESHOLD = CONFIG.SIMILARITY_THRESHOLD || 0.65
const MAX_RESULTS = CONFIG.MAX_SIMILAR_RESULTS || 8



// ================= MAIN STAGE =================

export async function runSimilarityStage(frame, detections){

try{

emit("vision:similarity:start")

const results = []

for(const object of detections){

const crop = cropObject(frame, object)

const features = await extractFeatures(crop)

const matches = await findSimilarObjects(features)

const filtered = filterMatches(matches)

results.push({

object: object.label,
similar: filtered,
bestMatch: filtered[0] || null

})

}

emit("vision:similarity:complete", results)

return results

}catch(err){

console.error("Similarity stage error", err)

emit("vision:similarity:error")

return []

}

}



// ================= CROP OBJECT =================

function cropObject(frame, object){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

const width = frame.videoWidth || frame.width
const height = frame.videoHeight || frame.height

canvas.width = object.width * width
canvas.height = object.height * height

ctx.drawImage(

frame,

object.x * width,
object.y * height,
object.width * width,
object.height * height,

0,
0,
canvas.width,
canvas.height

)

return canvas

}



// ================= FILTER MATCHES =================

function filterMatches(matches){

if(!matches) return []

return matches
.filter(m => m.score >= SIMILARITY_THRESHOLD)
.sort((a,b)=> b.score - a.score)
.slice(0, MAX_RESULTS)

}



// ================= BEST MATCH =================

export function getBestSimilarity(results){

if(!results || results.length === 0) return null

return results.reduce((best,current)=>{

const scoreA = best.bestMatch?.score || 0
const scoreB = current.bestMatch?.score || 0

return scoreB > scoreA ? current : best

})

}



// ================= SIMILARITY SUMMARY =================

export function similaritySummary(results){

return results.map(r => {

if(!r.bestMatch){

return `${r.object} → unknown`

}

return `${r.object} → ${r.bestMatch.label} ${(r.bestMatch.score*100).toFixed(0)}%`

})

}



// ================= UNKNOWN GUESS =================

export function guessUnknownObject(result){

if(!result || !result.bestMatch){

return {

guess: "unknown object",
confidence: 0

}

}

return {

guess: result.bestMatch.label,
confidence: result.bestMatch.score

}

}
