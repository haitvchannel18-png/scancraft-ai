// ================= IMPORT =================

import { emit } from "../core/events.js"



// ================= CONFIG =================

const FLIPKART_BASE = "https://www.flipkart.com/search?q="



// ================= SEARCH FLIPKART =================

export async function searchFlipkartProducts(object){

emit("commerce:flipkart-search:start")

try{

const query = encodeURIComponent(object.name)

const searchURL = `${FLIPKART_BASE}${query}`

const result = {

object: object.name,

marketplace: "Flipkart",

searchURL,

estimatedPrice: estimatePrice(object)

}

emit("commerce:flipkart-search:complete", result)

return result

}catch(err){

console.error("Flipkart search failed", err)

emit("commerce:flipkart-search:error")

return null

}

}



// ================= PRICE ESTIMATION =================

function estimatePrice(object){

const category = object.category?.toLowerCase()

if(category === "electronics"){

return "₹2,000 - ₹25,000"

}

if(category === "mechanical"){

return "₹500 - ₹10,000"

}

if(category === "furniture"){

return "₹2,000 - ₹50,000"

}

return "₹300 - ₹5,000"

}



// ================= GENERATE LINK =================

export function generateFlipkartLink(productName){

const query = encodeURIComponent(productName)

return `${FLIPKART_BASE}${query}`

}



// ================= PRODUCT LIST =================

export function generateFlipkartProductList(objects){

return objects.map(obj => ({

name: obj.name,

marketplace: "Flipkart",

link: generateFlipkartLink(obj.name),

priceRange: estimatePrice(obj)

}))

}



// ================= PRODUCT SUMMARY =================

export function flipkartProductSummary(object){

return {

title: object.name,

marketplace: "Flipkart",

link: generateFlipkartLink(object.name),

priceRange: estimatePrice(object)

}

}
