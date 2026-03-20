// modules/learning/model-adaptation.js

import ConfigManager from "../utils/config-manager.js"
import AILogger from "../utils/ai-logger.js"

class ModelAdaptation {

constructor(){
this.history = []
this.maxHistory = 50
}

// ⚙️ adapt system based on performance
adapt(metrics){

if(!metrics) return

const { fps, inferenceTime } = metrics

// 🧠 store history
this.history.push({ fps, inferenceTime, time: Date.now() })
if(this.history.length > this.maxHistory){
this.history.shift()
}

// 🎯 FPS based tuning
if(fps < 15){

ConfigManager.set("PERFORMANCE.targetFPS", 20)
ConfigManager.set("AI.maxConcurrentInference", 1)

AILogger.log("warn","Low FPS detected → reducing load",{fps})

}

// ⚡ inference slow
if(inferenceTime > 200){

ConfigManager.set("AI.maxConcurrentInference", 1)
ConfigManager.set("MODEL.lazyLoad", true)

AILogger.log("warn","Slow inference → optimizing",{inferenceTime})

}

// 🚀 good performance → scale up
if(fps > 28 && inferenceTime < 120){

ConfigManager.set("AI.maxConcurrentInference", 3)
ConfigManager.set("MODEL.lazyLoad", false)

AILogger.log("info","Performance good → scaling up",{fps})

}

}

// 📊 get recent stats
getStats(){
return this.history
}

}

export default new ModelAdaptation()
