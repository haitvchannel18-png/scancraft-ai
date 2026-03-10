// ================= IMPORTS =================

import * as THREE from "/assets/libs/three.js"
import { emit } from "../core/events.js"
import { logAI } from "../utils/AILogger.js"

let currentModel = null
let currentMaterial = null


// ================= INIT =================

export function initTextureEditor(model){

currentModel = model

logAI("Texture editor initialized")

}


// ================= APPLY BASIC COLOR =================

export function applyColor(color){

if(!currentModel) return

currentModel.traverse((child)=>{

if(child.isMesh){

child.material.color = new THREE.Color(color)

child.material.needsUpdate = true

}

})

emit("texture:color-applied", color)

}


// ================= APPLY IMAGE TEXTURE =================

export function applyTexture(imageURL){

if(!currentModel) return

const loader = new THREE.TextureLoader()

loader.load(imageURL,(texture)=>{

currentModel.traverse((child)=>{

if(child.isMesh){

child.material.map = texture
child.material.needsUpdate = true

}

})

emit("texture:image-applied", imageURL)

})

}


// ================= MATERIAL PRESETS =================

export function applyMaterialPreset(type){

if(!currentModel) return

currentModel.traverse((child)=>{

if(!child.isMesh) return

if(type === "metal"){

child.material.metalness = 1
child.material.roughness = 0.2

}

if(type === "plastic"){

child.material.metalness = 0.2
child.material.roughness = 0.7

}

if(type === "wood"){

child.material.metalness = 0.1
child.material.roughness = 0.9

}

child.material.needsUpdate = true

})

emit("texture:preset", type)

}


// ================= PATTERN TEXTURE =================

export function applyPattern(patternURL){

const loader = new THREE.TextureLoader()

loader.load(patternURL,(texture)=>{

texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping

texture.repeat.set(4,4)

currentModel.traverse((child)=>{

if(child.isMesh){

child.material.map = texture
child.material.needsUpdate = true

}

})

emit("texture:pattern")

})

}


// ================= REMOVE TEXTURE =================

export function removeTexture(){

currentModel.traverse((child)=>{

if(child.isMesh){

child.material.map = null
child.material.needsUpdate = true

}

})

emit("texture:removed")

}


// ================= TEXTURE ROTATION =================

export function rotateTexture(angle){

currentModel.traverse((child)=>{

if(child.isMesh && child.material.map){

child.material.map.rotation = angle
child.material.map.needsUpdate = true

}

})

emit("texture:rotated", angle)

}


// ================= TEXTURE SCALE =================

export function scaleTexture(scale){

currentModel.traverse((child)=>{

if(child.isMesh && child.material.map){

child.material.map.repeat.set(scale,scale)
child.material.map.needsUpdate = true

}

})

emit("texture:scaled", scale)

}


// ================= EXPORT MODEL =================

export function exportModel(){

if(!currentModel) return null

const exporter = new THREE.GLTFExporter()

exporter.parse(

currentModel,

(result)=>{

emit("texture:model-export", result)

},

{binary:true}

)

}
