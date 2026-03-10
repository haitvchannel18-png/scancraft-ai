// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= STATE =================

let sceneObjects = []
let sceneContext = null



// ================= UPDATE OBJECTS =================

export function updateSceneObjects(objects){

sceneObjects = objects || []

emit("context:objects:update", sceneObjects)

sceneContext = analyzeScene(sceneObjects)

emit("context:scene:updated", sceneContext)

return sceneContext

}



// ================= SCENE ANALYSIS =================

function analyzeScene(objects){

if(!objects || objects.length === 0){

return {
type:"unknown",
description:"No recognizable environment detected"
}

}

const labels = objects.map(o => o.name?.toLowerCase() || "")


// scene rules

if(labels.includes("stove") || labels.includes("pan") || labels.includes("kettle")){

return buildScene("kitchen","Cooking environment with kitchen tools")

}

if(labels.includes("bed") || labels.includes("pillow")){

return buildScene("bedroom","Sleeping environment")

}

if(labels.includes("computer") || labels.includes("keyboard") || labels.includes("monitor")){

return buildScene("office","Workspace with computer equipment")

}

if(labels.includes("car") || labels.includes("bicycle")){

return buildScene("transport","Transportation environment")

}

return buildScene("general","General environment with mixed objects")

}



// ================= SCENE BUILDER =================

function buildScene(type,description){

return {

type,

description,

objects: sceneObjects.map(o => o.name),

confidence: computeConfidence(sceneObjects)

}

}



// ================= CONFIDENCE =================

function computeConfidence(objects){

const base = 0.4

const bonus = Math.min(objects.length * 0.1,0.5)

return Math.min(base + bonus,1)

}



// ================= SCENE EXPLANATION =================

export function describeScene(){

if(!sceneContext){

return "Scene not analyzed yet."

}

const objectList = sceneContext.objects.join(", ")

return `I see ${objectList}. This appears to be a ${sceneContext.type} environment.`

}



// ================= RELATIONSHIP ANALYSIS =================

export function analyzeObjectRelations(){

const relations = []

for(let i=0;i<sceneObjects.length;i++){

for(let j=i+1;j<sceneObjects.length;j++){

const a = sceneObjects[i].name
const b = sceneObjects[j].name

relations.push(`${a} is likely used with ${b}`)

}

}

return relations

}



// ================= PRIMARY OBJECT =================

export function getPrimaryObject(){

if(!sceneObjects || sceneObjects.length === 0){

return null

}

return sceneObjects.reduce((best,current)=>{

return (current.confidence || 0) > (best.confidence || 0) ? current : best

})

}



// ================= SCENE SUMMARY =================

export function getSceneSummary(){

if(!sceneContext){

return null

}

return {

sceneType: sceneContext.type,

objectCount: sceneContext.objects.length,

confidence: sceneContext.confidence

}

}



// ================= RESET =================

export function resetScene(){

sceneObjects = []
sceneContext = null

emit("context:reset")

}
