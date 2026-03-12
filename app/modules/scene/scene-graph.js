// modules/scene/scene-graph.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let currentGraph = null

export function buildSceneGraph(sceneData){

try{

if(!sceneData){
return null
}

EventBus.emit("sceneGraphStart")

const nodes = createNodes(sceneData.objects)
const edges = createEdges(sceneData.relations)

const graph = {

nodes,
edges,
environment: sceneData.environment || "unknown",
mainObject: sceneData.mainObject || null,
timestamp: Date.now()

}

currentGraph = graph

EventBus.emit("sceneGraphReady",graph)

logAI("SceneGraph",graph)

return graph

}catch(err){

console.error("Scene graph error",err)

EventBus.emit("sceneGraphError",err)

return null

}

}



function createNodes(objects){

if(!objects) return []

return objects.map(obj => ({

id: obj.label,
type: "object",
bbox: obj.bbox || null,
confidence: obj.confidence || 0.8

}))

}



function createEdges(relations){

if(!relations) return []

const edges = []

relations.forEach(rel => {

const parts = rel.split(" ")

if(parts.length < 3) return

edges.push({

from: parts[0],
relation: parts[1],
to: parts[2]

})

})

return edges

}



export function getSceneGraph(){
return currentGraph
}



export function clearSceneGraph(){
currentGraph = null
}
