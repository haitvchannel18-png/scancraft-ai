// modules/ui/loading-visuals.js

import { EventBus } from "../core/events.js"
import Animation from "./animation-engine.js"

class LoadingVisuals {

constructor(){
this.container = document.getElementById("loading")
this.interval = null
}

// 🔥 SHOW LOADING
show(message = "Analyzing..."){

if(!this.container) return

this.container.innerHTML = `
<div class="ai-loading-box">
<div class="ai-loader"></div>
<div class="ai-text">${message}</div>
</div>
`

this.container.style.display = "flex"

// ✨ animation
Animation.apply(this.container, "fade-in")

// 🔄 animated dots
this.animateText()
}

// ❌ HIDE LOADING
hide(){

if(!this.container) return

this.container.style.display = "none"

if(this.interval){
clearInterval(this.interval)
this.interval = null
}

}

// 🔄 TEXT ANIMATION
animateText(){

const textEl = this.container.querySelector(".ai-text")

let dots = 0

this.interval = setInterval(()=>{

dots = (dots + 1) % 4

textEl.innerText = "AI is thinking" + ".".repeat(dots)

}, 400)

}

// 🔥 ADVANCED MODE (scan loading)
scanMode(){

this.show("Scanning object...")

const box = this.container.querySelector(".ai-loading-box")

if(box){
Animation.apply(box, "scale-in")
Animation.scanPulse(box)
}

}

// 🧠 AUTO EVENTS
initListeners(){

EventBus.on("scanStart", ()=>{
this.scanMode()
})

EventBus.on("detectionComplete", ()=>{
this.show("Recognizing object...")
})

EventBus.on("reasoningComplete", ()=>{
this.show("Generating insights...")
})

EventBus.on("aiResponse", ()=>{
this.hide()
})

}

}

export default new LoadingVisuals()
