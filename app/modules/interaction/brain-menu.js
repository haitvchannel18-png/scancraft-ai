// modules/interaction/brain-menu.js

import FeatureFlags from "../utils/feature-flags.js"
import AILogger from "../utils/ai-logger.js"

class BrainMenu {

toggle(feature){

FeatureFlags.toggle(feature)

AILogger.log("info","Feature toggled",{feature})

}

// 🎛 UI bind
init(){

const el = document.getElementById("brain-menu")

if(!el) return

Object.keys(FeatureFlags.getAll()).forEach(f=>{

const btn = document.createElement("button")

btn.innerText = f

btn.onclick = ()=>this.toggle(f)

el.appendChild(btn)

})

}

}

export default new BrainMenu()
