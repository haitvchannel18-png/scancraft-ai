// modules/product-search/brand-matcher.js

import AILogger from "../utils/ai-logger.js"

class BrandMatcher {

constructor(){

this.brands = [
"nike","adidas","apple","samsung",
"sony","hp","dell","lenovo"
]

}

// 🔍 match brand
match(label){

const lower = label.toLowerCase()

const found = this.brands.find(b => lower.includes(b))

AILogger.log("info","Brand match",{label,found})

return found || "generic"

}

}

export default new BrandMatcher()
