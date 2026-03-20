// modules/product-search/product-search-engine.js

import BrandMatcher from "./brand-matcher.js"
import ProductRanker from "./product-ranker.js"
import AILogger from "../utils/ai-logger.js"

class ProductSearchEngine {

async search(object){

// 🔍 detect brand
const brand = BrandMatcher.match(object)

// 💀 fake API (replace later)
const products = await this.fetchProducts(object, brand)

// 📊 rank
const ranked = ProductRanker.rank(object, products)

AILogger.log("info","Search complete",{object})

return ranked

}

// 🔌 placeholder API
async fetchProducts(object, brand){

return [
{name:`${brand} ${object}`, price:1000},
{name:`${object} premium`, price:1500},
{name:`${object} basic`, price:500}
]

}

}

export default new ProductSearchEngine()
