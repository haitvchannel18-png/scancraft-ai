// modules/commerce/amazon-search.js

import { EventBus } from "../core/events.js"

class AmazonSearch {

constructor(){
this.baseURL = "https://www.amazon.in/s?k="
}

// 🔥 MAIN SEARCH
async search(query){

if(!query) return []

EventBus.emit("amazonSearchStart", query)

try{

const url = this.baseURL + encodeURIComponent(query)

// ⚡ Fake structured result (browser-safe)
const results = this.buildResults(query, url)

EventBus.emit("amazonSearchComplete", results)

return results

}catch(err){

EventBus.emit("amazonSearchError", err)
return []

}

}

// 🧠 RESULT BUILDER
buildResults(query, url){

const products = []

for(let i=1;i<=5;i++){

products.push({
title: `${query} ${i}`,
price: this.randomPrice(),
rating: (Math.random()*2+3).toFixed(1),
platform: "Amazon",
link: url,
confidence: 0.8
})

}

return products

}

// 💰 RANDOM PRICE (UI demo)
randomPrice(){

return "₹" + (Math.floor(Math.random()*5000)+500)

}

}

export default new AmazonSearch()
