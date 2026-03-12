// modules/commerce/google-shopping.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

const GOOGLE_SHOPPING_URL =
  "https://api.allorigins.win/raw?url=https://www.google.com/search?tbm=shop&q="

export async function searchGoogleShopping(query) {

try{

if(!query) return []

EventBus.emit("googleShoppingSearchStart",query)

const url = GOOGLE_SHOPPING_URL + encodeURIComponent(query)

const response = await fetch(url)

const html = await response.text()

const products = parseShoppingHTML(html)

EventBus.emit("googleShoppingSearchComplete",products)

logAI("GoogleShopping",products)

return products

}catch(err){

console.error("Google shopping search error",err)

EventBus.emit("googleShoppingSearchError",err)

return []

}

}



function parseShoppingHTML(html){

const parser = new DOMParser()

const doc = parser.parseFromString(html,"text/html")

const results = []

const cards = doc.querySelectorAll(".sh-dgr__grid-result")

cards.forEach(card => {

const title = card.querySelector(".tAxDx")?.innerText
const priceText = card.querySelector(".a8Pemb")?.innerText
const image = card.querySelector("img")?.src
const link = card.querySelector("a")?.href
const merchant = card.querySelector(".aULzUe")?.innerText

if(!title || !priceText) return

const price = extractPrice(priceText)

results.push({
name: title,
price: price,
image: image,
link: link,
market: merchant || "Google Shopping",
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
