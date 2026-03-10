// ================= IMPORT =================

import { on, emit } from "../core/events.js"
import { getCurrentModel } from "./viewer.js"
import { playTextureSound } from "../audio/editor-sounds.js"

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"



// ================= GLOBAL =================

let targetObject = null



// ================= INIT =================

export function initObjectModifier(){

listenModifierEvents()

}



// ================= EVENTS =================

function listenModifierEvents(){

on("object:modify:scale", scaleObject)
on("object:modify:rotate", rotateObject)
on("object:modify:move", moveObject)
on("object:modify:duplicate", duplicateObject)
on("object:modify:reset", resetObject)

}



// ================= GET TARGET =================

function getTarget(){

const model = getCurrentModel()

if(!model) return null

targetObject = model

return targetObject

}



// ================= SCALE =================

function scaleObject(data){

const obj = getTarget()

if(!obj) return

const factor = data?.factor || 1.2

obj.scale.multiplyScalar(factor)

emit("object:scaled", obj)

playTextureSound()

}



// ================= ROTATE =================

function rotateObject(data){

const obj = getTarget()

if(!obj) return

const axis = data?.axis || "y"
const angle = data?.angle || 0.3

obj.rotation[axis] += angle

emit("object:rotated", obj)

playTextureSound()

}



// ================= MOVE =================

function moveObject(data){

const obj = getTarget()

if(!obj) return

obj.position.x += data?.x || 0
obj.position.y += data?.y || 0
obj.position.z += data?.z || 0

emit("object:moved", obj)

playTextureSound()

}



// ================= DUPLICATE =================

function duplicateObject(){

const obj = getTarget()

if(!obj) return

const clone = obj.clone(true)

clone.position.x += 1

obj.parent.add(clone)

emit("object:duplicated", clone)

playTextureSound()

}



// ================= RESET =================

function resetObject(){

const obj = getTarget()

if(!obj) return

obj.position.set(0,0,0)

obj.rotation.set(0,0,0)

obj.scale.set(1,1,1)

emit("object:reset", obj)

}



// ================= EXPORT TRANSFORM =================

export function getObjectTransform(){

const obj = getTarget()

if(!obj) return null

return {

position: obj.position.clone(),
rotation: obj.rotation.clone(),
scale: obj.scale.clone()

}

}
