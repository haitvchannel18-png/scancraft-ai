// modules/viewer/layer-system.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let layers = []
let activeLayerId = null

export function initLayerSystem(canvas){

layers = []

createLayer("base",canvas)

EventBus.emit("layerSystemReady")

}



export function createLayer(name,canvas){

const layer = {

id: generateId(),
name: name || "layer",
canvas: canvas || document.createElement("canvas"),
visible: true,
opacity: 1,
type: "paint"

}

layers.push(layer)

activeLayerId = layer.id

EventBus.emit("layerCreated",layer)

logAI("LayerCreated",layer)

return layer

}



export function getLayers(){
return layers
}



export function setActiveLayer(id){

activeLayerId = id

EventBus.emit("activeLayerChanged",id)

}



export function getActiveLayer(){

return layers.find(l => l.id === activeLayerId)

}



export function toggleLayerVisibility(id){

const layer = layers.find(l => l.id === id)

if(!layer) return

layer.visible = !layer.visible

EventBus.emit("layerVisibilityChanged",layer)

}



export function setLayerOpacity(id,value){

const layer = layers.find(l => l.id === id)

if(!layer) return

layer.opacity = value

EventBus.emit("layerOpacityChanged",layer)

}



export function deleteLayer(id){

layers = layers.filter(l => l.id !== id)

EventBus.emit("layerDeleted",id)

}



export function mergeLayers(){

if(layers.length < 2) return

const base = layers[0]

const ctx = base.canvas.getContext("2d")

for(let i=1;i<layers.length;i++){

const layer = layers[i]

if(!layer.visible) continue

ctx.globalAlpha = layer.opacity

ctx.drawImage(layer.canvas,0,0)

}

layers = [base]

activeLayerId = base.id

EventBus.emit("layersMerged")

}



function generateId(){

return "layer_" + Math.random().toString(36).substr(2,9)

}
