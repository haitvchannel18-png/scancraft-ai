// modules/commerce/product-compare.js

import { EventBus } from "../core/events.js"

export function compareProducts(results){

if(!results || results.length === 0) return null

const normalized = results
.map(normalizeProduct)
.filter(Boolean)

if(normalized.length === 0) return null

normalized.sort((a,b)=>a.priceValue - b.priceValue)

const bestDeal = normalized[0]

const comparison = {

best: bestDeal,

options: normalized,

totalSources: normalized.length,

recommendation: generateRecommendation(bestDeal)

}

EventBus.emit("productComparisonReady",comparison)

return comparison

}



function normalizeProduct(product){

if(!product || !product.price) return null

const priceValue = extractPrice(product.price)

return {

marketplace: product.marketplace,

query: product.query,

url: product.searchUrl,

priceLabel: product.price,

priceValue: priceValue

}

}



function extractPrice(priceString){

if(!priceString) return Number.MAX_SAFE_INTEGER

const numbers = priceString.replace(/[^\d]/g,"")

if(!numbers) return Number.MAX_SAFE_INTEGER

return parseInt(numbers,10)

}



function generateRecommendation(best){

return `Best price found on ${best.marketplace}`
}
