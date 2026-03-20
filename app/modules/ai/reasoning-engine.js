/**
 * ScanCraft AI
 * Hybrid Reasoning Engine (Fast + Intelligent + Scalable)
 */

import Events from "../core/events.js"
import Performance from "../core/performance.js"

// ⚡ FAST RULE BASE (your logic upgraded)
const MATERIAL_HINTS = {
  metal:["car","motorcycle","bicycle","knife","spoon","fork"],
  plastic:["bottle","container","toothbrush","remote"],
  wood:["chair","table","bench","desk"],
  glass:["wine glass","cup","vase"]
}

const CATEGORY_HINTS = {
  vehicle:["car","truck","bus","motorcycle","bicycle"],
  electronics:["laptop","tv","remote","cell phone","keyboard"],
  furniture:["chair","couch","bed","table","bench"],
  kitchen:["cup","spoon","fork","knife","bowl","microwave"]
}

class ReasoningEngine {

async analyze(object, knowledge = {}){

if(!object) return null

Performance.start("ai-reasoning")

// ⚡ FAST LAYER (instant result)
const fast = this.fastReasoning(object)

// 🧠 ADVANCED LAYER (AI + knowledge)
const advanced = this.advancedReasoning(object, knowledge)

// 🔥 MERGED OUTPUT
const final = this.mergeReasoning(object, fast, advanced)

Performance.end("ai-reasoning")

Events.emit("ai:reasoning", final)

return final

}

// ⚡ FAST RULE-BASED (YOUR CODE UPGRADED)
fastReasoning(object){

const label = object.label

return {
category: this.inferCategory(label),
material: this.inferMaterial(label),
uses: this.inferUses(label),
confidenceLevel: this.getConfidenceLevel(object.confidence)
}

}

inferCategory(label){

for(const key in CATEGORY_HINTS){
if(CATEGORY_HINTS[key].includes(label)) return key
}

return "unknown"

}

inferMaterial(label){

for(const mat in MATERIAL_HINTS){
if(MATERIAL_HINTS[mat].includes(label)) return mat
}

return "unknown"

}

inferUses(object){

const uses = {
chair:["sitting","furniture","home use"],
bottle:["storage","liquid container"],
laptop:["computing","work"],
car:["transport","travel"],
phone:["communication","apps"]
}

return uses[object] || ["general purpose"]
}

getConfidenceLevel(conf){

if(conf > 0.85) return "high"
if(conf > 0.6) return "medium"
return "low"

}

// 🧠 ADVANCED AI REASONING
advancedReasoning(object, knowledge){

return {

whyDetected: `Detected as ${object.label} using visual + pattern recognition`,

knowledgeMatch: knowledge ? "matched" : "weak match",

description: knowledge?.description || null,

future: knowledge?.future || `${object.label} will evolve with smart tech`,

risk: this.detectRisk(object.label)

}

}

detectRisk(label){

if(label.includes("knife") || label.includes("fire")){
return "Potentially dangerous"
}

return "Safe object"

}

// 🔥 MERGE BOTH WORLDS
mergeReasoning(object, fast, advanced){

return {

object: object.label,

confidence: object.confidence,

// ⚡ FAST
category: fast.category,
material: fast.material,
uses: fast.uses,
confidenceLevel: fast.confidenceLevel,

// 🧠 ADVANCED
whyDetected: advanced.whyDetected,
knowledgeMatch: advanced.knowledgeMatch,
description: advanced.description,
future: advanced.future,
risk: advanced.risk,

// 🎯 SMART SCORE
intelligenceScore: this.computeScore(object, fast, advanced)

}

}

// 💀 INTELLIGENCE SCORE (premium feature)
computeScore(object, fast, advanced){

let score = 0

// base confidence
score += object.confidence * 50

// category known
if(fast.category !== "unknown") score += 10

// material known
if(fast.material !== "unknown") score += 10

// knowledge match
if(advanced.knowledgeMatch === "matched") score += 20

// safety
if(advanced.risk === "Safe object") score += 10

return Math.min(100, Math.round(score))

}

}

const Reasoning = new ReasoningEngine()

export default Reasoning
