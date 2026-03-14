// ScanCraft AI
// Advanced Object Gallery UI

import AnimationEngine from "../animations/ui-animations.js"
import EventBus from "../../modules/core/events.js"

class GalleryUI {

constructor(){

this.panel = document.getElementById("galleryPanel")
this.grid = document.getElementById("galleryGrid")

this.items = []

this.init()

}

init(){

EventBus.on("ADD_TO_GALLERY",(data)=>{

this.addItem(data)

})

EventBus.on("CLEAR_GALLERY",()=>{

this.clear()

})

}

addItem(data){

this.items.unshift(data)

const card = document.createElement("div")
card.className = "gallery-card"

card.innerHTML = `

<div class="gallery-thumb">
<img src="${data.image}" />
</div>

<div class="gallery-meta">
<h4>${data.name || "Unknown Object"}</h4>
<p>${data.time || ""}</p>
</div>

`

card.addEventListener("click",()=>{

EventBus.emit("OPEN_OBJECT_PANEL",data)

})

this.grid.prepend(card)

AnimationEngine.openPanel(card)

}

clear(){

this.grid.innerHTML = ""
this.items = []

}

show(){

AnimationEngine.openPanel(this.panel)

}

hide(){

AnimationEngine.closePanel(this.panel)

}

}

export default new GalleryUI()
