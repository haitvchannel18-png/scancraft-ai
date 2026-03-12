// modules/scene/scene-relations.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let lastRelations = []

export function computeSceneRelations(objects){

try{

if(!objects || objects.length < 2){
return []
}

EventBus.emit("sceneRelationsStart")

const relations = []

for(let i=0;i<objects.length;i++){

for(let j=i+1;j<objects.length;j++){

const objA = objects[i]
const objB = objects[j]

const relation = analyzePair(objA,objB)

if(relation){
relations.push(relation)
}

}

}

lastRelations = relations

EventBus.emit("sceneRelationsComplete",relations)

logAI("SceneRelations",relations)

return relations

}catch(err){

console.error("Scene relations error",err)
EventBus.emit("sceneRelationsError",err)

return []

}

}



function analyzePair(a,b){

const centerA = getCenter(a.bbox)
const centerB = getCenter(b.bbox)

const distance = Math.hypot(
centerA.x - centerB.x,
centerA.y - centerB.y
)

const overlap = checkOverlap(a.bbox,b.bbox)

if(overlap){

if(a.bbox.y < b.bbox.y){
return `${a.label} on ${b.label}`
}

return `${b.label} on ${a.label}`

}

if(distance < 150){
return `${a.label} next to ${b.label}`
}

if(isInside(a.bbox,b.bbox)){
return `${a.label} inside ${b.label}`
}

if(isInside(b.bbox,a.bbox)){
return `${b.label} inside ${a.label}`
}

return null

}



function getCenter(bbox){

return {
x: bbox.x + bbox.width/2,
y: bbox.y + bbox.height/2
}

}



function checkOverlap(a,b){

return !(
a.x + a.width < b.x ||
b.x + b.width < a.x ||
a.y + a.height < b.y ||
b.y + b.height < a.y
)

}



function isInside(inner,outer){

return (
inner.x > outer.x &&
inner.y > outer.y &&
inner.x + inner.width < outer.x + outer.width &&
inner.y + inner.height < outer.y + outer.height
)

}



export function getLastRelations(){
return lastRelations
}
