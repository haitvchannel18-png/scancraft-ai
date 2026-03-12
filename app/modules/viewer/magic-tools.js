// modules/viewer/magic-tools.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let ctx = null
let tolerance = 40

export function initMagicTools(context){
ctx = context
EventBus.emit("magicToolsReady")
}



export function setTolerance(value){
tolerance = value
}



export function magicFill(x,y,color){

if(!ctx) return

const canvas = ctx.canvas
const image = ctx.getImageData(0,0,canvas.width,canvas.height)
const data = image.data

const startIndex = getPixelIndex(x,y,canvas.width)

const targetColor = [
data[startIndex],
data[startIndex+1],
data[startIndex+2],
data[startIndex+3]
]

const fillColor = hexToRGBA(color)

floodFill(data,canvas.width,canvas.height,x,y,targetColor,fillColor)

ctx.putImageData(image,0,0)

EventBus.emit("magicFillApplied")

logAI("MagicFill", {x,y,color})

}



export function magicErase(x,y){

if(!ctx) return

const canvas = ctx.canvas
const image = ctx.getImageData(0,0,canvas.width,canvas.height)
const data = image.data

const startIndex = getPixelIndex(x,y,canvas.width)

const targetColor = [
data[startIndex],
data[startIndex+1],
data[startIndex+2],
data[startIndex+3]
]

floodFill(data,canvas.width,canvas.height,x,y,targetColor,[0,0,0,0])

ctx.putImageData(image,0,0)

EventBus.emit("magicEraseApplied")

logAI("MagicErase", {x,y})

}



function floodFill(data,width,height,x,y,targetColor,fillColor){

const stack = [[x,y]]

while(stack.length){

const [cx,cy] = stack.pop()

if(cx<0 || cy<0 || cx>=width || cy>=height) continue

const index = getPixelIndex(cx,cy,width)

if(!colorMatch(data,index,targetColor)) continue

data[index] = fillColor[0]
data[index+1] = fillColor[1]
data[index+2] = fillColor[2]
data[index+3] = fillColor[3]

stack.push([cx+1,cy])
stack.push([cx-1,cy])
stack.push([cx,cy+1])
stack.push([cx,cy-1])

}

}



function getPixelIndex(x,y,width){
return (y*width + x) * 4
}



function colorMatch(data,index,target){

const r = data[index]
const g = data[index+1]
const b = data[index+2]

return (
Math.abs(r-target[0]) < tolerance &&
Math.abs(g-target[1]) < tolerance &&
Math.abs(b-target[2]) < tolerance
)

}



function hexToRGBA(hex){

let c = hex.replace("#","")

const bigint = parseInt(c,16)

return [
(bigint>>16)&255,
(bigint>>8)&255,
bigint&255,
255
]

}
