// ScanCraft AI
// Object Information Panel

import AnimationEngine from "../animations/ui-animations.js"
import EventBus from "../../modules/core/events.js"

class ObjectPanel {

constructor(){

this.panel = document.getElementById("objectPanel")

this.title = document.getElementById("objectTitle")
this.image = document.getElementById("objectImage")
this.description = document.getElementById("objectDescription")
this.material = document.getElementById("objectMaterial")
this.history = document.getElementById("objectHistory")
this.price = document.getElementById("objectPrice")

this.init()

}

init(){

EventBus.on("OBJECT_ANALYZED",(data)=>{

this.render(data)

})

}

render(data){

if(!this.panel) return

this.title.innerText = data.name || "Unknown Object"

this.image.src = data.image || ""

this.description.innerText = data.description || ""

this.material.innerText = data.material || ""

this.history.innerText = data.history || ""

this.price.innerText = data.price ? "₹"+data.price : ""

AnimationEngine.openPanel(this.panel)

}

close(){

AnimationEngine.closePanel(this.panel)

}

}

export default new ObjectPanel()
