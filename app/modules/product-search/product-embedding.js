// modules/product-search/product-embedding.js

import AILogger from "../utils/ai-logger.js"

class ProductEmbedding {

generate(object){

// 🧠 simple embedding simulation (future CLIP/real embedding)
const vector = object
.toLowerCase()
.split("")
.map(c => c.charCodeAt(0) / 255)

AILogger.log("info","Product embedding created",{object})

return vector

}

}

export default new ProductEmbedding()
