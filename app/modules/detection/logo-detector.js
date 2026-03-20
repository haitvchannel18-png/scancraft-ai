/**
 * ScanCraft AI
 * Logo Detection Engine (Brand Recognition + Product Intelligence)
 */

import Events from "../core/events.js"
import ModelLoader from "../core/model-loader.js"
import Performance from "../core/performance.js"

class LogoDetector {

constructor(){

this.model = null
this.isLoaded = false
this.inputSize = 224

// Known brands (expandable)
this.brands = [
"apple",
"samsung",
"nike",
"adidas",
"puma",
"boat",
"sony",
"hp",
"dell",
"lenovo",
"asus",
"lg",
"coca cola",
"pepsi",
"amazon",
"flipkart"
]

}

async load(){

this.model = await ModelLoader.loadONNX(
"models/logo/logo-detect.onnx",
"logo"
)

this.isLoaded = true

Events.emit("logo:loaded")

}

async detect(frame){

if(!this.isLoaded) return null

Performance.start("logo-inference")

const input = this.preprocess(frame)

const output = await this.model.run(input)

const result = this.postprocess(output)

Performance.end("logo-inference")

Events.emit("logo:detected", result)

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

tensor[j++] = data[i] / 255
tensor[j++] = data[i+1] / 255
tensor[j++] = data[i+2] / 255

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

postprocess(output){

// Placeholder parsing (real model output depend karega)
const scores = output.output?.data || []

let bestIndex = -1
let bestScore = 0

for(let i=0;i<scores.length;i++){

if(scores[i] > bestScore){
bestScore = scores[i]
bestIndex = i
}

}

if(bestScore < 0.5){

return {
brand: null,
confidence: 0
}

}

return {
brand: this.brands[bestIndex] || "unknown brand",
confidence: bestScore
}

}

}

const Logo = new LogoDetector()

export default Logo
