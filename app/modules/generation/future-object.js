// modules/generation/future-object.js

import AILogger from "../utils/ai-logger.js"
import ImageGenerator from "./image-generator.js"

class FutureObject {

async predict(object){

const prompt = `${object} in future advanced technology 2050`

const image = await ImageGenerator.generate(prompt)

AILogger.log("info","Future object generated",{object})

return {
object,
futureImage: image
}

}

}

export default new FutureObject()
