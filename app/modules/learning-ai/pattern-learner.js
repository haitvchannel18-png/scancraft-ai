// modules/learning-ai/pattern-learner.js

import AILogger from "../utils/ai-logger.js"

class PatternLearner {

constructor(){
this.patterns = {}
this.load()
}

// 🔥 learn from object
learn(object){

if(!object) return

this.patterns[object] =
(this.patterns[object] || 0) + 1

this.save()

AILogger.log("info","Pattern learned",{object, count:this.patterns[object]})

}

// 🧠 learn batch (AI pipeline use)
learnBatch(objects){

objects.forEach(o=>{
this.learn(o.label || o)
})

}

// 📊 get top
getTopObjects(limit = 5){

return Object.entries(this.patterns)
.sort((a,b)=>b[1]-a[1])
.slice(0,limit)
.map(([label,count])=>({label,count}))

}

// 🔥 confidence boost (AI integration)
getBoost(label){

const count = this.patterns[label] || 0

// scale factor
return Math.min(0.2, count * 0.02)

}

// 💾 save
save(){

try{
localStorage.setItem("pattern_data", JSON.stringify(this.patterns))
}catch(e){
AILogger.log("error","Pattern save failed",e)
}

}

// 📥 load
load(){

try{

const data = localStorage.getItem("pattern_data")

if(data){
this.patterns = JSON.parse(data)
}

}catch(e){
AILogger.log("error","Pattern load failed",e)
}

}

}

export default new PatternLearner()
