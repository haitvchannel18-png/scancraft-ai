// ==============================
// 💀 ScanCraft AI - ULTRA APP CORE
// ==============================

// 🎥 CAMERA
import Camera from "./modules/camera/camera.js"

// 🧠 AI CORE
import VisionAI from "./modules/ai/vision-ai.js"
import ContextAI from "./modules/ai/context.js"
import VisualReasoning from "./modules/ai/visual-reasoning.js"
import ObjectChat from "./modules/ai/object-chat.js"
import ResultFormatter from "./modules/ai/result-formatter.js"

// 🧠 LEARNING
import PatternLearner from "./modules/learning-ai/pattern-learner.js"

// 💰 COMMERCE
import PriceAggregator from "./modules/commerce/price-aggregator.js"

// 🧠 MEMORY
import CacheManager from "./modules/memory/cache-manager.js"

// 🔊 AUDIO
import SoundManager from "./modules/audio/sound-manager.js"

// 🎨 UI
import HistoryUI from "./modules/ui/history-ui.js"
import AnimationEngine from "./modules/ui/animation-engine.js"

// ⚡ CORE
import Performance from "./modules/core/performance.js"
import EventBus from "./modules/core/events.js"

// ==============================
// ⚡ STATE
// ==============================

let scanning = false
let lastFrameTime = 0

// ==============================
// 🚀 INIT SYSTEM
// ==============================

async function init(){

console.log("🚀 ScanCraft AI ULTRA BOOT")

// 🎥 camera
await Camera.init(document.getElementById("camera"))

// 🎨 UI init
HistoryUI.init()

// 🎮 controls
bindUI()

// 🔊 audio unlock
initAudio()

// ⚡ performance monitor
Performance.start()

}

// ==============================
// 🎮 UI BINDINGS
// ==============================

function bindUI(){

document.getElementById("scan-btn").onclick = startScan
document.getElementById("stop-btn").onclick = stopScan
document.getElementById("history-btn").onclick = ()=>HistoryUI.show()

}

// ==============================
// 🔊 AUDIO INIT
// ==============================

function initAudio(){

document.getElementById("start-audio").onclick = ()=>{
SoundManager.unlock()
document.getElementById("audio-unlock").style.display = "none"
}

}

// ==============================
// 🔍 MAIN SCAN PIPELINE
// ==============================

async function startScan(){

if(scanning) return
scanning = true

toggleLoading(true)
SoundManager.play("scan-start")

try{

// 🎥 FRAME CAPTURE
const frame = Camera.captureFrame()

// ⚡ PERFORMANCE THROTTLE
if(Date.now() - lastFrameTime < 100){
return
}
lastFrameTime = Date.now()

// ==============================
// 🧠 STAGE 1 — DETECTION
// ==============================

const vision = await VisionAI.detect(frame)

// ==============================
// 🧠 STAGE 2 — CONTEXT
// ==============================

const context = await ContextAI.analyze(vision)

// ==============================
// 🧠 STAGE 3 — VISUAL REASONING
// ==============================

const reasoning = await VisualReasoning.process({
vision,
context
})

// ==============================
// 🧠 STAGE 4 — AI EXPLANATION
// ==============================

const explanation = await ObjectChat.explain(reasoning)

// ==============================
// 💰 STAGE 5 — PRICE SEARCH
// ==============================

const price = await PriceAggregator.search(vision.label)

// ==============================
// 🧠 STAGE 6 — LEARNING
// ==============================

PatternLearner.learn(vision.label)
PatternLearner.save()

// ==============================
// 💾 STAGE 7 — CACHE
// ==============================

CacheManager.set("last_scan", {
vision,
context,
reasoning,
price
})

// ==============================
// 🎯 STAGE 8 — FORMAT RESULT
// ==============================

const result = ResultFormatter.format({
vision,
context,
reasoning,
explanation,
price
})

// ==============================
// 🎨 UI RENDER
// ==============================

renderResult(result)

// ==============================
// 🎧 FEEDBACK
// ==============================

SoundManager.play("scan-complete")
AnimationEngine.pulse("object-panel")

// ==============================
// 📡 EVENT EMIT
// ==============================

EventBus.emit("scanComplete", result)

}catch(error){

handleError(error)

}finally{

toggleLoading(false)
scanning = false

}

}

// ==============================
// ⛔ STOP SCAN
// ==============================

function stopScan(){

scanning = false
toggleLoading(false)

SoundManager.play("click")

}

// ==============================
// 🎨 UI RENDER ENGINE
// ==============================

function renderResult(data){

const panel = document.getElementById("object-panel")

panel.classList.remove("hidden")

document.getElementById("object-name").innerText =
data?.vision?.label || "Unknown Object"

document.getElementById("object-info").innerText =
data?.explanation || "AI could not generate details"

}

// ==============================
// ⚡ LOADING UI
// ==============================

function toggleLoading(state){

document.getElementById("loading").classList.toggle("hidden", !state)

}

// ==============================
// ❌ ERROR HANDLER
// ==============================

function handleError(error){

console.error("💀 ERROR:", error)

SoundManager.play("error")

}

// ==============================
// 🚀 START APP
// ==============================

init()
