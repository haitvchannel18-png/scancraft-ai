// modules/viewer/texture-editor.js

import { EventBus } from "../core/events.js"

let THREE = window.THREE

let targetModel = null
let originalMaterials = new Map()

export function initTextureEditor(model){

targetModel = model

storeOriginalMaterials(model)

EventBus.emit("textureEditorReady")

}



function storeOriginalMaterials(model){

model.traverse(node=>{

if(node.isMesh){

originalMaterials.set(node.uuid,node.material.clone())

}

})

}



export function setColor(color){

if(!targetModel) return

targetModel.traverse(mesh=>{

if(mesh.isMesh){

mesh.material.color = new THREE.Color(color)
mesh.material.needsUpdate = true

}

})

EventBus.emit("textureChanged",{type:"color",value:color})

}



export function applyTexture(textureURL){

if(!targetModel) return

const loader = new THREE.TextureLoader()

loader.load(textureURL,texture=>{

targetModel.traverse(mesh=>{

if(mesh.isMesh){

mesh.material.map = texture
mesh.material.needsUpdate = true

}

})

EventBus.emit("textureChanged",{type:"texture",value:textureURL})

})

}



export function setMetallic(value){

targetModel.traverse(mesh=>{

if(mesh.isMesh){

mesh.material.metalness = value
mesh.material.needsUpdate = true

}

})

}



export function setRoughness(value){

targetModel.traverse(mesh=>{

if(mesh.isMesh){

mesh.material.roughness = value
mesh.material.needsUpdate = true

}

})

}



export function applyPreset(preset){

if(!targetModel) return

const presets = {

gold:{color:"#d4af37",metalness:1,roughness:0.2},
chrome:{color:"#eeeeee",metalness:1,roughness:0.05},
plastic:{color:"#ffffff",metalness:0.1,roughness:0.7},
matte:{color:"#dddddd",metalness:0,roughness:1}

}

const p = presets[preset]

if(!p) return

targetModel.traverse(mesh=>{

if(mesh.isMesh){

mesh.material.color = new THREE.Color(p.color)
mesh.material.metalness = p.metalness
mesh.material.roughness = p.roughness
mesh.material.needsUpdate = true

}

})

EventBus.emit("texturePresetApplied",preset)

}



export function resetTexture(){

if(!targetModel) return

targetModel.traverse(mesh=>{

if(mesh.isMesh){

const original = originalMaterials.get(mesh.uuid)

if(original){

mesh.material = original.clone()

}

}

})

EventBus.emit("textureReset")

}



export function exportTextureData(){

const textures = []

targetModel.traverse(mesh=>{

if(mesh.isMesh){

textures.push({

mesh:mesh.name,
color:mesh.material.color.getHexString(),
metalness:mesh.material.metalness,
roughness:mesh.material.roughness

})

}

})

return textures

}
