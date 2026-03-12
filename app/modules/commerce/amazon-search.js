// modules/commerce/amazon-search.js

import { EventBus } from "../core/events.js"

const AMAZON_BASE = "https://www.amazon.com/s?k="

export async function searchAmazon(objectLabel){

if(!objectLabel) return null

const query = encodeURIComponent(objectLabel)

const url = AMAZON_BASE + query

const priceRange = estimatePrice(objectLabel)

const result = {

marketplace:"Amazon",

query:objectLabel,

searchUrl:url,

price:priceRange,

note:"Open link to view live marketplace results"

}

EventBus.emit("amazonSearchReady",result)

return result

}



function estimatePrice(label){

const ranges = {

bottle:"$5 - $25",
chair:"$40 - $200",
laptop:"$500 - $2500",
phone:"$200 - $1500",
car:"$10000 - $80000"

}

const key = label.toLowerCase()

if(ranges[key]) return ranges[key]

return "$10 - $500"
}
