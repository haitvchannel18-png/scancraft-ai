// modules/learning-ai/conversation-learning.js

import AILogger from "../utils/ai-logger.js"

class ConversationLearning {

constructor(){
this.memory = []
this.maxMemory = 200
}

// 🧠 store conversation
learn({question, answer, feedback = null}){

const entry = {
question,
answer,
feedback,
timestamp: Date.now()
}

this.memory.push(entry)

// limit
if(this.memory.length > this.maxMemory){
this.memory.shift()
}

AILogger.log("info","Conversation stored", entry)

}

// 📊 get patterns
getPatterns(){

const patterns = {}

this.memory.forEach(item=>{

const key = item.question.toLowerCase()

patterns[key] = (patterns[key] || 0) + 1

})

return patterns

}

// 🔍 find similar past question
findSimilar(question){

return this.memory.find(item =>
item.question.includes(question)
)

}

// 💾 save
save(){
localStorage.setItem("conversation_memory", JSON.stringify(this.memory))
}

// 📥 load
load(){

const data = localStorage.getItem("conversation_memory")

if(data){
this.memory = JSON.parse(data)
}

}

}

export default new ConversationLearning()
