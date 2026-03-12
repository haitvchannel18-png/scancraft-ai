
// modules/commerce/aliexpress-search.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

const ALI_SEARCH_URL =
"https://api.allorigins.win/raw?url=https://www.aliexpress.com/wholesale?SearchText="

export async function searchAliExpress(query){

try{

if(!query) return []

EventBus.emit("aliexpressSearchStart",query)

const url = ALI_SEARCH_URL + encodeURIComponent(query)

const response = await fetch(url)

const html = await response.text()

const products = parseAliHTML(html)

EventBus.emit("aliexpressSearchComplete",products)

logAI("AliExpressSearch",products)

return products

}catch(err){

console.error("AliExpress search error",err)

EventBus.emit("aliexpressSearchError",err)

return []

}

}



function parseAliHTML(html){

const parser = new DOMParser()
const doc = parser.parseFromString(html,"text/html")

const items = doc.querySelectorAll(".manhattan--container")

const results = []

items.forEach(item => {

const title =
item.querySelector("h1,h2,.multi--titleText")?.innerText

const priceText =
item.querySelector(".multi--price-sale")?.innerText

const image =
item.querySelector("img")?.src

const link =
item.querySelector("a")?.href

if(!title || !priceText) return

const price = extractPrice(priceText)

results.push({

name: title,
price: price,
image: image,
link: link,
market: "AliExpress",
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
