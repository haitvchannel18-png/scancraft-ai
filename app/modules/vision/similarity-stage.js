// modules/vision/similarity-stage.js

import { EventBus } from "../core/events.js"
import { extractFeatures } from "../vision-search/feature-extractor.js"
import { searchSimilar } from "../vision-search/similarity-search.js"

const MAX_RESULTS = 5
const MIN_SIMILARITY = 0.25

export async function runSimilarityStage(frame, objects){

try{

EventBus.emit("visionStageStart","similarity")

if(!objects || objects.length === 0){
return []
}

const results = []

for(const obj of objects){

const crop = cropObject(frame,obj.bbox)

const features = await extractFeatures(crop)

const matches = await searchSimilar(features)

const filtered = filterMatches(matches)

results.push({

object: obj.label,
confidence: obj.confidence,
bbox: obj.bbox,
similar: filtered

})

}

EventBus.emit("visionSimilarityComplete",results)

return results

}catch(err){

console.error("Similarity stage error",err)

EventBus.emit("visionSimilarityError",err)

return []

}

}



function filterMatches(matches){

if(!matches) return []

return matches
.filter(m => m.score >= MIN_SIMILARITY)
.sort((a,b)=> b.score - a.score)
.slice(0,MAX_RESULTS)

}



function cropObject(frame,bbox){

const {x,y,width,height} = bbox

try{

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = width
canvas.height = height

ctx.drawImage(
frame,
x,
y,
width,
height,
0,
0,
width,
height
)

return canvas

}catch(err){

console.warn("Object crop failed",err)

return frame

}

}
