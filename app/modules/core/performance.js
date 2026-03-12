// modules/core/performance.js

import { EventBus } from "./events.js"

class PerformanceManager {

constructor(){

this.frameTimes = []
this.maxSamples = 60

this.lastFrame = performance.now()

this.fps = 0

this.aiTimes = []

this.targetFPS = 30

this.dynamicThrottle = false

}

trackFrame(){

const now = performance.now()

const delta = now - this.lastFrame
this.lastFrame = now

this.frameTimes.push(delta)

if(this.frameTimes.length > this.maxSamples){
this.frameTimes.shift()
}

const avg = this.frameTimes.reduce((a,b)=>a+b,0) / this.frameTimes.length

this.fps = Math.round(1000 / avg)

EventBus.emit("fpsUpdate", this.fps)

this.adaptiveScaling()

}

startAITimer(){

this.aiStart = performance.now()

}

endAITimer(){

const duration = performance.now() - this.aiStart

this.aiTimes.push(duration)

if(this.aiTimes.length > this.maxSamples){
this.aiTimes.shift()
}

EventBus.emit("aiInferenceTime", duration)

}

adaptiveScaling(){

if(this.fps < this.targetFPS - 5){

this.dynamicThrottle = true
EventBus.emit("performanceThrottle")

}

else{

this.dynamicThrottle = false

}

}

shouldSkipFrame(){

return this.dynamicThrottle

}

getStats(){

const aiAvg = this.aiTimes.length
? this.aiTimes.reduce((a,b)=>a+b,0)/this.aiTimes.length
:0

return {

fps: this.fps,
avgAIInference: Math.round(aiAvg),
framesTracked: this.frameTimes.length

}

}

}


export const Performance = new PerformanceManager()
