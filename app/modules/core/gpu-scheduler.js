/**
 * ScanCraft AI
 * GPU Task Scheduler
 * Controls GPU workload for AI models
 */

import Events from "./events.js"
import GPU from "./gpu-optimizer.js"

class GPUScheduler {

constructor(){

this.queue = []

this.activeTasks = 0

this.maxParallel = 1

this.device = null

}

async init(){

const info = await GPU.detect()

if(info.webgpu || info.webgl){

this.maxParallel = 2

}else{

this.maxParallel = 1

}

Events.emit("gpu:scheduler:init",{
parallel:this.maxParallel
})

}

add(task,label="gpu-task"){

return new Promise((resolve,reject)=>{

this.queue.push({
task,
resolve,
reject,
label
})

this.process()

})

}

async process(){

if(this.activeTasks >= this.maxParallel) return

if(this.queue.length === 0) return

const item = this.queue.shift()

this.activeTasks++

try{

Events.emit("gpu:task:start",item.label)

const result = await item.task()

item.resolve(result)

Events.emit("gpu:task:complete",item.label)

}catch(err){

item.reject(err)

Events.emit("gpu:task:error",err)

console.error("GPU task error:",err)

}

this.activeTasks--

this.process()

}

clear(){

this.queue = []

}

size(){

return this.queue.length

}

}

const GPUSchedulerInstance = new GPUScheduler()

export default GPUSchedulerInstance
