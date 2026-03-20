// modules/security/input-sanitizer.js

import AILogger from "../utils/ai-logger.js"

class InputSanitizer {

// 🔒 clean text
sanitize(text){

if(!text) return ""

// remove script tags
let clean = text.replace(/<script.*?>.*?<\/script>/gi, "")

// remove HTML tags
clean = clean.replace(/<\/?[^>]+(>|$)/g, "")

// trim
clean = clean.trim()

AILogger.log("info","Input sanitized",{original:text, clean})

return clean

}

// 🔍 validate length
validate(text, maxLength = 200){

if(!text) return false

if(text.length > maxLength){
AILogger.log("warn","Input too long",{length:text.length})
return false
}

return true

}

// 🔐 full process
process(text){

const clean = this.sanitize(text)

if(!this.validate(clean)) return null

return clean

}

}

export default new InputSanitizer()
