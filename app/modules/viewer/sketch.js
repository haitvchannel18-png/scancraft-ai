// ================= IMPORT =================

import { on, emit } from "../core/events.js"
import { playBrushSound } from "../audio/editor-sounds.js"
import { fadeIn } from "../ui/animation-engine.js"



// ================= GLOBAL =================

let sketchCanvas
let ctx
let drawing = false
let currentColor = "#00f7ff"
let lineWidth = 3
let history = []



// ================= INIT =================

export function initSketch(){

sketchCanvas = document.getElementById("sketch-canvas")

if(!sketchCanvas) return

ctx = sketchCanvas.getContext("2d")

setupCanvas()

listenEvents()

sketchCanvas.addEventListener("mousedown", startDraw)
sketchCanvas.addEventListener("mousemove", draw)
sketchCanvas.addEventListener("mouseup", stopDraw)
sketchCanvas.addEventListener("mouseleave", stopDraw)

}



// ================= SETUP =================

function setupCanvas(){

resizeCanvas()

window.addEventListener("resize", resizeCanvas)

ctx.lineCap = "round"
ctx.lineJoin = "round"

}



function resizeCanvas(){

sketchCanvas.width = sketchCanvas.offsetWidth
sketchCanvas.height = sketchCanvas.offsetHeight

}



// ================= EVENTS =================

function listenEvents(){

on("sketch:open", openSketch)

on("sketch:clear", clearSketch)

}



// ================= OPEN =================

function openSketch(){

sketchCanvas.style.display = "block"

fadeIn(sketchCanvas)

emit("sketch:ready")

}



// ================= DRAW =================

function startDraw(e){

drawing = true

saveState()

ctx.beginPath()

ctx.moveTo(e.offsetX,e.offsetY)

}



function draw(e){

if(!drawing) return

ctx.lineWidth = lineWidth
ctx.strokeStyle = currentColor

ctx.lineTo(e.offsetX,e.offsetY)

ctx.stroke()

playBrushSound()

}



function stopDraw(){

drawing = false

ctx.closePath()

}



// ================= SETTINGS =================

export function setSketchColor(color){

currentColor = color

}



export function setSketchWidth(size){

lineWidth = size

}



// ================= CLEAR =================

function clearSketch(){

ctx.clearRect(

0,
0,
sketchCanvas.width,
sketchCanvas.height

)

history = []

}



// ================= HISTORY =================

function saveState(){

history.push(

ctx.getImageData(

0,
0,
sketchCanvas.width,
sketchCanvas.height

)

)

}



export function undoSketch(){

if(history.length === 0) return

const last = history.pop()

ctx.putImageData(last,0,0)

}



// ================= EXPORT =================

export function exportSketch(){

return sketchCanvas.toDataURL("image/png")

}
