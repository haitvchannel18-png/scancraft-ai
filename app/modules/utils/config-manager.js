// modules/utils/config-manager.js

import CONFIG from "./config.js"

class ConfigManager {

constructor(){
this.config = structuredClone(CONFIG)
}

// 🔍 GET
get(path){

return path.split(".").reduce((obj,key)=>obj?.[key], this.config)

}

// ✏️ SET
set(path,value){

const keys = path.split(".")
let obj = this.config

keys.slice(0,-1).forEach(k=>{
if(!obj[k]) obj[k] = {}
obj = obj[k]
})

obj[keys[keys.length-1]] = value

}

// 🔄 RESET
reset(){

this.config = structuredClone(CONFIG)

}

// 💾 SAVE (localStorage)
save(){

localStorage.setItem("app_config", JSON.stringify(this.config))

}

// 📥 LOAD
load(){

const data = localStorage.getItem("app_config")

if(data){
this.config = JSON.parse(data)
}

}

}

export default new ConfigManager()
