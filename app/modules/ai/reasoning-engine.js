// modules/ai/reasoning-engine.js

import { EventBus } from "../core/events.js"

const MATERIAL_HINTS = {
metal:["car","motorcycle","bicycle","knife","spoon","fork"],
plastic:["bottle","container","toothbrush","remote"],
wood:["chair","table","bench","desk"],
glass:["wine glass","cup","vase"]
}

const CATEGORY_HINTS = {
vehicle:["car","truck","bus","motorcycle","bicycle"],
electronics:["laptop","tv","remote","cell phone","keyboard"],
furniture:["chair","couch","bed","table","bench"],
kitchen:["cup","spoon","fork","knife","bowl","microwave"]
}



export async function reasoningEngine(input){

const {label,similarObjects} = input

const category = inferCategory(label)
const material = inferMaterial(label)

const similarLabels = similarObjects.map(o=>o.label)

const consensus = buildConsensus(label,similarLabels)

const confidence = computeConfidence(similarObjects)

const reasoning = {

object: consensus,

category,

material,

confidence,

similar: similarLabels,

possibleUses: inferUses(consensus)

}

EventBus.emit("reasoningComplete",reasoning)

return reasoning

}



function inferCategory(label){

for(const key in CATEGORY_HINTS){

if(CATEGORY_HINTS[key].includes(label)){
return key
}

}

return "unknown"

}



function inferMaterial(label){

for(const mat in MATERIAL_HINTS){

if(MATERIAL_HINTS[mat].includes(label)){
return mat
}

}

return "unknown"

}



function buildConsensus(label,similar){

if(similar.length === 0) return label

const counts = {}

counts[label] = 1

for(const s of similar){

counts[s] = (counts[s] || 0) + 1

}

let best = label
let max = 0

for(const k in counts){

if(counts[k] > max){

max = counts[k]
best = k

}

}

return best

}



function computeConfidence(similar){

if(!similar.length) return 0.5

const avg = similar.reduce((a,b)=>a + b.score,0) / similar.length

return Math.min(1,avg)

}



function inferUses(object){

const uses = {

chair:["sitting","furniture","home use"],

bottle:["storage","liquid container","portable water"],

laptop:["computing","work","internet browsing"],

car:["transport","travel","vehicle"],

phone:["communication","apps","camera"]

}

return uses[object] || ["general purpose object"]

}
