// modules/ai/context.js

import { EventBus } from "../core/events.js"
import { cacheKnowledge } from "../memory/cache-manager.js"
import { logAI } from "../utils/ai-logger.js"

let context = {

activeObject: null,

brand: null,

materials: [],

history: null,

scene: null,

conversation: [],

lastUpdated: null

}



export function initContext(){

EventBus.on("objectBrainComplete",updateContext)

EventBus.emit("aiContextReady")

}



export function updateContext(payload){

try{

if(!payload) return

context.activeObject = payload.object || null

context.brand = payload.brand || null

context.materials = payload.materials || []

context.history = payload.history || null

context.lastUpdated = Date.now()

cacheKnowledge("context",context)

logAI("ContextUpdate",context)

EventBus.emit("contextUpdated",context)

}catch(err){

console.error("Context update error",err)

}

}



export function updateSceneContext(sceneData){

context.scene = sceneData

context.lastUpdated = Date.now()

EventBus.emit("sceneContextUpdated",sceneData)

}



export function addConversation(role,message){

context.conversation.push({

role,

message,

time: Date.now()

})

if(context.conversation.length > 20){

context.conversation.shift()

}

EventBus.emit("conversationUpdated",context.conversation)

}



export function getContext(){

return context

}



export function getActiveObject(){

return context.activeObject

}



export function getConversationHistory(){

return context.conversation

}



export function clearConversation(){

context.conversation = []

EventBus.emit("conversationCleared")

}



export function resetContext(){

context = {

activeObject:null,

brand:null,

materials:[],

history:null,

scene:null,

conversation:[],

lastUpdated:null

}

EventBus.emit("contextReset")

}
