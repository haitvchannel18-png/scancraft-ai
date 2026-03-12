// modules/ai/object-brain.js

import { EventBus } from "../core/events.js"

import { generateExplanation } from "./explain-ai.js"
import { updateContext } from "./context.js"
import { startConversation } from "./object-chat.js"

import { speak } from "../voice/narration.js"
import { renderAIChat } from "../ui/ai-chat-ui.js"

import { cacheKnowledge } from "../memory/cache-manager.js"
import { logAI } from "../utils/ai-logger.js"

let activeObject = null
let activeKnowledge = null

export function initObjectBrain(){

EventBus.on("visionKnowledgeComplete",handleVisionKnowledge)

EventBus.emit("objectBrainReady")

}



async function handleVisionKnowledge(knowledgeResults){

if(!knowledgeResults || knowledgeResults.length === 0) return

const mainObject = knowledgeResults[0]

activeObject = mainObject.object
activeKnowledge = mainObject

try{

updateContext(mainObject)

const explanation = await generateExplanation(mainObject)

const payload = {

object: mainObject.object,
brand: mainObject.brand,
category: mainObject.category,
confidence: mainObject.confidence,
description: explanation,
images: mainObject.images || [],
price: mainObject.price,
materials: mainObject.materials,
history: mainObject.history

}

cacheKnowledge(mainObject.object,payload)

renderAIChat(payload)

speak(explanation)

EventBus.emit("objectBrainComplete",payload)

logAI("ObjectBrain",payload)

}catch(err){

console.error("Object brain error",err)

EventBus.emit("objectBrainError",err)

}

}



export function getActiveObject(){

return activeObject

}



export function getActiveKnowledge(){

return activeKnowledge

}



export function askObject(question){

if(!activeKnowledge) return

startConversation(question,activeKnowledge)

}



export function resetObjectBrain(){

activeObject = null
activeKnowledge = null

EventBus.emit("objectBrainReset")

}
