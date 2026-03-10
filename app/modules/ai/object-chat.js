// ================= IMPORTS =================

import { speak } from "../voice/narration.js"
import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"
import { playThinkingSound } from "../audio/ai-sounds.js"



// ================= STATE =================

let currentObject = null
let conversationHistory = []



// ================= INITIALIZE =================

export function setActiveObject(objectData){

currentObject = objectData
conversationHistory = []

emit("chat:object:set", objectData)

}



// ================= ASK QUESTION =================

export async function askObjectQuestion(question){

if(!currentObject){

return "No object selected."

}

emit("chat:question:start", question)

playThinkingSound()

const context = buildContext(currentObject)

const answer = await generateAnswer(context, question)

conversationHistory.push({

question,
answer,
timestamp: Date.now()

})

emit("chat:answer", answer)

await speak(answer)

return answer

}



// ================= CONTEXT BUILDER =================

function buildContext(object){

return {

name: object.name,
category: object.category,
purpose: object.purpose,
materials: object.material,
history: object.history,
manufacturing: object.manufacturing

}

}



// ================= AI ANSWER GENERATOR =================

async function generateAnswer(context, question){

try{

const prompt = buildPrompt(context, question)

// future API integration point
// OpenRouter / local AI

const response = simulateReasoning(context, question)

return response

}catch(err){

console.error("AI chat error", err)

return "Sorry, I couldn't understand the question."

}

}



// ================= PROMPT BUILDER =================

function buildPrompt(context, question){

return `
Object: ${context.name}
Category: ${context.category}
Purpose: ${context.purpose}
Materials: ${context.materials}
History: ${context.history}
Manufacturing: ${context.manufacturing}

User question: ${question}

Explain clearly and simply.
`

}



// ================= SIMULATED AI =================

function simulateReasoning(context, question){

const q = question.toLowerCase()

if(q.includes("what is this")){

return `${context.name} is a ${context.category} used for ${context.purpose}.`

}

if(q.includes("material")){

return `${context.name} is usually made from ${context.materials}.`

}

if(q.includes("history")){

return `Historically, ${context.name} evolved as ${context.history}.`

}

if(q.includes("how made") || q.includes("manufacture")){

return `${context.name} is manufactured using processes like ${context.manufacturing}.`

}

if(q.includes("future")){

return `Future versions of ${context.name} may include smart materials and AI integration.`

}

return `${context.name} is mainly used for ${context.purpose}.`

}



// ================= HISTORY =================

export function getConversationHistory(){

return conversationHistory

}



// ================= CLEAR =================

export function clearConversation(){

conversationHistory = []

emit("chat:clear")

}
