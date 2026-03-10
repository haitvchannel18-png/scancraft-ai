// ================= IMPORTS =================

import * as THREE from "/assets/libs/three.js"
import { initViewer, loadModel, rotateModel, scaleModel } from "./model-loader.js"
import { emit } from "../core/events.js"
import { logAI } from "../utils/AILogger.js"


// ================= STATE =================

let container
let touchStartX = 0
let touchStartY = 0
let zoomLevel = 1
let rotateSpeed = 0.01

let autoRotate = false


// ================= INIT =================

export function startViewer(containerElement){

container = containerElement

initViewer(container)

logAI("3D viewer started")

emit("viewer:ready")

setupGestures()

}


// ================= LOAD OBJECT MODEL =================

export function showObjectModel(objectName){

logAI("Viewer loading object: " + objectName)

loadModel(objectName)

emit("viewer:object-show", objectName)

}


// ================= ROTATION CONTROL =================

export function enableAutoRotate(){

autoRotate = true

}

export function disableAutoRotate(){

autoRotate = false

}


// ================= ZOOM CONTROL =================

export function zoomIn(){

zoomLevel += 0.2

scaleModel(zoomLevel)

}

export function zoomOut(){

zoomLevel -= 0.2

if(zoomLevel < 0.2) zoomLevel = 0.2

scaleModel(zoomLevel)

}


// ================= TOUCH GESTURES =================

function setupGestures(){

container.addEventListener("touchstart",handleTouchStart)

container.addEventListener("touchmove",handleTouchMove)

container.addEventListener("wheel",handleMouseWheel)

}


// ================= TOUCH START =================

function handleTouchStart(event){

const touch = event.touches[0]

touchStartX = touch.clientX
touchStartY = touch.clientY

}


// ================= TOUCH MOVE =================

function handleTouchMove(event){

const touch = event.touches[0]

const dx = touch.clientX - touchStartX

rotateModel(dx * 0.002)

touchStartX = touch.clientX

}


// ================= MOUSE WHEEL =================

function handleMouseWheel(event){

if(event.deltaY < 0){

zoomIn()

}else{

zoomOut()

}

}


// ================= UPDATE LOOP =================

export function viewerUpdate(){

if(autoRotate){

rotateModel(rotateSpeed)

}

}


// ================= VIEWER RESET =================

export function resetViewer(){

zoomLevel = 1

scaleModel(1)

autoRotate = false

emit("viewer:reset")

}


// ================= ENTER PAINT MODE =================

export function enterPaintMode(){

emit("viewer:paint-mode")

}


// ================= ENTER EDIT MODE =================

export function enterEditMode(){

emit("viewer:edit-mode")

}
