// modules/depth/depth-estimator.js

import AILogger from "../utils/ai-logger.js"

class DepthEstimator {

constructor(){
this.session = null
this.inputName = null
}

// 🔥 load ONNX model
async init(){

try {

this.session = await ort.InferenceSession.create(
"/models/depth/midas.onnx",
{ executionProviders: ["webgl"] } // fast GPU
)

this.inputName = this.session.inputNames[0]

AILogger.log("info","MiDaS model loaded")

} catch(e){
AILogger.log("error","Model load failed",e)
}

}

// 🔥 preprocess frame
preprocess(video){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = 256
canvas.height = 256

ctx.drawImage(video,0,0,256,256)

const imgData = ctx.getImageData(0,0,256,256).data

const input = new Float32Array(1 * 3 * 256 * 256)

for(let i=0;i<256*256;i++){

input[i] = imgData[i*4] / 255
input[i + 256*256] = imgData[i*4+1] / 255
input[i + 2*256*256] = imgData[i*4+2] / 255

}

return new ort.Tensor("float32", input, [1,3,256,256])

}

// 🔥 run inference
async estimate(video){

if(!this.session) return null

const inputTensor = this.preprocess(video)

const feeds = {}
feeds[this.inputName] = inputTensor

const results = await this.session.run(feeds)

const output = results[Object.keys(results)[0]].data

// 🔥 convert to depth map
const depthMap = []

for(let i=0;i<256*256;i++){

depthMap.push({
x: i % 256,
y: Math.floor(i/256),
depth: output[i]
})

}

return depthMap

}

}

export default new DepthEstimator()
