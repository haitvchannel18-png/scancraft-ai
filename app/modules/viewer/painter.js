// modules/viewer/painter.js

import { EventBus } from "../core/events.js"

let THREE = window.THREE

let paintCanvas
let paintCtx
let texture
let targetMesh = null

let painting = false
let brushSize = 10
let brushColor = "#ff0000"
let opacity = 1

export function initPainter(model){

targetMesh = findPaintableMesh(model)

if(!targetMesh){
console.warn("No paintable mesh found")
return
}

createTextureCanvas()

applyTexture()

EventBus.emit("painterReady")

}



function findPaintableMesh(model){

let mesh = null

model.traverse(child=>{
if(child.isMesh && !mesh){
mesh = child
}
})

return mesh

}



function createTextureCanvas(){

paintCanvas = document.createElement("canvas")
paintCanvas.width = 1024
paintCanvas.height = 1024

paintCtx = paintCanvas.getContext("2d")

paintCtx.fillStyle = "#ffffff"
paintCtx.fillRect(0,0,paintCanvas.width,paintCanvas.height)

texture = new THREE.CanvasTexture(paintCanvas)

}



function applyTexture(){

targetMesh.material.map = texture
targetMesh.material.needsUpdate = true

}



export function attachPainterControls(canvas){

canvas.addEventListener("mousedown",startPaint)
canvas.addEventListener("mousemove",paint)
canvas.addEventListener("mouseup",stopPaint)

canvas.addEventListener("touchstart",startPaint)
canvas.addEventListener("touchmove",paint)
canvas.addEventListener("touchend",stopPaint)

}



function startPaint(e){

painting = true

const pos = getPointer(e)

draw(pos.x,pos.y)

}



function paint(e){

if(!painting) return

const pos = getPointer(e)

draw(pos.x,pos.y)

}



function stopPaint(){

painting = false

}



function draw(x,y){

paintCtx.globalAlpha = opacity
paintCtx.fillStyle = brushColor

paintCtx.beginPath()
paintCtx.arc(x,y,brushSize,0,Math.PI*2)
paintCtx.fill()

texture.needsUpdate = true

EventBus.emit("paintStroke",{x,y})

}



function getPointer(e){

const rect = e.target.getBoundingClientRect()

let x
let y

if(e.touches){

x = e.touches[0].clientX - rect.left
y = e.touches[0].clientY - rect.top

}else{

x = e.clientX - rect.left
y = e.clientY - rect.top

}

return {x,y}

}



export function setBrushColor(color){

brushColor = color

EventBus.emit("brushColorChanged",color)

}



export function setBrushSize(size){

brushSize = size

EventBus.emit("brushSizeChanged",size)

}



export function setOpacity(value){

opacity = value

}



export function clearPaint(){

paintCtx.clearRect(0,0,paintCanvas.width,paintCanvas.height)

paintCtx.fillStyle = "#ffffff"
paintCtx.fillRect(0,0,paintCanvas.width,paintCanvas.height)

texture.needsUpdate = true

EventBus.emit("paintCleared")

}



export function exportTexture(){

return paintCanvas.toDataURL("image/png")

}
