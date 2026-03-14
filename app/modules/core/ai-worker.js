/**
 * ScanCraft AI
 * AI Worker Manager
 * Runs heavy AI inference in Web Worker
 */

import Events from "./events.js"

class AIWorkerManager {

constructor(){

this.worker = null
this.callbacks = {}
this.taskId = 0

}

init(){

if(this.worker) return

this.worker = new Worker("/modules/core/ai-worker-thread.js",{type:"module"})

this.worker.onmessage = (e)=>{

const {id,result,error} = e.data

const cb = this.callbacks[id]

if(!cb) return

if(error){

cb.reject(error)

Events.emit("ai-worker:error",error)

}else{

cb.resolve(result)

Events.emit("ai-worker:result",result)

}

delete this.callbacks[id]

}

}

run(task,data){

return new Promise((resolve,reject)=>{

this.init()

const id = ++this.taskId

this.callbacks[id] = {resolve,reject}

this.worker.postMessage({
id,
task,
data
})

Events.emit("ai-worker:task",task)

})

}

terminate(){

if(!this.worker) return

this.worker.terminate()

this.worker = null

}

}

const AIWorker = new AIWorkerManager()

export default AIWorker
