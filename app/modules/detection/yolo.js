// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { getCachedModel, cacheModel } from "../core/performance.js"

let session = null

const MODEL_PATH = "/models/detection/yolov8n.onnx"

const INPUT_SIZE = 640

const CONFIDENCE_THRESHOLD = 0.35
const NMS_THRESHOLD = 0.45



// ================= LOAD MODEL =================

export async function loadYOLO(){

const cached = getCachedModel("yolo")

if(cached){

session = cached
return session

}

emit("ai:model-loading","YOLO")

session = await ort.InferenceSession.create(
MODEL_PATH,
{
executionProviders:["webgl","wasm"]
}
)

cacheModel("yolo",session)

emit("ai:model-ready","YOLO")

return session

}



// ================= DETECT OBJECTS =================

export async function detectObjects(imageData){

if(!session){

await loadYOLO()

}

const tensor = preprocess(imageData)

const feeds = { images:tensor }

const results = await session.run(feeds)

const output = results.output0.data

const detections = postprocess(output,imageData.width,imageData.height)

emit("ai:detection",detections)

return detections

}



// ================= PREPROCESS =================

function preprocess(image){

const canvas = document.createElement("canvas")

canvas.width = INPUT_SIZE
canvas.height = INPUT_SIZE

const ctx = canvas.getContext("2d")

const temp = document.createElement("canvas")

temp.width = image.width
temp.height = image.height

temp.getContext("2d").putImageData(image,0,0)

ctx.drawImage(temp,0,0,INPUT_SIZE,INPUT_SIZE)

const imgData = ctx.getImageData(0,0,INPUT_SIZE,INPUT_SIZE)

const data = imgData.data

const floatData = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE)

for(let i=0;i<INPUT_SIZE*INPUT_SIZE;i++){

floatData[i] = data[i*4] / 255
floatData[i + INPUT_SIZE*INPUT_SIZE] = data[i*4+1] / 255
floatData[i + 2*INPUT_SIZE*INPUT_SIZE] = data[i*4+2] / 255

}

return new ort.Tensor(
"float32",
floatData,
[1,3,INPUT_SIZE,INPUT_SIZE]
)

}



// ================= POSTPROCESS =================

function postprocess(output,width,height){

const detections = []

const rows = output.length / 85

for(let i=0;i<rows;i++){

const confidence = output[i*85+4]

if(confidence < CONFIDENCE_THRESHOLD) continue

let maxClass = 0
let maxScore = 0

for(let j=5;j<85;j++){

const score = output[i*85+j]

if(score > maxScore){

maxScore = score
maxClass = j-5

}

}

const finalScore = confidence * maxScore

if(finalScore < CONFIDENCE_THRESHOLD) continue

const cx = output[i*85]
const cy = output[i*85+1]
const w = output[i*85+2]
const h = output[i*85+3]

const x = (cx - w/2) * width
const y = (cy - h/2) * height

detections.push({

classId:maxClass,
confidence:finalScore,

box:{
x,
y,
width:w*width,
height:h*height
}

})

}

return nonMaxSuppression(detections)

}



// ================= NMS =================

function nonMaxSuppression(detections){

detections.sort((a,b)=>b.confidence-a.confidence)

const results = []

while(detections.length){

const best = detections.shift()

results.push(best)

detections = detections.filter(d=>{

return iou(best.box,d.box) < NMS_THRESHOLD

})

}

return results

}



// ================= IOU =================

function iou(a,b){

const x1 = Math.max(a.x,b.x)
const y1 = Math.max(a.y,b.y)

const x2 = Math.min(a.x+a.width,b.x+b.width)
const y2 = Math.min(a.y+a.height,b.y+b.height)

const intersection = Math.max(0,x2-x1) * Math.max(0,y2-y1)

const union =
a.width*a.height +
b.width*b.height -
intersection

return intersection / union

}
