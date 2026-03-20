// modules/ai/future-ai.js

import Context from "./context.js"
import LLM from "./llm-engine.js"
import ImageGen from "./image-generator.js"
import { EventBus } from "../core/events.js"

class FutureAI {

constructor(){
this.cache = {}
}

// 🔥 MAIN FUNCTION
async generateFuture(userInput = "future version"){

const context = Context.getContext()
const key = context.object + "_future"

// ⚡ CACHE
if(this.cache[key]){
return this.cache[key]
}

EventBus.emit("futureThinking", {object: context.object})

try{

// 🧠 PROMPT
const prompt = this.buildPrompt(context, userInput)

// 🧠 TEXT FUTURE
const textResponse = await LLM.generate(prompt)

// 🖼 OPTIONAL IMAGE
let image = null
try{
image = await ImageGen.generate({
prompt: `futuristic ${context.object}, advanced technology, sci-fi design`
})
}catch(e){
image = null
}

// 🎯 FORMAT
const result = this.formatFuture(textResponse, image, context)

// 💾 CACHE
this.cache[key] = result

EventBus.emit("futureReady", result)

return result

}catch(err){

EventBus.emit("futureError", err)

return {
title: "Future prediction unavailable",
text: "",
image: null
}

}

}

// 🧠 PROMPT BUILDER
buildPrompt(context, userInput){

return `
You are a futuristic AI.

Object: ${context.object}
Category: ${context.category}
Material: ${context.material}

User request: ${userInput}

Explain:
1. How this object may evolve in future
2. New technologies added
3. Improvements in design
4. Smart features

Make it exciting and realistic.
`
}

// 🎯 FORMAT OUTPUT
formatFuture(text, image, context){

return {
object: context.object,
title: `Future of ${context.object}`,
description: text,
image: image,
timestamp: Date.now()
}

}

}

export default new FutureAI()
