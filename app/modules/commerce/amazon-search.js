// ================= IMPORT =================

import { emit } from "../core/events.js"



// ================= CONFIG =================

const AMAZON_BASE = "https://www.amazon.com/s?k="



// ================= SEARCH AMAZON =================

export async function searchAmazonProducts(object){

emit("commerce:amazon-search:start")

try{

const query = encodeURIComponent(object.name)

const searchURL = `${AMAZON_BASE}${query}`

const result = {

object: object.name,

searchURL,

estimatedPrice: estimatePrice(object),

marketplace:"Amazon"

}

emit("commerce:amazon-search:complete", result)

return result

}catch(err){

console.error("Amazon search failed", err)

emit("commerce:amazon-search:error")

return null

}

}



// ================= PRICE ESTIMATION =================

function estimatePrice(object){

const category = object.category?.toLowerCase()

if(category === "electronics"){

return "$50 - $300"

}

if(category === "mechanical"){

return "$20 - $150"

}

if(category === "furniture"){

return "$80 - $600"

}

return "$10 - $200"

}



// ================= PRODUCT LINK =================

export function generateAmazonLink(productName){

const query = encodeURIComponent(productName)

return `${AMAZON_BASE}${query}`

}



// ================= MULTIPLE PRODUCTS =================

export function generateAmazonProductList(objects){

return objects.map(obj => ({

name: obj.name,

link: generateAmazonLink(obj.name),

price: estimatePrice(obj)

}))

}



// ================= PRODUCT DETAILS =================

export function productSummary(object){

return {

title: object.name,

marketplace: "Amazon",

link: generateAmazonLink(object.name),

priceRange: estimatePrice(object)

}

}
