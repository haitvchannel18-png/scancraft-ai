// modules/utils/ai-logger.js

import ConfigManager from "./config-manager.js"

class AILogger {

constructor(){
this.logs = []
this.maxLogs = 500
}

// 🧠 log
log(type, message, data = {}){

const entry = {
time: new Date().toISOString(),
type,
message,
data
}

this.logs.push(entry)

// 🧹 limit logs
if(this.logs.length > this.maxLogs){
this.logs.shift()
}

// 🖥 debug print
if(ConfigManager.get("APP.debug")){
console[type](`[AI-${type}]`, message, data)
}

}

// 📊 get logs
getLogs(){
return this.logs
}

// ❌ clear
clear(){
this.logs = []
}

}

export default new AILogger()
