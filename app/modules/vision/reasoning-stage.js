// modules/vision/reasoning-stage.js

import { EventBus } from "../core/events.js"
import { runReasoningEngine } from "../ai/reasoning-engine.js"
import { rankResults } from "../reasoning/result-ranker.js"

const CONFIDENCE_THRESHOLD = 0.35

export async function runReasoningStage(input){

try{

EventBus.emit("visionStageStart","reasoning")

const { detection, logoResults, similarityResults } = input

if(!detection || detection.length === 0){
return []
}

const results = []

for(const obj of detection){

const brand = findBrandForObject(obj,logoResults)

const similar = findSimilarForObject(obj,similarityResults)

const reasoningInput = {
label: obj.label,
confidence: obj.confidence,
brand,
similar
}

const reasoning = await runReasoningEngine(reasoningInput)

results.push(reasoning)

}

const ranked = rankResults(results)

const filtered = ranked.filter(r => r.confidence >= CONFIDENCE_THRESHOLD)

EventBus.emit("visionReasoningComplete",filtered)

return filtered

}catch(err){

console.error("Reasoning stage error",err)

EventBus.emit("visionReasoningError",err)

return []

}

}



function findBrandForObject(object, logos){

if(!logos) return null

for(const logo of logos){

if(logo.object === object.label){
return logo.brand
}

}

return null

}



function findSimilarForObject(object, similarity){

if(!similarity) return []

for(const item of similarity){

if(item.object === object.label){
return item.similar
}

}

return []

}
