// modules/ui/object-panel.js

import { EventBus } from "../core/events.js"
import Animation from "./animation-engine.js"

class ObjectPanel {

constructor(){
this.container = document.getElementById("object-panel")
this.isOpen = false
}

// 🔥 OPEN PANEL
open(data){

if(!this.container || !data) return

this.container.innerHTML = this.buildUI(data)

this.container.style.display = "block"

Animation.apply(this.container, "slide-up")

this.attachEvents(data)

this.isOpen = true

EventBus.emit("panelOpened", data)

}

// ❌ CLOSE PANEL
close(){

if(!this.container) return

Animation.apply(this.container, "fade-out")

setTimeout(()=>{
this.container.style.display = "none"
},300)

this.isOpen = false

EventBus.emit("panelClosed")

}

// 🧠 BUILD UI
buildUI(data){

return `
<div class="panel-header">
<h2>${data.object || data.title || "Object"}</h2>
<button class="close-btn">✖</button>
</div>

<div class="panel-content">

${this.section("📦 Category", data.category)}
${this.section("🧱 Materials", this.format(data.materials))}
${this.section("📜 History", data.history)}
${this.section("🔮 Future", this.format(data.future))}
${this.section("💰 Price Range", this.formatPrice(data.price))}
${this.section("🧠 AI Insight", data.summary)}

<div class="panel-actions">
<button class="btn-chat">Ask AI</button>
<button class="btn-3d">View 3D</button>
<button class="btn-buy">Buy</button>
</div>

</div>
`
}

// 🧠 SECTION BUILDER
section(title, content){

if(!content) return ""

return `
<div class="panel-section">
<h3>${title}</h3>
<p>${content}</p>
</div>
`

}

// 🎯 EVENTS
attachEvents(data){

// close
this.container.querySelector(".close-btn").onclick = ()=>{
this.close()
}

// AI chat
this.container.querySelector(".btn-chat").onclick = ()=>{
EventBus.emit("openChat", data)
}

// 3D view
this.container.querySelector(".btn-3d").onclick = ()=>{
EventBus.emit("view3D", data)
}

// buy
this.container.querySelector(".btn-buy").onclick = ()=>{
EventBus.emit("buyRequest", data)
}

}

// 🧠 FORMAT ARRAY
format(arr){

if(!arr) return ""
if(Array.isArray(arr)) return arr.join(", ")
return arr
}

// 💰 FORMAT PRICE
formatPrice(price){

if(!price) return "N/A"

if(typeof price === "object"){
return `₹${price.min} - ₹${price.max}`
}

return price
}

}

export default new ObjectPanel()
