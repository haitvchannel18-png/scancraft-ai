/**
 * ScanCraft AI
 * AI Gateway (Central Brain Controller)
 */

import Events from "../core/events.js"
import Reasoning from "./reasoning-engine.js"
import Knowledge from "../knowledge/knowledge-aggregator.js"
import LLM from "./llm-engine.js"
import Prompt from "./prompt-engine.js"
import Fusion from "./knowledge-fusion.js"
import Consensus from "./multi-model-consensus.js"
import Confidence from "./confidence-engine.js"
import Hallucination from "./hallucination-filter.js"

class AIGateway {

constructor(){
this.state = {
busy: false
}
}

// 🔥 MAIN PIPELINE ENTRY
async processDetection(detection){

if(!detection) return null

this.state.busy = true
Events.emit("ai:thinking", true)

try{

// ⚡ STEP 1 — REASONING
const reasoning = await Reasoning.analyze(detection)

// 📚 STEP 2 — KNOWLEDGE
const knowledge = await Knowledge.fetch(detection)

// 🧠 STEP 3 — FUSION (merge reasoning + knowledge)
const fused = Fusion.merge(reasoning, knowledge)

// 🎯 STEP 4 — CONSENSUS (multi-model agreement)
const consensus = Consensus.resolve(fused)

// 🧠 STEP 5 — PROMPT GENERATION
const prompt = Prompt.build(consensus)

// 💀 STEP 6 — LLM RESPONSE
const aiResponse = await LLM.generate(prompt)

// 🛡 STEP 7 — HALLUCINATION FILTER
const safeResponse = Hallucination.clean(aiResponse)

// 📊 STEP 8 — CONFIDENCE ENGINE
const final = Confidence.score({
...consensus,
response: safeResponse
})

// 📡 FINAL EVENT
Events.emit("ai:response", final)

this.state.busy = false
Events.emit("ai:thinking", false)

return final

}catch(err){

console.error("AI Gateway Error:", err)

Events.emit("ai:error", err)

this.state.busy = false
Events.emit("ai:thinking", false)

return null

}

}

}

const AI = new AIGateway()

export default AI
