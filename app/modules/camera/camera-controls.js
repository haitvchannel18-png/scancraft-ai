// ================= IMPORT =================

import { emit } from "../core/events.js"


// ================= CAMERA STATE =================

let currentStream = null
let currentTrack = null

let videoElement = null

let zoomLevel = 1


// ================= INIT CAMERA =================

export async function initCamera(video){

videoElement = video

const constraints = {

audio:false,

video:{
facingMode:"environment",
width:{ideal:1920},
height:{ideal:1080},
focusMode:"continuous",
exposureMode:"continuous",
whiteBalanceMode:"continuous"
}

}

currentStream = await navigator.mediaDevices.getUserMedia(constraints)

video.srcObject = currentStream

currentTrack = currentStream.getVideoTracks()[0]

emit("camera:started")

}


// ================= STOP CAMERA =================

export function stopCamera(){

if(!currentStream) return

currentStream.getTracks().forEach(track=>track.stop())

emit("camera:stopped")

}


// ================= SWITCH CAMERA =================

export async function switchCamera(){

if(!videoElement) return

stopCamera()

const constraints = {

video:{
facingMode:"user",
width:{ideal:1280},
height:{ideal:720}
}

}

currentStream = await navigator.mediaDevices.getUserMedia(constraints)

videoElement.srcObject = currentStream

currentTrack = currentStream.getVideoTracks()[0]

emit("camera:switched")

}


// ================= TORCH CONTROL =================

export async function toggleTorch(state){

if(!currentTrack) return

const capabilities = currentTrack.getCapabilities()

if(!capabilities.torch) return

await currentTrack.applyConstraints({

advanced:[{torch:state}]

})

emit("camera:torch",state)

}


// ================= ZOOM CONTROL =================

export async function setZoom(level){

if(!currentTrack) return

const capabilities = currentTrack.getCapabilities()

if(!capabilities.zoom) return

zoomLevel = level

await currentTrack.applyConstraints({

advanced:[{zoom:zoomLevel}]

})

emit("camera:zoom",zoomLevel)

}


// ================= AUTO FOCUS =================

export async function autoFocus(){

if(!currentTrack) return

const capabilities = currentTrack.getCapabilities()

if(!capabilities.focusMode) return

await currentTrack.applyConstraints({

advanced:[{focusMode:"continuous"}]

})

emit("camera:focus")

}


// ================= AUTO EXPOSURE =================

export async function autoExposure(){

if(!currentTrack) return

const capabilities = currentTrack.getCapabilities()

if(!capabilities.exposureMode) return

await currentTrack.applyConstraints({

advanced:[{exposureMode:"continuous"}]

})

emit("camera:exposure")

}


// ================= CAPTURE FRAME =================

export function captureFrame(){

if(!videoElement) return null

const canvas = document.createElement("canvas")

canvas.width = videoElement.videoWidth
canvas.height = videoElement.videoHeight

const ctx = canvas.getContext("2d")

ctx.drawImage(videoElement,0,0)

return ctx.getImageData(
0,
0,
canvas.width,
canvas.height
)

}
