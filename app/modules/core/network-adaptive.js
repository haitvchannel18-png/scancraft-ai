/**
 * ScanCraft AI
 * Network Adaptive Engine
 * Adjusts AI behavior based on network conditions
 */

import Events from "./events.js"

class NetworkAdaptive {

constructor(){

this.info = {
type:"unknown",
downlink:0,
rtt:0,
saveData:false
}

this.init()

}

init(){

if(navigator.connection){

this.update()

navigator.connection.addEventListener("change",()=>{
this.update()
})

}

}

update(){

const conn = navigator.connection

this.info = {
type:conn.effectiveType,
downlink:conn.downlink,
rtt:conn.rtt,
saveData:conn.saveData
}

Events.emit("network:adaptive:update",this.info)

}

getMode(){

if(this.info.saveData){

return "data-saver"

}

if(this.info.downlink < 1){

return "slow"

}

if(this.info.downlink < 5){

return "medium"

}

return "fast"

}

shouldUseRemoteAI(){

const mode = this.getMode()

return mode === "fast"

}

shouldReduceModels(){

const mode = this.getMode()

return mode === "slow"

}

getInfo(){

return this.info

}

}

const AdaptiveNetwork = new NetworkAdaptive()

export default AdaptiveNetwork
