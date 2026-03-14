/**
 * ScanCraft AI
 * Network Manager
 * Handles online/offline connectivity and API requests
 */

import Events from "./events.js"

class NetworkManager {

constructor(){

this.online = navigator.onLine
this.retryLimit = 3
this.timeout = 10000

this.initListeners()

}

initListeners(){

window.addEventListener("online",()=>{

this.online = true
Events.emit("network:online")

})

window.addEventListener("offline",()=>{

this.online = false
Events.emit("network:offline")

})

}

isOnline(){

return this.online

}

async request(url,options={},retry=0){

if(!this.online){

Events.emit("network:offline-request",url)
throw new Error("Offline mode")

}

const controller = new AbortController()

const timer = setTimeout(()=>{
controller.abort()
},this.timeout)

try{

const response = await fetch(url,{
...options,
signal:controller.signal
})

clearTimeout(timer)

if(!response.ok){

throw new Error("Network response error")
}

const data = await response.json()

Events.emit("network:success",url)

return data

}catch(err){

clearTimeout(timer)

Events.emit("network:error",{url,err})

if(retry < this.retryLimit){

return this.request(url,options,retry+1)

}

throw err

}

}

async fetchText(url){

const res = await this.request(url)

return res

}

async fetchJSON(url){

const res = await this.request(url)

return res

}

}

const Network = new NetworkManager()

export default Network
