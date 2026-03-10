// ================= IMPORT =================

import { on, emit } from "../core/events.js"
import { playBrushSound } from "../audio/editor-sounds.js"
import { getCurrentModel } from "./viewer.js"

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"



// ================= GLOBAL =================

let paintCanvas
let ctx
let brushColor = "#ff0000"
let brushSize = 20
let painting = false
let texture
let meshTarget



// ================= INIT =================

export function initPainter(){

paintCanvas = document.getElementById("paint-canvas")

if(!paintCanvas) return

ctx = paintCanvas.getContext("2d")

setupCanvas()

listenPainterEvents()

paintCanvas.addEventListener("mousedown", startPaint)
paintCanvas.addEventListener("mousemove", paint)
paintCanvas.addEventListener("mouseup", stopPaint)

}



// ================= CANVAS =================

function setupCanvas(){

paintCanvas.width = 1024
paintCanvas.height = 1024

ctx.fillStyle = "#ffffff"
ctx.fillRect(0,0,paintCanvas.width,paintCanvas.height)

texture = new THREE.CanvasTexture(paintCanvas)

}



// ================= EVENTS =================

function listenPainterEvents(){

on("painter:open", enablePainter)

}



// ================= ENABLE PAINTER =================

function enablePainter(){

const model = getCurrentModel()

if(!model) return

model.traverse(obj=>{

if(obj.isMesh){

meshTarget = obj

applyTexture(obj)

}

})

emit("painter:ready")

}



// ================= APPLY TEXTURE =================

function applyTexture(mesh){

mesh.material.map = texture

mesh.material.needsUpdate = true

}



// ================= START PAINT =================

function startPaint(e){

painting = true

draw(e)

}



// ================= STOP PAINT =================

function stopPaint(){

painting = false

ctx.beginPath()

}



// ================= DRAW =================

function paint(e){

if(!painting) return

draw(e)

}



function draw(e){

const rect = paintCanvas.getBoundingClientRect()

const x = e.clientX - rect.left
const y = e.clientY - rect.top

ctx.lineWidth = brushSize
ctx.lineCap = "round"
ctx.strokeStyle = brushColor

ctx.lineTo(x,y)
ctx.stroke()
ctx.beginPath()
ctx.moveTo(x,y)

playBrushSound()

updateTexture()

}



// ================= UPDATE TEXTURE =================

function updateTexture(){

if(texture){

texture.needsUpdate = true

}

}



// ================= BRUSH SETTINGS =================

export function setBrushColor(color){

brushColor = color

}



export function setBrushSize(size){

brushSize = size

}



// ================= CLEAR =================

export function clearPaint(){

ctx.clearRect(0,0,paintCanvas.width,paintCanvas.height)

ctx.fillStyle = "#ffffff"

ctx.fillRect(0,0,paintCanvas.width,paintCanvas.height)

updateTexture()

}



// ================= EXPORT =================

export function exportTexture(){

return paintCanvas.toDataURL("image/png")

}
