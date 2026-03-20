/**
 * ScanCraft AI
 * Object Brain (Central Intelligence System)
 */

import Events from "../core/events.js"
import State from "../core/state-manager.js"
import Performance from "../core/performance.js"

import ExplainAI from "./explain-ai.js"
import Reasoning from "./reasoning-engine.js"
import Knowledge from "../knowledge/knowledge-aggregator.js"

class ObjectBrain {

constructor(){

this.currentObject = null
this.history = []

}

async process(detections){

if(!detections || detections.length === 0) return null

Performance.start("brain-total")

// Pick main object
const primary = detections[0]
this.currentObject = primary

// Save to state
State.set("currentObject", primary)

// Save history
this.history.push(primary)

// Step 1: Knowledge Fetch
const knowledge = await Knowledge.get(primary.label)

// Step 2: Reasoning
const reasoning = await Reasoning.analyze(primary, knowledge)

// Step 3: Explanation
const explanation = await ExplainAI.explain(detections)

// Step 4: Final Brain Output
const output = this.buildOutput({
object: primary,
knowledge,
reasoning,
explanation
})

Performance.end("brain-total")

Events.emit("brain:result", output)

return output

}

buildOutput({object, knowledge, reasoning, explanation}){

return {

id: Date.now(),

object: {
label: object.label,
confidence: object.confidence,
type: object.type
},

brain: {

// Smart Summary
summary: this.generateSummary(object, knowledge),

// Deep Explanation
explanation: explanation,

// AI Thinking
reasoning: reasoning,

// Metadata
confidence: object.confidence,
source: object.source

},

actions: this.generateActions(object),

ui: this.generateUIHints(object)

}

}

generateSummary(object, knowledge){

if(knowledge?.description){
return knowledge.description
}

return `This is a ${object.label} detected with ${(object.confidence*100).toFixed(1)}% confidence.`

}

generateActions(object){

const actions = []

// Basic actions
actions.push("Explain")
actions.push("Search")
actions.push("Compare")

// Smart actions
if(object.type === "brand"){
actions.push("Buy Online")
}

if(object.type === "object"){
actions.push("How to Use")
}

return actions

}

generateUIHints(object){

return {
highlight: true,
showPanel: true,
animate: true,
voiceReady: true,
color: this.getColor(object.type)
}

}

getColor(type){

switch(type){

case "brand": return "#00FFD1"
case "object": return "#4DA3FF"
case "inferred": return "#FFC857"
default: return "#FFFFFF"

}

}

getHistory(){
return this.history
}

getCurrent(){
return this.currentObject
}

}

const Brain = new ObjectBrain()

export default Brain
