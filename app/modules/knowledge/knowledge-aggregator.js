// ================= IMPORTS =================

import { getMaterialInfo } from "../data/materials.js"
import { getHistoryInfo } from "../data/history.js"
import { getManufacturingInfo } from "../data/manufacturing.js"

import { generateFutureConcepts } from "../ai/future-ai.js"

import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= STATE =================

let knowledgeCache = new Map()



// ================= MAIN FUNCTION =================

export async function aggregateKnowledge(reasoning){

try{

const objectName = reasoning.guess || reasoning.object

emit("knowledge:start", objectName)


// cache check

if(knowledgeCache.has(objectName)){

emit("knowledge:cache-hit", objectName)

return knowledgeCache.get(objectName)

}



// ================= DATA COLLECTION =================

const materials = await getMaterialInfo(objectName)

const history = await getHistoryInfo(objectName)

const manufacturing = await getManufacturingInfo(objectName)

const futureIdeas = await generateFutureConcepts({ name: objectName })



// ================= IMAGE SOURCES =================

const images = buildImageSources(objectName)



// ================= DESCRIPTION =================

const description = buildDescription(reasoning)



// ================= PACKAGE =================

const knowledge = {

name: objectName,

description,

material: materials,

history,

manufacturing,

images,

futureIdeas

}



// ================= CACHE =================

knowledgeCache.set(objectName, knowledge)



emit("knowledge:complete", knowledge)

return knowledge

}catch(err){

console.error("Knowledge aggregation failed", err)

emit("knowledge:error")

return null

}

}



// ================= DESCRIPTION BUILDER =================

function buildDescription(reasoning){

const name = reasoning.guess || reasoning.object

const category = reasoning.category || "object"

const purpose = reasoning.purpose || "general usage"

return `${name} is a ${category} typically used for ${purpose}.`

}



// ================= IMAGE BUILDER =================

function buildImageSources(objectName){

const encoded = encodeURIComponent(objectName)

return [

`https://source.unsplash.com/600x400/?${encoded}`,

`https://source.unsplash.com/600x400/?${encoded},technology`,

`https://source.unsplash.com/600x400/?${encoded},product`

]

}



// ================= CACHE CONTROL =================

export function clearKnowledgeCache(){

knowledgeCache.clear()

emit("knowledge:cache:cleared")

}



// ================= SUMMARY =================

export function summarizeKnowledge(knowledge){

if(!knowledge) return null

return {

name: knowledge.name,

materialCount: knowledge.material?.length || 0,

futureConcepts: knowledge.futureIdeas?.length || 0

}

}
