// ================= IMPORTS =================

import { emit } from "./events.js"

import { detectObjects } from "../detection/yolo.js"

import { extractFeatures } from "../vision-search/feature-extractor.js"

import { findSimilarObjects, guessObject } from "../vision-search/similarity-engine.js"

import { explainObject } from "../ai/explain-ai.js"

import { showObjectModel } from "../viewer/viewer.js"


// ================= STATE =================

let processing = false

let frameInterval = 200


// ================= START STREAM =================

export function startStreamProcessor(videoElement){

emit("pipeline:started")

setInterval(()=>{

processFrame(videoElement)

}, frameInterval)

}


// ================= FRAME PROCESS =================

async function processFrame(video){

if(processing) return

processing = true

try{

const frame = captureFrame(video)

emit("pipeline:frame")

// ---------------- DETECTION ----------------

const detections = await detectObjects(frame)

if(!detections.length){

processing = false

return

}

// choose strongest detection

const object = detections[0]

emit("pipeline:object-detected", object)

// ---------------- FEATURE EXTRACTION ----------------

const crop = cropObject(frame, object.box)

const features = await extractFeatures(crop)

emit("pipeline:features")

// ---------------- SIMILARITY SEARCH ----------------

const matches = await findSimilarObjects(features)

const guessedObject = guessObject(matches)

emit("pipeline:object-identified", guessedObject)

// ---------------- AI EXPLANATION ----------------

const explanation = await explainObject(guessedObject)

emit("pipeline:explanation", explanation)

// ---------------- VIEWER ----------------

showObjectModel(guessedObject.name)

emit("pipeline:model-loaded")

}catch(err){

console.error("Pipeline error", err)

}

processing = false

}


// ================= FRAME CAPTURE =================

function captureFrame(video){

const canvas = document.createElement("canvas")

canvas.width = video.videoWidth
canvas.height = video.videoHeight

const ctx = canvas.getContext("2d")

ctx.drawImage(video,0,0)

return ctx.getImageData(
0,
0,
canvas.width,
canvas.height
)

}


// ================= OBJECT CROP =================

function cropObject(frame, box){

const canvas = document.createElement("canvas")

canvas.width = box.width
canvas.height = box.height

const ctx = canvas.getContext("2d")

const tempCanvas = document.createElement("canvas")

tempCanvas.width = frame.width
tempCanvas.height = frame.height

const tempCtx = tempCanvas.getContext("2d")

tempCtx.putImageData(frame,0,0)

ctx.drawImage(
tempCanvas,
box.x,
box.y,
box.width,
box.height,
0,
0,
box.width,
box.height
)

return ctx.getImageData(
0,
0,
box.width,
box.height
)

}
