// ================= IMPORTS =================

import * as THREE from "/assets/libs/three.js"
import { emit } from "../core/events.js"
import { logAI } from "../utils/AILogger.js"


// ================= STATE =================

let paintCanvas
let paintContext
let paintTexture

let brushSize = 10
let brushColor = "#ff0000"

let paintingEnabled = false


// ================= INIT PAINT SYSTEM =================

export function initPainter(model){

paintCanvas = document.createElement("canvas")

paintCanvas.width = 1024
paintCanvas.height = 1024

paintContext = paintCanvas.getContext("2d")

paintContext.fillStyle = "#ffffff"
paintContext.fillRect(0,0,1024,1024)

paintTexture = new THREE.CanvasTexture(paintCanvas)

applyTextureToModel(model, paintTexture)

logAI("Painter initialized")

}


// ================= APPLY TEXTURE =================

function applyTextureToModel(model, texture){

model.traverse((child)=>{

if(child.isMesh){

child.material.map = texture
child.material.needsUpdate = true

}

})

}


// ================= ENABLE PAINT MODE =================

export function enablePainting(){

paintingEnabled = true

emit("painter:enabled")

}


// ================= DISABLE PAINT MODE =================

export function disablePainting(){

paintingEnabled = false

emit("painter:disabled")

}


// ================= SET BRUSH SIZE =================

export function setBrushSize(size){

brushSize = size

}


// ================= SET BRUSH COLOR =================

export function setBrushColor(color){

brushColor = color

}


// ================= PAINT STROKE =================

export function paint(x,y){

if(!paintingEnabled) return

paintContext.fillStyle = brushColor

paintContext.beginPath()

paintContext.arc(x,y,brushSize,0,Math.PI*2)

paintContext.fill()

paintTexture.needsUpdate = true

emit("painter:stroke")

}


// ================= CLEAR PAINT =================

export function clearPainting(){

paintContext.fillStyle = "#ffffff"

paintContext.fillRect(0,0,1024,1024)

paintTexture.needsUpdate = true

emit("painter:cleared")

}


// ================= EXPORT TEXTURE =================

export function exportPainting(){

const dataURL = paintCanvas.toDataURL()

emit("painter:export", dataURL)

return dataURL

}


// ================= BRUSH PRESETS =================

export function brushPreset(type){

if(type === "soft"){

brushSize = 20

}

if(type === "fine"){

brushSize = 5

}

if(type === "spray"){

brushSize = 30

}

}


// ================= RANDOM COLOR =================

export function randomColor(){

brushColor = "#" + Math.floor(Math.random()*16777215).toString(16)

}
