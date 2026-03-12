// modules/ui/object-panel.js

import { EventBus } from "../core/events.js"

let panel
let titleEl
let descriptionEl
let imageEl
let buttons = {}

export function initObjectPanel(containerId="object-panel"){

const container = document.getElementById(containerId)

panel = document.createElement("div")
panel.className = "object-panel"

titleEl = document.createElement("h2")
descriptionEl = document.createElement("p")

imageEl = document.createElement("img")
imageEl.className = "object-image"

const btnContainer = document.createElement("div")
btnContainer.className = "object-buttons"

buttons.view3D = createButton("3D View","objectView3D")
buttons.paint = createButton("Paint","objectPaint")
buttons.buy = createButton("Buy","objectBuy")
buttons.history = createButton("History","objectHistory")

btnContainer.appendChild(buttons.view3D)
btnContainer.appendChild(buttons.paint)
btnContainer.appendChild(buttons.buy)
btnContainer.appendChild(buttons.history)

panel.appendChild(imageEl)
panel.appendChild(titleEl)
panel.appendChild(descriptionEl)
panel.appendChild(btnContainer)

container.appendChild(panel)

attachEvents()

hidePanel()

}

function createButton(label,eventName){

const btn = document.createElement("button")
btn.textContent = label

btn.onclick = () => {

EventBus.emit(eventName)

}

return btn

}

function attachEvents(){

EventBus.on("objectDetected",showObject)

EventBus.on("objectPanelHide",hidePanel)

}

function showObject(data){

if(!data) return

titleEl.textContent = data.label || "Unknown Object"

descriptionEl.textContent = data.description || "No description available"

if(data.image){
imageEl.src = data.image
imageEl.style.display = "block"
}else{
imageEl.style.display = "none"
}

panel.style.display = "block"

}

export function hidePanel(){

if(panel){
panel.style.display = "none"
}

}

export function updateDescription(text){

descriptionEl.textContent = text

}

export function updateImage(url){

imageEl.src = url
imageEl.style.display = "block"

}
