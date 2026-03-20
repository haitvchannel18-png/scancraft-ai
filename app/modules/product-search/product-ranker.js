// modules/product-search/product-ranker.js

import { cosineSimilarity } from "../utils/helpers.js"
import ProductEmbedding from "./product-embedding.js"
import AILogger from "../utils/ai-logger.js"

class ProductRanker {

rank(object, products){

const queryVec = ProductEmbedding.generate(object)

const ranked = products.map(p=>{

const vec = ProductEmbedding.generate(p.name)

return {
...p,
score: cosineSimilarity(queryVec, vec)
}

})
.sort((a,b)=>b.score - a.score)

AILogger.log("info","Products ranked",{object})

return ranked

}

}

export default new ProductRanker()
