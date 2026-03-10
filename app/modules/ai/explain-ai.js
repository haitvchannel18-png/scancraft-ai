// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { aggregateKnowledge } from "../knowledge/knowledge-aggregator.js"



// ================= EXPLAIN OBJECT =================

export async function explainObject(objectData){

emit("ai:explain:start")

try{

const knowledge = await aggregateKnowledge(objectData)

const explanation = generateExplanation(objectData, knowledge)

emit("ai:explain:complete", explanation)

return explanation

}catch(err){

console.error("AI explanation failed", err)

emit("ai:explain:error")

return fallbackExplanation(objectData)

}

}



// ================= GENERATE EXPLANATION =================

function generateExplanation(object, knowledge){

return {

title: object.name,

overview: generateOverview(object),

materials: knowledge.materials || [],

manufacturing: knowledge.manufacturing || "Unknown",

history: knowledge.history || "No history data",

uses: knowledge.uses || [],

future: predictFuture(object),

confidence: object.confidence || 0.5

}

}



// ================= OVERVIEW =================

function generateOverview(object){

return `The scanned object appears to be ${object.name}. 
This object is commonly categorized under ${object.category}. 
Based on visual analysis, the system estimates a confidence level of 
${Math.round(object.confidence*100)} percent.`

}



// ================= FUTURE PREDICTION =================

function predictFuture(object){

const category = object.category?.toLowerCase()

if(category === "electronics"){

return "Future versions may integrate smarter AI and improved energy efficiency."

}

if(category === "mechanical"){

return "Future designs may include lighter alloys and higher durability."

}

return "Future developments may improve efficiency and automation."

}



// ================= CHAT STYLE ANSWER =================

export function answerQuestion(question, objectData){

const q = question.toLowerCase()

if(q.includes("material")){

return `The object is likely made from materials such as ${objectData.materials?.join(", ") || "various industrial materials"}.`

}

if(q.includes("use")){

return `The primary uses of this object include ${objectData.uses?.join(", ") || "general functional purposes"}.`

}

if(q.includes("history")){

return objectData.history || "Historical information is limited."

}

return "The AI system is analyzing the object and generating insights."

}



// ================= STORY MODE =================

export function generateStory(object){

return `Imagine holding a ${object.name}. 
This object was designed to solve practical problems in the ${object.category} field. 
Over time, innovations improved its durability and functionality, making it a key component in modern technology.`

}



// ================= FALLBACK =================

function fallbackExplanation(object){

return {

title: object.name || "Unknown Object",

overview: "The AI system could not generate a full explanation, but the object appears to be a physical device detected by the visual system.",

materials: [],

manufacturing: "Unknown",

history: "Unknown",

uses: [],

future: "Further analysis required",

confidence: object.confidence || 0

}

}
