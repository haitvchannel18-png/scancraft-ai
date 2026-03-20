// modules/ai/vision-ai.js

import YOLO from "../detection/yolo.js"
import CLIP from "../detection/clip.js"
import Similarity from "./similarity.js"
import { EventBus } from "../core/events.js"

class VisionAI {

constructor(){
this.lastResult = null
}

// 🔥 MAIN PROCESS
async analyze(frame){

if(!frame) return null

EventBus.emit("visionStart")

try{

// 🧠 STEP 1 — YOLO DETECTION
const detections = await YOLO.detect(frame)

// pick best object
const best = this.getBestDetection(detections)

if(!best){
EventBus.emit("visionEmpty")
return null
}

// ✂️ crop object region
const cropped = this.crop(frame, best.box)

// 🧠 STEP 2 — FEATURE VECTOR (CLIP)
const vector = await CLIP.extract(cropped)

// 🧠 STEP 3 — SIMILARITY SEARCH
const similar = await Similarity.findSimilar(vector)

// 🧠 STEP 4 — FUSION
const final = this.fuseResults(best, similar)

// 📦 STORE
this.lastResult = final

EventBus.emit("visionComplete", final)

return final

}catch(err){

EventBus.emit("visionError", err)
return null

}

}

// 🎯 BEST DETECTION
getBestDetection(detections){

if(!detections || detections.length === 0) return null

return detections.sort((a,b)=>b.score - a.score)[0]

}

// ✂️ CROP IMAGE
crop(frame, box){

// simple canvas crop
const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = box.width
canvas.height = box.height

ctx.drawImage(
frame,
box.x, box.y,
box.width, box.height,
0, 0,
box.width, box.height
)

return canvas

}

// 🧠 FUSION ENGINE
fuseResults(detection, similar){

const detectionLabel = detection.label
const similarityLabels = similar.map(s=>s.label)

// 🔥 decision logic
let finalLabel = detectionLabel

if(similar.length){

// if similarity strong override
if(similar[0].score > 0.7){
finalLabel = similar[0].label
}

}

// 📊 confidence fusion
const confidence = this.computeConfidence(detection, similar)

return {
label: finalLabel,
detectionScore: detection.score,
similarObjects: similar,
confidence,
box: detection.box
}

}

// 📊 CONFIDENCE
computeConfidence(detection, similar){

let score = detection.score * 0.6

if(similar.length){
score += similar[0].score * 0.4
}

return Math.min(1, score)

}

// 🔄 LAST RESULT
getLastResult(){
return this.lastResult
}

}

export default new VisionAI()
