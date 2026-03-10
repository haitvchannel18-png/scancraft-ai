// ================= IMPORT =================

import { on, emit } from "../core/events.js"
import { playAISpeakingSound } from "../audio/ai-sounds.js"
import { bubblePop } from "./animation-engine.js"


// ================= DOM =================

let bubble
let waveformCanvas
let ctx
let animationId
let listening = false
let speaking = false


// ================= INIT =================

export function initVoiceBubble(){

bubble = document.getElementById("voice-bubble")
waveformCanvas = document.getElementById("voice-waveform")

if(!bubble || !waveformCanvas) return

ctx = waveformCanvas.getContext("2d")

resizeCanvas()

window.addEventListener("resize", resizeCanvas)

listenVoiceEvents()

}



// ================= RESIZE =================

function resizeCanvas(){

waveformCanvas.width = waveformCanvas.offsetWidth
waveformCanvas.height = waveformCanvas.offsetHeight

}



// ================= EVENT LISTENER =================

function listenVoiceEvents(){

on("voice:listening:start", startListeningAnimation)

on("voice:listening:stop", stopListeningAnimation)

on("voice:speaking:start", startSpeakingAnimation)

on("voice:speaking:stop", stopSpeakingAnimation)

}



// ================= LISTENING =================

function startListeningAnimation(){

listening = true
speaking = false

bubble.classList.add("voice-active")

bubblePop(bubble)

animateWave()

}



function stopListeningAnimation(){

listening = false
bubble.classList.remove("voice-active")

cancelAnimationFrame(animationId)

clearWave()

}



// ================= SPEAKING =================

function startSpeakingAnimation(){

speaking = true
listening = false

bubble.classList.add("voice-speaking")

playAISpeakingSound()

animateWave()

}



function stopSpeakingAnimation(){

speaking = false

bubble.classList.remove("voice-speaking")

cancelAnimationFrame(animationId)

clearWave()

}



// ================= WAVE ANIMATION =================

function animateWave(){

animationId = requestAnimationFrame(animateWave)

ctx.clearRect(0,0,waveformCanvas.width,waveformCanvas.height)

const bars = 32
const barWidth = waveformCanvas.width / bars

for(let i=0;i<bars;i++){

let amplitude

if(listening){

amplitude = Math.random()*40 + 10

}else if(speaking){

amplitude = Math.random()*60 + 20

}else{

amplitude = 2

}

const x = i * barWidth
const y = waveformCanvas.height / 2

ctx.fillStyle = "#00f7ff"

ctx.fillRect(
x,
y - amplitude/2,
barWidth*0.6,
amplitude
)

}

}



// ================= CLEAR =================

function clearWave(){

ctx.clearRect(0,0,waveformCanvas.width,waveformCanvas.height)

}



// ================= CLICK VOICE =================

export function enableVoiceTap(){

bubble.addEventListener("click",()=>{

emit("voice:toggle")

})

}
