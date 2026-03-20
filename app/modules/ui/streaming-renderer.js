// modules/ui/streaming-renderer.js

import { EventBus } from "../core/events.js"
import Camera from "../camera/camera.js"
import Detector from "../detection/detector.js"
import ScanOverlay from "./scan-overlay.js"
import Performance from "../core/performance.js"

class StreamingRenderer {

constructor(){
this.running = false
this.lastFrameTime = 0
this.fps = 0
this.frameCount = 0
this.startTime = Date.now()
}

// 🔥 START STREAM
async start(video){

if(this.running) return

this.running = true

// init camera
await Camera.init(video)

// init overlay
ScanOverlay.init(video)

// start loop
this.loop()

EventBus.emit("streamStart")

}

// ❌ STOP STREAM
stop(){

this.running = false

EventBus.emit("streamStop")

}

// 🧠 MAIN LOOP
async loop(){

if(!this.running) return

const now = performance.now()

// ⚡ FPS CONTROL (30fps target)
if(now - this.lastFrameTime < 33){
requestAnimationFrame(()=>this.loop())
return
}

this.lastFrameTime = now

// 🎥 CAPTURE FRAME
const frame = Camera.captureFrame()

// 🧠 DETECT OBJECTS
const detections = await Detector.detect(frame)

// 🎯 DRAW UI
EventBus.emit("detections", detections)

// 📊 FPS TRACK
this.trackFPS()

// 🚀 NEXT FRAME
requestAnimationFrame(()=>this.loop())

}

// 📊 FPS TRACKER
trackFPS(){

this.frameCount++

const elapsed = (Date.now() - this.startTime) / 1000

if(elapsed >= 1){

this.fps = Math.round(this.frameCount / elapsed)

Performance.update("fps", this.fps)

this.frameCount = 0
this.startTime = Date.now()

}

}

}

export default new StreamingRenderer()
