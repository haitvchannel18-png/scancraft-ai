// modules/commerce/google-shopping.js

import { EventBus } from "../core/events.js"
import Amazon from "./amazon-search.js"
import Flipkart from "./flipkart-search.js"
import Ebay from "./ebay-search.js"

class GoogleShopping {

constructor(){
this.name = "GoogleShopping-Aggregator"
}

// 🔥 MAIN SEARCH
async search(query){

if(!query) return []

EventBus.emit("googleShoppingStart", query)

try{

// 🧠 MULTI SOURCE SEARCH
const [amazon, flipkart, ebay] = await Promise.all([
Amazon.search(query),
Flipkart.search(query),
Ebay.search(query)
])

// 🧠 MERGE ALL RESULTS
let combined = [
...amazon,
...flipkart,
...ebay
]

// 🧠 NORMALIZE + SCORE
combined = this.normalize(combined)

// 🧠 SORT BEST DEALS
combined.sort((a,b)=> b.score - a.score)

// 🧠 LIMIT TOP RESULTS
const finalResults = combined.slice(0,10)

EventBus.emit("googleShoppingComplete", finalResults)

return finalResults

}catch(err){

EventBus.emit("googleShoppingError", err)
return []

}

}

// 🧠 NORMALIZATION ENGINE
normalize(products){

return products.map(p=>{

const numericPrice = this.extractPrice(p.price)

// 💀 smart scoring formula
const score =
(5 - numericPrice/2000) + // cheaper = better
(parseFloat(p.rating || 3)) +
(p.confidence || 0.5) +
(this.platformBoost(p.platform))

return {
...p,
numericPrice,
score
}

})

}

// 💰 PRICE PARSER
extractPrice(price){

if(!price) return 1000

const num = price.replace(/[^\d.]/g,"")
return parseFloat(num) || 1000

}

// 🚀 PLATFORM BOOST
platformBoost(platform){

const boost = {
Amazon: 0.5,
Flipkart: 0.5,
"eBay": 0.3
}

return boost[platform] || 0.2

}

}

export default new GoogleShopping()
