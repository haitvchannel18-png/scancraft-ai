// modules/ui/card-renderer.js

import { EventBus } from "../core/events.js"

let container

export function initCardRenderer(containerId="card-container"){

container = document.getElementById(containerId)

attachEvents()

}

function attachEvents(){

EventBus.on("renderProductCards",renderProductCards)

EventBus.on("renderImageCards",renderImageCards)

EventBus.on("renderInfoCards",renderInfoCards)

}

export function clearCards(){

if(!container) return

container.innerHTML = ""

}

function createCard(){

const card = document.createElement("div")
card.className = "info-card"

return card

}

function renderProductCards(products){

clearCards()

products.forEach(product=>{

const card = createCard()

const img = document.createElement("img")
img.src = product.image || ""
img.className = "card-image"

const title = document.createElement("h3")
title.textContent = product.title || "Product"

const price = document.createElement("p")
price.className = "card-price"
price.textContent = product.price || ""

const link = document.createElement("a")
link.href = product.url || "#"
link.target = "_blank"
link.textContent = "View"

card.appendChild(img)
card.appendChild(title)
card.appendChild(price)
card.appendChild(link)

container.appendChild(card)

})

}

function renderImageCards(images){

clearCards()

images.forEach(src=>{

const card = createCard()

const img = document.createElement("img")
img.src = src
img.className = "card-image"

card.appendChild(img)

container.appendChild(card)

})

}

function renderInfoCards(infoList){

clearCards()

infoList.forEach(info=>{

const card = createCard()

const title = document.createElement("h3")
title.textContent = info.title || ""

const text = document.createElement("p")
text.textContent = info.text || ""

card.appendChild(title)
card.appendChild(text)

container.appendChild(card)

})

}

export function renderSingleCard(title,text,image){

clearCards()

const card = createCard()

const t = document.createElement("h3")
t.textContent = title

const p = document.createElement("p")
p.textContent = text

card.appendChild(t)
card.appendChild(p)

if(image){

const img = document.createElement("img")
img.src = image
img.className = "card-image"

card.appendChild(img)

}

container.appendChild(card)

}
