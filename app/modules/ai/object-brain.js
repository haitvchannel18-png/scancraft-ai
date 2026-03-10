// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { explainObject } from "./explain-ai.js"
import { aggregateKnowledge } from "../knowledge/knowledge-aggregator.js"



// ================= MEMORY =================

const objectMemory = new Map()



// ================= ACTIVE OBJECT =================

let activeObject = null



// ================= SET ACTIVE OBJECT =================

export function setActiveObject(object){

activeObject = object

if(!objectMemory.has(object.id)){

objectMemory.set(object.id,{
history:[],
questions:[],
insights:{}
})

}

emit("object:active",object)

}



// ================= GET ACTIVE OBJECT =================

export function getActiveObject(){

return activeObject

}



// ================= OBJECT INSIGHTS =================

export async function generateInsights(object){

emit("object:insight:start")

const knowledge = await aggregateKnowledge(object)

const explanation = await explainObject(object)

const insights = {

overview: explanation.overview,

materials: knowledge.materials || [],

uses: knowledge.uses || [],

manufacturing: knowledge.manufacturing || null,

history: knowledge.history || null,

future: explanation.future

}

const mem = objectMemory.get(object.id)

mem.insights = insights

emit("object:insight:complete", insights)

return insights

}



// ================= ASK OBJECT =================

export async function askObject(question){

if(!activeObject){

return "No object selected."

}

const mem = objectMemory.get(activeObject.id)

mem.questions.push(question)

mem.history.push({

role:"user",
text:question
})

const response = await generateResponse(question, activeObject)

mem.history.push({

role:"ai",
text:response

})

emit("object:chat:response",response)

return response

}



// ================= RESPONSE ENGINE =================

async function generateResponse(question, object){

const q = question.toLowerCase()

if(q.includes("material")){

return `The object is likely made from ${object.materials?.join(", ") || "various industrial materials"}.`

}

if(q.includes("use")){

return `The main purpose of this object is ${object.uses?.join(", ") || "functional usage in its category"}.`

}

if(q.includes("history")){

return object.history || "Historical data for this object is limited."

}

if(q.includes("future")){

return "Future versions of this object may include smarter materials and improved efficiency."

}

if(q.includes("how")){

return "This object is typically manufactured using industrial fabrication techniques and assembly processes."

}

return await genericReasoning(question, object)

}



// ================= GENERIC REASONING =================

async function genericReasoning(question, object){

const knowledge = await aggregateKnowledge(object)

return `Based on visual analysis, the object appears to belong to the ${object.category} category. 
Its common uses include ${knowledge.uses?.join(", ") || "various functional applications"}.`

}



// ================= OBJECT MEMORY =================

export function getObjectMemory(objectId){

return objectMemory.get(objectId)

}



// ================= CLEAR MEMORY =================

export function clearObjectMemory(objectId){

objectMemory.delete(objectId)

emit("object:memory:cleared",objectId)

}



// ================= OBJECT PERSONALITY =================

export function objectPersonality(object){

return {

tone:"informative",

style:"friendly",

description:`I am a ${object.name}, designed for ${object.category} applications.`

}

}
