// ================= IMPORTS =================

import { emit } from "../core/events.js"



// ================= CONFIG =================

const RELATION_DISTANCE = 120



// ================= ANALYZE SCENE =================

export function analyzeScene(detections){

emit("ai:scene:start")

const scene = {

objects:[],
relationships:[],
summary:""

}

detections.forEach(obj => {

scene.objects.push({

name:obj.name || "object",

box:obj.box,

category:obj.category || "unknown"

})

})

scene.relationships = detectRelationships(scene.objects)

scene.summary = generateSceneSummary(scene)

emit("ai:scene:complete",scene)

return scene

}



// ================= DETECT RELATIONSHIPS =================

function detectRelationships(objects){

const relations = []

for(let i=0;i<objects.length;i++){

for(let j=i+1;j<objects.length;j++){

const a = objects[i]
const b = objects[j]

const distance = calculateDistance(a.box,b.box)

if(distance < RELATION_DISTANCE){

relations.push({

objectA:a.name,
objectB:b.name,
relation:inferRelation(a,b)

})

}

}

}

return relations

}



// ================= RELATION INFERENCE =================

function inferRelation(a,b){

const ay = a.box.y
const by = b.box.y

if(Math.abs(ay - by) < 30){

return "next to"

}

if(ay < by){

return "above"

}

return "below"

}



// ================= DISTANCE =================

function calculateDistance(boxA,boxB){

const ax = boxA.x + boxA.width/2
const ay = boxA.y + boxA.height/2

const bx = boxB.x + boxB.width/2
const by = boxB.y + boxB.height/2

const dx = ax - bx
const dy = ay - by

return Math.sqrt(dx*dx + dy*dy)

}



// ================= SCENE SUMMARY =================

function generateSceneSummary(scene){

const names = scene.objects.map(o => o.name)

let summary = `The AI system detected ${names.length} objects.`

if(names.length){

summary += ` Objects include: ${names.join(", ")}.`

}

if(scene.relationships.length){

summary += " Some objects appear to be spatially related."

}

return summary

}



// ================= SCENE CONTEXT =================

export function detectContext(scene){

const categories = scene.objects.map(o=>o.category)

if(categories.includes("kitchen")){

return "Kitchen environment detected."

}

if(categories.includes("electronics")){

return "Electronics workspace detected."

}

if(categories.includes("furniture")){

return "Indoor room scene detected."

}

return "General environment detected."

}



// ================= SCENE SCORE =================

export function sceneConfidence(scene){

return Math.min(
1,
scene.objects.length * 0.2
)

}
