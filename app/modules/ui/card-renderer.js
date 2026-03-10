// ================= IMPORT =================

import { on } from "../core/events.js"
import { animateCardReveal } from "./animation-engine.js"



// ================= DOM =================

let cardContainer



// ================= INIT =================

export function initCardRenderer(){

cardContainer = document.getElementById("ai-result-cards")

listenCardEvents()

}



// ================= EVENTS =================

function listenCardEvents(){

on("ai:object-info", renderObjectCard)

on("ai:image-results", renderImageGallery)

on("ai:price-results", renderPriceCards)

on("ai:material-results", renderMaterialCard)

on("ai:history-results", renderHistoryCard)

}



// ================= OBJECT CARD =================

function renderObjectCard(data){

const card = document.createElement("div")

card.className = "ai-card object-card"

card.innerHTML = `

<div class="card-header">
<div class="card-icon">📦</div>
<div class="card-title">${escapeHTML(data.name)}</div>
</div>

<div class="card-body">
${escapeHTML(data.description)}
</div>

`

appendCard(card)

}



// ================= IMAGE GALLERY =================

function renderImageGallery(images){

const card = document.createElement("div")

card.className = "ai-card image-gallery"

let html = `<div class="card-header">Images</div>`

html += `<div class="gallery-grid">`

images.forEach(img => {

html += `<img src="${img}" class="gallery-img">`

})

html += `</div>`

card.innerHTML = html

appendCard(card)

}



// ================= PRICE CARDS =================

function renderPriceCards(products){

const card = document.createElement("div")

card.className = "ai-card price-card"

let html = `<div class="card-header">Buy Online</div>`

html += `<div class="price-grid">`

products.forEach(p => {

html += `

<div class="price-item">

<div class="store">${p.marketplace}</div>

<div class="price">${p.priceRange}</div>

<a href="${p.link}" target="_blank">View</a>

</div>

`

})

html += `</div>`

card.innerHTML = html

appendCard(card)

}



// ================= MATERIAL CARD =================

function renderMaterialCard(data){

const card = document.createElement("div")

card.className = "ai-card material-card"

card.innerHTML = `

<div class="card-header">Material</div>

<div class="card-body">
${escapeHTML(data.material)}
</div>

`

appendCard(card)

}



// ================= HISTORY CARD =================

function renderHistoryCard(data){

const card = document.createElement("div")

card.className = "ai-card history-card"

card.innerHTML = `

<div class="card-header">History</div>

<div class="card-body">
${escapeHTML(data.history)}
</div>

`

appendCard(card)

}



// ================= APPEND CARD =================

function appendCard(card){

cardContainer.appendChild(card)

animateCardReveal(card)

scrollToBottom()

}



// ================= SCROLL =================

function scrollToBottom(){

cardContainer.scrollTop = cardContainer.scrollHeight

}



// ================= SECURITY =================

function escapeHTML(text){

const div = document.createElement("div")

div.innerText = text

return div.innerHTML

}



// ================= CLEAR =================

export function clearCards(){

if(cardContainer){

cardContainer.innerHTML = ""

}

}
