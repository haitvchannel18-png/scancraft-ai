// modules/scene/scene-map.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let lastSceneMap = null

export function buildSceneMap(objects){

try{

if(!objects || objects.length === 0){
return null
}

EventBus.emit("sceneMapStart")

const mappedObjects = objects.map(obj => {

const centerX = obj.bbox.x + obj.bbox.width / 2
const centerY = obj.bbox.y + obj.bbox.height / 2

return {

label: obj.label,

bbox: obj.bbox,

position:{
x:centerX,
y:centerY
},

size:{
width:obj.bbox.width,
height:obj.bbox.height
},

area: obj.bbox.width * obj.bbox.height

}

})

const grid = generateSpatialGrid(mappedObjects)

const result = {

objects:mappedObjects,

grid,

timestamp:Date.now()

}

lastSceneMap = result

EventBus.emit("sceneMapComplete",result)

logAI("SceneMap",result)

return result

}catch(err){

console.error("Scene map error",err)

EventBus.emit("sceneMapError",err)

return null

}

}



function generateSpatialGrid(objects){

const grid = {

topLeft:[],
topRight:[],
bottomLeft:[],
bottomRight:[]

}

objects.forEach(obj=>{

if(obj.position.x < window.innerWidth/2 && obj.position.y < window.innerHeight/2){
grid.topLeft.push(obj.label)
}

else if(obj.position.x >= window.innerWidth/2 && obj.position.y < window.innerHeight/2){
grid.topRight.push(obj.label)
}

else if(obj.position.x < window.innerWidth/2 && obj.position.y >= window.innerHeight/2){
grid.bottomLeft.push(obj.label)
}

else{
grid.bottomRight.push(obj.label)
}

})

return grid

}



export function getLastSceneMap(){
return lastSceneMap
}
