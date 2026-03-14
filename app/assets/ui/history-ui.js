// ScanCraft AI
// Scan History Timeline

import AnimationEngine from "../animations/ui-animations.js"
import EventBus from "../../modules/core/events.js"

class HistoryUI {

constructor(){

this.container = document.getElementById("historyPanel")

this.history = []

this.init()

}

init(){

EventBus.on("SCAN_SAVED",(data)=>{

this.add(data)

})

}

add(data){

this.history.unshift(data)

const card = document.createElement("div")

card.className="history-card"

card.innerHTML = `

<img src="${data.image}" />

<div class="history-info">

<h4>${data.name}</h4>

<p>${data.time}</p>

</div>

`

card.addEventListener("click",()=>{

EventBus.emit("LOAD_HISTORY_OBJECT",data)

})

this.container.prepend(card)

AnimationEngine.openPanel(card)

}

clear(){

this.container.innerHTML=""

this.history=[]

}

}

export default new HistoryUI()
