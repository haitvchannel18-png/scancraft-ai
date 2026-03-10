// ================= IMPORT =================

import { on, emit } from "../core/events.js"
import { highlightObject } from "./animation-engine.js"



// ================= GLOBAL =================

let overlayCanvas
let ctx
let detectedObjects = []
let videoElement



// ================= INIT =================

export function initScanOverlay(video){

videoElement = video

overlayCanvas = document.getElementById("scan-overlay")

ctx = overlayCanvas.getContext("2d")

resizeCanvas()

window.addEventListener("resize", resizeCanvas)

overlayCanvas.addEventListener("click", handleTap)

listenDetectionEvents()

}



// ================= RESIZE =================

function resizeCanvas(){

overlayCanvas.width = overlayCanvas.offsetWidth
overlayCanvas.height = overlayCanvas.offsetHeight

}



// ================= LISTEN DETECTION =================

function listenDetectionEvents(){

on("vision:detections", objects => {

detectedObjects = objects

drawBoundingBoxes()

})

}



// ================= DRAW BOXES =================

function drawBoundingBoxes(){

ctx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height)

detectedObjects.forEach(obj => {

const {x,y,width,height,label,score} = obj

drawBox(x,y,width,height,label,score)

})

}



// ================= DRAW SINGLE BOX =================

function drawBox(x,y,width,height,label,score){

ctx.strokeStyle = "#00f7ff"
ctx.lineWidth = 2

ctx.strokeRect(x,y,width,height)

ctx.fillStyle = "#00f7ff"
ctx.font = "14px sans-serif"

const text = `${label} ${(score*100).toFixed(0)}%`

ctx.fillText(text,x+4,y-6)

}



// ================= TAP OBJECT =================

function handleTap(e){

const rect = overlayCanvas.getBoundingClientRect()

const x = e.clientX - rect.left
const y = e.clientY - rect.top

const selected = detectedObjects.find(obj =>

x >= obj.x &&
x <= obj.x + obj.width &&
y >= obj.y &&
y <= obj.y + obj.height

)

if(selected){

emit("object:selected", selected)

showSelectionEffect(selected)

}

}



// ================= HIGHLIGHT =================

function showSelectionEffect(obj){

const box = document.createElement("div")

box.className = "scan-highlight"

box.style.left = obj.x + "px"
box.style.top = obj.y + "px"
box.style.width = obj.width + "px"
box.style.height = obj.height + "px"

overlayCanvas.parentElement.appendChild(box)

highlightObject(box)

setTimeout(()=>box.remove(),800)

}



// ================= CLEAR =================

export function clearOverlay(){

ctx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height)

detectedObjects = []

}



// ================= UPDATE =================

export function updateOverlay(objects){

detectedObjects = objects

drawBoundingBoxes()

}
