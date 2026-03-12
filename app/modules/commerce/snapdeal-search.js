// modules/commerce/snapdeal-search.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

const SNAPDEAL_SEARCH_URL =
"https://api.allorigins.win/raw?url=https://www.snapdeal.com/search?keyword="


export async function searchSnapdeal(query){

try{

if(!query) return []

EventBus.emit("snapdealSearchStart",query)

const url = SNAPDEAL_SEARCH_URL + encodeURIComponent(query)

const response = await fetch(url)

const html = await response.text()

const products = parseSnapdealHTML(html)

EventBus.emit("snapdealSearchComplete",products)

logAI("SnapdealSearch",products)

return products

}catch(err){

console.error("Snapdeal search error",err)

EventBus.emit("snapdealSearchError",err)

return []

}

}



function parseSnapdealHTML(html){

const parser = new DOMParser()

const doc = parser.parseFromString(html,"text/html")

const cards = doc.querySelectorAll(".product-tuple-listing")

const results = []

cards.forEach(card => {

const title =
card.querySelector(".product-title")?.innerText

const priceText =
card.querySelector(".product-price")?.innerText

const image =
card.querySelector("img")?.src

const link =
card.querySelector("a")?.href

if(!title || !priceText) return

const price = extractPrice(priceText)

results.push({

name: title,
price: price,
image: image,
link: link,
market: "Snapdeal",
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
