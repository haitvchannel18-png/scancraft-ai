// modules/detection/yolo.js

import { EventBus } from "../core/events.js"

let session = null
let inputSize = 640

const MODEL_PATH = "/models/detection/yolov8n.onnx"

export async function loadYOLO(){

if(session) return session

const ort = window.ort

session = await ort.InferenceSession.create(MODEL_PATH,{
executionProviders:["webgl"]
})

EventBus.emit("yoloLoaded")

return session

}



export async function detectObjects(canvas){

if(!session){
await loadYOLO()
}

const ctx = canvas.getContext("2d")

const imageData = ctx.getImageData(0,0,canvas.width,canvas.height)

const tensor = preprocess(imageData)

const feeds = {
images: tensor
}

const results = await session.run(feeds)

const output = results.output0.data

const detections = decodeYOLO(output,canvas.width,canvas.height)

return detections

}



function preprocess(imageData){

const data = imageData.data
const size = inputSize

const floatData = new Float32Array(3*size*size)

let i = 0

for(let y=0;y<size;y++){
for(let x=0;x<size;x++){

const px = (y*size + x)*4

floatData[i] = data[px]/255
floatData[i + size*size] = data[px+1]/255
floatData[i + size*size*2] = data[px+2]/255

i++

}
}

return new ort.Tensor("float32",floatData,[1,3,size,size])

}



function decodeYOLO(output,imgW,imgH){

const results = []

const numClasses = 80
const stride = numClasses + 5

for(let i=0;i<output.length;i+=stride){

const conf = output[i+4]

if(conf < 0.4) continue

let bestClass = -1
let bestScore = 0

for(let c=0;c<numClasses;c++){

const score = output[i+5+c]

if(score > bestScore){
bestScore = score
bestClass = c
}

}

const score = conf * bestScore

if(score < 0.45) continue

const cx = output[i]
const cy = output[i+1]
const w = output[i+2]
const h = output[i+3]

const x = cx - w/2
const y = cy - h/2

results.push({

label: classNames[bestClass],
confidence: score,
box: [x*imgW,y*imgH,w*imgW,h*imgH]

})

}

return nms(results)

}



function nms(boxes){

const selected = []

boxes.sort((a,b)=>b.confidence - a.confidence)

while(boxes.length){

const chosen = boxes.shift()

selected.push(chosen)

boxes = boxes.filter(b=>iou(chosen.box,b.box) < 0.45)

}

return selected

}



function iou(a,b){

const [x1,y1,w1,h1] = a
const [x2,y2,w2,h2] = b

const xa = Math.max(x1,x2)
const ya = Math.max(y1,y2)

const xb = Math.min(x1+w1,x2+w2)
const yb = Math.min(y1+h1,y2+h2)

const inter = Math.max(0,xb-xa) * Math.max(0,yb-ya)

const union = w1*h1 + w2*h2 - inter

return inter/union

}



const classNames = [
"person","bicycle","car","motorcycle","airplane","bus","train","truck",
"boat","traffic light","fire hydrant","stop sign","parking meter","bench",
"bird","cat","dog","horse","sheep","cow","elephant","bear","zebra","giraffe",
"backpack","umbrella","handbag","tie","suitcase","frisbee","skis","snowboard",
"sports ball","kite","baseball bat","baseball glove","skateboard","surfboard",
"tennis racket","bottle","wine glass","cup","fork","knife","spoon","bowl",
"banana","apple","sandwich","orange","broccoli","carrot","hot dog","pizza",
"donut","cake","chair","couch","potted plant","bed","dining table","toilet",
"tv","laptop","mouse","remote","keyboard","cell phone","microwave","oven",
"toaster","sink","refrigerator","book","clock","vase","scissors","teddy bear",
"hair drier","toothbrush"
]
