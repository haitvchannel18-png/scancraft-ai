// modules/commerce/ebay-search.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

const EBAY_SEARCH_URL = "https://api.allorigins.win/raw?url=https://www.ebay.com/sch/i.html?_nkw="

export async function searchEbay(query){

try{

if(!query) return []

EventBus.emit("ebaySearchStart",query)

const url = EBAY_SEARCH_URL + encodeURIComponent(query)

const response = await fetch(url)

const html = await response.text()

const products = parseEbayHTML(html)

EventBus.emit("ebaySearchComplete",products)

logAI("EbaySearch",products)

return products

}catch(err){

console.error("Ebay search error",err)

EventBus.emit("ebaySearchError",err)

return []

}

}



function parseEbayHTML(html){

const parser = new DOMParser()

const doc = parser.parseFromString(html,"text/html")

const items = doc.querySelectorAll(".s-item")

const results = []

items.forEach(item => {

const title = item.querySelector(".s-item__title")?.innerText
const priceText = item.querySelector(".s-item__price")?.innerText
const image = item.querySelector(".s-item__image-img")?.src
const link = item.querySelector(".s-item__link")?.href

if(!title || !priceText) return

const price = extractPrice(priceText)

results.push({

name: title,
price: price,
image: image,
link: link,
market: "eBay",
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
