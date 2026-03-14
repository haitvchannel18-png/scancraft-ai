// ScanCraft AI
// Future Prediction Visualization UI

import AnimationEngine from "../animations/ui-animations.js"
import EventBus from "../../modules/core/events.js"

class FutureUI {

constructor(){

this.panel = document.getElementById("futurePanel")

this.init()

}

init(){

EventBus.on("FUTURE_RESULT", data => {

this.showFuture(data)

})

}

showFuture(data){

this.panel.innerHTML=""

const title = document.createElement("h2")

title.innerText="Future Possibilities"

this.panel.appendChild(title)

data.images.forEach(img => {

const card = document.createElement("div")

card.className="future-card"

card.innerHTML = `

<img src="${img.url}" />

<p>${img.description}</p>

`

this.panel.appendChild(card)

AnimationEngine.openPanel(card)

})

}

hide(){

AnimationEngine.closePanel(this.panel)

}

}

export default new FutureUI()
