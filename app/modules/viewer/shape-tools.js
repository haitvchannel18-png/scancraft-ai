// modules/viewer/shape-tools.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let ctx = null
let startX = 0
let startY = 0
let drawing = false

let shapeColor = "#ff0000"
let lineWidth = 3

export function initShapeTools(context){

ctx = context

EventBus.emit("shapeToolsReady")

}



export function setShapeColor(color){

shapeColor = color

}



export function setLineWidth(width){

lineWidth = width

}



export function startShape(x,y){

startX = x
startY = y
drawing = true

}



export function endShape(){

drawing = false

}



export function drawRectangle(x,y){

if(!drawing || !ctx) return

ctx.strokeStyle = shapeColor
ctx.lineWidth = lineWidth

const width = x - startX
const height = y - startY

ctx.strokeRect(startX,startY,width,height)

}



export function drawCircle(x,y){

if(!drawing || !ctx) return

ctx.strokeStyle = shapeColor
ctx.lineWidth = lineWidth

const radius = Math.sqrt(
Math.pow(x-startX,2) + Math.pow(y-startY,2)
)

ctx.beginPath()
ctx.arc(startX,startY,radius,0,Math.PI*2)
ctx.stroke()

}



export function drawLine(x,y){

if(!drawing || !ctx) return

ctx.strokeStyle = shapeColor
ctx.lineWidth = lineWidth

ctx.beginPath()
ctx.moveTo(startX,startY)
ctx.lineTo(x,y)
ctx.stroke()

}



export function drawArrow(x,y){

if(!drawing || !ctx) return

drawLine(x,y)

const angle = Math.atan2(y-startY,x-startX)
const headLength = 10

ctx.beginPath()
ctx.moveTo(x,y)

ctx.lineTo(
x-headLength*Math.cos(angle-Math.PI/6),
y-headLength*Math.sin(angle-Math.PI/6)
)

ctx.moveTo(x,y)

ctx.lineTo(
x-headLength*Math.cos(angle+Math.PI/6),
y-headLength*Math.sin(angle+Math.PI/6)
)

ctx.stroke()

}



export function drawPolygon(points){

if(!ctx || points.length < 3) return

ctx.strokeStyle = shapeColor
ctx.lineWidth = lineWidth

ctx.beginPath()

ctx.moveTo(points[0].x,points[0].y)

points.forEach(p=>{
ctx.lineTo(p.x,p.y)
})

ctx.closePath()
ctx.stroke()

logAI("PolygonDrawn",points)

EventBus.emit("polygonDrawn")

}
