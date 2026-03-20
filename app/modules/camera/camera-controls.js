/**
 * ScanCraft AI
 * Camera Controls (Zoom + Focus + Gestures)
 */

import Camera from "./camera.js"
import Events from "../core/events.js"

class CameraControls {

constructor(){

this.video = null

this.zoomLevel = 1
this.minZoom = 1
this.maxZoom = 5

this.lastTouchDistance = null

}

init(videoElement){

this.video = videoElement

this.enableTapFocus()
this.enablePinchZoom()

}

getTrack(){

return Camera.stream?.getVideoTracks()[0]

}

applyConstraints(constraints){

const track = this.getTrack()

if(track){

track.applyConstraints(constraints).catch(err=>{
console.warn("Constraint failed:", err)
})

}

}

setZoom(zoom){

this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, zoom))

this.applyConstraints({
advanced:[{ zoom: this.zoomLevel }]
})

Events.emit("camera:zoom", this.zoomLevel)

}

zoomIn(){

this.setZoom(this.zoomLevel + 0.2)

}

zoomOut(){

this.setZoom(this.zoomLevel - 0.2)

}

enablePinchZoom(){

this.video.addEventListener("touchmove", (e)=>{

if(e.touches.length === 2){

const dist = this.getDistance(e.touches[0], e.touches[1])

if(this.lastTouchDistance){

const diff = dist - this.lastTouchDistance

if(Math.abs(diff) > 5){

this.setZoom(this.zoomLevel + diff * 0.01)

}

}

this.lastTouchDistance = dist

}

})

this.video.addEventListener("touchend", ()=>{
this.lastTouchDistance = null
})

}

getDistance(t1, t2){

return Math.hypot(
t2.clientX - t1.clientX,
t2.clientY - t1.clientY
)

}

enableTapFocus(){

this.video.addEventListener("click", async (e)=>{

const rect = this.video.getBoundingClientRect()

const x = (e.clientX - rect.left) / rect.width
const y = (e.clientY - rect.top) / rect.height

this.applyConstraints({
advanced:[{
focusMode: "manual",
pointsOfInterest: [{ x, y }]
}]
})

Events.emit("camera:focus", { x, y })

this.showFocusAnimation(e.clientX, e.clientY)

})

}

showFocusAnimation(x, y){

const focusRing = document.createElement("div")

focusRing.style.position = "absolute"
focusRing.style.left = `${x - 30}px`
focusRing.style.top = `${y - 30}px`
focusRing.style.width = "60px"
focusRing.style.height = "60px"
focusRing.style.border = "2px solid #00ffcc"
focusRing.style.borderRadius = "50%"
focusRing.style.pointerEvents = "none"
focusRing.style.transition = "all 0.3s ease"
focusRing.style.zIndex = "9999"

document.body.appendChild(focusRing)

setTimeout(()=>{
focusRing.style.transform = "scale(0.6)"
focusRing.style.opacity = "0"
}, 100)

setTimeout(()=>{
focusRing.remove()
}, 400)

}

enableDoubleTapSwitch(){

this.video.addEventListener("dblclick", ()=>{
Camera.switchCamera()
})

}

}

const Controls = new CameraControls()

export default Controls
