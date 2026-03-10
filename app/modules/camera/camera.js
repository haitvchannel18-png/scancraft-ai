// ================= IMPORTS =================

import { startStreamProcessor } from "../core/pipeline.js"
import { emit } from "../core/events.js"


// ================= STATE =================

let videoElement = null
let mediaStream = null
let activeDevice = null


// ================= CAMERA START =================

export async function startCamera(video){

videoElement = video

try{

const device = await getBestCamera()

const constraints = {

video:{

deviceId: device.deviceId,

width:{ ideal:1920 },
height:{ ideal:1080 },

facingMode:"environment",

focusMode:"continuous",

exposureMode:"continuous"

},

audio:false

}

mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

videoElement.srcObject = mediaStream

await videoElement.play()

activeDevice = device

emit("camera:started", device.label)

startStreamProcessor(videoElement)

}catch(err){

console.error("Camera start failed", err)

emit("camera:error", err)

}

}


// ================= CAMERA STOP =================

export function stopCamera(){

if(!mediaStream) return

mediaStream.getTracks().forEach(track => track.stop())

emit("camera:stopped")

}


// ================= DEVICE SELECT =================

async function getBestCamera(){

const devices = await navigator.mediaDevices.enumerateDevices()

const cameras = devices.filter(d => d.kind === "videoinput")

// prefer back camera

let backCamera = cameras.find(c =>

c.label.toLowerCase().includes("back") ||
c.label.toLowerCase().includes("rear")
)

return backCamera || cameras[0]

}


// ================= CAMERA SWITCH =================

export async function switchCamera(){

if(!videoElement) return

const devices = await navigator.mediaDevices.enumerateDevices()

const cameras = devices.filter(d => d.kind === "videoinput")

const index = cameras.findIndex(d => d.deviceId === activeDevice.deviceId)

const next = cameras[(index+1) % cameras.length]

stopCamera()

await startCamera(videoElement, next)

emit("camera:switched", next.label)

}


// ================= CAMERA INFO =================

export function getCameraInfo(){

if(!activeDevice) return null

return{

label: activeDevice.label,
id: activeDevice.deviceId

}

}
