/**
 * ScanCraft AI
 * Performance Monitor
 * Real-time performance analytics
 */

import Events from "./events.js"

class PerformanceMonitor {

constructor(){

this.stats = {
fps:0,
frameTime:0,
pipelineTime:0,
inferenceTime:0,
memory:0,
modules:{}
}

this.frameCount = 0
this.lastFrameTime = performance.now()

this.timers = {}

}

start(label){

this.timers[label] = performance.now()

}

end(label){

const start = this.timers[label]

if(!start) return

const duration = performance.now() - start

this.stats.modules[label] = duration

Events.emit("performance:module",{
module:label,
time:duration
})

delete this.timers[label]

}

frame(){

this.frameCount++

const now = performance.now()

const delta = now - this.lastFrameTime

if(delta >= 1000){

this.stats.fps = this.frameCount

this.frameCount = 0

this.lastFrameTime = now

Events.emit("performance:fps",this.stats.fps)

}

}

pipelineStart(){

this.timers.pipeline = performance.now()

}

pipelineEnd(){

const duration = performance.now() - this.timers.pipeline

this.stats.pipelineTime = duration

Events.emit("performance:pipeline",duration)

}

inferenceStart(){

this.timers.inference = performance.now()

}

inferenceEnd(){

const duration = performance.now() - this.timers.inference

this.stats.inferenceTime = duration

Events.emit("performance:ai",duration)

}

updateMemory(){

if(performance.memory){

this.stats.memory = performance.memory.usedJSHeapSize

Events.emit("performance:memory",this.stats.memory)

}

}

getStats(){

return this.stats

}

}

const Monitor = new PerformanceMonitor()

export default Monitor
