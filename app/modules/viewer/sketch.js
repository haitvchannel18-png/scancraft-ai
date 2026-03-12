// modules/viewer/sketch.js

import { EventBus } from "../core/events.js"

let canvas
let ctx

let drawing = false
let tool = "pen"

let color = "#00ffff"
let lineWidth = 3

let startX = 0
let startY = 0

let history = []
let redoStack = []

export function initSketch(targetCanvas){

canvas = targetCanvas

ctx = canvas.getContext("2d")

resizeCanvas()

window.addEventListener("resize",resizeCanvas)

attachEvents()

EventBus.emit("sketchReady")

}



function resizeCanvas(){

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

}



function attachEvents(){

canvas.addEventListener("mousedown",startDraw)
canvas.addEventListener("mousemove",draw)
canvas.addEventListener("mouseup",stopDraw)

canvas.addEventListener("touchstart",startDraw)
canvas.addEventListener("touchmove",draw)
canvas.addEventListener("touchend",stopDraw)

}



function startDraw(e){

drawing = true

const pos = getPointer(e)

startX = pos.x
startY = pos.y

saveHistory()

if(tool === "pen"){

ctx.beginPath()
ctx.moveTo(startX,startY)

}

}



function draw(e){

if(!drawing) return

const pos = getPointer(e)

ctx.strokeStyle = color
ctx.lineWidth = lineWidth

if(tool === "pen"){

ctx.lineTo(pos.x,pos.y)
ctx.stroke()

}

else{

redrawHistory()

drawShape(pos.x,pos.y)

}

}



function stopDraw(){

drawing = false

ctx.beginPath()

EventBus.emit("sketchStroke")

}



function drawShape(x,y){

ctx.beginPath()

if(tool === "line"){

ctx.moveTo(startX,startY)
ctx.lineTo(x,y)

}

if(tool === "rectangle"){

ctx.rect(startX,startY,x-startX,y-startY)

}

if(tool === "circle"){

const radius = Math.hypot(x-startX,y-startY)

ctx.arc(startX,startY,radius,0,Math.PI*2)

}

ctx.stroke()

}



function redrawHistory(){

ctx.clearRect(0,0,canvas.width,canvas.height)

history.forEach(img=>{

ctx.drawImage(img,0,0)

})

}



function saveHistory(){

const img = new Image()

img.src = canvas.toDataURL()

history.push(img)

redoStack = []

}



function getPointer(e){

const rect = canvas.getBoundingClientRect()

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



export function setTool(newTool){

tool = newTool

}



export function setColor(newColor){

color = newColor

}



export function setLineWidth(size){

lineWidth = size

}



export function undo(){

if(history.length === 0) return

redoStack.push(history.pop())

redrawHistory()

}



export function redo(){

if(redoStack.length === 0) return

history.push(redoStack.pop())

redrawHistory()

}



export function clearSketch(){

ctx.clearRect(0,0,canvas.width,canvas.height)

history = []
redoStack = []

}



export function exportSketch(){

return canvas.toDataURL("image/png")

}
