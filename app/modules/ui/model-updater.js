// modules/ui/model-updater.js

import { EventBus } from "../core/events.js"
import Network from "../core/network-manager.js"
import Cache from "../memory/cache-manager.js"
import Animation from "./animation-engine.js"

class ModelUpdater {

constructor(){
this.updateURL = "/models/version.json" // future server endpoint
this.currentVersion = "1.0.0"
this.checkInterval = 1000 * 60 * 10 // 10 min
}

// 🔥 INIT
init(){

this.checkUpdates()

setInterval(()=>{
this.checkUpdates()
}, this.checkInterval)

}

// 🔍 CHECK FOR UPDATES
async checkUpdates(){

try{

if(!Network.isOnline()) return

EventBus.emit("modelCheckStart")

const res = await fetch(this.updateURL)
const data = await res.json()

if(this.isNewVersion(data.version)){
await this.updateModels(data)
}

}catch(err){
EventBus.emit("modelCheckError", err)
}

}

// 🧠 VERSION CHECK
isNewVersion(version){

return version !== this.currentVersion

}

// 🚀 UPDATE MODELS
async updateModels(data){

EventBus.emit("modelUpdateStart", data)

try{

for(const model of data.models){

await this.downloadModel(model)

}

// 💾 SAVE VERSION
Cache.set("model_version", data.version)
this.currentVersion = data.version

EventBus.emit("modelUpdateComplete", data)

}catch(err){

EventBus.emit("modelUpdateError", err)

}

}

// 📥 DOWNLOAD MODEL
async downloadModel(model){

const res = await fetch(model.url)
const blob = await res.blob()

// 💾 store locally (IndexedDB later upgrade)
Cache.set(model.name, blob)

}

// 🎯 MANUAL UPDATE (UI button)
triggerUpdate(){

this.checkUpdates()

}

// 🎬 UI HOOK
initListeners(){

EventBus.on("modelUpdateStart", ()=>{
this.showUpdatingUI()
})

EventBus.on("modelUpdateComplete", ()=>{
this.hideUpdatingUI()
})

}

// ✨ SHOW UI
showUpdatingUI(){

const el = document.getElementById("model-update")

if(!el) return

el.innerText = "Updating AI models..."
el.style.display = "block"

Animation.apply(el, "fade-in")

}

// ❌ HIDE UI
hideUpdatingUI(){

const el = document.getElementById("model-update")

if(!el) return

el.style.display = "none"

}

}

export default new ModelUpdater()
