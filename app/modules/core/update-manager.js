/**
 * ScanCraft AI
 * Update Manager
 * Handles system updates, model updates and remote configs
 */

import Events from "./events.js"
import Network from "./network-manager.js"

class UpdateManager {

constructor(){

this.currentVersion = "1.0.0"

this.configURL = "/config/scancraft-config.json"

this.remoteConfig = null

}

async checkUpdates(){

try{

if(!Network.isOnline()){

Events.emit("update:offline")

return null

}

Events.emit("update:checking")

const config = await Network.request(this.configURL)

this.remoteConfig = config

if(config.version !== this.currentVersion){

Events.emit("update:available",{
current:this.currentVersion,
latest:config.version
})

}else{

Events.emit("update:latest")

}

return config

}catch(err){

console.error("Update check failed:",err)

Events.emit("update:error",err)

return null

}

}

getConfig(){

return this.remoteConfig

}

isFeatureEnabled(feature){

if(!this.remoteConfig) return false

return !!this.remoteConfig.features?.[feature]

}

getModelVersion(model){

if(!this.remoteConfig) return null

return this.remoteConfig.models?.[model] || null

}

async refresh(){

return await this.checkUpdates()

}

}

const Updater = new UpdateManager()

export default Updater
