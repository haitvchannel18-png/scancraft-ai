// modules/ai/confidence-filter.js

import { EventBus } from "../core/events.js"

class ConfidenceFilter {

constructor(){
this.threshold = 0.6
this.history = []
}

// 🔥 MAIN FILTER
filter(result){

if(!result) return null

const confidence = this.computeConfidence(result)

const validated = confidence >= this.threshold

const output = {
...result,
confidence,
valid: validated,
risk: this.assessRisk(confidence)
}

this.log(output)

EventBus.emit("confidenceChecked", output)

return output
}

// 🧠 CONFIDENCE CALCULATION (multi-factor)
computeConfidence(result){

let score = 0

// detection confidence
if(result.detectionScore) score += result.detectionScore * 0.4

// similarity score
if(result.similarityScore) score += result.similarityScore * 0.3

// reasoning confidence
if(result.reasoning?.confidence) score += result.reasoning.confidence * 0.3

return Math.min(1, score)
}

// ⚠️ RISK LEVEL
assessRisk(confidence){

if(confidence > 0.8) return "low"
if(confidence > 0.6) return "medium"
return "high"
}

// 📊 LOGGING (AI learning ready)
log(data){

this.history.push({
time: Date.now(),
data
})

// limit memory
if(this.history.length > 100){
this.history.shift()
}

}

}

export default new ConfidenceFilter()
