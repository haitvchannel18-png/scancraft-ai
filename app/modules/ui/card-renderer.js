// modules/ui/card-renderer.js

import { EventBus } from "../core/events.js"
import Animation from "./animation-engine.js"

class CardRenderer {

constructor(){
this.container = document.getElementById("card-container")
}

// 🔥 MAIN RENDER
render(data){

if(!this.container || !data) return

EventBus.emit("cardRenderStart", data)

// 🧠 clear old
this.container.innerHTML = ""

// 🧠 create card
const card = this.createCard(data)

this.container.appendChild(card)

// ✨ animate
Animation.apply(card, "scale-in")

EventBus.emit("cardRenderComplete", data)

}

// 🧠 CREATE CARD
createCard(data){

const card = document.createElement("div")
card.className = "ai-card"

card.innerHTML = `
<div class="card-header">
<img src="${data.image || ''}" class="card-img"/>
<h2>${data.title || data.object || "Unknown Object"}</h2>
</div>

<div class="card-body">

<div class="card-section">
<span class="label">Category:</span>
<span>${data.category || "Unknown"}</span>
</div>

<div class="card-section">
<span class="label">Material:</span>
<span>${this.formatArray(data.materials)}</span>
</div>

<div class="card-section">
<span class="label">Price:</span>
<span>${data.price || "N/A"}</span>
</div>

<div class="card-section">
<span class="label">Confidence:</span>
<span>${Math.round((data.confidence || 0.5)*100)}%</span>
</div>

</div>

<div class="card-actions">
<button class="btn-compare">Compare</button>
<button class="btn-buy">Buy</button>
<button class="btn-3d">View 3D</button>
</div>
`

// 🎯 BUTTON EVENTS
this.attachEvents(card, data)

return card

}

// 🎯 EVENTS
attachEvents(card, data){

card.querySelector(".btn-compare").onclick = ()=>{
EventBus.emit("compareRequest", data)
}

card.querySelector(".btn-buy").onclick = ()=>{
EventBus.emit("buyRequest", data)
}

card.querySelector(".btn-3d").onclick = ()=>{
EventBus.emit("view3D", data)
}

}

// 🧠 FORMAT ARRAY
formatArray(arr){

if(!arr || !arr.length) return "Unknown"
return arr.join(", ")

}

}

export default new CardRenderer()
