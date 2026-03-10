// ================= IMPORT =================

import { on, emit } from "../core/events.js"
import { getCurrentModel } from "./viewer.js"
import { playTextureSound } from "../audio/editor-sounds.js"

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"



// ================= GLOBAL =================

let currentMaterial = null
let textureCanvas
let ctx
let texture



// ================= INIT =================

export function initTextureEditor(){

textureCanvas = document.getElementById("texture-canvas")

if(textureCanvas){

ctx = textureCanvas.getContext("2d")

textureCanvas.width = 1024
textureCanvas.height = 1024

texture = new THREE.CanvasTexture(textureCanvas)

}

listenTextureEvents()

}



// ================= EVENTS =================

function listenTextureEvents(){

on("texture:apply-color", applyColor)

on("texture:apply-style", applyStyle)

on("texture:reset", resetTexture)

}



// ================= GET TARGET =================

function getTargetMesh(){

const model = getCurrentModel()

if(!model) return null

let mesh = null

model.traverse(obj => {

if(obj.isMesh && !mesh){

mesh = obj

}

})

return mesh

}



// ================= APPLY COLOR =================

function applyColor(color){

const mesh = getTargetMesh()

if(!mesh) return

if(!mesh.material) return

mesh.material.color = new THREE.Color(color)

mesh.material.needsUpdate = true

playTextureSound()

emit("texture:updated")

}



// ================= APPLY STYLE =================

function applyStyle(style){

const mesh = getTargetMesh()

if(!mesh) return

switch(style){

case "gold":

applyMaterial(mesh,{
color:"#d4af37",
metalness:1,
roughness:0.2
})

break

case "metal":

applyMaterial(mesh,{
color:"#888888",
metalness:0.9,
roughness:0.4
})

break

case "plastic":

applyMaterial(mesh,{
color:"#ffffff",
metalness:0.1,
roughness:0.8
})

break

case "glass":

applyMaterial(mesh,{
color:"#a0d8ff",
metalness:0,
roughness:0,
transparent:true,
opacity:0.5
})

break

case "wood":

generateWoodTexture(mesh)

break

}

emit("texture:updated")

playTextureSound()

}



// ================= APPLY MATERIAL =================

function applyMaterial(mesh,props){

mesh.material = new THREE.MeshStandardMaterial({

color: props.color || "#ffffff",
metalness: props.metalness || 0,
roughness: props.roughness || 1,
transparent: props.transparent || false,
opacity: props.opacity || 1

})

mesh.material.needsUpdate = true

}



// ================= WOOD TEXTURE =================

function generateWoodTexture(mesh){

ctx.fillStyle = "#8b5a2b"

ctx.fillRect(0,0,textureCanvas.width,textureCanvas.height)

for(let i=0;i<200;i++){

ctx.strokeStyle = "rgba(0,0,0,0.05)"

ctx.beginPath()

ctx.moveTo(Math.random()*1024,0)

ctx.lineTo(Math.random()*1024,1024)

ctx.stroke()

}

texture.needsUpdate = true

mesh.material.map = texture

mesh.material.needsUpdate = true

}



// ================= RESET =================

function resetTexture(){

const mesh = getTargetMesh()

if(!mesh) return

mesh.material = new THREE.MeshStandardMaterial({

color:"#ffffff"

})

mesh.material.needsUpdate = true

emit("texture:reset")

}



// ================= EXPORT TEXTURE =================

export function exportTexture(){

if(!textureCanvas) return null

return textureCanvas.toDataURL("image/png")

}
