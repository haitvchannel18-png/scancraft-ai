// modules/security/privacy-guard.js

import AILogger from "../utils/ai-logger.js"

class PrivacyGuard {

constructor(){
this.blockedKeys = [
"password",
"otp",
"credit card",
"cvv",
"aadhaar",
"pan"
]
}

// 🔍 detect sensitive
isSensitive(text){

const lower = text.toLowerCase()

return this.blockedKeys.some(k => lower.includes(k))

}

// 🔒 protect
filter(text){

if(this.isSensitive(text)){

AILogger.log("warn","Sensitive data blocked",{text})

return "[REDACTED]"

}

return text

}

// 🔐 safe output
safeOutput(data){

if(typeof data === "string"){
return this.filter(data)
}

if(typeof data === "object"){

const safe = {}

for(const k in data){
safe[k] = this.filter(String(data[k]))
}

return safe

}

return data

}

}

export default new PrivacyGuard()
