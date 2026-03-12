// modules/viewer/viewer.js

import { EventBus } from "../core/events.js"

let THREE = window.THREE

let scene
let camera
let renderer
let controls
let currentModel = null

let animationId

export function initViewer(canvas){

scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera(
60,
canvas.clientWidth / canvas.clientHeight,
0.1,
1000
)

camera.position.set(0,1.5,3)

renderer = new THREE.WebGLRenderer({
canvas:canvas,
antialias:true,
alpha:true
})

renderer.setSize(canvas.clientWidth,canvas.clientHeight)

renderer.setPixelRatio(window.devicePixelRatio)

setupLights()

controls = new THREE.OrbitControls(camera,renderer.domElement)

controls.enableDamping = true

startRenderLoop()

EventBus.emit("viewerReady")

}



function setupLights(){

const ambient = new THREE.AmbientLight(0xffffff,0.6)
scene.add(ambient)

const dir = new THREE.DirectionalLight(0xffffff,1)
dir.position.set(5,10,7)

scene.add(dir)

}



export function loadModelToScene(model){

if(currentModel){
scene.remove(currentModel)
}

currentModel = model

scene.add(model)

centerModel(model)

EventBus.emit("viewerModelLoaded",model)

}



function centerModel(model){

const box = new THREE.Box3().setFromObject(model)

const center = box.getCenter(new THREE.Vector3())

model.position.sub(center)

}



function startRenderLoop(){

function animate(){

animationId = requestAnimationFrame(animate)

if(controls) controls.update()

renderer.render(scene,camera)

}

animate()

}



export function getScene(){
return scene
}

export function getCamera(){
return camera
}

export function getRenderer(){
return renderer
}

export function getCurrentModel(){
return currentModel
}



export function resizeViewer(width,height){

if(!renderer || !camera) return

camera.aspect = width / height
camera.updateProjectionMatrix()

renderer.setSize(width,height)

}



export function destroyViewer(){

cancelAnimationFrame(animationId)

renderer.dispose()

scene.clear()

EventBus.emit("viewerDestroyed")

}
