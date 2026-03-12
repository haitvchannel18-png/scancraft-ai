// modules/ui/animation-engine.js

import { EventBus } from "../core/events.js"

let animations = new Map()

export function initAnimationEngine(){

attachEvents()

}

function attachEvents(){

EventBus.on("panelOpen",fadeIn)

EventBus.on("panelClose",fadeOut)

EventBus.on("aiThinking",pulseElement)

EventBus.on("scanStart",scanFlash)

}

export function fadeIn(element){

if(!element) return

element.style.opacity = 0
element.style.display = "block"

let opacity = 0

const step = ()=>{

opacity += 0.05

element.style.opacity = opacity

if(opacity < 1){

requestAnimationFrame(step)

}

}

requestAnimationFrame(step)

}

export function fadeOut(element){

if(!element) return

let opacity = 1

const step = ()=>{

opacity -= 0.05

element.style.opacity = opacity

if(opacity > 0){

requestAnimationFrame(step)

}else{

element.style.display = "none"

}

}

requestAnimationFrame(step)

}

export function slideUp(element){

if(!element) return

element.style.transform = "translateY(40px)"
element.style.opacity = 0
element.style.display = "block"

let y = 40
let opacity = 0

const step = ()=>{

y -= 2
opacity += 0.05

element.style.transform = `translateY(${y}px)`
element.style.opacity = opacity

if(opacity < 1){

requestAnimationFrame(step)

}

}

requestAnimationFrame(step)

}

export function pulseElement(){

const loader = document.querySelector(".ai-spinner")

if(!loader) return

loader.classList.add("pulse")

setTimeout(()=>{

loader.classList.remove("pulse")

},1200)

}

export function scanFlash(){

const overlay = document.querySelector(".scan-overlay-canvas")

if(!overlay) return

overlay.classList.add("scan-flash")

setTimeout(()=>{

overlay.classList.remove("scan-flash")

},300)

}

export function animateScale(element){

if(!element) return

element.style.transform = "scale(0.8)"
element.style.opacity = 0

let scale = 0.8
let opacity = 0

const step = ()=>{

scale += 0.02
opacity += 0.05

element.style.transform = `scale(${scale})`
element.style.opacity = opacity

if(opacity < 1){

requestAnimationFrame(step)

}

}

requestAnimationFrame(step)

}
