// ================= IMPORTS =================

import * as THREE from "/assets/libs/three.js"
import { emit } from "../core/events.js"
import { logAI } from "../utils/AILogger.js"


// ================= STATE =================

let sketchCanvas
let sketchContext
let sketchTexture

let drawing = false

let lineColor = "#00ffff"
let lineWidth = 4


// ================= INIT =================

export function initSketch(model){

sketchCanvas = document.createElement("canvas")

sketchCanvas.width = 1024
sketchCanvas.height = 1024

sketchContext = sketchCanvas.getContext("2d")

sketchContext.clearRect(0,0,1024,1024)

sketchTexture = new THREE.CanvasTexture(sketchCanvas)

applySketchTexture(model)

logAI("Sketch system initialized")

}


// ================= APPLY TEXTURE =================

function applySketchTexture(model){

model.traverse((child)=>{

if(child.isMesh){

child.material.map = sketchTexture
child.material.needsUpdate = true

}

})

}


// ================= START DRAW =================

export function startSketch(x,y){

drawing = true

sketchContext.beginPath()

sketchContext.moveTo(x,y)

}


// ================= DRAW LINE =================

export function drawSketch(x,y){

if(!drawing) return

sketchContext.strokeStyle = lineColor
sketchContext.lineWidth = lineWidth

sketchContext.lineTo(x,y)

sketchContext.stroke()

sketchTexture.needsUpdate = true

emit("sketch:drawing")

}


// ================= STOP DRAW =================

export function stopSketch(){

drawing = false

emit("sketch:complete")

}


// ================= COLOR =================

export function setSketchColor(color){

lineColor = color

}


// ================= LINE WIDTH =================

export function setSketchWidth(width){

lineWidth = width

}


// ================= DRAW SHAPES =================

export function drawShape(type,x,y,size){

sketchContext.strokeStyle = lineColor
sketchContext.lineWidth = lineWidth

if(type === "circle"){

sketchContext.beginPath()
sketchContext.arc(x,y,size,0,Math.PI*2)
sketchContext.stroke()

}

if(type === "square"){

sketchContext.strokeRect(x-size,y-size,size*2,size*2)

}

if(type === "triangle"){

sketchContext.beginPath()

sketchContext.moveTo(x,y-size)

sketchContext.lineTo(x-size,y+size)

sketchContext.lineTo(x+size,y+size)

sketchContext.closePath()

sketchContext.stroke()

}

sketchTexture.needsUpdate = true

emit("sketch:shape")

}


// ================= CLEAR =================

export function clearSketch(){

sketchContext.clearRect(0,0,1024,1024)

sketchTexture.needsUpdate = true

emit("sketch:cleared")

}


// ================= EXPORT =================

export function exportSketch(){

const dataURL = sketchCanvas.toDataURL()

emit("sketch:export", dataURL)

return dataURL

}
