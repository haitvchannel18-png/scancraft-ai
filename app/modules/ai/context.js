// modules/ai/context.js

import { EventBus } from "../core/events.js"

class ContextEngine {

constructor(){
this.currentContext = {}
this.history = []
this.scene = null
this.userIntent = null
}

// 🔥 MAIN BUILDER
buildContext({ detection, reasoning, scene, memory, userInput }){

const context = {
object: detection?.label || "unknown",
confidence: detection?.score || 0,
category: reasoning?.category || "unknown",
material: reasoning?.material || "unknown",
scene: scene || this.scene || "unknown",
similar: reasoning?.similar || [],
history: this.getRecentHistory(),
intent: this.extractIntent(userInput),
timestamp: Date.now()
}

// store
this.currentContext = context
this.history.push(context)

if(this.history.length > 50){
this.history.shift()
}

EventBus.emit("contextUpdated", context)

return context
}

// 🧠 USER INTENT DETECTION
extractIntent(text){

if(!text) return "observe"

text = text.toLowerCase()

if(text.includes("price")) return "commerce"
if(text.includes("buy")) return "commerce"
if(text.includes("how")) return "explanation"
if(text.includes("make") || text.includes("build")) return "diy"
if(text.includes("future")) return "future"
if(text.includes("inside")) return "xray"

return "general"
}

// 📊 HISTORY (short-term memory)
getRecentHistory(){

return this.history.slice(-5)
}

// 🌍 SCENE UPDATE
updateScene(sceneData){
this.scene = sceneData
}

// 🎯 INTENT UPDATE (voice/chat)
updateIntent(intent){
this.userIntent = intent
}

// 🔄 CONTEXT GETTER
getContext(){
return this.currentContext
}

}

export default new ContextEngine()
