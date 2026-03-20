// modules/commerce/price-aggregator.js

import { EventBus } from "../core/events.js"

class PriceAggregator {

constructor(){
this.platformWeight = {
Amazon:1,
Flipkart:1,
"eBay":0.9,
AliExpress:0.8,
Myntra:0.95,
Meesho:0.85,
JioMart:0.9,
Snapdeal:0.8,
AJIO:0.95,
Shopify:0.85
}
}

// 🔥 MAIN FUNCTION
aggregate(allResults){

if(!allResults || !allResults.length) return []

EventBus.emit("priceAggregationStart")

try{

// 🧠 flatten all results
let products = allResults.flat()

// 🧠 normalize + score
products = products.map(p => this.normalize(p))

// 🧠 sort by best value
products.sort((a,b)=> b.finalScore - a.finalScore)

// 🧠 best deal
const bestDeal = products[0]

// 🧠 price range
const range = this.priceRange(products)

const result = {
bestDeal,
products: products.slice(0,15),
range
}

EventBus.emit("priceAggregationComplete", result)

return result

}catch(err){

EventBus.emit("priceAggregationError", err)
return {products:[]}

}

}

// 🧠 NORMALIZE
normalize(p){

const numericPrice = this.extractPrice(p.price)

const score =
(this.platformWeight[p.platform] || 0.7) +
(parseFloat(p.rating || 3)) +
(p.confidence || 0.5) -
(numericPrice / 5000)

return {
...p,
numericPrice,
finalScore: score
}

}

// 💰 PRICE PARSER
extractPrice(price){

if(!price) return 1000

const num = price.toString().replace(/[^\d.]/g,"")
return parseFloat(num) || 1000

}

// 📊 PRICE RANGE
priceRange(products){

const prices = products.map(p=>p.numericPrice)

return {
min: Math.min(...prices),
max: Math.max(...prices)
}

}

}

export default new PriceAggregator()
