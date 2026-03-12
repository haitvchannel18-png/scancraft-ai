// modules/viewer/color-tools.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let currentColor = "#ff0000"
let palette = []
let gradient = null

export function setColor(color){

currentColor = color

EventBus.emit("colorChanged",color)

}



export function getColor(){

return currentColor

}



export function generatePalette(baseColor){

palette = []

for(let i=0;i<5;i++){

palette.push(adjustColor(baseColor,i*20))

}

EventBus.emit("paletteGenerated",palette)

logAI("Palette",palette)

return palette

}



function adjustColor(color,amount){

let usePound = false

if(color[0] === "#"){

color = color.slice(1)

usePound = true

}

const num = parseInt(color,16)

let r = (num >> 16) + amount
let g = ((num >> 8) & 0x00FF) + amount
let b = (num & 0x0000FF) + amount

r = Math.min(255,Math.max(0,r))
g = Math.min(255,Math.max(0,g))
b = Math.min(255,Math.max(0,b))

return (usePound?"#":"") + ((r<<16)|(g<<8)|b).toString(16).padStart(6,"0")

}



export function createGradient(colorA,colorB){

gradient = {

start: colorA,
end: colorB

}

EventBus.emit("gradientCreated",gradient)

return gradient

}



export function getGradient(){

return gradient

}



export function aiSuggestColors(objectLabel){

const suggestions = []

switch(objectLabel){

case "chair":

suggestions.push("#8B4513","#A0522D","#DEB887")
break

case "car":

suggestions.push("#000000","#FF0000","#FFFFFF")
break

case "phone":

suggestions.push("#222222","#444444","#999999")
break

default:

suggestions.push("#FF5733","#33FFAA","#3366FF")

}

EventBus.emit("aiColorSuggestion",suggestions)

logAI("ColorSuggestions",suggestions)

return suggestions

}
