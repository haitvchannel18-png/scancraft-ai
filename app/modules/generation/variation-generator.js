// modules/generation/variation-generator.js

import AILogger from "../utils/ai-logger.js"
import ImageGenerator from "./image-generator.js"

class VariationGenerator {

async generateVariations(object){

const prompts = [
`${object} futuristic design`,
`${object} premium version`,
`${object} minimal style`,
`${object} concept design`
]

const results = []

for(const p of prompts){

const img = await ImageGenerator.generate(p)

if(img) results.push(img)

}

AILogger.log("info","Variations generated",{object})

return results

}

}

export default new VariationGenerator()
