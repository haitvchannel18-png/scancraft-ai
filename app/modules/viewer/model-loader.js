// ================= IMPORT =================

import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"

// ThreeJS loaders
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/DRACOLoader.js"



// ================= GLOBAL =================

let loader
let dracoLoader
let modelCache = new Map()



// ================= INIT =================

export function initModelLoader(){

loader = new GLTFLoader()

dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath(
"https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/libs/draco/"
)

loader.setDRACOLoader(dracoLoader)

}



// ================= LOAD MODEL =================

export async function loadModel(modelPath){

try{

// CACHE CHECK
if(modelCache.has(modelPath)){

return cloneModel(modelCache.get(modelPath))

}

emit("viewer:model-loading", modelPath)

const gltf = await loader.loadAsync(modelPath)

const model = gltf.scene

prepareModel(model)

modelCache.set(modelPath, model)

emit("viewer:model-loaded", model)

return cloneModel(model)

}catch(err){

console.error("Model loading failed", err)

emit("viewer:model-error", err)

throw err

}

}



// ================= PREPARE MODEL =================

function prepareModel(model){

model.traverse(obj => {

if(obj.isMesh){

obj.castShadow = true
obj.receiveShadow = true

if(obj.material){

obj.material.metalness = obj.material.metalness || 0.3
obj.material.roughness = obj.material.roughness || 0.7

}

}

})

centerModel(model)

}



// ================= CENTER MODEL =================

function centerModel(model){

const box = new THREE.Box3().setFromObject(model)

const center = new THREE.Vector3()

box.getCenter(center)

model.position.sub(center)

}



// ================= SCALE MODEL =================

export function scaleModel(model, targetSize = 2){

const box = new THREE.Box3().setFromObject(model)

const size = new THREE.Vector3()

box.getSize(size)

const maxDim = Math.max(size.x, size.y, size.z)

const scale = targetSize / maxDim

model.scale.setScalar(scale)

}



// ================= CLONE MODEL =================

function cloneModel(model){

return model.clone(true)

}



// ================= LOAD BY OBJECT =================

export async function loadModelFromObject(object){

// simple mapping

const name = object.label?.toLowerCase()

let modelPath = CONFIG.MODEL_PATH + "default.glb"

if(name.includes("chair")) modelPath = CONFIG.MODEL_PATH + "chair.glb"

if(name.includes("bottle")) modelPath = CONFIG.MODEL_PATH + "bottle.glb"

if(name.includes("phone")) modelPath = CONFIG.MODEL_PATH + "phone.glb"

return loadModel(modelPath)

}



// ================= CLEAR CACHE =================

export function clearModelCache(){

modelCache.clear()

}
