// ================= PERFORMANCE STATE =================

let targetFPS = 20
let frameInterval = 1000 / targetFPS

let lastFrameTime = 0
let frameCount = 0

let gpuMode = true

let memoryLimit = 200 * 1024 * 1024 // 200MB


// ================= FPS CONTROLLER =================

export function shouldProcessFrame(){

const now = performance.now()

if(now - lastFrameTime < frameInterval){
return false
}

lastFrameTime = now
frameCount++

return true

}


// ================= DYNAMIC FPS =================

export function adjustFPS(deviceSpeed){

if(deviceSpeed === "slow"){

targetFPS = 10

}

else if(deviceSpeed === "medium"){

targetFPS = 15

}

else{

targetFPS = 25

}

frameInterval = 1000 / targetFPS

}


// ================= DEVICE DETECTION =================

export function detectDeviceCapability(){

const cores = navigator.hardwareConcurrency || 2

if(cores <= 2){

adjustFPS("slow")

}

else if(cores <= 6){

adjustFPS("medium")

}

else{

adjustFPS("fast")

}

}


// ================= MEMORY MONITOR =================

export function monitorMemory(){

if(!performance.memory) return

const used = performance.memory.usedJSHeapSize

if(used > memoryLimit){

cleanupMemory()

}

}


// ================= MEMORY CLEANUP =================

function cleanupMemory(){

console.warn("Memory cleanup triggered")

if(window.gc){
gc()
}

}


// ================= GPU MODE =================

export function enableGPU(){

gpuMode = true

}

export function disableGPU(){

gpuMode = false

}

export function isGPUEnabled(){

return gpuMode

}


// ================= FRAME SKIP =================

let skipCounter = 0

export function shouldSkipFrame(){

skipCounter++

if(skipCounter % 2 === 0){

return true

}

return false

}


// ================= MODEL CACHE =================

const modelCache = {}

export function cacheModel(name, model){

modelCache[name] = model

}

export function getCachedModel(name){

return modelCache[name]

}


// ================= PERFORMANCE REPORT =================

export function getPerformanceStats(){

return {

fps: targetFPS,

framesProcessed: frameCount,

gpu: gpuMode,

memoryUsed: performance.memory
? performance.memory.usedJSHeapSize
: null

}

}
