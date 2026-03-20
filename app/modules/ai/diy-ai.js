// modules/ai/diy-ai.js

import Context from "./context.js"
import LLM from "./llm-engine.js"
import { EventBus } from "../core/events.js"

class DIYAI {

constructor(){
this.cache = {}
}

// 🔥 MAIN FUNCTION
async generateDIY(userInput = "how to make this"){

const context = Context.getContext()

const key = context.object + "_diy"

// ⚡ CACHE CHECK
if(this.cache[key]){
return this.cache[key]
}

EventBus.emit("diyThinking", {object: context.object})

try{

const prompt = this.buildPrompt(context, userInput)

// 🧠 LLM CALL
const response = await LLM.generate(prompt)

// 🎯 STRUCTURE OUTPUT
const diyData = this.formatDIY(response, context)

// 💾 CACHE
this.cache[key] = diyData

EventBus.emit("diyReady", diyData)

return diyData

}catch(err){

EventBus.emit("diyError", err)

return {
title: "DIY unavailable",
steps: [],
tools: [],
materials: []
}

}

}

// 🧠 PROMPT BUILDER
buildPrompt(context, userInput){

return `
You are a DIY expert.

Object: ${context.object}
Category: ${context.category}
Material: ${context.material}

User wants: ${userInput}

Generate a DIY guide with:

1. Required materials
2. Tools needed
3. Step-by-step instructions
4. Safety tips

Keep it simple and practical.
`
}

// 🎯 FORMAT RESPONSE
formatDIY(text, context){

// basic parsing (can upgrade later)
const lines = text.split("\n")

return {
object: context.object,
title: `DIY ${context.object}`,
raw: text,
steps: lines.filter(l => l.match(/^\d/)),
tools: this.extractSection(text, "tools"),
materials: this.extractSection(text, "materials"),
safety: this.extractSection(text, "safety")
}

}

// 🧩 EXTRACT SECTION
extractSection(text, keyword){

const lower = text.toLowerCase()

if(!lower.includes(keyword)) return []

return text
.split("\n")
.filter(l => l.toLowerCase().includes(keyword))

}

}

export default new DIYAI()
