// ================= IMPORT =================

import { extractFeatures } from "../vision-search/feature-extractor.js"
import { searchSimilarImages } from "../vision-search/image-search.js"
import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= CONFIG =================

const LOGO_SIMILARITY_THRESHOLD = CONFIG.LOGO_THRESHOLD || 0.75
const MAX_LOGO_RESULTS = CONFIG.MAX_LOGO_RESULTS || 5



// ================= MAIN STAGE =================

export async function runLogoStage(frame, detections){

try{

emit("vision:logo:start")

const results = []

for(const object of detections){

const crop = cropObject(frame, object)

const features = await extractFeatures(crop)

const matches = await searchSimilarImages(features)

const brand = identifyBrand(matches)

results.push({

object: object.label,
brand: brand?.name || null,
confidence: brand?.confidence || 0,
matches: matches.slice(0, MAX_LOGO_RESULTS)

})

}

emit("vision:logo:complete", results)

return results

}catch(err){

console.error("Logo stage error", err)

emit("vision:logo:error")

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



// ================= BRAND IDENTIFICATION =================

function identifyBrand(matches){

if(!matches || matches.length === 0){

return null

}

const best = matches[0]

if(best.score < LOGO_SIMILARITY_THRESHOLD){

return null

}

return {

name: best.label,
confidence: best.score

}

}



// ================= BRAND SUMMARY =================

export function logoSummary(results){

return results.map(r => {

if(!r.brand){

return `${r.object} (unknown brand)`

}

return `${r.object} → ${r.brand} ${(r.confidence*100).toFixed(0)}%`

})

}



// ================= FILTER BRANDS =================

export function filterKnownBrands(results){

return results.filter(r => r.brand !== null)

}



// ================= GET PRIMARY BRAND =================

export function getPrimaryBrand(results){

if(!results.length) return null

return results.reduce((best,current)=>{

return current.confidence > best.confidence ? current : best

})

}
