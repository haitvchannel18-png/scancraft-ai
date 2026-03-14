// ScanCraft AI
// Advanced Scan UI Controller

import AnimationEngine from "../animations/ui-animations.js"
import EventBus from "../../modules/core/events.js"

class ScanUI {

constructor(){

this.overlay = document.getElementById("scanOverlay")
this.scanButton = document.getElementById("scanButton")
this.canvas = document.getElementById("cameraCanvas")

this.isScanning = false

this.init()

}

init(){

if(this.scanButton){

this.scanButton.addEventListener("click",()=>{

this.toggleScan()

})

}

EventBus.on("OBJECT_DETECTED",(data)=>{

this.highlightObject(data.box)

})

}

toggleScan(){

this.isScanning = !this.isScanning

if(this.isScanning){

this.startScan()

}else{

this.stopScan()

}

}

startScan(){

AnimationEngine.scanPulse(this.overlay)

EventBus.emit("SCAN_START")

this.overlay.classList.add("scanning")

}

stopScan(){

EventBus.emit("SCAN_STOP")

this.overlay.classList.remove("scanning")

}

highlightObject(box){

const el = document.createElement("div")

el.className="scan-box"

el.style.left = box.x+"px"
el.style.top = box.y+"px"
el.style.width = box.w+"px"
el.style.height = box.h+"px"

this.overlay.appendChild(el)

AnimationEngine.highlightObject(el)

setTimeout(()=>{

el.remove()

},1500)

}

}

export default new ScanUI()
