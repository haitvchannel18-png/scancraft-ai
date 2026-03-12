// modules/ai/future-ai.js

import { EventBus } from "../core/events.js"

import { getContext } from "./context.js"
import { predictFuture } from "../knowledge/future-predict.js"

import { logAI } from "../utils/ai-logger.js"
import { cacheKnowledge } from "../memory/cache-manager.js"

let activeObject = null
let lastFutureResult = null

export function initFutureAI(){

EventBus.on("objectBrainComplete",setObjectContext)

EventBus.emit("futureAIReady")

}



function setObjectContext(payload){

activeObject = payload

}



export async function generateFutureConcept(objectName){

try{

if(!objectName && activeObject){
objectName = activeObject.object
}

if(!objectName){
return null
}

const context = getContext()

const prediction = await predictFuture(objectName,context)

const concepts = buildFutureConcepts(objectName,prediction)

const result = {

object: objectName,

prediction,

concepts,

generatedAt: Date.now()

}

lastFutureResult = result

cacheKnowledge("future-"+objectName,result)

EventBus.emit("futureConceptReady",result)

logAI("FutureAI",result)

return result

}catch(err){

console.error("Future AI error",err)

EventBus.emit("futureAIError",err)

return null

}

}



function buildFutureConcepts(objectName,prediction){

const concepts = []

prediction.trends.forEach((trend,index)=>{

concepts.push({

id:index+1,

title:`Future ${objectName} concept ${index+1}`,

trend,

description:`Future ${objectName} may evolve with ${trend} technology.`,

designHints:generateDesignHints(objectName,trend)

})

})

return concepts

}



function generateDesignHints(objectName,trend){

const hints = []

if(trend.includes("AI")){

hints.push("integrated AI system")
hints.push("smart automation")

}

if(trend.includes("eco")){

hints.push("eco friendly materials")
hints.push("recyclable design")

}

if(trend.includes("smart")){

hints.push("IoT connectivity")
hints.push("sensor integration")

}

if(objectName.toLowerCase().includes("car")){

hints.push("autonomous driving")
hints.push("electric propulsion")

}

if(objectName.toLowerCase().includes("bottle")){

hints.push("self cooling material")
hints.push("smart hydration tracking")

}

return hints

}



export function getLastFutureConcept(){

return lastFutureResult

}



export function clearFutureConcept(){

lastFutureResult = null

EventBus.emit("futureConceptCleared")

}
