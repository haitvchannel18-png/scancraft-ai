// modules/learning-ai/feedback-collector.js

import AILogger from "../utils/ai-logger.js"

class FeedbackCollector {

constructor(){
this.feedbackData = []
}

// 👍 / 👎 collect
collect({object, correctLabel, userFeedback}){

const entry = {
object,
correctLabel,
userFeedback,
time: Date.now()
}

this.feedbackData.push(entry)

AILogger.log("warn","User feedback received", entry)

}

// 📊 get feedback
getAll(){
return this.feedbackData
}

// 💾 save
save(){
localStorage.setItem("feedback_data", JSON.stringify(this.feedbackData))
}

// 📥 load
load(){

const d = localStorage.getItem("feedback_data")

if(d){
this.feedbackData = JSON.parse(d)
}

}

}

export default new FeedbackCollector()
