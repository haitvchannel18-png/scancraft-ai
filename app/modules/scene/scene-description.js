// modules/scene/scene-description.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let lastDescription = null

export function generateSceneDescription(sceneData){

try{

if(!sceneData){
return null
}

EventBus.emit("sceneDescriptionStart")

const environment = sceneData.environment || "environment"
const objects = sceneData.objects || []
const relations = sceneData.relations || []

const objectNames = objects.map(o=>o.label)

const uniqueObjects = [...new Set(objectNames)]

let description = ""

description += describeObjects(uniqueObjects)

description += describeRelations(relations)

description += describeEnvironment(environment)

lastDescription = description

EventBus.emit("sceneDescriptionComplete",description)

logAI("SceneDescription",description)

return description

}catch(err){

console.error("Scene description error",err)

EventBus.emit("sceneDescriptionError",err)

return null

}

}



function describeObjects(objects){

if(objects.length === 0){
return "I cannot detect clear objects in the scene. "
}

if(objects.length === 1){
return `I see a ${objects[0]} in the scene. `
}

if(objects.length === 2){
return `I see a ${objects[0]} and a ${objects[1]} in the scene. `
}

const last = objects.pop()

return `I see several objects including ${objects.join(", ")} and ${last}. `
}



function describeRelations(relations){

if(!relations || relations.length === 0){
return ""
}

let text = "Objects appear to have spatial relationships. "

relations.slice(0,3).forEach(rel=>{
text += `${rel}. `
})

return text

}



function describeEnvironment(env){

if(!env){
return ""
}

return `This scene appears to be a ${env} environment. `
}



export function getLastSceneDescription(){
return lastDescription
}
