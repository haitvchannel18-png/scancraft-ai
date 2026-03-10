// ================= IMPORT =================

import { detectObjects } from "../detection/yolo.js"
import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= CONFIG =================

const CONFIDENCE_THRESHOLD = CONFIG.DETECTION_THRESHOLD || 0.45
const MAX_OBJECTS = CONFIG.MAX_DETECTIONS || 12



// ================= MAIN STAGE =================

export async function runDetectionStage(frame){

try{

emit("vision:detection:start")

const rawDetections = await detectObjects(frame)

const filtered = filterDetections(rawDetections)

const normalized = normalizeDetections(filtered, frame)

emit("vision:detection:complete", normalized)

return normalized

}catch(err){

console.error("Detection stage failed", err)

emit("vision:detection:error")

return []

}

}



// ================= FILTER =================

function filterDetections(detections){

if(!detections) return []

return detections
.filter(obj => obj.score >= CONFIDENCE_THRESHOLD)
.sort((a,b)=> b.score - a.score)
.slice(0, MAX_OBJECTS)

}



// ================= NORMALIZE =================

function normalizeDetections(detections, frame){

const width = frame.width || frame.videoWidth
const height = frame.height || frame.videoHeight

return detections.map(obj => {

return {

label: obj.label || obj.class || "object",

score: obj.score,

x: obj.x / width,
y: obj.y / height,
width: obj.width / width,
height: obj.height / height,

centerX: (obj.x + obj.width/2) / width,
centerY: (obj.y + obj.height/2) / height

}

})

}



// ================= UTILS =================

export function getBestDetection(detections){

if(!detections || detections.length === 0) return null

return detections.reduce((best, current)=>{

return current.score > best.score ? current : best

})

}



export function groupDetections(detections){

const groups = {}

detections.forEach(obj => {

if(!groups[obj.label]){

groups[obj.label] = []

}

groups[obj.label].push(obj)

})

return groups

}



export function detectionSummary(detections){

return detections.map(d => {

return `${d.label} ${(d.score*100).toFixed(0)}%`

}).join(", ")

}
