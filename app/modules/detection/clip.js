/**
 * ScanCraft AI
 * CLIP Engine (Visual Understanding + Similarity AI)
 */

import Events from "../core/events.js"
import ModelLoader from "../core/model-loader.js"
import Performance from "../core/performance.js"

class CLIPEngine {

constructor(){

this.model = null
this.isLoaded = false
this.inputSize = 224

// text embeddings (basic prompt set)
this.labels = [
"a photo of a tool",
"a photo of a machine",
"a photo of a device",
"a photo of food",
"a photo of furniture",
"a photo of clothing",
"a photo of electronics",
"a photo of an object",
"a photo of a metal part",
"a photo of a plastic item"
]

}

async load(){

this.model = await ModelLoader.loadONNX(
"models/vision/clip-vit-base.onnx",
"clip"
)

this.isLoaded = true

Events.emit("clip:loaded")

}

async analyze(frame){

if(!this.isLoaded) return null

Performance.start("clip-inference")

const input = this.preprocess(frame)

const output = await this.model.run(input)

const embedding = output.output

const result = this.match(embedding)

Performance.end("clip-inference")

Events.emit("clip:analyzed", result)

return result

}

preprocess(frame){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = this.inputSize
canvas.height = this.inputSize

ctx.drawImage(
this.imageDataToCanvas(frame),
0,0,this.inputSize,this.inputSize
)

const imageData = ctx.getImageData(0,0,this.inputSize,this.inputSize)

const data = imageData.data

const tensor = new Float32Array(this.inputSize * this.inputSize * 3)

let j = 0

for(let i=0;i<data.length;i+=4){

tensor[j++] = (data[i] / 255 - 0.5) / 0.5
tensor[j++] = (data[i+1] / 255 - 0.5) / 0.5
tensor[j++] = (data[i+2] / 255 - 0.5) / 0.5

}

return {
image: new ort.Tensor("float32", tensor, [1,3,this.inputSize,this.inputSize])
}

}

imageDataToCanvas(imageData){

const c = document.createElement("canvas")
const ctx = c.getContext("2d")

c.width = imageData.width
c.height = imageData.height

ctx.putImageData(imageData,0,0)

return c

}

match(embedding){

// Fake similarity logic (real vector DB later)
let best = null
let bestScore = -Infinity

this.labels.forEach(label=>{

const score = Math.random() // placeholder similarity

if(score > bestScore){
bestScore = score
best = label
}

})

return {
label: best,
confidence: bestScore
}

}

}

const CLIP = new CLIPEngine()

export default CLIP
