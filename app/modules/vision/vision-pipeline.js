// modules/vision/vision-pipeline.js

import { EventBus } from "../core/events.js"

import { runDetectionStage } from "./detection-stage.js"
import { runLogoStage } from "./logo-stage.js"
import { runSimilarityStage } from "./similarity-stage.js"
import { runReasoningStage } from "./reasoning-stage.js"
import { runKnowledgeStage } from "./knowledge-stage.js"

let pipelineActive = false
let processing = false

export function initVisionPipeline(){

pipelineActive = true

EventBus.emit("visionPipelineReady")

}



export async function processFrame(frame){

if(!pipelineActive || processing) return

processing = true

try{

EventBus.emit("visionFrameStart")

// 1️⃣ object detection
const detection = await runDetectionStage(frame)

if(!detection || detection.length === 0){

EventBus.emit("visionNoObject")

processing = false
return

}

// 2️⃣ logo detection
const logoResults = await runLogoStage(frame,detection)

// 3️⃣ visual similarity search
const similarityResults = await runSimilarityStage(frame,detection)

// 4️⃣ reasoning
const reasoning = await runReasoningStage({
detection,
logoResults,
similarityResults
})

// 5️⃣ knowledge aggregation
const knowledge = await runKnowledgeStage(reasoning)

const result = {

timestamp: Date.now(),

objects: detection,

logo: logoResults,

similar: similarityResults,

reasoning: reasoning,

knowledge: knowledge

}

EventBus.emit("visionResult",result)

processing = false

return result

}catch(err){

processing = false

EventBus.emit("visionError",err)

console.error("Vision pipeline error",err)

}

}



export function stopVisionPipeline(){

pipelineActive = false

EventBus.emit("visionPipelineStopped")

}



export function startVisionPipeline(){

pipelineActive = true

EventBus.emit("visionPipelineStarted")

}



export function isVisionPipelineActive(){

return pipelineActive

}
