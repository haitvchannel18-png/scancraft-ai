/**
 * ScanCraft AI
 * Adaptive Detection Engine
 * Dynamically selects best detection strategy
 */

import Events from "./events.js"
import GPU from "./gpu-optimizer.js"
import AdaptiveNetwork from "./network-adaptive.js"

class AdaptiveDetection {

constructor(){

this.strategy = "standard"

}

analyzeFrame(frame){

if(!frame) return "standard"

const pixels = frame.width * frame.height

if(pixels > 2000000){

return "high-res"

}

if(pixels < 500000){

return "low-res"

}

return "standard"

}

chooseStrategy(frame){

const scene = this.analyzeFrame(frame)

const networkMode = AdaptiveNetwork.getMode()

const gpu = GPU.getInfo()

if(networkMode === "slow"){

this.strategy = "lightweight"

}

else if(scene === "high-res" && gpu.webgpu){

this.strategy = "high-accuracy"

}

else if(scene === "low-res"){

this.strategy = "fast"

}

else{

this.strategy = "standard"

}

Events.emit("detection:strategy",this.strategy)

return this.strategy

}

getStrategy(){

return this.strategy

}

shouldReduceResolution(){

return this.strategy === "lightweight"

}

shouldUseHighAccuracy(){

return this.strategy === "high-accuracy"

}

shouldUseFastMode(){

return this.strategy === "fast"

}

}

const Adaptive = new AdaptiveDetection()

export default Adaptive
