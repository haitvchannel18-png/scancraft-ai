// modules/ai/xray-ai.js

import Context from "./context.js"
import LLM from "./llm-engine.js"
import { EventBus } from "../core/events.js"

class XRayAI {

constructor(){
this.cache = {}
}

// 🔥 MAIN FUNCTION
async analyze(){

const context = Context.getContext()
const key = context.object + "_xray"

// ⚡ CACHE
if(this.cache[key]){
return this.cache[key]
}

EventBus.emit("xrayThinking", {object: context.object})

try{

// 🧠 PROMPT
const prompt = this.buildPrompt(context)

// 🤖 LLM CALL
const raw = await LLM.generate(prompt)

// 🎯 FORMAT
const result = this.formatXRay(raw, context)

// 💾 CACHE
this.cache[key] = result

EventBus.emit("xrayReady", result)

return result

}catch(err){

EventBus.emit("xrayError", err)

return {
object: context.object,
parts: [],
layers: [],
description: ""
}

}

}

// 🧠 PROMPT BUILDER
buildPrompt(context){

return `
You are an engineering expert.

Object: ${context.object}
Category: ${context.category}

Explain the internal structure of this object like an X-ray.

Give:
1. Internal components
2. Layers
3. How parts are connected
4. How it works internally

Keep it simple and structured.
`
}

// 🎯 FORMAT OUTPUT
formatXRay(text, context){

return {
object: context.object,
description: text,
parts: this.extractParts(text),
layers: this.extractLayers(text),
timestamp: Date.now()
}

}

// 🔍 EXTRACT PARTS
extractParts(text){

const keywords = [
"battery","motor","circuit","gear",
"sensor","chip","board","screen"
]

const lower = text.toLowerCase()

return keywords.filter(k => lower.includes(k))

}

// 🧩 EXTRACT LAYERS
extractLayers(text){

const lines = text.split("\n")

return lines.filter(line => 
line.toLowerCase().includes("layer") ||
line.toLowerCase().includes("inside")
)

}

}

export default new XRayAI()
