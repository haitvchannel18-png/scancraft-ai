// modules/vision-search/feature-extractor.js

import { EventBus } from "../core/events.js"

let clipSession = null

const MODEL_PATH = "/models/vision/clip-vit-base.onnx"

const INPUT_SIZE = 224



export async function loadCLIP(){

if(clipSession) return clipSession

const ort = window.ort

clipSession = await ort.InferenceSession.create(MODEL_PATH,{
executionProviders:["webgl"]
})

EventBus.emit("clipLoaded")

return clipSession

}



export async function extractFeatures(canvas,box){

if(!clipSession){
await loadCLIP()
}

const cropped = cropObject(canvas,box)

const tensor = preprocess(cropped)

const feeds = {
input: tensor
}

const results = await clipSession.run(feeds)

const embedding = results.output.data

return normalizeEmbedding(embedding)

}



function cropObject(canvas,box){

const [x,y,w,h] = box

const tempCanvas = document.createElement("canvas")
const ctx = tempCanvas.getContext("2d")

tempCanvas.width = INPUT_SIZE
tempCanvas.height = INPUT_SIZE

ctx.drawImage(
canvas,
x,y,w,h,
0,0,INPUT_SIZE,INPUT_SIZE
)

return ctx.getImageData(0,0,INPUT_SIZE,INPUT_SIZE)

}



function preprocess(imageData){

const data = imageData.data

const floatData = new Float32Array(3*INPUT_SIZE*INPUT_SIZE)

let i = 0

for(let y=0;y<INPUT_SIZE;y++){
for(let x=0;x<INPUT_SIZE;x++){

const px = (y*INPUT_SIZE + x)*4

floatData[i] = (data[px]/255 - 0.5)/0.5
floatData[i + INPUT_SIZE*INPUT_SIZE] = (data[px+1]/255 - 0.5)/0.5
floatData[i + INPUT_SIZE*INPUT_SIZE*2] = (data[px+2]/255 - 0.5)/0.5

i++

}
}

return new ort.Tensor(
"float32",
floatData,
[1,3,INPUT_SIZE,INPUT_SIZE]
)

}



function normalizeEmbedding(vec){

let sum = 0

for(let i=0;i<vec.length;i++){
sum += vec[i]*vec[i]
}

const norm = Math.sqrt(sum)

const normalized = new Float32Array(vec.length)

for(let i=0;i<vec.length;i++){
normalized[i] = vec[i]/norm
}

return normalized

}
