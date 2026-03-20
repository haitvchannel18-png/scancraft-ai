// modules/learning-ai/knowledge-expander.js

import KnowledgeUpdater from "./knowledge-updater.js"
import AILogger from "../utils/ai-logger.js"

class KnowledgeExpander {

expand(object, inferredData){

if(!object) return

KnowledgeUpdater.update(object, {
...inferredData,
source: "ai_generated"
})

AILogger.log("info","Knowledge expanded",{object})

}

}

export default new KnowledgeExpander()
