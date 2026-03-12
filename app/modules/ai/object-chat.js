// modules/ai/object-chat.js

import { EventBus } from "../core/events.js"

import { generateConversation } from "./conversation-ai.js"
import { getContext } from "./context.js"

import { speak } from "../voice/narration.js"
import { appendChatMessage } from "../ui/ai-chat-ui.js"

import { logAI } from "../utils/ai-logger.js"
import { cacheKnowledge } from "../memory/cache-manager.js"

let activeKnowledge = null

export function initObjectChat(){

EventBus.on("objectBrainComplete", setActiveKnowledge)

EventBus.emit("objectChatReady")

}



function setActiveKnowledge(payload){

activeKnowledge = payload

}



export async function startConversation(question, knowledge){

try{

if(!knowledge) knowledge = activeKnowledge

if(!knowledge){
console.warn("No object context for conversation")
return
}

appendChatMessage({
role:"user",
text:question
})

const context = getContext()

const answer = await generateConversation({

question,
object:knowledge.object,
brand:knowledge.brand,
materials:knowledge.materials,
history:knowledge.history,
context

})

appendChatMessage({
role:"ai",
text:answer
})

speak(answer)

cacheKnowledge("conversation",{
question,
answer,
object:knowledge.object
})

logAI("ObjectConversation",{
question,
answer
})

EventBus.emit("objectChatResponse",{
question,
answer
})

}catch(err){

console.error("Conversation error",err)

EventBus.emit("objectChatError",err)

}

}



export function ask(question){

if(!activeKnowledge) return

startConversation(question,activeKnowledge)

}



export function resetConversation(){

activeKnowledge = null

EventBus.emit("objectChatReset")

}
