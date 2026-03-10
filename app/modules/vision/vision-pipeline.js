// ================= IMPORT =================

import { emit } from "../core/events.js"

import { detectObjects } from "../detection/yolo.js"
import { extractFeatures } from "../vision-search/feature-extractor.js"
import { findSimilarObjects } from "../vision-search/similarity-engine.js"

import { runVisualReasoning } from "../ai/visual-reasoning.js"
import { aggregateKnowledge } from "../knowledge/knowledge-aggregator.js"
import { compareProductPrices } from "../commerce/product-compare.js"



// ================= GLOBAL =================

let pipelineRunning = false



// ================= INIT =================

export function initVisionPipeline(){

pipelineRunning = true

}



// ================= MAIN PROCESS =================

export async function processFrame(frame){

if(!pipelineRunning) return

try{

emit("ai:processing:start")

// 1️⃣ Object Detection
const detections = await detectObjects(frame)

emit("vision:detections", detections)



// 2️⃣ Process each object
for(const object of detections){

await processObject(frame, object)

}

emit("ai:processing:stop")

}catch(err){

console.error("Vision pipeline error", err)

emit("ai:processing:error")

}

}



// ================= PROCESS OBJECT =================

async function processObject(frame, object){

try{

// Feature extraction
const features = await extractFeatures(frame, object)

// Similarity search
const similarObjects = await findSimilarObjects(features)

emit("vision:similarity-results", similarObjects)


// AI reasoning
const reasoning = await runVisualReasoning(object, similarObjects)

emit("ai:reasoning", reasoning)


// Knowledge aggregation
const knowledge = await aggregateKnowledge(reasoning)

emit("ai:object-info", {

name: knowledge.name,
description: knowledge.description

})

emit("ai:material-results", {

material: knowledge.material

})

emit("ai:history-results", {

history: knowledge.history

})

emit("ai:image-results", knowledge.images)


// Commerce search
const commerce = await compareProductPrices(object)

emit("ai:price-results", commerce)

}catch(err){

console.error("Object processing error", err)

}

}



// ================= START PIPELINE =================

export async function startVisionLoop(getFrame){

while(pipelineRunning){

const frame = await getFrame()

if(frame){

await processFrame(frame)

}

await delay(120)

}

}



// ================= STOP PIPELINE =================

export function stopVisionPipeline(){

pipelineRunning = false

}



// ================= UTILS =================

function delay(ms){

return new Promise(resolve => setTimeout(resolve, ms))

}
