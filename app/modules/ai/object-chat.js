// modules/ai/object-chat.js

import Context from "./context.js"
import LLM from "./llm-engine.js"
import Voice from "../voice/narration.js"
import { EventBus } from "../core/events.js"

class ObjectChat {

constructor(){
this.history = []
}

// 🔥 MAIN FUNCTION
async talk(userInput){

const context = Context.getContext()

EventBus.emit("objectChatThinking", {object: context.object})

try{

// 🧠 PROMPT
const prompt = this.buildPrompt(userInput, context)

// 🧠 LLM CALL
const rawResponse = await LLM.generate(prompt)

// 🎯 FORMAT
const response = this.formatResponse(rawResponse, context)

// 💾 MEMORY
this.saveHistory(userInput, response)

// 🔊 VOICE
Voice.speak(response.text)

// 📡 EVENT
EventBus.emit("objectChatResponse", response)

return response

}catch(err){

EventBus.emit("objectChatError", err)

return {
text: "Sorry, I can't respond right now.",
error: true
}

}

}

// 🧠 PROMPT BUILDER (OBJECT POV)
buildPrompt(userInput, context){

return `
You are the object itself.

Object: ${context.object}
Category: ${context.category}
Material: ${context.material}

Speak in first person like you ARE the object.

User says: ${userInput}

Respond in a natural, friendly way.
Explain your purpose, structure, and features.
Keep it engaging and simple.
`
}

// 🎯 FORMAT RESPONSE
formatResponse(text, context){

return {
object: context.object,
text: text,
tone: "friendly",
timestamp: Date.now()
}

}

// 💾 HISTORY
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

// 📊 GET HISTORY
getHistory(){
return this.history
}

}

export default new ObjectChat()
