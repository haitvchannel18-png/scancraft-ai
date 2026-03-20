// modules/interaction/action-menu.js

import { EventBus } from "../core/events.js"
import AILogger from "../utils/ai-logger.js"

class ActionMenu {

constructor(){
this.actions = [
"scan",
"details",
"buy",
"future",
"3d",
"xray"
]
}

// 🎯 show menu
show(object){

const menu = document.getElementById("action-menu")

if(!menu) return

menu.innerHTML = ""

this.actions.forEach(action=>{

const btn = document.createElement("button")
btn.innerText = action

btn.onclick = ()=>{
EventBus.emit("actionTriggered",{action,object})
}

menu.appendChild(btn)

})

menu.style.display = "block"

AILogger.log("info","Action menu opened",{object})

}

// ❌ hide
hide(){

const menu = document.getElementById("action-menu")
if(menu) menu.style.display = "none"

}

}

export default new ActionMenu()
