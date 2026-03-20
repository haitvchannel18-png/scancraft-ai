/**
 * ScanCraft AI
 * Hallucination Filter (AI Safety + Truth Control)
 */

import Events from "../core/events.js"
import Performance from "../core/performance.js"

class HallucinationFilter {

clean(response){

if(!response) return ""

Performance.start("hallucination-filter")

let safe = response

// ⚠️ 1. Remove overconfident phrases
safe = this.removeOverconfidence(safe)

// 🧠 2. Add uncertainty if needed
safe = this.addUncertainty(safe)

// 🔍 3. Detect hallucinated patterns
safe = this.detectHallucination(safe)

// ✂️ 4. Clean unsafe claims
safe = this.cleanUnsafeClaims(safe)

Performance.end("hallucination-filter")

Events.emit("ai:safe-response", safe)

return safe

}

// ❌ REMOVE FAKE CONFIDENCE
removeOverconfidence(text){

const patterns = [
"definitely",
"100%",
"always",
"guaranteed",
"certainly"
]

let cleaned = text

for(const p of patterns){
cleaned = cleaned.replace(new RegExp(p,"gi"), "")
}

return cleaned

}

// 🤔 ADD UNCERTAINTY (if needed)
addUncertainty(text){

if(text.length < 30){
return text + " This is based on available data."
}

return text

}

// 🚨 DETECT HALLUCINATION
detectHallucination(text){

// simple check: unrealistic claims
if(text.includes("impossible") && text.includes("always")){
return "AI is unsure about this object. Please verify manually."
}

return text

}

// 🧹 CLEAN UNSAFE CLAIMS
cleanUnsafeClaims(text){

// prevent fake facts like "invented in 1800" without source
if(text.match(/\d{4}/) && !text.includes("approx")){
return text.replace(/\d{4}/g, "unknown year")
}

return text

}

}

const Hallucination = new HallucinationFilter()

export default Hallucination
