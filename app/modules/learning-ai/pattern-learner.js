// modules/learning-ai/pattern-learner.js

import AILogger from "../utils/ai-logger.js"

class PatternLearner {

constructor(){
this.patterns = {}
}

// 📊 learn pattern
learn(object){

this.patterns[object] =
(this.patterns[object] || 0) + 1

AILogger.log("info","Pattern learned", {object})

}

// 🔥 most common objects
getTopObjects(){

return Object.entries(this.patterns)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)

}

// 💾 save
save(){
localStorage.setItem("pattern_data", JSON.stringify(this.patterns))
}

// 📥 load
load(){

const d = localStorage.getItem("pattern_data")

if(d){
this.patterns = JSON.parse(d)
}

}

}

export default new PatternLearner()
