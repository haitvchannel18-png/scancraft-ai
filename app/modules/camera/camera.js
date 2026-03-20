/**
 * ScanCraft AI
 * Ultra Camera Engine (PWA + AI Ready)
 */

import Events from "../core/events.js"
import State from "../core/state-manager.js"

class CameraEngine {

constructor(){

this.video = null
this.stream = null
this.canvas = document.createElement("canvas")
this.ctx = this.canvas.getContext("2d")

this.isRunning = false

this.facingMode = "environment" // back camera
this.resolution = { width: 1280, height: 720 }

this.frameRate = 30

}

async init(videoElement){

this.video = videoElement

await this.startCamera()

}

async startCamera(){

try{

this.stream = await navigator.mediaDevices.getUserMedia({
video:{
facingMode:this.facingMode,
width:{ ideal: this.resolution.width },
height:{ ideal: this.resolution.height },
frameRate:{ ideal: this.frameRate }
},
audio:false
})

this.video.srcObject = this.stream
await this.video.play()

this.isRunning = true

Events.emit("camera:started")

State.set("cameraActive", true)

}catch(err){

console.error("Camera Error:", err)
Events.emit("camera:error", err)

}

}

stopCamera(){

if(this.stream){

this.stream.getTracks().forEach(track => track.stop())

this.video.srcObject = null

this.isRunning = false

Events.emit("camera:stopped")

State.set("cameraActive", false)

}

}

switchCamera(){

this.facingMode = this.facingMode === "environment" ? "user" : "environment"

this.stopCamera()
this.startCamera()

}

captureFrame(){

if(!this.video) return null

this.canvas.width = this.video.videoWidth
this.canvas.height = this.video.videoHeight

this.ctx.drawImage(this.video, 0, 0)

const imageData = this.canvas.toDataURL("image/jpeg", 0.9)

Events.emit("camera:frameCaptured", imageData)

return imageData

}

getFrameTensor(){

// future AI pipeline ke liye raw pixel data
this.canvas.width = this.video.videoWidth
this.canvas.height = this.video.videoHeight

this.ctx.drawImage(this.video, 0, 0)

const frame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

return frame

}

startStreaming(callback){

const loop = () => {

if(!this.isRunning) return

const frame = this.getFrameTensor()

callback(frame)

requestAnimationFrame(loop)

}

loop()

}

setResolution(width, height){

this.resolution = { width, height }

if(this.isRunning){

this.stopCamera()
this.startCamera()

}

}

setFPS(fps){

this.frameRate = fps

if(this.isRunning){

this.stopCamera()
this.startCamera()

}

}

enableTorch(enable){

const track = this.stream?.getVideoTracks()[0]

if(track && track.getCapabilities().torch){

track.applyConstraints({
advanced:[{ torch: enable }]
})

}

}

}

const Camera = new CameraEngine()

export default Camera
