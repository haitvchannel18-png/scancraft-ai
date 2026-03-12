// modules/vision/detection-stage.js

import { EventBus } from "../core/events.js"
import { detectObjects } from "../detection/yolo.js"

const CONFIDENCE_THRESHOLD = 0.35

export async function runDetectionStage(frame){

try{

EventBus.emit("visionStageStart","detection")

const predictions = await detectObjects(frame)

if(!predictions || predictions.length === 0){
return []
}

const filtered = filterPredictions(predictions)

const normalized = normalizePredictions(filtered)

EventBus.emit("visionDetectionComplete",normalized)

return normalized

}catch(err){

console.error("Detection stage error",err)

EventBus.emit("visionDetectionError",err)

return []

}

}



function filterPredictions(predictions){

return predictions.filter(p=>{

if(!p) return false

if(p.score < CONFIDENCE_THRESHOLD) return false

if(!p.bbox) return false

return true

})

}



function normalizePredictions(predictions){

return predictions.map(p=>{

const [x,y,width,height] = p.bbox

return {

label: p.class || p.label || "unknown",

confidence: p.score,

bbox:{
x,
y,
width,
height
},

center:{
x: x + width/2,
y: y + height/2
},

area: width * height

}

})

}
