// modules/learning/learning-engine.js

import ConversationLearning from "../learning-ai/conversation-learning.js"
import PatternLearner from "../learning-ai/pattern-learner.js"
import FeedbackCollector from "../learning-ai/feedback-collector.js"
import KnowledgeUpdaterAI from "../learning-ai/knowledge-updater.js"

import KnowledgeUpdaterSystem from "./knowledge-updater.js"
import ModelAdaptation from "./model-adaptation.js"

import Telemetry from "../utils/telemetry.js"
import AILogger from "../utils/ai-logger.js"

class LearningEngine {

process({object, result, feedback = null}){

// 🧠 learn pattern
PatternLearner.learn(object)

// 💬 conversation memory
ConversationLearning.learn({
question: object,
answer: result,
feedback
})

// 👍 feedback
if(feedback){
FeedbackCollector.collect({
object,
correctLabel: result,
userFeedback: feedback
})
}

// 📚 update AI knowledge
KnowledgeUpdaterAI.update(object, {result})

// ⚙️ update system knowledge
KnowledgeUpdaterSystem.update(object, {result})

// ⚡ adapt model
ModelAdaptation.adapt(Telemetry.get())

AILogger.log("info","Learning cycle complete",{object})

}

}

export default new LearningEngine()
