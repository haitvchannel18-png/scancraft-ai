// Ultra Advanced Event Bus for ScanCraft AI

class EventBusClass {

constructor(){

this.listeners = new Map()

this.history = []

}

on(event,callback){

if(!this.listeners.has(event)){
this.listeners.set(event,new Set())
}

this.listeners.get(event).add(callback)

}

once(event,callback){

const wrapper = (...args)=>{

callback(...args)

this.off(event,wrapper)

}

this.on(event,wrapper)

}

off(event,callback){

if(!this.listeners.has(event)) return

this.listeners.get(event).delete(callback)

}

emit(event,data){

this.history.push({
event,
data,
time:Date.now()
})

if(!this.listeners.has(event)) return

for(const listener of this.listeners.get(event)){

try{

listener(data)

}catch(err){

console.error("EventBus error:",err)

}

}

}

clear(event){

if(event){
this.listeners.delete(event)
}else{
this.listeners.clear()
}

}

getHistory(limit=50){

return this.history.slice(-limit)

}

}


export const EventBus = new EventBusClass()
