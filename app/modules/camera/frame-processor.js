/**
 * ScanCraft AI
 * Frame Processor (AI Optimization + Tensor Prep)
 */

import Events from "../core/events.js"
import Performance from "../core/performance.js"

class FrameProcessor {

constructor(){

this.canvas = document.createElement("canvas")
this.ctx = this.canvas.getContext("2d")

this.targetSize = 224 // default (CLIP / MobileNet)
this.normalize = true

this.lastProcessTime = 0

}

setTargetSize(size){
this.targetSize = size
}

process(frame){

const start = performance.now()

// Resize frame
this.canvas.width = this.targetSize
this.canvas.height = this.targetSize

this.ctx.drawImage(
this.imageDataToCanvas(frame),
0,
0,
this.targetSize,
this.targetSize
)

const imageData = this.ctx.getImageData(0, 0, this.targetSize, this.targetSize)

// Convert to tensor-like array
const tensor = this.toTensor(imageData)

const end = performance.now()
this.lastProcessTime = end - start

Performance.mark("frame-process", this.lastProcessTime)

Events.emit("frame:processed", {
time: this.lastProcessTime,
size: this.targetSize
})

return tensor

}

imageDataToCanvas(imageData){

const tempCanvas = document.createElement("canvas")
const tempCtx = tempCanvas.getContext("2d")

tempCanvas.width = imageData.width
tempCanvas.height = imageData.height

tempCtx.putImageData(imageData, 0, 0)

return tempCanvas

}

toTensor(imageData){

const { data, width, height } = imageData

// RGB normalize
const tensor = new Float32Array(width * height * 3)

let j = 0

for(let i = 0; i < data.length; i += 4){

let r = data[i]
let g = data[i + 1]
let b = data[i + 2]

// Normalize (0–1)
if(this.normalize){
r /= 255
g /= 255
b /= 255
}

// Optional: mean/std normalization (advanced)
r = (r - 0.5) / 0.5
g = (g - 0.5) / 0.5
b = (b - 0.5) / 0.5

tensor[j++] = r
tensor[j++] = g
tensor[j++] = b

}

return {
data: tensor,
shape: [1, 3, height, width] // NCHW (AI models ke liye)
}

}

optimize(frame){

// Adaptive resolution (performance based)
const fps = Performance.getFPS?.() || 30

if(fps < 20){
this.targetSize = 160
}else if(fps < 25){
this.targetSize = 192
}else{
this.targetSize = 224
}

return this.process(frame)

}

}

const FrameProcessorInstance = new FrameProcessor()

export default FrameProcessorInstance
