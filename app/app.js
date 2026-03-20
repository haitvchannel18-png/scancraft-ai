// 🔥 CORE IMPORTS
import CONFIG from "./modules/utils/config.js"

// 🎥 CAMERA
import Camera from "./modules/camera/camera.js"

// 🧠 AI
import VisionAI from "./modules/ai/vision-ai.js"
import ContextAI from "./modules/ai/context.js"
import ObjectChat from "./modules/ai/object-chat.js"
import ResultFormatter from "./modules/ai/result-formatter.js"

// 🧠 LEARNING
import PatternLearner from "./modules/learning-ai/pattern-learner.js"

// 💰 COMMERCE
import PriceAggregator from "./modules/commerce/price-aggregator.js"

// 🔊 AUDIO
import SoundManager from "./modules/audio/sound-manager.js"

// 🔐 AUTH
import Auth from "./modules/auth/auth.js"

// ☁️ CLOUD
import CloudSync from "./modules/cloud/cloud-sync.js"

// 🎨 UI
import Overlay from "./modules/ui/scan-overlay.js"
import Panel from "./modules/ui/object-panel.js"
import Loader from "./modules/ui/loading-visuals.js"

// ⚡ GLOBAL STATE
let currentUser = null

// 🚀 INIT APP
async function init(){

console.log("🔥 ScanCraft AI Started")

// 🎥 Camera start
await Camera.start("camera")

// 🔐 Auth listener
Auth.onChange(user=>{
currentUser = user
console.log("👤 User:", user)
})

// 🎤 Click scan (tap anywhere)
document.body.addEventListener("click", scanObject)

}

//////////////////////////////////////////////////////
// 🔍 MAIN SCAN PIPELINE (FULL AI FLOW 💀)
//////////////////////////////////////////////////////

async function scanObject(){

try{

Loader.show()
Overlay.show()

// 🔊 sound
SoundManager.play("scan-start")

// 🎥 Capture frame
const frame = Camera.capture()

// 🧠 Vision AI detect
const vision = await VisionAI.detect(frame)

// 🧠 Context understanding
const context = await ContextAI.analyze(vision)

// 💬 AI explanation
const explanation = await ObjectChat.explain(context)

// 🧠 Learning
PatternLearner.learn(vision.label)

// 💰 Price search
const price = await PriceAggregator.search(vision.label)

// 🧠 Format result
const result = ResultFormatter.format({
vision,
context,
explanation,
price
})

// 🎨 Show UI
Panel.show(result)

// 🔊 complete sound
SoundManager.play("scan-complete")

// ☁️ SAVE TO CLOUD
if(currentUser){
await CloudSync.saveScan(currentUser.uid, result)
}

// 💾 local save
PatternLearner.save()

}catch(e){

console.error("💀 ERROR:", e)

}finally{

Loader.hide()
Overlay.hide()

}

}

//////////////////////////////////////////////////////
// 🔐 LOGIN BUTTON
//////////////////////////////////////////////////////

document.getElementById("login-btn").onclick = async ()=>{

try{

const user = await Auth.login()

console.log("🔥 LOGIN SUCCESS:", user)

SoundManager.play("click")

}catch(e){

console.error("Login error", e)

}

}

//////////////////////////////////////////////////////
// 🚀 START APP
//////////////////////////////////////////////////////

init()
