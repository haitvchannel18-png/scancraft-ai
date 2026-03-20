// 🔥 CORE CONFIG
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

// ⚡ STATE
let scanning = false
let currentUser = null

//////////////////////////////////////////////////////
// 🚀 INIT
//////////////////////////////////////////////////////

async function init(){

console.log("🔥 ScanCraft AI Started")

// 🎥 Camera start
await Camera.start("camera")

// 🔐 Auth listener
Auth.onChange(user=>{
currentUser = user
console.log("👤 User:", user)
})

// 🔘 Buttons
document.getElementById("scan-btn").onclick = startScan
document.getElementById("stop-btn").onclick = stopScan

// 🔊 Mobile audio unlock
document.getElementById("start-audio").onclick = ()=>{
SoundManager.unlock()
document.getElementById("audio-unlock").style.display = "none"
}

}

//////////////////////////////////////////////////////
// 🔍 START SCAN
//////////////////////////////////////////////////////

async function startScan(){

if(scanning) return

scanning = true

document.getElementById("loading").classList.remove("hidden")

SoundManager.play("scan-start")

try{

// 🎥 Capture frame
const frame = Camera.capture()

// 🧠 Vision
const vision = await VisionAI.detect(frame)

// 🧠 Context
const context = await ContextAI.analyze(vision)

// 💬 Explanation
const explanation = await ObjectChat.explain(context)

// 💰 Price
const price = await PriceAggregator.search(vision.label)

// 🧠 Learn
PatternLearner.learn(vision.label)

// 🧠 Format
const result = ResultFormatter.format({
vision,
context,
explanation,
price
})

// 🎨 UI Update
showResult(result)

// 🔊 Sound
SoundManager.play("scan-complete")

// ☁️ Cloud Save
if(currentUser){
await CloudSync.saveScan(currentUser.uid, result)
}

// 💾 Local Save
PatternLearner.save()

}catch(e){

console.error("💀 Scan Error:", e)

}finally{

document.getElementById("loading").classList.add("hidden")

scanning = false

}

}

//////////////////////////////////////////////////////
// ⛔ STOP SCAN
//////////////////////////////////////////////////////

function stopScan(){

scanning = false

SoundManager.play("click")

document.getElementById("loading").classList.add("hidden")

}

//////////////////////////////////////////////////////
// 🎨 SHOW RESULT
//////////////////////////////////////////////////////

function showResult(data){

const panel = document.getElementById("object-panel")

panel.classList.remove("hidden")

document.getElementById("object-name").innerText = data.vision.label || "Unknown"

document.getElementById("object-info").innerText =
data.explanation || "No details available"

}

//////////////////////////////////////////////////////
// 🔐 LOGIN (OPTIONAL ADD BUTTON IF NEEDED)
//////////////////////////////////////////////////////

window.login = async ()=>{

try{

const user = await Auth.login()
console.log("🔥 LOGIN:", user)

}catch(e){
console.error(e)
}

}

//////////////////////////////////////////////////////
// 🚀 START APP
//////////////////////////////////////////////////////

init()
