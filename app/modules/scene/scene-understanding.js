// modules/scene/scene-understanding.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let lastUnderstanding = null

export function understandScene(sceneData){

try{

if(!sceneData){
return null
}

EventBus.emit("sceneUnderstandingStart")

const objects = sceneData.objects || []
const relations = sceneData.relations || []
const environment = sceneData.environment || "unknown"

const objectScores = computeObjectImportance(objects,relations)

const mainObject = selectPrimaryObject(objectScores)

const context = buildSceneContext(environment,objects,relations,mainObject)

const result = {

environment,
objectCount:objects.length,
mainObject,
objects,
relations,
importance:objectScores,
context,
timestamp:Date.now()

}

lastUnderstanding = result

EventBus.emit("sceneUnderstandingComplete",result)

logAI("SceneUnderstanding",result)

return result

}catch(err){

console.error("Scene understanding error",err)

EventBus.emit("sceneUnderstandingError",err)

return null

}

}



function computeObjectImportance(objects,relations){

const scores = {}

objects.forEach(o=>{
scores[o.label] = 1
})

relations.forEach(rel=>{

const parts = rel.split(" ")

const a = parts[0]
const b = parts[2]

if(scores[a]) scores[a] += 2
if(scores[b]) scores[b] += 2

})

return scores

}



function selectPrimaryObject(scores){

let max = 0
let selected = null

for(const key in scores){

if(scores[key] > max){
max = scores[key]
selected = key
}

}

return selected

}



function buildSceneContext(environment,objects,relations,mainObject){

const objectList = objects.map(o=>o.label)

return {

environment,

mainObject,

objects:objectList,

relations,

summary:

`This scene appears to be a ${environment} environment with objects such as ${objectList.join(", ")}. The main focus object appears to be ${mainObject}.`

}

}



export function getLastSceneUnderstanding(){
return lastUnderstanding
}
