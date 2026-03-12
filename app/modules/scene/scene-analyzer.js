
// modules/scene/scene-analyzer.js

import { EventBus } from "../core/events.js"
import { buildSceneMap } from "./scene-map.js"
import { computeSceneRelations } from "./scene-relations.js"
import { logAI } from "../utils/ai-logger.js"

let lastScene = null

export async function analyzeScene(detectedObjects, frameMeta = {}) {

try {

if(!detectedObjects || detectedObjects.length === 0){
return null
}

EventBus.emit("sceneAnalysisStart")

const environment = classifyEnvironment(detectedObjects)

const sceneMap = buildSceneMap(detectedObjects)

const relations = computeSceneRelations(detectedObjects)

const result = {

environment,
objects: detectedObjects,
objectCount: detectedObjects.length,
sceneMap,
relations,
frameMeta,
timestamp: Date.now()

}

lastScene = result

EventBus.emit("sceneAnalysisComplete", result)

logAI("SceneAnalysis", result)

return result

} catch(err){

console.error("Scene analyzer error", err)
EventBus.emit("sceneAnalysisError", err)

return null

}

}



function classifyEnvironment(objects){

const labels = objects.map(o => o.label.toLowerCase())

if(labels.includes("stove") || labels.includes("pan") || labels.includes("kettle")){
return "kitchen"
}

if(labels.includes("bed") || labels.includes("pillow")){
return "bedroom"
}

if(labels.includes("desk") || labels.includes("laptop") || labels.includes("monitor")){
return "workspace"
}

if(labels.includes("tree") || labels.includes("car")){
return "outdoor"
}

return "general"
}



export function getLastScene(){
return lastScene
}
