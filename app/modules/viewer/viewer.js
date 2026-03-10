// ================= IMPORT =================

import { on, emit } from "../core/events.js"
import { loadModelFromObject, scaleModel } from "./model-loader.js"

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/OrbitControls.js"



// ================= GLOBAL =================

let scene
let camera
let renderer
let controls
let container
let currentModel
let clock = new THREE.Clock()



// ================= INIT =================

export function initViewer(){

container = document.getElementById("viewer-container")

if(!container) return

createScene()
createRenderer()
createCamera()
createLights()
createControls()

window.addEventListener("resize", resizeViewer)

animate()

listenViewerEvents()

}



// ================= SCENE =================

function createScene(){

scene = new THREE.Scene()

scene.background = new THREE.Color(0x050510)

}



// ================= CAMERA =================

function createCamera(){

camera = new THREE.PerspectiveCamera(

60,
container.clientWidth / container.clientHeight,
0.1,
1000

)

camera.position.set(0,1.5,4)

scene.add(camera)

}



// ================= RENDERER =================

function createRenderer(){

renderer = new THREE.WebGLRenderer({

antialias:true,
alpha:true

})

renderer.setPixelRatio(window.devicePixelRatio)

renderer.setSize(

container.clientWidth,
container.clientHeight

)

renderer.shadowMap.enabled = true

container.appendChild(renderer.domElement)

}



// ================= LIGHTING =================

function createLights(){

const ambient = new THREE.AmbientLight(0xffffff,0.6)
scene.add(ambient)

const dirLight = new THREE.DirectionalLight(0xffffff,1)

dirLight.position.set(4,6,4)

dirLight.castShadow = true

scene.add(dirLight)

}



// ================= CONTROLS =================

function createControls(){

controls = new OrbitControls(camera,renderer.domElement)

controls.enableDamping = true

controls.dampingFactor = 0.05

controls.enablePan = true

controls.minDistance = 1
controls.maxDistance = 10

}



// ================= LOAD MODEL =================

async function openViewer(object){

emit("viewer:opening")

if(currentModel){

scene.remove(currentModel)

}

const model = await loadModelFromObject(object)

scaleModel(model)

scene.add(model)

currentModel = model

emit("viewer:model-ready",object)

}



// ================= EVENTS =================

function listenViewerEvents(){

on("viewer:open", openViewer)

}



// ================= ANIMATION LOOP =================

function animate(){

requestAnimationFrame(animate)

const delta = clock.getDelta()

if(controls){

controls.update(delta)

}

renderer.render(scene,camera)

}



// ================= RESIZE =================

function resizeViewer(){

if(!renderer) return

camera.aspect = container.clientWidth / container.clientHeight

camera.updateProjectionMatrix()

renderer.setSize(

container.clientWidth,
container.clientHeight

)

}



// ================= CAMERA RESET =================

export function resetCamera(){

camera.position.set(0,1.5,4)

controls.reset()

}



// ================= ROTATE MODEL =================

export function rotateModel(speed = 0.01){

if(!currentModel) return

currentModel.rotation.y += speed

}



// ================= MODEL INFO =================

export function getCurrentModel(){

return currentModel

}



// ================= SCREENSHOT =================

export function captureViewerImage(){

return renderer.domElement.toDataURL("image/png")

}
