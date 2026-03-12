// modules/ai/xray-ai.js

import { EventBus } from "../core/events.js"

import { getMaterialInfo } from "../knowledge/material-db.js"
import { searchProductDB } from "../knowledge/product-db.js"

import { logAI } from "../utils/ai-logger.js"

let currentObject = null

export function initXrayAI(){

EventBus.on("objectBrainComplete",setObjectContext)

EventBus.emit("xrayAIReady")

}



function setObjectContext(payload){

currentObject = payload

}



export async function analyzeInternalStructure(objectName){

try{

if(!objectName && currentObject){
objectName = currentObject.object
}

if(!objectName){
return null
}

const materials = await getMaterialInfo(objectName)

const product = await searchProductDB(objectName)

const components = inferComponents(objectName,materials,product)

const layers = buildMaterialLayers(materials)

const result = {

object: objectName,

materials,

components,

layers,

analysis: generateAnalysis(objectName,materials,components)

}

EventBus.emit("xrayAnalysisComplete",result)

logAI("XRayAnalysis",result)

return result

}catch(err){

console.error("XRay AI error",err)

EventBus.emit("xrayAnalysisError",err)

return null

}

}



function inferComponents(objectName,materials,product){

const components = []

if(product && product.components){

product.components.forEach(c=>components.push(c))

}

if(objectName.toLowerCase().includes("phone")){

components.push("display")
components.push("battery")
components.push("motherboard")
components.push("camera module")

}

if(objectName.toLowerCase().includes("bottle")){

components.push("container body")
components.push("cap")
components.push("liquid content")

}

if(objectName.toLowerCase().includes("chair")){

components.push("seat")
components.push("legs")
components.push("support frame")

}

return [...new Set(components)]

}



function buildMaterialLayers(materials){

if(!materials) return []

return materials.map((mat,index)=>{

return {
layer:index+1,
material:mat
}

})

}



function generateAnalysis(objectName,materials,components){

let text = `${objectName} internal structure analysis:\n`

if(materials && materials.length){

text += `Materials used: ${materials.join(", ")}.\n`

}

if(components && components.length){

text += `Main components include: ${components.join(", ")}.`

}

return text

}



export function getCurrentObject(){

return currentObject

}
