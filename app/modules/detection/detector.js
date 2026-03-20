/**
 * ScanCraft AI
 * Unified Detector Engine (YOLO + CLIP + LOGO Fusion)
 */

import Events from "../core/events.js"
import YOLO from "./yolo.js"
import CLIP from "./clip.js"
import Logo from "./logo-detector.js"
import Performance from "../core/performance.js"

class Detector {

constructor(){

this.isReady = false

}

async init(){

await Promise.all([
YOLO.load(),
CLIP.load(),
Logo.load()
])

this.isReady = true

Events.emit("detector:ready")

}

async detect(frame){

if(!this.isReady) return []

Performance.start("detector-total")

// Run all AI models in parallel
const [yoloResults, clipResult, logoResult] = await Promise.all([
YOLO.detect(frame),
CLIP.analyze(frame),
Logo.detect(frame)
])

// Merge results
const finalResults = this.fuseResults(
yoloResults,
clipResult,
logoResult
)

Performance.end("detector-total")

Events.emit("detector:result", finalResults)

return finalResults

}

fuseResults(yoloResults, clipResult, logoResult){

const results = []

// 1. YOLO objects (main detection)
yoloResults.forEach(obj=>{

results.push({
type: "object",
label: obj.label,
confidence: obj.confidence,
bbox: obj.bbox,
source: "yolo"
})

})

// 2. CLIP fallback (unknown object)
if(results.length === 0 && clipResult){

results.push({
type: "inferred",
label: clipResult.label,
confidence: clipResult.confidence,
bbox: null,
source: "clip"
})

}

// 3. Brand detection
if(logoResult && logoResult.brand){

results.push({
type: "brand",
label: logoResult.brand,
confidence: logoResult.confidence,
bbox: null,
source: "logo"
})

}

// 4. Confidence sorting
results.sort((a,b)=> b.confidence - a.confidence)

// 5. Add smart hint
const enriched = results.map(item=>{

return {
...item,
hint: this.generateHint(item)
}

})

return enriched

}

generateHint(item){

if(item.type === "object"){

return `Detected ${item.label}`

}

if(item.type === "brand"){

return `Brand: ${item.label}`

}

if(item.type === "inferred"){

return `Looks like ${item.label}`

}

return ""

}

}

const MainDetector = new Detector()

export default MainDetector
