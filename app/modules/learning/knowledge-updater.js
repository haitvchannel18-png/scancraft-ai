// modules/learning/knowledge-updater.js

import AILogger from "../utils/ai-logger.js"

class KnowledgeUpdaterSystem {

constructor(){
this.db = {}
}

// 🔄 update system knowledge
update(object, data){

this.db[object] = {
...(this.db[object] || {}),
...data,
updatedAt: Date.now()
}

AILogger.log("info","System knowledge updated",{object})

}

// 🔍 get
get(object){
return this.db[object] || null
}

// 💾 save
save(){
localStorage.setItem("system_knowledge", JSON.stringify(this.db))
}

// 📥 load
load(){

const d = localStorage.getItem("system_knowledge")

if(d){
this.db = JSON.parse(d)
}

}

}

export default new KnowledgeUpdaterSystem()
