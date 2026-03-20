// modules/learning-ai/knowledge-updater.js

import AILogger from "../utils/ai-logger.js"

class KnowledgeUpdater {

constructor(){
this.knowledge = {}
}

// 🔄 update
update(object, data){

this.knowledge[object] = {
...(this.knowledge[object] || {}),
...data,
updatedAt: Date.now()
}

AILogger.log("info","Knowledge updated", {object})

}

// 🔍 get
get(object){

return this.knowledge[object] || null

}

// 💾 save
save(){

localStorage.setItem("ai_knowledge", JSON.stringify(this.knowledge))

}

// 📥 load(){

const d = localStorage.getItem("ai_knowledge")

if(d){
this.knowledge = JSON.parse(d)
}

}

}

export default new KnowledgeUpdater()
