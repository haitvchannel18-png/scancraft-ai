/**
 * ScanCraft AI
 * Confidence Engine (Trust + Reliability Scoring)
 */

import Events from "../core/events.js"
import Performance from "../core/performance.js"

class ConfidenceEngine {

score(data){

if(!data) return null

Performance.start("confidence")

// 📊 base score
let score = this.baseScore(data)

// 🧠 apply factors
score += this.knowledgeBoost(data)
score += this.consensusBoost(data)
score += this.contextBoost(data)
score -= this.riskPenalty(data)

// 🔥 normalize
score = this.normalize(score)

// 📈 level
const level = this.getLevel(score)

// 🎯 final result
const result = {
...data,
confidenceScore: score,
confidenceLevel: level,
trustLabel: this.getTrustLabel(score)
}

Performance.end("confidence")

Events.emit("confidence:ready", result)

return result

}

// ⚡ BASE SCORE
baseScore(data){

if(!data.confidence) return 50

return data.confidence

}

// 📚 KNOWLEDGE BOOST
knowledgeBoost(data){

if(data.description) return 10
return 0

}

// 🎯 CONSENSUS BOOST
consensusBoost(data){

if(data.agreementScore){
return Math.round(data.agreementScore * 0.1)
}

return 0

}

// 🌍 CONTEXT BOOST
contextBoost(data){

if(data.category !== "unknown") return 5
return 0

}

// ⚠️ RISK PENALTY
riskPenalty(data){

if(data.risk === "Potentially dangerous"){
return 5
}

return 0

}

// 🔄 NORMALIZATION (0–100)
normalize(score){

return Math.max(0, Math.min(100, Math.round(score)))

}

// 📊 LEVELS
getLevel(score){

if(score > 85) return "high"
if(score > 60) return "medium"
return "low"

}

// 🏷 TRUST LABEL
getTrustLabel(score){

if(score > 90) return "Highly Reliable"
if(score > 75) return "Reliable"
if(score > 60) return "Moderate Confidence"
return "Low Confidence"

}

}

const Confidence = new ConfidenceEngine()

export default Confidence
