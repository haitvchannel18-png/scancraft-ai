// ================= IMPORT =================

import { emit } from "../core/events.js"
import { searchAmazonProducts } from "./amazon-search.js"
import { searchFlipkartProducts } from "./flipkart-search.js"



// ================= COMPARE PRODUCTS =================

export async function compareProductPrices(object){

emit("commerce:compare:start")

try{

const results = await Promise.all([

searchAmazonProducts(object),
searchFlipkartProducts(object)

])

const validResults = results.filter(r => r !== null)

const ranked = rankMarketplaces(validResults)

emit("commerce:compare:complete", ranked)

return ranked

}catch(err){

console.error("Product comparison failed", err)

emit("commerce:compare:error")

return []

}

}



// ================= RANK MARKETPLACES =================

function rankMarketplaces(results){

return results.sort((a,b)=>{

const priceA = extractPrice(a.estimatedPrice)
const priceB = extractPrice(b.estimatedPrice)

return priceA - priceB

})

}



// ================= PRICE EXTRACTION =================

function extractPrice(priceRange){

if(!priceRange){

return Infinity

}

const numbers = priceRange.match(/\d+/g)

if(!numbers){

return Infinity

}

return parseInt(numbers[0])

}



// ================= BEST DEAL =================

export function findBestDeal(results){

if(!results || results.length === 0){

return null

}

return results[0]

}



// ================= SUMMARY =================

export function comparisonSummary(results){

if(!results.length){

return "No product results available."

}

const best = results[0]

return `Best deal available on ${best.marketplace}. 
Estimated price range: ${best.estimatedPrice}.`

}



// ================= PRODUCT CARD =================

export function generateProductCards(results){

return results.map(result => ({

marketplace: result.marketplace,
product: result.object,
priceRange: result.estimatedPrice,
link: result.searchURL

}))

}



// ================= MULTI MARKET SEARCH =================

export async function multiMarketplaceSearch(object){

const marketplaces = await compareProductPrices(object)

return {

object: object.name,

bestDeal: findBestDeal(marketplaces),

marketplaces

}

}
