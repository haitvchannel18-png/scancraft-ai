// modules/learning-ai/memory-sync.js

import ConversationLearning from "./conversation-learning.js"
import PatternLearner from "./pattern-learner.js"
import KnowledgeUpdater from "./knowledge-updater.js"

class MemorySync {

sync(){

ConversationLearning.save()
PatternLearner.save()
KnowledgeUpdater.save()

console.log("🧠 Memory Synced")

}

load(){

ConversationLearning.load()
PatternLearner.load()
KnowledgeUpdater.load()

console.log("🧠 Memory Loaded")

}

}

export default new MemorySync()
