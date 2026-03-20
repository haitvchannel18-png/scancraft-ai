// modules/ui/scan-overlay.js

import { EventBus } from "../core/events.js"
import Animation from "./animation-engine.js"

class ScanOverlay {

constructor(){
this.canvas = document.getElementById("overlay")
this.ctx = this.canvas?.getContext("2d")
this.width = 0
this.height = 0
}

// 🔥 INIT
init(video){

if(!this.canvas || !video) return

this.width = video.videoWidth
this.height = video.videoHeight

this.canvas.width = this.width
this.canvas.height = this.height

this.canvas.style.display = "block"

}

// 🧠 DRAW DETECTIONS
draw(detections){

if(!this.ctx) return

this.clear()

detections.forEach(det => {

const {x,y,w,h,label,confidence} = det

// 🎯 BOX
this.ctx.strokeStyle = "#00ffff"
this.ctx.lineWidth = 2
this.ctx.strokeRect(x,y,w,h)

// ✨ LABEL BACKGROUND
this.ctx.fillStyle = "rgba(0,255,255,0.2)"
this.ctx.fillRect(x, y-22, w, 22)

// 🧠 TEXT
this.ctx.fillStyle = "#00ffff"
this.ctx.font = "14px Arial"
this.ctx.fillText(
`${label} (${Math.round(confidence*100)}%)`,
x+5,
y-6
)

// ✨ animation glow
this.glowEffect(x,y,w,h)

})

}

// ✨ GLOW EFFECT
glowEffect(x,y,w,h){

this.ctx.shadowColor = "#00ffff"
this.ctx.shadowBlur = 10
this.ctx.strokeRect(x,y,w,h)
this.ctx.shadowBlur = 0

}

// 🧹 CLEAR
clear(){

this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

}

// 🔥 SCAN LINE EFFECT
scanLine(){

const line = document.createElement("div")
line.className = "scan-line"

this.canvas.parentElement.appendChild(line)

setTimeout(()=>{
line.remove()
},2000)

}

// 🧠 AUTO EVENTS
initListeners(){

EventBus.on("scanStart", ()=>{
this.scanLine()
})

EventBus.on("detections", (data)=>{
this.draw(data)
})

EventBus.on("scanStop", ()=>{
this.clear()
})

}

}

export default new ScanOverlay()
