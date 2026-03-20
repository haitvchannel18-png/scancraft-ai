// modules/learning-ai/confidence-adjuster.js

import FeedbackCollector from "./feedback-collector.js"
import AILogger from "../utils/ai-logger.js"

class ConfidenceAdjuster {

constructor(){
this.adjustments = {}
}

// 🎯 adjust confidence
adjust(object, baseConfidence){

const feedback = FeedbackCollector.getAll()
.filter(f => f.object === object)

if(!feedback.length) return baseConfidence

let score = baseConfidence

feedback.forEach(f => {
if(f.userFeedback === "correct") score += 0.05
if(f.userFeedback === "wrong") score -= 0.1
})

score = Math.max(0, Math.min(1, score))

this.adjustments[object] = score

AILogger.log("info","Confidence adjusted",{object,score})

return score

}

get(object){
return this.adjustments[object] || null
}

}

export default new ConfidenceAdjuster()
