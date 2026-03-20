// app/app.js

import CONFIG from "./modules/utils/config.js"
import { EventBus } from "./modules/core/events.js"

// 🎥 Camera
import Camera from "./modules/camera/camera.js"

// 🧠 Detection
import Detector from "./modules/detection/detector.js"

// 🤖 AI Brain
import ReasoningEngine from "./modules/ai/reasoning-engine.js"
import VisionAI from "./modules/ai/vision-ai.js"

// 🔊 Sound
import SoundLoader from "./modules/audio/sound-loader.js"
import SoundManager from "./modules/audio/sound-manager.js"
import UISounds from "./modules/audio/ui-sounds.js"

// 🎤 Voice
import AutoVoice from "./modules/audio/auto-voice.js"

// 🎨 UI
import ScanOverlay from "./modules/ui/scan-overlay.js"
import ObjectPanel from "./modules/ui/object-panel.js"
import LoadingUI from "./modules/ui/loading-visuals.js"

// ⚡ Performance
import PerformanceMonitor from "./modules/core/performance-monitor.js"

// =============================
// 🚀 APP ENGINE
// =============================

class ScanCraftApp {

constructor(){
this.video = null
this.isRunning = false
}

// 🔥 INIT APP
async init(){

console.log("🚀 ScanCraft AI Starting...")

// UI Elements
this.video = document.getElementById("camera")

// 🎧 Load Sounds
SoundLoader.init()

// 🔊 Background ambience
SoundManager.loop("background",0.15)

// 🎤 Voice Auto
AutoVoice.init()

// ⚡ Performance monitor
PerformanceMonitor.start()

// 🎥 Camera init
await Camera.init(this.video)

// 🎯 Start pipeline
this.startPipeline()

}

// =============================
// 🔥 MAIN PIPELINE
// =============================

startPipeline(){

if(this.isRunning) return

this.isRunning = true

Camera.startStreaming(async (frame)=>{

try{

// ⚡ loading animation
LoadingUI.show()

// 🔍 detection
const detections = await Detector.detect(frame)

if(!detections || detections.length === 0){
LoadingUI.hide()
return
}

// 🎯 best object
const object = detections[0]

// 🧠 vision AI
const visionData = await VisionAI.process(object)

// 🧠 reasoning
const reasoning = await ReasoningEngine({
label: object.label,
similarObjects: visionData.similar || []
})

// 🎨 UI update
ScanOverlay.draw(object)
ObjectPanel.show(reasoning)

// 🔊 scan complete sound
UISounds.success()

// 📡 emit event (voice trigger)
EventBus.emit("resultReady",{
summary: `${reasoning.object} detected`,
data: reasoning
})

// ⚡ performance log
PerformanceMonitor.mark("frameProcessed")

}catch(e){
console.error(e)
UISounds.error()
}

finally{
LoadingUI.hide()
}

})

}

// =============================
// 🛑 STOP
// =============================

stop(){

Camera.stopStreaming()
this.isRunning = false

}

}

// =============================
// 🚀 BOOTSTRAP
// =============================

const app = new ScanCraftApp()

window.addEventListener("load", ()=>{
app.init()
})

// optional debug
window.app = app
