// ================= IMPORTS =================

import * as THREE from "/assets/libs/three.js"
import { logAI } from "../utils/AILogger.js"
import { emit } from "../core/events.js"


// ================= STATE =================

let renderer
let scene
let camera
let controls
let currentModel


// ================= INIT VIEWER =================

export function initViewer(container){

scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera(
60,
container.clientWidth/container.clientHeight,
0.1,
1000
)

camera.position.set(0,1.5,3)

renderer = new THREE.WebGLRenderer({
antialias:true,
alpha:true
})

renderer.setSize(container.clientWidth, container.clientHeight)

container.appendChild(renderer.domElement)

addLights()

animate()

}


// ================= LIGHTING =================

function addLights(){

const ambient = new THREE.AmbientLight(0xffffff,0.6)
scene.add(ambient)

const dirLight = new THREE.DirectionalLight(0xffffff,0.8)

dirLight.position.set(5,10,7)

scene.add(dirLight)

}


// ================= LOAD MODEL =================

export async function loadModel(objectName){

logAI("Loading 3D model for " + objectName)

emit("viewer:model-loading",objectName)

const modelPath = `/models/vision/${objectName}.glb`

try{

const loader = new THREE.GLTFLoader()

loader.load(

modelPath,

(gltf)=>{

if(currentModel){

scene.remove(currentModel)

}

currentModel = gltf.scene

scene.add(currentModel)

emit("viewer:model-loaded",objectName)

},

undefined,

(err)=>{

logAI("Model not found, loading fallback")

loadFallbackModel()

}

)

}catch(e){

loadFallbackModel()

}

}


// ================= FALLBACK MODEL =================

function loadFallbackModel(){

const geometry = new THREE.BoxGeometry(1,1,1)

const material = new THREE.MeshStandardMaterial({

color:0x00aaff,
metalness:0.3,
roughness:0.4

})

const cube = new THREE.Mesh(geometry,material)

scene.add(cube)

currentModel = cube

emit("viewer:fallback-model")

}


// ================= MODEL ROTATION =================

export function rotateModel(speed = 0.01){

if(!currentModel) return

currentModel.rotation.y += speed

}


// ================= MODEL SCALE =================

export function scaleModel(factor){

if(!currentModel) return

currentModel.scale.set(factor,factor,factor)

}


// ================= RENDER LOOP =================

function animate(){

requestAnimationFrame(animate)

renderer.render(scene,camera)

}
