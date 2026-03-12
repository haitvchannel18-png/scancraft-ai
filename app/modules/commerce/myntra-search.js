// modules/commerce/myntra-search.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

const MYNTRA_SEARCH_URL =
"https://api.allorigins.win/raw?url=https://www.myntra.com/"


export async function searchMyntra(query){

try{

if(!query) return []

EventBus.emit("myntraSearchStart",query)

const url = MYNTRA_SEARCH_URL + encodeURIComponent(query)

const response = await fetch(url)

const html = await response.text()

const products = parseMyntraHTML(html)

EventBus.emit("myntraSearchComplete",products)

logAI("MyntraSearch",products)

return products

}catch(err){

console.error("Myntra search error",err)

EventBus.emit("myntraSearchError",err)

return []

}

}



function parseMyntraHTML(html){

const parser = new DOMParser()

const doc = parser.parseFromString(html,"text/html")

const cards = doc.querySelectorAll(".product-base")

const results = []

cards.forEach(card => {

const title = card.querySelector(".product-product")?.innerText

const brand = card.querySelector(".product-brand")?.innerText

const priceText = card.querySelector(".product-discountedPrice")?.innerText

const image = card.querySelector("img")?.src

const link = card.querySelector("a")?.href

if(!title || !priceText) return

const price = extractPrice(priceText)

results.push({

name: `${brand || ""} ${title}`,
price: price,
image: image,
link: link,
market: "Myntra",
rating: null,
reviews: null

})

})

return results.slice(0,20)

}



function extractPrice(text){

const cleaned = text.replace(/[^0-9.]/g,"")

return parseFloat(cleaned) || null

}
