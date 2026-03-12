// modules/viewer/painter.js

import { EventBus } from "../core/events.js"
import { getActiveTool } from "./tool-manager.js"
import { drawStroke } from "./brush-engine.js"
import { startShape, drawRectangle, drawCircle, drawLine, drawArrow, endShape } from "./shape-tools.js"
import { magicFill, magicErase } from "./magic-tools.js"
import { getColor } from "./color-tools.js"
import { logAI } from "../utils/ai-logger.js"

let canvas = null
let ctx = null

let drawing = false
let prevX = 0
let prevY = 0

export function initPainter(targetCanvas){

canvas = targetCanvas
ctx = canvas.getContext("2d")

attachEvents()

EventBus.emit("painterReady")

}



function attachEvents(){

canvas.addEventListener("mousedown",onPointerDown)
canvas.addEventListener("mousemove",onPointerMove)
canvas.addEventListener("mouseup",onPointerUp)

canvas.addEventListener("touchstart",touchStart)
canvas.addEventListener("touchmove",touchMove)
canvas.addEventListener("touchend",onPointerUp)

}



function onPointerDown(e){

const {x,y} = getPos(e)

const tool = getActiveTool()

drawing = true

prevX = x
prevY = y

if(tool === "shape"){
startShape(x,y)
}

if(tool === "magic"){
magicFill(x,y,getColor())
}

if(tool === "eraser"){
magicErase(x,y)
}

EventBus.emit("paintStart",{x,y,tool})

}



function onPointerMove(e){

if(!drawing) return

const {x,y} = getPos(e)

const tool = getActiveTool()

switch(tool){

case "brush":

drawStroke(x,y,prevX,prevY)
break

case "shape":

drawRectangle(x,y)
break

case "line":

drawLine(x,y)
break

case "circle":

drawCircle(x,y)
break

case "arrow":

drawArrow(x,y)
break

}

prevX = x
prevY = y

EventBus.emit("paintMove",{x,y,tool})

}



function onPointerUp(){

drawing = false

endShape()

EventBus.emit("paintEnd")

}



function touchStart(e){

const touch = e.touches[0]

onPointerDown({
clientX: touch.clientX,
clientY: touch.clientY
})

}



function touchMove(e){

const touch = e.touches[0]

onPointerMove({
clientX: touch.clientX,
clientY: touch.clientY
})

}



function getPos(e){

const rect = canvas.getBoundingClientRect()

return {

x: e.clientX - rect.left,
y: e.clientY - rect.top

}

}



export function clearCanvas(){

ctx.clearRect(0,0,canvas.width,canvas.height)

EventBus.emit("canvasCleared")

}



export function getCanvas(){
return canvas
}
