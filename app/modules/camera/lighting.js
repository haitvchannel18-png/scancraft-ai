/**
 * ScanCraft AI
 * Lighting Engine (Auto Exposure + Low Light Enhancement)
 */

import Events from "../core/events.js"
import Performance from "../core/performance.js"

class LightingEngine {

constructor(){

this.canvas = document.createElement("canvas")
this.ctx = this.canvas.getContext("2d")

this.brightness = 1
this.contrast = 1
this.isLowLight = false

}

analyze(frame){

const start = performance.now()

const { data } = frame

let total = 0

// brightness calculation (fast sampling)
for(let i = 0; i < data.length; i += 40){
total += data[i] // red channel approx
}

const avg = total / (data.length / 40)

this.isLowLight = avg < 80

Events.emit("lighting:analyzed", {
brightness: avg,
lowLight: this.isLowLight
})

return avg

}

enhance(frame){

const start = performance.now()

this.canvas.width = frame.width
this.canvas.height = frame.height

this.ctx.putImageData(frame, 0, 0)

const imageData = this.ctx.getImageData(0, 0, frame.width, frame.height)
const data = imageData.data

const brightnessBoost = this.isLowLight ? 1.4 : 1.0
const contrastBoost = this.isLowLight ? 1.2 : 1.0

for(let i = 0; i < data.length; i += 4){

// brightness
data[i] *= brightnessBoost     // R
data[i+1] *= brightnessBoost   // G
data[i+2] *= brightnessBoost   // B

// contrast (simple)
data[i] = ((data[i] - 128) * contrastBoost) + 128
data[i+1] = ((data[i+1] - 128) * contrastBoost) + 128
data[i+2] = ((data[i+2] - 128) * contrastBoost) + 128

// clamp
data[i] = Math.min(255, Math.max(0, data[i]))
data[i+1] = Math.min(255, Math.max(0, data[i+1]))
data[i+2] = Math.min(255, Math.max(0, data[i+2]))

}

this.ctx.putImageData(imageData, 0, 0)

const end = performance.now()

Performance.mark("lighting-enhance", end - start)

Events.emit("lighting:enhanced", {
lowLight: this.isLowLight
})

return imageData

}

auto(frame){

this.analyze(frame)
return this.enhance(frame)

}

}

const Lighting = new LightingEngine()

export default Lighting
