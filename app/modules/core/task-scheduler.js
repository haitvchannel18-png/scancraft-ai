/**
 * ScanCraft AI
 * Background Task Scheduler
 */

import Events from "./events.js"

class TaskScheduler {

constructor(){

this.tasks = new Map()

this.running = false

}

addTask(name,callback,interval){

this.tasks.set(name,{
callback,
interval,
timer:null
})

}

startTask(name){

const task = this.tasks.get(name)

if(!task) return

task.timer = setInterval(async ()=>{

try{

Events.emit("task:start",name)

await task.callback()

Events.emit("task:complete",name)

}catch(err){

Events.emit("task:error",{name,err})

console.error("Task error:",name,err)

}

},task.interval)

}

stopTask(name){

const task = this.tasks.get(name)

if(!task || !task.timer) return

clearInterval(task.timer)

task.timer = null

}

startAll(){

if(this.running) return

this.running = true

for(const name of this.tasks.keys()){

this.startTask(name)

}

}

stopAll(){

for(const name of this.tasks.keys()){

this.stopTask(name)

}

this.running = false

}

removeTask(name){

this.stopTask(name)

this.tasks.delete(name)

}

listTasks(){

return Array.from(this.tasks.keys())

}

}

const Scheduler = new TaskScheduler()

export default Scheduler
