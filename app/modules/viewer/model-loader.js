// modules/viewer/model-loader.js

import { EventBus } from "../core/events.js"

let THREE = window.THREE

let loader = null

const MODEL_PATH = "/models/vision/"

export function initModelLoader(){

if(loader) return loader

loader = new THREE.GLTFLoader()

EventBus.emit("modelLoaderReady")

return loader

}



export async function loadModel(objectLabel){

if(!loader){
initModelLoader()
}

const file = getModelFile(objectLabel)

try{

const model = await loadGLB(file)

EventBus.emit("modelLoaded",{
label:objectLabel,
model
})

return model

}catch(err){

console.warn("3D model not found, fallback model used")

const fallback = await loadGLB("model.glb")

return fallback

}

}



function getModelFile(label){

const name = label.toLowerCase()

const models = {

bottle:"bottle.glb",
chair:"chair.glb",
laptop:"laptop.glb",
phone:"phone.glb",
car:"car.glb"

}

return models[name] || "model.glb"

}



function loadGLB(file){

return new Promise((resolve,reject)=>{

loader.load(

MODEL_PATH + file,

gltf=>{

resolve(gltf.scene)

},

undefined,

err=>reject(err)

)

})

}
