// modules/learning/user-feedback.js

import LearningEngine from "./learning-engine.js"

class UserFeedback {

submit({object, result, feedback}){

LearningEngine.process({
object,
result,
feedback
})

console.log("👍 Feedback submitted:", feedback)

}

}

export default new UserFeedback()
