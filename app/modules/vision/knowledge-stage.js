// ================= IMPORT =================

import { aggregateKnowledge } from "../knowledge/knowledge-aggregator.js"
import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= CONFIG =================

const MIN_CONFIDENCE = CONFIG.KNOWLEDGE_THRESHOLD || 0.35



// ================= MAIN STAGE =================

export async function runKnowledgeStage(reasoningResults){

try{

emit("vision:knowledge:start")

const knowledgeResults = []

for(const item of reasoningResults){

const knowledge = await processKnowledge(item)

knowledgeResults.push(knowledge)

}

emit("vision:knowledge:complete", knowledgeResults)

return knowledgeResults

}catch(err){

console.error("Knowledge stage error", err)

emit("vision:knowledge:error")

return []

}

}



// ================= PROCESS =================

async function processKnowledge(reasoning){

const knowledge = await aggregateKnowledge(reasoning)

return {

name: reasoning.guess || reasoning.object,

confidence: reasoning.confidence,

description: knowledge.description,

material: knowledge.material,

history: knowledge.history,

manufacturing: knowledge.manufacturing,

images: knowledge.images,

futureIdeas: knowledge.futureIdeas,

category: reasoning.category,

purpose: reasoning.purpose

}

}



// ================= FILTER =================

export function filterKnowledge(results){

return results.filter(r => r.confidence >= MIN_CONFIDENCE)

}



// ================= PRIMARY =================

export function getPrimaryKnowledge(results){

if(!results || results.length === 0) return null

return results.reduce((best,current)=>{

return current.confidence > best.confidence ? current : best

})

}



// ================= SUMMARY =================

export function knowledgeSummary(results){

return results.map(r => {

return `${r.name} (${(r.confidence*100).toFixed(0)}%)`

})

}
