/**
 * ScanCraft AI
 * GPU Optimizer
 * Detects and enables best GPU acceleration
 */

import Events from "./events.js"

class GPUOptimizer {

constructor(){

this.info = {
webgl:false,
webgpu:false,
cores:navigator.hardwareConcurrency || 2,
deviceMemory:navigator.deviceMemory || 2
}

}

detectWebGL(){

try{

const canvas = document.createElement("canvas")

const gl = canvas.getContext("webgl") ||
           canvas.getContext("experimental-webgl")

this.info.webgl = !!gl

}catch(e){

this.info.webgl = false

}

}

async detectWebGPU(){

if("gpu" in navigator){

this.info.webgpu = true

}else{

this.info.webgpu = false

}

}

async detect(){

this.detectWebGL()

await this.detectWebGPU()

Events.emit("gpu:detected",this.info)

return this.info

}

getExecutionProvider(){

if(this.info.webgpu){

return "webgpu"

}

if(this.info.webgl){

return "webgl"

}

return "wasm"

}

getInfo(){

return this.info

}

}

const GPU = new GPUOptimizer()

export default GPU
