// modules/learning-ai/user-intent.js

class UserIntent {

detect(text){

text = text.toLowerCase()

if(text.includes("price")) return "price_check"
if(text.includes("buy")) return "purchase"
if(text.includes("what is")) return "explain"
if(text.includes("future")) return "future_prediction"
if(text.includes("how to")) return "diy"

return "general"

}

}

export default new UserIntent()
