// modules/ai/vision-llm-bridge.js

import Context from "./context.js"
import LLM from "./llm-engine.js"
import Formatter from "./result-formatter.js"
import Confidence from "./confidence-filter.js"
import { EventBus } from "../core/events.js"

class VisionLLMBridge {

constructor(){
this.lastOutput = null
}

// 🔥 MAIN BRIDGE
async process(visionResult, userInput = "explain this object"){

if(!visionResult){
return null
}

EventBus.emit("bridgeStart", visionResult)

try{

// 🧠 STEP 1 — BUILD CONTEXT
const context = Context.buildContext({
detection: {
label: visionResult.label,
score: visionResult.detectionScore
},
reasoning: {
similar: visionResult.similarObjects,
confidence: visionResult.confidence
},
userInput
})

// 🧠 STEP 2 — BUILD PROMPT
const prompt = this.buildPrompt(context, userInput)

// 🤖 STEP 3 — LLM RESPONSE
const rawResponse = await LLM.generate(prompt)

// 🎯 STEP 4 — FORMAT
const formatted = Formatter.format(rawResponse, context)

// 🛡 STEP 5 — CONFIDENCE FILTER
const finalResult = Confidence.filter({
...formatted,
detectionScore: visionResult.detectionScore,
similarityScore: visionResult.similarObjects?.[0]?.score || 0,
reasoning: {confidence: visionResult.confidence}
})

// 📦 STORE
this.lastOutput = finalResult

EventBus.emit("bridgeComplete", finalResult)

return finalResult

}catch(err){

EventBus.emit("bridgeError", err)

return {
text: "Error processing vision data",
error: true
}

}

}

// 🧠 PROMPT BUILDER
buildPrompt(context, userInput){

return `
You are an intelligent AI assistant.

Object: ${context.object}
Category: ${context.category}
Material: ${context.material}
Scene: ${context.scene}

User Question: ${userInput}

Explain clearly:
- What this object is
- What it is used for
- How it works
- Any interesting facts

Keep it simple, accurate, and helpful.
`
}

// 🔄 LAST RESULT
getLastOutput(){
return this.lastOutput
}

}

export default new VisionLLMBridge()
