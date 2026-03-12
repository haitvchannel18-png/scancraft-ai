// modules/voice/conversation.js

import { speak } from "./narration.js"
import { startListening, stopListening } from "./speech.js"
import { EventBus } from "../core/events.js"

let conversationActive = false

export function startConversation(){

conversationActive = true

startListening()

EventBus.emit("conversationStart")

}

export function stopConversation(){

conversationActive = false

stopListening()

EventBus.emit("conversationStop")

}

export function handleUserSpeech(text){

if(!text) return

EventBus.emit("userSpeech",text)

processUserQuery(text)

}

async function processUserQuery(query){

try{

EventBus.emit("aiThinking")

const response = await askAI(query)

speak(response)

EventBus.emit("aiResponse",response)

}catch(err){

console.error("Conversation error",err)

}

}

async function askAI(query){

// placeholder AI logic

return `You asked: ${query}. This feature will connect with ScanCraft AI reasoning engine.`

}

export function isConversationActive(){
return conversationActive
}
