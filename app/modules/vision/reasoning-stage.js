// ================= IMPORT =================

import { runVisualReasoning } from "../ai/visual-reasoning.js"
import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= CONFIG =================

const MIN_CONFIDENCE = CONFIG.REASONING_THRESHOLD || 0.4



// ================= MAIN STAGE =================

export async function runReasoningStage(input){

try{

emit("vision:reasoning:start")

const results = []

for(const item of input){

const reasoning = await processReasoning(item)

results.push(reasoning)

}

emit("vision:reasoning:complete", results)

return results

}catch(err){

console.error("Reasoning stage failed", err)

emit("vision:reasoning:error")

return []

}

}



// ================= PROCESS =================

async function processReasoning(item){

const object = item.object
const brand = item.brand
const similarity = item.bestMatch

const reasoning = await runVisualReasoning({

object,
brand,
similarity

})

const confidence = computeConfidence(item)

return {

object,

brand: brand || null,

guess: similarity?.label || object,

confidence,

category: reasoning.category,

purpose: reasoning.purpose,

description: reasoning.description,

attributes: reasoning.attributes,

context: reasoning.context

}

}



// ================= CONFIDENCE =================

function computeConfidence(item){

let score = 0

if(item.brand){

score += 0.3

}

if(item.bestMatch){

score += item.bestMatch.score * 0.5

}

if(item.object){

score += 0.2

}

return Math.min(score,1)

}



// ================= SUMMARY =================

export function reasoningSummary(results){

return results.map(r => {

return `${r.guess} (${(r.confidence*100).toFixed(0)}%)`

})

}



// ================= FILTER =================

export function filterLowConfidence(results){

return results.filter(r => r.confidence >= MIN_CONFIDENCE)

}



// ================= PRIMARY RESULT =================

export function getPrimaryReasoning(results){

if(!results || results.length === 0) return null

return results.reduce((best,current)=>{

return current.confidence > best.confidence ? current : best

})

}
