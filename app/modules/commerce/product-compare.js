// modules/commerce/product-compare.js

import { EventBus } from "../core/events.js"

class ProductCompare {

compare(products){

if(!products || products.length < 2) return null

EventBus.emit("productCompareStart")

try{

// 🧠 top 2 compare
const [a,b] = products

const comparison = {

productA: this.extract(a),
productB: this.extract(b),

winner: this.getWinner(a,b),

differences: this.getDifferences(a,b)

}

EventBus.emit("productCompareComplete", comparison)

return comparison

}catch(err){

EventBus.emit("productCompareError", err)
return null

}

}

// 🧠 EXTRACT CORE DATA
extract(p){

return {
title: p.title,
price: p.price,
rating: p.rating,
platform: p.platform
}

}

// 🏆 WINNER LOGIC
getWinner(a,b){

const scoreA = this.score(a)
const scoreB = this.score(b)

return scoreA > scoreB ? a.title : b.title

}

// 📊 SCORE
score(p){

const price = this.extractPrice(p.price)

return (
(parseFloat(p.rating || 3)) +
(p.confidence || 0.5) -
(price / 5000)
)

}

// 💰 PRICE PARSER
extractPrice(price){

const num = price.toString().replace(/[^\d.]/g,"")
return parseFloat(num) || 1000

}

// 🔍 DIFFERENCE ENGINE
getDifferences(a,b){

return {
priceDiff: this.extractPrice(a.price) - this.extractPrice(b.price),
ratingDiff: (parseFloat(a.rating||0) - parseFloat(b.rating||0)).toFixed(2),
platformDiff: `${a.platform} vs ${b.platform}`
}

}

}

export default new ProductCompare()
