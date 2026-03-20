/**
 * ScanCraft AI
 * YOLOv8 Detection Engine (ONNX + WebGPU/WebGL)
 */

import Events from "../core/events.js"
import ModelLoader from "../core/model-loader.js"
import Adaptive from "../core/adaptive-detection.js"
import Performance from "../core/performance.js"

class YOLOEngine {

constructor(){

this.model = null
this.inputSize = 640
this.isLoaded = false

this.labels = [
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

}

async load(){

this.model = await ModelLoader.loadONNX(
"models/detection/yolov8n.onnx",
"yolo"
)

this.isLoaded = true

Events.emit("yolo:loaded")

}

async detect(frame){

if(!this.isLoaded) return []

Performance.start("yolo-inference")

const strategy = Adaptive.getStrategy()

const input = this.preprocess(frame, strategy)

const output = await this.model.run(input)

const detections = this.postprocess(output)

Performance.end("yolo-inference")

Events.emit("yolo:detected", detections)

return detections

}

preprocess(frame, strategy){

// Resize input
const size = strategy === "high-accuracy" ? 640 :
             strategy === "lightweight" ? 320 : 416

this.inputSize = size

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = size
canvas.height = size

ctx.drawImage(
this.imageDataToCanvas(frame),
0, 0, size, size
)

const imageData = ctx.getImageData(0,0,size,size)

const input = new Float32Array(size * size * 3)

let j = 0

for(let i=0;i<imageData.data.length;i+=4){

input[j++] = imageData.data[i] / 255
input[j++] = imageData.data[i+1] / 255
input[j++] = imageData.data[i+2] / 255

}

return {
images: new ort.Tensor("float32", input, [1,3,size,size])
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

// YOLO raw output parsing
const data = output.output0.data

const results = []

for(let i=0;i<data.length;i+=85){

const confidence = data[i+4]

if(confidence < 0.4) continue

let maxClass = 0
let maxScore = 0

for(let j=5;j<85;j++){

if(data[i+j] > maxScore){
maxScore = data[i+j]
maxClass = j-5
}

}

if(maxScore > 0.5){

results.push({
label: this.labels[maxClass],
confidence: maxScore,
bbox: [
data[i],
data[i+1],
data[i+2],
data[i+3]
]
})

}

}

return results

}

}

const YOLO = new YOLOEngine()

export default YOLO
