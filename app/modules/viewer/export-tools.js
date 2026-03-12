// modules/viewer/export-tools.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

export function exportPNG(canvas,filename="scancraft-export"){

try{

const link = document.createElement("a")

link.download = filename + ".png"

link.href = canvas.toDataURL("image/png")

link.click()

EventBus.emit("exportPNG",filename)

logAI("ExportPNG",filename)

}catch(err){

console.error("PNG export error",err)

}

}



export function exportJPG(canvas,filename="scancraft-export"){

try{

const link = document.createElement("a")

link.download = filename + ".jpg"

link.href = canvas.toDataURL("image/jpeg",0.9)

link.click()

EventBus.emit("exportJPG",filename)

logAI("ExportJPG",filename)

}catch(err){

console.error("JPG export error",err)

}

}



export function exportTexture(canvas){

try{

const texture = canvas.toDataURL("image/png")

EventBus.emit("textureExported",texture)

logAI("TextureExport","texture generated")

return texture

}catch(err){

console.error("Texture export error",err)

return null

}

}



export function captureCanvas(canvas){

try{

const data = canvas.toDataURL("image/png")

EventBus.emit("canvasCaptured")

return data

}catch(err){

console.error("Canvas capture error",err)

return null

}

}



export function shareImage(canvas){

try{

const data = canvas.toDataURL("image/png")

if(navigator.share){

fetch(data)
.then(res => res.blob())
.then(blob => {

const file = new File([blob],"scancraft.png",{type:"image/png"})

navigator.share({

title:"ScanCraft Creation",
files:[file]

})

})

}

EventBus.emit("imageShared")

}catch(err){

console.error("Share error",err)

}

}
