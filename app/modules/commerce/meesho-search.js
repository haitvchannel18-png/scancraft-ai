// modules/commerce/meesho-search.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

const MEESHO_SEARCH_URL =
"https://api.allorigins.win/raw?url=https://www.meesho.com/search?q="

export async function searchMeesho(query){

try{

if(!query) return []

EventBus.emit("meeshoSearchStart",query)

const url = MEESHO_SEARCH_URL + encodeURIComponent(query)

const response = await fetch(url)

const html = await response.text()

const products = parseMeeshoHTML(html)

EventBus.emit("meeshoSearchComplete",products)

logAI("MeeshoSearch",products)

return products

}catch(err){

console.error("Meesho search error",err)

EventBus.emit("meeshoSearchError",err)

return []

}

}



function parseMeeshoHTML(html){

const parser = new DOMParser()

const doc = parser.parseFromString(html,"text/html")

const cards = doc.querySelectorAll(".ProductList__GridCol")

const results = []

cards.forEach(card => {

const title =
card.querySelector("p")?.innerText

const priceText =
card.querySelector("h5")?.innerText

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
market: "Meesho",
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
