// ================= IMPORT =================

import { emit } from "../core/events.js"


// ================= LIGHTING STATE =================

let brightness = 1
let contrast = 1
let lowLightMode = false


// ================= ANALYZE LIGHT =================

export function analyzeLighting(frame){

let total = 0

for(let i=0;i<frame.data.length;i+=4){

const r = frame.data[i]
const g = frame.data[i+1]
const b = frame.data[i+2]

const luminance = 0.2126*r + 0.7152*g + 0.0722*b

total += luminance

}

const avgLight = total / (frame.data.length/4)

if(avgLight < 60){

lowLightMode = true
emit("lighting:low")

}else{

lowLightMode = false
emit("lighting:normal")

}

return avgLight

}


// ================= AUTO ADJUST =================

export function autoAdjustLighting(frame){

const light = analyzeLighting(frame)

if(light < 60){

brightness = 1.4
contrast = 1.3

}else if(light > 180){

brightness = 0.9
contrast = 1.1

}else{

brightness = 1
contrast = 1

}

emit("lighting:adjusted",{
brightness,
contrast
})

return applyLighting(frame)

}


// ================= APPLY LIGHTING =================

function applyLighting(frame){

const data = frame.data

for(let i=0;i<data.length;i+=4){

data[i] = clamp((data[i] * brightness - 128) * contrast + 128)
data[i+1] = clamp((data[i+1] * brightness - 128) * contrast + 128)
data[i+2] = clamp((data[i+2] * brightness - 128) * contrast + 128)

}

return frame

}


// ================= CLAMP =================

function clamp(value){

return Math.max(0, Math.min(255, value))

}


// ================= SHADOW REDUCTION =================

export function reduceShadows(frame){

const data = frame.data

for(let i=0;i<data.length;i+=4){

const avg = (data[i] + data[i+1] + data[i+2]) / 3

if(avg < 50){

data[i] += 20
data[i+1] += 20
data[i+2] += 20

}

}

emit("lighting:shadow-reduced")

return frame

}


// ================= LIGHT MODE =================

export function isLowLight(){

return lowLightMode

}
