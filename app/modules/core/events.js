// ================= EVENT STORE =================

const listeners = {}


// ================= EMIT EVENT =================

export function emit(eventName, data = null){

if(!listeners[eventName]) return

listeners[eventName].forEach(callback => {

try{

callback(data)

}catch(err){

console.error("Event error:", eventName, err)

}

})

}


// ================= SUBSCRIBE =================

export function on(eventName, callback){

if(!listeners[eventName]){

listeners[eventName] = []

}

listeners[eventName].push(callback)

}


// ================= ONCE =================

export function once(eventName, callback){

const wrapper = (data)=>{

callback(data)

off(eventName, wrapper)

}

on(eventName, wrapper)

}


// ================= REMOVE LISTENER =================

export function off(eventName, callback){

if(!listeners[eventName]) return

listeners[eventName] = listeners[eventName].filter(

cb => cb !== callback

)

}


// ================= CLEAR EVENT =================

export function clear(eventName){

if(listeners[eventName]){

delete listeners[eventName]

}

}


// ================= CLEAR ALL =================

export function clearAll(){

Object.keys(listeners).forEach(event => delete listeners[event])

}
