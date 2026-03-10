// ================= IMPORTS =================

import { emit } from "./events.js"
import { loadModels } from "./model-loader.js"
import { scheduleTask } from "./task-scheduler.js"
import { logAI } from "../utils/ai-logger.js"

import { detectObjects } from "../detection/yolo.js"
import { extractFeatures } from "../vision-search/feature-extractor.js"
import { searchSimilar } from "../vision-search/similarity-search.js"

import { runReasoning } from "../ai/reasoning-engine.js"
import { fetchKnowledge } from "../knowledge/knowledge-aggregator.js"


// ================= PIPELINE STATE =================

let modelsReady = false
let pipelineRunning = false


// ================= INIT PIPELINE =================

export async function initPipeline(){

logAI("Initializing AI pipeline")

await loadModels()

modelsReady = true

emit("pipeline:ready")

logAI("AI pipeline ready")

}


// ================= MAIN FRAME PROCESS =================

export async function processFrame(frame){

if(!modelsReady) return

if(pipelineRunning) return

pipelineRunning = true

try{

// ---------------- DETECTION ----------------

emit("pipeline:stage","detect")

const detections = await detectObjects(frame)

if(!detections || detections.length === 0){

pipelineRunning = false
return

}

// choose best object

const target = detections[0]

// ---------------- FEATURE EXTRACTION ----------------

emit("pipeline:stage","feature")

const embedding = await extractFeatures(frame,target.box)


// ---------------- SIMILARITY SEARCH ----------------

emit("pipeline:stage","similarity")

const similar = await searchSimilar(embedding)


// ---------------- REASONING ----------------

emit("pipeline:stage","reasoning")

const reasoning = await runReasoning({

detection:target,
similarObjects:similar

})


// ---------------- KNOWLEDGE ----------------

emit("pipeline:stage","knowledge")

const knowledge = await fetchKnowledge(reasoning.objectName)


// ---------------- RESULT COMPOSE ----------------

const result = {

name: reasoning.objectName,

confidence: target.score,

image: target.crop,

similar,

knowledge

}


// ---------------- EMIT RESULT ----------------

emit("pipeline:result", result)

logAI("Pipeline result generated")

}catch(err){

emit("pipeline:error",err)

console.error("Pipeline error:",err)

}

pipelineRunning = false

}


// ================= STREAM PROCESSOR =================

export function startStreamProcessor(video){

const canvas = document.createElement("canvas")

const ctx = canvas.getContext("2d")

async function loop(){

if(video.readyState === 4){

canvas.width = video.videoWidth

canvas.height = video.videoHeight

ctx.drawImage(video,0,0)

const frame = ctx.getImageData(0,0,canvas.width,canvas.height)

scheduleTask(()=>processFrame(frame))

}

requestAnimationFrame(loop)

}

loop()

}
