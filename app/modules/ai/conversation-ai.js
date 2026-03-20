// modules/ai/conversation-ai.js

import Context from "./context.js"
import LLM from "./llm-engine.js"
import Formatter from "./result-formatter.js"
import Voice from "../voice/narration.js"
import { EventBus } from "../core/events.js"

class ConversationAI {

constructor(){
this.history = []
this.isStreaming = false
}

// 🔥 MAIN CHAT FUNCTION
async ask(userInput){

const context = Context.getContext()

// build prompt
const prompt = this.buildPrompt(userInput, context)

// emit thinking
EventBus.emit("aiThinking", {input:userInput})

try{

// ⚡ LLM call
const rawResponse = await LLM.generate(prompt)

// 🎯 format response
const response = Formatter.format(rawResponse, context)

// 💾 store memory
this.saveHistory(userInput, response)

// 🔊 voice output
Voice.speak(response.text)

// emit result
EventBus.emit("aiResponse", response)

return response

}catch(err){

EventBus.emit("aiError", err)

return {
text: "Sorry, I couldn't process that.",
error: true
}

}

}

// 🧠 PROMPT BUILDER (VERY IMPORTANT)
buildPrompt(userInput, context){

return `
You are an intelligent AI assistant.

Object: ${context.object}
Category: ${context.category}
Material: ${context.material}
Scene: ${context.scene}

User Question: ${userInput}

Give a clear, helpful, human-like answer.
Keep it concise but informative.
`
}

// 💾 MEMORY
saveHistory(input, response){

this.history.push({
input,
response,
time: Date.now()
})

if(this.history.length > 20){
this.history.shift()
}

}

// 📊 HISTORY ACCESS
getHistory(){
return this.history
}

// 🔄 STREAMING MODE (for UI typing effect)
async stream(userInput, onChunk){

this.isStreaming = true

const context = Context.getContext()
const prompt = this.buildPrompt(userInput, context)

await LLM.stream(prompt, (chunk)=>{
onChunk(chunk)
})

this.isStreaming = false

}

}

export default new ConversationAI()
