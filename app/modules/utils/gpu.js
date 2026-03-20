// modules/utils/gpu.js

class GPUManager {

constructor(){
this.mode = "cpu"
this.capabilities = {}
}

// 🔍 detect capabilities
async detect(){

this.capabilities.webgl = this.hasWebGL()
this.capabilities.webgpu = this.hasWebGPU()
this.capabilities.wasm = this.hasWASM()

this.selectBestMode()

}

// ⚙️ select best
selectBestMode(){

if(this.capabilities.webgpu){
this.mode = "webgpu"
}
else if(this.capabilities.webgl){
this.mode = "webgl"
}
else if(this.capabilities.wasm){
this.mode = "wasm"
}
else{
this.mode = "cpu"
}

console.log("⚡ GPU MODE:", this.mode)

}

// 🔎 check WebGL
hasWebGL(){

try{
const canvas = document.createElement("canvas")
return !!(window.WebGLRenderingContext && canvas.getContext("webgl"))
}catch{
return false
}

}

// 🔎 check WebGPU
hasWebGPU(){

return !!navigator.gpu

}

// 🔎 check WASM
hasWASM(){

try{
return typeof WebAssembly === "object"
}catch{
return false
}

}

// 🎯 get mode
getMode(){
return this.mode
}

// ⚡ optimize inference provider
getONNXProvider(){

switch(this.mode){

case "webgpu":
return ["webgpu"]

case "webgl":
return ["webgl"]

case "wasm":
return ["wasm"]

default:
return ["cpu"]
}

}

}

export default new GPUManager()
