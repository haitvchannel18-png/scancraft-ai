// modules/ai/material-ai.js

import Context from "./context.js"
import LLM from "./llm-engine.js"
import { EventBus } from "../core/events.js"

class MaterialAI {

constructor(){
this.cache = {}
}

// 🔥 MAIN FUNCTION
async analyzeMaterial(){

const context = Context.getContext()
const key = context.object + "_material"

// ⚡ CACHE CHECK
if(this.cache[key]){
return this.cache[key]
}

EventBus.emit("materialThinking", {object: context.object})

try{

// 🧠 PROMPT
const prompt = this.buildPrompt(context)

// 🧠 LLM RESPONSE
const response = await LLM.generate(prompt)

// 🎯 FORMAT
const materialData = this.formatMaterial(response, context)

// 💾 CACHE
this.cache[key] = materialData

EventBus.emit("materialReady", materialData)

return materialData

}catch(err){

EventBus.emit("materialError", err)

return {
object: context.object,
materials: [],
composition: "",
properties: []
}

}

}

// 🧠 PROMPT BUILDER
buildPrompt(context){

return `
You are a materials science expert.

Object: ${context.object}
Category: ${context.category}

Explain:

1. What materials it is made of
2. Internal components
3. Material properties (strength, flexibility, durability)
4. Why these materials are used

Keep it clear and structured.
`
}

// 🎯 FORMAT RESPONSE
formatMaterial(text, context){

return {
object: context.object,
summary: text,
materials: this.extractList(text, ["steel","plastic","glass","wood","aluminum","copper","rubber"]),
properties: this.extractProperties(text),
timestamp: Date.now()
}

}

// 🧩 EXTRACT MATERIAL LIST
extractList(text, knownMaterials){

const lower = text.toLowerCase()

return knownMaterials.filter(m => lower.includes(m))
}

// ⚙️ EXTRACT PROPERTIES
extractProperties(text){

const props = []

if(text.includes("strong")) props.push("high strength")
if(text.includes("flexible")) props.push("flexible")
if(text.includes("light")) props.push("lightweight")
if(text.includes("durable")) props.push("durable")

return props

}

}

export default new MaterialAI()
