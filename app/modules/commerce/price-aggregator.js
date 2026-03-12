// modules/commerce/price-aggregator.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

import { searchAmazon } from "./amazon-search.js"
import { searchFlipkart } from "./flipkart-search.js"

let lastResults = []

export async function aggregatePrices(query){

try{

EventBus.emit("priceAggregationStart",query)

const tasks = [

safeSearch(searchAmazon,query),
safeSearch(searchFlipkart,query)

]

const results = await Promise.all(tasks)

const merged = mergeResults(results)

const ranked = rankResults(merged)

lastResults = ranked

EventBus.emit("priceAggregationComplete",ranked)

logAI("PriceAggregation",ranked)

return ranked

}catch(err){

console.error("Price aggregation error",err)

EventBus.emit("priceAggregationError",err)

return []

}

}



async function safeSearch(fn,query){

try{

const res = await fn(query)

return res || []

}catch(err){

console.warn("Marketplace search failed",fn.name)

return []

}

}



function mergeResults(results){

let merged = []

results.forEach(list => {

if(Array.isArray(list)){
merged = merged.concat(list)
}

})

return merged

}



function rankResults(products){

if(!products.length) return []

return products
.map(p => ({
...p,
score: computeScore(p)
}))
.sort((a,b) => b.score - a.score)

}



function computeScore(product){

let score = 0

if(product.price) score += 40
if(product.rating) score += product.rating * 10
if(product.reviews) score += Math.log(product.reviews + 1) * 5
if(product.brandMatch) score += 20
if(product.image) score += 10

return score

}



export function getBestDeal(){

if(!lastResults.length) return null

return lastResults[0]

}



export function getLastPriceResults(){
return lastResults
}
