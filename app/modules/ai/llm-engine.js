/**
 * ScanCraft AI
 * LLM Engine (ChatGPT-like AI Brain)
 */

import Events from "../core/events.js"
import Cache from "../memory/llm-cache.js"
import Network from "../core/network-manager.js"
import Performance from "../core/performance.js"

class LLMEngine {

constructor(){
this.mode = "auto" // auto | offline | online
}

// 🔥 MAIN GENERATE FUNCTION
async generate(prompt){

if(!prompt) return null

Performance.start("llm-generate")

// ⚡ 1. CACHE CHECK
const cached = await Cache.get(prompt)
if(cached){
Events.emit("llm:cache-hit", cached)
Performance.end("llm-generate")
return cached
}

// 🌐 2. DECIDE MODE
const isOnline = await Network.isOnline()

let response

if(this.mode === "offline" || !isOnline){
response = this.offlineResponse(prompt)
}else{
response = await this.onlineResponse(prompt)
}

// 💾 SAVE CACHE
await Cache.set(prompt, response)

Events.emit("llm:response", response)

Performance.end("llm-generate")

return response

}

// 🧠 OFFLINE RESPONSE (fallback AI)
offlineResponse(prompt){

return this.simpleAI(prompt)

}

// 🤖 BASIC LOCAL AI (rule-based + smart fallback)
simpleAI(prompt){

const text = prompt.toLowerCase()

if(text.includes("what is")){
return "This is an object detected by AI. It is commonly used in real-world applications."
}

if(text.includes("use")){
return "This object is used for practical purposes depending on its category."
}

if(text.includes("material")){
return "It may be made of materials like plastic, metal, or wood."
}

return "This object has been analyzed using local AI. More details require internet connection."

}

// 🌐 ONLINE RESPONSE (REAL AI)
async onlineResponse(prompt){

try{

// 🔥 FREE API (you can replace later with OpenAI, etc.)
const res = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
inputs: prompt
})
})

const data = await res.json()

if(data?.[0]?.generated_text){
return data[0].generated_text
}

// fallback
return "AI could not generate a detailed response."

}catch(err){

console.warn("LLM API failed, fallback to offline")

return this.simpleAI(prompt)

}

}

}

const LLM = new LLMEngine()

export default LLM
