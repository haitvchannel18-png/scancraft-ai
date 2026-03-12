// modules/commerce/jiomart-search.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

const JIOMART_SEARCH_URL =
"https://api.allorigins.win/raw?url=https://www.jiomart.com/search/"

export async function searchJioMart(query){

try{

if(!query) return []

EventBus.emit("jiomartSearchStart",query)

const url = JIOMART_SEARCH_URL + encodeURIComponent(query)

const response = await fetch(url)

const html = await response.text()

const products = parseJioMartHTML(html)

EventBus.emit("jiomartSearchComplete",products)

logAI("JioMartSearch",products)

return products

}catch(err){

console.error("JioMart search error",err)

EventBus.emit("jiomartSearchError",err)

return []

}

}



function parseJioMartHTML(html){

const parser = new DOMParser()

const doc = parser.parseFromString(html,"text/html")

const cards = doc.querySelectorAll(".product-item")

const results = []

cards.forEach(card => {

const title =
card.querySelector(".product-name")?.innerText

const priceText =
card.querySelector(".final-price")?.innerText

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
market: "JioMart",
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
