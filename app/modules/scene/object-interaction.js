// modules/scene/object-interaction.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let activeObjects = []
let selectedObject = null

export function registerSceneObjects(objects){

try{

activeObjects = objects || []

EventBus.emit("sceneObjectsRegistered",activeObjects)

logAI("SceneObjects",activeObjects)

}catch(err){
console.error("Object registration error",err)
}

}



export function handleSceneClick(x,y){

try{

const target = findObjectAtPosition(x,y)

if(!target){
return null
}

selectedObject = target

EventBus.emit("sceneObjectSelected",target)

logAI("ObjectSelected",target)

return target

}catch(err){

console.error("Scene click error",err)

return null

}

}



function findObjectAtPosition(x,y){

for(const obj of activeObjects){

const b = obj.bbox

if(
x >= b.x &&
x <= b.x + b.width &&
y >= b.y &&
y <= b.y + b.height
){
return obj
}

}

return null

}



export function getSelectedObject(){
return selectedObject
}



export function clearSelection(){

selectedObject = null

EventBus.emit("sceneObjectDeselected")

}
