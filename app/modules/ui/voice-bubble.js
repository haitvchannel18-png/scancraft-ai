// modules/ui/voice-bubble.js

import { EventBus } from "../core/events.js"
import Animation from "./animation-engine.js"

class VoiceBubble {

constructor(){
this.container = document.getElementById("voice-bubble")
this.animating = false
}

// 🔥 INIT
init(){

if(!this.container) return

this.container.innerHTML = `
<div class="voice-core">
<div class="wave"></div>
<div class="wave"></div>
<div class="wave"></div>
</div>
`

this.hide()
this.initListeners()

}

// 🎤 SHOW
show(){

if(!this.container) return

this.container.style.display = "flex"

Animation.apply(this.container, "fade-in")

this.startAnimation()

}

// ❌ HIDE
hide(){

if(!this.container) return

this.container.style.display = "none"

this.stopAnimation()

}

// 🌊 START ANIMATION
startAnimation(){

if(this.animating) return

this.animating = true

const waves = this.container.querySelectorAll(".wave")

waves.forEach((wave, i)=>{

wave.style.animation = `voiceWave 1s infinite ease-in-out ${i * 0.2}s`

})

}

// ⛔ STOP ANIMATION
stopAnimation(){

this.animating = false

const waves = this.container.querySelectorAll(".wave")

waves.forEach(w=>{
w.style.animation = "none"
})

}

// 🎯 LISTEN EVENTS
initListeners(){

EventBus.on("voiceStart", ()=>{
this.show()
})

EventBus.on("voiceEnd", ()=>{
this.hide()
})

EventBus.on("aiSpeaking", ()=>{
this.show()
})

EventBus.on("aiSilent", ()=>{
this.hide()
})

}

}

export default new VoiceBubble()
