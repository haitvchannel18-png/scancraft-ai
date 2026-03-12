// modules/viewer/object-modifier.js

import { EventBus } from "../core/events.js"

let THREE = window.THREE

let scene = null
let selectedObject = null

export function initObjectModifier(viewerScene){

scene = viewerScene

EventBus.emit("objectModifierReady")

}



export function selectObject(object){

selectedObject = object

EventBus.emit("objectSelected",object)

}



export function moveObject(x,y,z){

if(!selectedObject) return

selectedObject.position.x += x
selectedObject.position.y += y
selectedObject.position.z += z

EventBus.emit("objectMoved",selectedObject)

}



export function rotateObject(rx,ry,rz){

if(!selectedObject) return

selectedObject.rotation.x += rx
selectedObject.rotation.y += ry
selectedObject.rotation.z += rz

EventBus.emit("objectRotated",selectedObject)

}



export function scaleObject(scale){

if(!selectedObject) return

selectedObject.scale.set(
selectedObject.scale.x * scale,
selectedObject.scale.y * scale,
selectedObject.scale.z * scale
)

EventBus.emit("objectScaled",selectedObject)

}



export function setScale(x,y,z){

if(!selectedObject) return

selectedObject.scale.set(x,y,z)

EventBus.emit("objectScaled",selectedObject)

}



export function duplicateObject(){

if(!selectedObject || !scene) return

const clone = selectedObject.clone()

clone.position.x += 0.2

scene.add(clone)

EventBus.emit("objectDuplicated",clone)

return clone

}



export function deleteObject(){

if(!selectedObject || !scene) return

scene.remove(selectedObject)

EventBus.emit("objectDeleted",selectedObject)

selectedObject = null

}



export function resetTransform(){

if(!selectedObject) return

selectedObject.position.set(0,0,0)
selectedObject.rotation.set(0,0,0)
selectedObject.scale.set(1,1,1)

EventBus.emit("objectReset",selectedObject)

}



export function getSelectedObject(){

return selectedObject

}



export function setPosition(x,y,z){

if(!selectedObject) return

selectedObject.position.set(x,y,z)

EventBus.emit("objectMoved",selectedObject)

}



export function setRotation(x,y,z){

if(!selectedObject) return

selectedObject.rotation.set(x,y,z)

EventBus.emit("objectRotated",selectedObject)

}
