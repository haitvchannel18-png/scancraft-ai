import { initPipeline, processFrame } from "./modules/core/pipeline.js"
import { startCamera } from "./modules/camera/camera.js"
import { EventBus } from "./modules/core/events.js"

import { AudioEngine } from "./modules/audio/audio-engine.js"
import { speak } from "./modules/voice/narration.js"

import { showDetection } from "./modules/ui/scan-overlay.js"
import { renderObjectPanel } from "./modules/ui/object-panel.js"
import { pushAIMessage } from "./modules/ui/ai-chat-ui.js"


const video = document.getElementById("camera-stream")
const canvas = document.getElementById("scan-canvas")

const scanBtn = document.getElementById("scan-button")
const chatInput = document.getElementById("chat-input")
const sendBtn = document.getElementById("send-btn")
const voiceBtn = document.getElementById("voice-btn")


let running = false


async function bootApp(){

console.log("Initializing ScanCraft AI")

await AudioEngine.init()

await initPipeline()

await startCamera(video)

startFrameLoop()

}


function startFrameLoop(){

const ctx = canvas.getContext("2d")

async function loop(){

if(!running){

requestAnimationFrame(loop)
return

}

ctx.drawImage(video,0,0,canvas.width,canvas.height)

const result = await processFrame(canvas)

if(result){

showDetection(result)

EventBus.emit("objectDetected",result)

}

requestAnimationFrame(loop)

}

requestAnimationFrame(loop)

}



scanBtn.addEventListener("click",()=>{

running = !running

if(running){

AudioEngine.play("scan-start")

scanBtn.innerText="STOP"

}else{

scanBtn.innerText="SCAN"

}

})



EventBus.on("objectDetected",async data=>{

AudioEngine.play("detect")

renderObjectPanel(data)

const text = `Detected ${data.label}`

pushAIMessage("ai",text)

await speak(text)

})



sendBtn.addEventListener("click",handleChat)

chatInput.addEventListener("keypress",e=>{

if(e.key==="Enter") handleChat()

})


async function handleChat(){

const text = chatInput.value

if(!text) return

pushAIMessage("user",text)

chatInput.value=""

AudioEngine.play("typing")

EventBus.emit("userQuery",text)

}



voiceBtn.addEventListener("click",()=>{

EventBus.emit("voiceInput")

})



window.addEventListener("load",bootApp)
