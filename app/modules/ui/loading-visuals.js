// modules/ui/loading-visuals.js

import { EventBus } from "../core/events.js"

let container
let spinner
let dots
let progressBar
let active = false

export function initLoadingVisuals(containerId = "loading-visuals"){

container = document.getElementById(containerId)

spinner = createSpinner()
dots = createDots()
progressBar = createProgressBar()

container.appendChild(spinner)
container.appendChild(dots)
container.appendChild(progressBar)

attachEvents()

hide()

}

function createSpinner(){

const el = document.createElement("div")
el.className = "ai-spinner"

return el

}

function createDots(){

const el = document.createElement("div")
el.className = "ai-dots"

el.innerHTML = `
<span></span>
<span></span>
<span></span>
`

return el

}

function createProgressBar(){

const wrapper = document.createElement("div")
wrapper.className = "ai-progress-wrapper"

const bar = document.createElement("div")
bar.className = "ai-progress"

wrapper.appendChild(bar)

return wrapper

}

function attachEvents(){

EventBus.on("aiThinking",show)

EventBus.on("aiResponse",hide)

EventBus.on("scanStart",show)

EventBus.on("scanComplete",hide)

}

export function show(){

if(!container) return

container.style.display = "flex"

active = true

animateProgress()

}

export function hide(){

if(!container) return

container.style.display = "none"

active = false

}

function animateProgress(){

if(!active) return

const bar = progressBar.querySelector(".ai-progress")

let width = 0

const interval = setInterval(()=>{

if(!active){

clearInterval(interval)
return

}

width += Math.random()*10

if(width > 90) width = 90

bar.style.width = width + "%"

},300)

}

export function complete(){

const bar = progressBar.querySelector(".ai-progress")

bar.style.width = "100%"

setTimeout(hide,300)

}
