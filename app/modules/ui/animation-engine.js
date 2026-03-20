// modules/ui/animation-engine.js

import { EventBus } from "../core/events.js"

class AnimationEngine {

constructor(){
this.animations = new Map()
this.initGlobalStyles()
}

// 🔥 INIT GLOBAL CSS (dynamic)
initGlobalStyles(){

const style = document.createElement("style")
style.innerHTML = `
.fade-in { animation: fadeIn 0.4s ease forwards; }
.fade-out { animation: fadeOut 0.3s ease forwards; }
.scale-in { animation: scaleIn 0.35s ease forwards; }
.slide-up { animation: slideUp 0.4s ease forwards; }
.glow { animation: glowPulse 1.2s infinite; }

@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes fadeOut { from{opacity:1} to{opacity:0} }
@keyframes scaleIn { from{transform:scale(0.9);opacity:0} to{transform:scale(1);opacity:1} }
@keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }

@keyframes glowPulse {
0%{box-shadow:0 0 5px rgba(0,255,255,0.3)}
50%{box-shadow:0 0 20px rgba(0,255,255,0.8)}
100%{box-shadow:0 0 5px rgba(0,255,255,0.3)}
}
`
document.head.appendChild(style)

}

// 🎯 APPLY ANIMATION
apply(element, type){

if(!element) return

element.classList.add(type)

setTimeout(()=>{
element.classList.remove(type)
},500)

}

// ✨ ADVANCED SEQUENCE
sequence(elements, type, delay=100){

elements.forEach((el, i)=>{
setTimeout(()=>{
this.apply(el, type)
}, i * delay)
})

}

// 🔥 SCAN EFFECT
scanPulse(element){

if(!element) return

element.classList.add("glow")

setTimeout(()=>{
element.classList.remove("glow")
},2000)

}

// 🎬 LOADING LOOP
loadingDots(element){

let dots = 0

const interval = setInterval(()=>{
dots = (dots + 1) % 4
element.innerText = "Processing" + ".".repeat(dots)
},400)

return () => clearInterval(interval)
}

// 💥 RIPPLE EFFECT
ripple(element, x, y){

const ripple = document.createElement("span")
ripple.className = "ripple"

ripple.style.left = x + "px"
ripple.style.top = y + "px"

element.appendChild(ripple)

setTimeout(()=>{
ripple.remove()
},600)

}

// 🎯 AUTO HOOK EVENTS
initListeners(){

EventBus.on("scanStart", ()=>{
const el = document.getElementById("scan-area")
this.scanPulse(el)
})

EventBus.on("cardOpen", (el)=>{
this.apply(el, "scale-in")
})

EventBus.on("aiResponse", ()=>{
const chat = document.getElementById("ai-chat")
this.apply(chat, "fade-in")
})

}

}

export default new AnimationEngine()
