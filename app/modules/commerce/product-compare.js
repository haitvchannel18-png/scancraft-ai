// modules/commerce/product-compare.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let lastComparison = null

export function compareProducts(products){

try{

if(!products || products.length === 0){
return null
}

EventBus.emit("productCompareStart",products)

const scored = products.map(p => ({
...p,
score: computeScore(p)
}))

const ranked = scored.sort((a,b)=> b.score - a.score)

const best = ranked[0]

const result = {

bestProduct: best,
ranking: ranked,
total: products.length,
timestamp: Date.now()

}

lastComparison = result

EventBus.emit("productCompareComplete",result)

logAI("ProductCompare",result)

return result

}catch(err){

console.error("Product compare error",err)

EventBus.emit("productCompareError",err)

return null

}

}



function computeScore(product){

let score = 0

if(product.price){

score += priceScore(product.price)

}

if(product.rating){

score += product.rating * 20

}

if(product.reviews){

score += Math.log(product.reviews + 1) * 10

}

if(product.market){

score += marketplaceTrust(product.market)

}

if(product.image){

score += 10

}

return score

}



function priceScore(price){

if(price < 500) return 50
if(price < 1000) return 40
if(price < 3000) return 30
if(price < 10000) return 20

return 10

}



function marketplaceTrust(market){

const trust = {

Amazon: 30,
Flipkart: 30,
Myntra: 25,
JioMart: 25,
Snapdeal: 20,
AliExpress: 15,
eBay: 15

}

return trust[market] || 10

}



export function getLastComparison(){
return lastComparison
}
