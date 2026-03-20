/**
 * ScanCraft AI
 * Knowledge Fusion Engine (Reasoning + Knowledge + Context Merge)
 */

import Events from "../core/events.js"
import Performance from "../core/performance.js"

class KnowledgeFusion {

merge(reasoning, knowledge){

if(!reasoning) return null

Performance.start("knowledge-fusion")

// 🔗 FINAL MERGED OBJECT
const fused = {

object: reasoning.object,

// 🎯 CORE
category: this.resolveField(reasoning.category, knowledge?.category),
material: this.resolveField(reasoning.material, knowledge?.material),

// 📘 KNOWLEDGE
description: knowledge?.description || this.generateFallbackDescription(reasoning),
history: knowledge?.history || null,
future: knowledge?.future || reasoning.future,

// ⚡ REASONING
uses: reasoning.uses || [],
risk: reasoning.risk,

// 📊 META
confidence: this.computeConfidence(reasoning, knowledge),
source: this.detectSource(knowledge),

// 🧠 ENHANCED
tags: this.generateTags(reasoning, knowledge),
relatedObjects: knowledge?.related || [],
intelligenceScore: reasoning.intelligenceScore || 50

}

Performance.end("knowledge-fusion")

Events.emit("fusion:complete", fused)

return fused

}

// 🔥 FIELD RESOLUTION (smart priority)
resolveField(primary, secondary){

if(primary && primary !== "unknown") return primary
if(secondary) return secondary

return "unknown"

}

// 📘 FALLBACK DESCRIPTION (AI style)
generateFallbackDescription(reasoning){

return `${reasoning.object} is a real-world object commonly used in daily life. It belongs to the ${reasoning.category} category and is typically made of ${reasoning.material}.`

}

// 📊 CONFIDENCE CALCULATION
computeConfidence(reasoning, knowledge){

let score = reasoning.confidence * 50

if(knowledge) score += 30
if(reasoning.category !== "unknown") score += 10
if(reasoning.material !== "unknown") score += 10

return Math.min(100, Math.round(score))

}

// 🌐 SOURCE DETECTION
detectSource(knowledge){

if(!knowledge) return "reasoning-only"
if(knowledge.source === "offline") return "offline-db"
if(knowledge.source === "online") return "web-ai"

return "hybrid"

}

// 🧠 TAG GENERATOR (for search & UI)
generateTags(reasoning, knowledge){

const tags = []

if(reasoning.category) tags.push(reasoning.category)
if(reasoning.material) tags.push(reasoning.material)

if(knowledge?.tags){
tags.push(...knowledge.tags)
}

return [...new Set(tags)]

}

}

const Fusion = new KnowledgeFusion()

export default Fusion
