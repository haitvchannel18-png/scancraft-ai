// ==============================
// 💀 ScanCraft AI - ULTRA APP CORE (FINAL)
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

// 💰 ADS
import AdsController from "./modules/ads/ads-controller.js"

// 💳 PAYMENT
import PaymentManager from "./modules/payment/payment-manager.js"
import BillingHandler from "./modules/payment/billing-handler.js"

// 👤 USER
import User from "./modules/auth/user.js"

// ==============================
// ⚡ STATE
// ==============================

let scanning = false
let lastFrameTime = 0

// ==============================
// 🚀 INIT SYSTEM
// ==============================

async function init(){

console.log("🚀 ScanCraft AI FINAL BUILD")

// 🎥 camera
await Camera.init(document.getElementById("camera"))

// 🎨 UI init
HistoryUI.init()

// 💳 billing init
BillingHandler.init()

// 👤 guest user (offline support)
if(!User.get()){
User.createGuest()
}

// 🎮 controls
bindUI()

// 🔊 audio unlock
initAudio()

// ⚡ performance monitor
Performance.start()

// 💰 banner ad (start)
AdsController.showBanner()

}

// ==============================
// 🎮 UI BINDINGS
// ==============================

function bindUI(){

document.getElementById("scan-btn").onclick = startScan
document.getElementById("stop-btn").onclick = stopScan
document.getElementById("history-btn").onclick = ()=>HistoryUI.show()

// 💳 PRO BUTTON (important)
const proBtn = document.getElementById("pro-btn")
if(proBtn){
proBtn.onclick = ()=>PaymentManager.startPurchase()
}

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

// 🎥 FRAME
const frame = Camera.captureFrame()

// ⚡ THROTTLE
if(Date.now() - lastFrameTime < 300){
return
}
lastFrameTime = Date.now()

// ==============================
// 🧠 CACHE BOOST (🔥 SPEED)
// ==============================

const cached = CacheManager.get("last_scan")

if(cached && cached.vision?.label){
renderResult(cached)
toggleLoading(false)
scanning = false
return
}

// ==============================
// 🧠 STAGE 1 — DETECTION
// ==============================

const vision = await VisionAI.detect(frame)

// ==============================
// 🧠 STAGE 2 — CONTEXT
// ==============================

const context = await ContextAI.analyze(vision)

// ==============================
// 🧠 STAGE 3 — REASONING
// ==============================

const reasoning = await VisualReasoning.process({
vision,
context
})

// ==============================
// 🧠 STAGE 4 — AI EXPLAIN
// ==============================

const explanation = await ObjectChat.explain(reasoning)

// ==============================
// 💰 STAGE 5 — PRICE
// ==============================

const price = await PriceAggregator.search(vision.label)

// ==============================
// 🧠 LEARNING
// ==============================

PatternLearner.learn(vision.label)
PatternLearner.save()

// ==============================
// 💾 CACHE SAVE
// ==============================

CacheManager.set("last_scan", {
vision,
context,
reasoning,
explanation,
price
})

// ==============================
// 🎯 FORMAT
// ==============================

const result = ResultFormatter.format({
vision,
context,
reasoning,
explanation,
price
})

// ==============================
// 🎨 UI
// ==============================

renderResult(result)

// ==============================
// 💰 ADS TRIGGER
// ==============================

AdsController.showInterstitial()

// ==============================
// 🔊 FEEDBACK
// ==============================

SoundManager.play("scan-complete")
AnimationEngine.pulse("object-panel")

// ==============================
// 📡 EVENT
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
// ⛔ STOP
// ==============================

function stopScan(){

scanning = false
toggleLoading(false)

SoundManager.play("click")

}

// ==============================
// 🎨 UI RENDER
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
// ⚡ LOADING
// ==============================

function toggleLoading(state){

document.getElementById("loading").classList.toggle("hidden", !state)

}

// ==============================
// ❌ ERROR
// ==============================

function handleError(error){

console.error("💀 ERROR:", error)

SoundManager.play("error")

}

// ==============================
// 🚀 START
// ==============================

init()
