// modules/core/pipeline.js

import { EventBus } from "./events.js"

import { detectObjects } from "../detection/yolo.js"
import { extractFeatures } from "../vision-search/feature-extractor.js"
import { searchSimilar } from "../vision-search/similarity-search.js"

import { reasoningEngine } from "../ai/reasoning-engine.js"
import { aggregateKnowledge } from "../knowledge/knowledge-aggregator.js"

let initialized = false


export async function initPipeline(){

console.log("Initializing Vision Pipeline")

initialized = true

EventBus.emit("pipelineReady")

}



export async function processFrame(canvas){

if(!initialized) return null

try{

// 1️⃣ Detection
const detections = await detectObjects(canvas)

if(!detections || detections.length === 0) return null


// choose best detection
const target = detections[0]


// 2️⃣ Feature Extraction
const features = await extractFeatures(canvas, target.box)


// 3️⃣ Similarity Search
const similar = await searchSimilar(features)


// 4️⃣ Reasoning
const reasoning = await reasoningEngine({

label: target.label,
similarObjects: similar

})


// 5️⃣ Knowledge Aggregation
const knowledge = await aggregateKnowledge({

label: target.label,
reasoning

})



const result = {

label: target.label,
confidence: target.confidence,
box: target.box,

similarObjects: similar,

knowledge

}


EventBus.emit("pipelineResult", result)

return result


}catch(err){

console.error("Pipeline error",err)

EventBus.emit("pipelineError",err)

return null

}

}
