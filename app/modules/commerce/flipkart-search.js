// modules/commerce/flipkart-search.js

import { EventBus } from "../core/events.js"

const FLIPKART_BASE = "https://www.flipkart.com/search?q="

export async function searchFlipkart(objectLabel){

if(!objectLabel) return null

const query = encodeURIComponent(objectLabel)

const url = FLIPKART_BASE + query

const priceRange = estimatePrice(objectLabel)

const result = {

marketplace:"Flipkart",

query:objectLabel,

searchUrl:url,

price:priceRange,

note:"Open link to view live Flipkart results"

}

EventBus.emit("flipkartSearchReady",result)

return result

}



function estimatePrice(label){

const ranges = {

bottle:"₹150 - ₹800",
chair:"₹1500 - ₹12000",
laptop:"₹30000 - ₹200000",
phone:"₹5000 - ₹120000",
headphones:"₹500 - ₹10000"

}

const key = label.toLowerCase()

if(ranges[key]) return ranges[key]

return "₹300 - ₹20000"
}
