// ScanCraft AI
// Product Compare UI

import AnimationEngine from "../animations/ui-animations.js"
import EventBus from "../../modules/core/events.js"

class CompareUI {

constructor(){

this.container = document.getElementById("comparePanel")

this.products = []

this.init()

}

init(){

EventBus.on("COMPARE_PRODUCTS", data => {

this.render(data.products)

})

}

render(products){

this.container.innerHTML = ""

products.forEach(product => {

const card = document.createElement("div")

card.className="compare-card"

card.innerHTML = `

<h3>${product.name}</h3>

<img src="${product.image}" />

<div class="price">₹${product.price}</div>

<div class="source">${product.source}</div>

`

this.container.appendChild(card)

AnimationEngine.openPanel(card)

})

}

clear(){

this.container.innerHTML=""

}

}

export default new CompareUI()
