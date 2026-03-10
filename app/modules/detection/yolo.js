// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let session = null

const MODEL_PATH = "/models/detection/yolov8n.onnx"

const INPUT_SIZE = 640


// ================= LOAD MODEL =================

export async function loadYOLO(){

if(session) return session

logAI("Loading YOLO model")

session = await ort.InferenceSession.create(MODEL_PATH,{

executionProviders:["webgl","wasm"]

})

logAI("YOLO model loaded")

return session

}


// ================= DETECT OBJECTS =================

export async function detectObjects(frame){

if(!session){

await loadYOLO()

}

emit("vision:detecting")

const {inputTensor,scaleX,scaleY} = preprocess(frame)

const feeds = {

images: inputTensor

}

const results = await session.run(feeds)

const detections = postprocess(results,scaleX,scaleY)

emit("vision:detections",detections)

return detections

}


// ================= PREPROCESS =================

function preprocess(frame){

const data = frame.data

const width = frame.width

const height = frame.height

const scaleX = width / INPUT_SIZE

const scaleY = height / INPUT_SIZE

const tensor = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE)

for(let y=0;y<INPUT_SIZE;y++){

for(let x=0;x<INPUT_SIZE;x++){

const srcX = Math.floor(x * scaleX)
const srcY = Math.floor(y * scaleY)

const idx = (srcY * width + srcX) * 4

const r = data[idx] / 255
const g = data[idx+1] / 255
const b = data[idx+2] / 255

const pos = y * INPUT_SIZE + x

tensor[pos] = r
tensor[pos + INPUT_SIZE*INPUT_SIZE] = g
tensor[pos + INPUT_SIZE*INPUT_SIZE*2] = b

}

}

const inputTensor = new ort.Tensor("float32",tensor,[1,3,INPUT_SIZE,INPUT_SIZE])

return{inputTensor,scaleX,scaleY}

}


// ================= POSTPROCESS =================

function postprocess(results,scaleX,scaleY){

const output = results.output0.data

const numPred = results.output0.dims[2]

const detections = []

for(let i=0;i<numPred;i++){

const offset = i*84

const x = output[offset]
const y = output[offset+1]
const w = output[offset+2]
const h = output[offset+3]

let maxScore = 0
let classId = -1

for(let c=4;c<84;c++){

if(output[offset+c] > maxScore){

maxScore = output[offset+c]
classId = c-4

}

}

if(maxScore > 0.5){

const box = {

x:(x - w/2) * scaleX,
y:(y - h/2) * scaleY,
width:w * scaleX,
height:h * scaleY

}

detections.push({

classId,
score:maxScore,
box,
crop:null

})

}

}

return nonMaxSuppression(detections)

}


// ================= NMS =================

function nonMaxSuppression(detections){

detections.sort((a,b)=>b.score-a.score)

const final = []

while(detections.length){

const first = detections.shift()

final.push(first)

detections = detections.filter(det=>iou(first.box,det.box) < 0.45)

}

return final

}


// ================= IOU =================

function iou(a,b){

const x1 = Math.max(a.x,b.x)
const y1 = Math.max(a.y,b.y)

const x2 = Math.min(a.x+a.width,b.x+b.width)
const y2 = Math.min(a.y+a.height,b.y+b.height)

const inter = Math.max(0,x2-x1) * Math.max(0,y2-y1)

const areaA = a.width * a.height
const areaB = b.width * b.height

return inter / (areaA + areaB - inter)

}
