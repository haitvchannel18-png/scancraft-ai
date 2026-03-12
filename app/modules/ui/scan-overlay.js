// modules/ui/scan-overlay.js

import { EventBus } from "../core/events.js"

let canvas
let ctx
let container

let boxes = []
let scanActive = false

export function initScanOverlay(containerId="scan-overlay"){

container = document.getElementById(containerId)

canvas = document.createElement("canvas")
canvas.className = "scan-overlay-canvas"

ctx = canvas.getContext("2d")

container.appendChild(canvas)

resize()

window.addEventListener("resize",resize)

attachEvents()

}

function resize(){

canvas.width = container.offsetWidth
canvas.height = container.offsetHeight

}

function attachEvents(){

EventBus.on("detectionResults",renderBoxes)

EventBus.on("scanStart",startScan)

EventBus.on("scanStop",stopScan)

}

function startScan(){

scanActive = true

animateScan()

}

function stopScan(){

scanActive = false

ctx.clearRect(0,0,canvas.width,canvas.height)

}

function renderBoxes(detections){

boxes = detections

draw()

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

boxes.forEach(box=>{

drawBox(box)

})

}

function drawBox(box){

const {x,y,width,height,label,confidence} = box

ctx.strokeStyle = "rgba(0,255,150,0.9)"
ctx.lineWidth = 2

ctx.strokeRect(x,y,width,height)

ctx.fillStyle = "rgba(0,255,150,0.9)"
ctx.font = "14px sans-serif"

const text = `${label} ${(confidence*100).toFixed(1)}%`

ctx.fillText(text,x+6,y-6)

}

function animateScan(){

if(!scanActive) return

ctx.clearRect(0,0,canvas.width,canvas.height)

const lineY = (Date.now()/6) % canvas.height

ctx.strokeStyle = "rgba(0,200,255,0.7)"
ctx.lineWidth = 2

ctx.beginPath()
ctx.moveTo(0,lineY)
ctx.lineTo(canvas.width,lineY)
ctx.stroke()

requestAnimationFrame(animateScan)

}

export function highlightObject(box){

ctx.strokeStyle = "rgba(255,180,0,1)"
ctx.lineWidth = 3

ctx.strokeRect(box.x,box.y,box.width,box.height)

}

export function clearOverlay(){

ctx.clearRect(0,0,canvas.width,canvas.height)

}
