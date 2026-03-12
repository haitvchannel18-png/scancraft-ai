// modules/viewer/brush-engine.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let ctx = null
let currentBrush = "soft"
let brushSize = 8
let brushColor = "#ff0000"
let opacity = 1

export function initBrushEngine(canvasContext){

ctx = canvasContext

EventBus.emit("brushEngineReady")

}



export function setBrush(type){

currentBrush = type

EventBus.emit("brushChanged",type)

}



export function setBrushSize(size){

brushSize = size

}



export function setBrushColor(color){

brushColor = color

}



export function setOpacity(value){

opacity = value

}



export function drawStroke(x,y,prevX,prevY){

if(!ctx) return

ctx.lineCap = "round"
ctx.lineJoin = "round"
ctx.globalAlpha = opacity
ctx.strokeStyle = brushColor
ctx.lineWidth = brushSize

switch(currentBrush){

case "soft":
drawSoft(x,y,prevX,prevY)
break

case "hard":
drawHard(x,y,prevX,prevY)
break

case "spray":
drawSpray(x,y)
break

case "eraser":
erase(x,y)
break

default:
drawSoft(x,y,prevX,prevY)

}

}



function drawSoft(x,y,px,py){

ctx.beginPath()

ctx.moveTo(px,py)
ctx.lineTo(x,y)

ctx.shadowBlur = brushSize
ctx.shadowColor = brushColor

ctx.stroke()

}



function drawHard(x,y,px,py){

ctx.beginPath()

ctx.moveTo(px,py)
ctx.lineTo(x,y)

ctx.shadowBlur = 0

ctx.stroke()

}



function drawSpray(x,y){

for(let i=0;i<20;i++){

const offsetX = (Math.random()-0.5) * brushSize * 2
const offsetY = (Math.random()-0.5) * brushSize * 2

ctx.fillStyle = brushColor

ctx.fillRect(x+offsetX,y+offsetY,1,1)

}

}



function erase(x,y){

ctx.clearRect(x-brushSize/2,y-brushSize/2,brushSize,brushSize)

}



export function getBrushState(){

return {

type: currentBrush,
size: brushSize,
color: brushColor,
opacity: opacity

}

}
