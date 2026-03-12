// modules/ui/voice-bubble.js

import { EventBus } from "../core/events.js"

let bubble
let canvas
let ctx
let animationId
let bars = []
let active = false

const BAR_COUNT = 24
const MAX_HEIGHT = 40

export function initVoiceBubble(containerId = "voice-bubble-container"){

const container = document.getElementById(containerId)

bubble = document.createElement("div")
bubble.className = "voice-bubble"

canvas = document.createElement("canvas")
canvas.width = 220
canvas.height = 80

ctx = canvas.getContext("2d")

bubble.appendChild(canvas)
container.appendChild(bubble)

createBars()

attachEvents()

}

function createBars(){

bars = []

for(let i=0;i<BAR_COUNT;i++){

bars.push({
height: Math.random()*10,
speed: 0.2 + Math.random()*0.8
})

}

}

function attachEvents(){

EventBus.on("voiceStart",startAnimation)

EventBus.on("voiceEnd",stopAnimation)

EventBus.on("voiceStopped",stopAnimation)

}

function startAnimation(){

active = true

bubble.classList.add("active")

animate()

}

function stopAnimation(){

active = false

bubble.classList.remove("active")

cancelAnimationFrame(animationId)

drawIdle()

}

function animate(){

animationId = requestAnimationFrame(animate)

ctx.clearRect(0,0,canvas.width,canvas.height)

const centerY = canvas.height/2
const barWidth = canvas.width / BAR_COUNT

bars.forEach((bar,i)=>{

bar.height += (Math.random()-0.5)*bar.speed*10

bar.height = Math.max(4,Math.min(MAX_HEIGHT,bar.height))

const x = i * barWidth

drawBar(x,centerY,barWidth-2,bar.height)

})

}

function drawBar(x,centerY,width,height){

ctx.beginPath()

ctx.fillStyle = "rgba(0,180,255,0.9)"

ctx.roundRect(
x,
centerY - height/2,
width,
height,
4
)

ctx.fill()

}

function drawIdle(){

ctx.clearRect(0,0,canvas.width,canvas.height)

const centerY = canvas.height/2
const barWidth = canvas.width / BAR_COUNT

for(let i=0;i<BAR_COUNT;i++){

drawBar(i*barWidth,centerY,barWidth-2,6)

}

}

export function destroyVoiceBubble(){

cancelAnimationFrame(animationId)

if(bubble && bubble.parentNode){

bubble.parentNode.removeChild(bubble)

}

}
