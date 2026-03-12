// modules/camera/camera.js

import { EventBus } from "../core/events.js"

let stream = null
let videoElement = null
let currentFacing = "environment"

const constraints = {

video: {
facingMode: currentFacing,
width: { ideal: 1280 },
height: { ideal: 720 },
focusMode: "continuous",
exposureMode: "continuous",
whiteBalanceMode: "continuous"
},

audio: false

}


export async function startCamera(video){

videoElement = video

try{

stream = await navigator.mediaDevices.getUserMedia(constraints)

video.srcObject = stream

await video.play()

EventBus.emit("cameraStarted")

}catch(err){

console.error("Camera error:",err)

EventBus.emit("cameraError",err)

}

}



export function stopCamera(){

if(!stream) return

stream.getTracks().forEach(track=>track.stop())

EventBus.emit("cameraStopped")

}



export async function switchCamera(){

if(!videoElement) return

currentFacing = currentFacing === "environment"
? "user"
: "environment"

stopCamera()

constraints.video.facingMode = currentFacing

await startCamera(videoElement)

EventBus.emit("cameraSwitched",currentFacing)

}



export function captureFrame(canvas){

if(!videoElement) return null

const ctx = canvas.getContext("2d")

canvas.width = videoElement.videoWidth
canvas.height = videoElement.videoHeight

ctx.drawImage(videoElement,0,0,canvas.width,canvas.height)

return canvas

}



export function getStream(){

return stream

}
