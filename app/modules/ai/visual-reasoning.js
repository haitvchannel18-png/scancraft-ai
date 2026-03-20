// modules/ai/visual-reasoning.js

import Context from "./context.js"
import { EventBus } from "../core/events.js"

class VisualReasoning {

constructor(){
this.lastScene = null
}

// 🔥 MAIN FUNCTION
analyzeScene(objects = []){

if(!objects.length){
return null
}

EventBus.emit("visualReasoningStart")

try{

// 🧠 STEP 1 — SCENE TYPE
const sceneType = this.inferScene(objects)

// 🧠 STEP 2 — RELATIONS
const relations = this.inferRelations(objects)

// 🧠 STEP 3 — PURPOSE
const purpose = this.inferPurpose(sceneType, objects)

// 🧠 STEP 4 — CONFIDENCE
const confidence = this.computeConfidence(objects)

// 📦 FINAL OUTPUT
const result = {
scene: sceneType,
objects,
relations,
purpose,
confidence,
timestamp: Date.now()
}

// 🧠 UPDATE CONTEXT
Context.updateScene(sceneType)

this.lastScene = result

EventBus.emit("visualReasoningDone", result)

return result

}catch(err){

EventBus.emit("visualReasoningError", err)
return null

}

}

// 🧠 SCENE DETECTION
inferScene(objects){

const labels = objects.map(o=>o.label)

if(this.match(labels, ["spoon","pan","knife","bowl"])) return "kitchen"
if(this.match(labels, ["laptop","keyboard","mouse"])) return "workspace"
if(this.match(labels, ["car","road","bike"])) return "outdoor transport"
if(this.match(labels, ["bed","pillow","lamp"])) return "bedroom"

return "general environment"

}

// 🔗 RELATION ENGINE
inferRelations(objects){

const relations = []

for(let i=0;i<objects.length;i++){
for(let j=i+1;j<objects.length;j++){

const a = objects[i].label
const b = objects[j].label

relations.push({
between: [a,b],
relation: this.getRelation(a,b)
})

}
}

return relations

}

// 🔧 RELATION LOGIC
getRelation(a,b){

if(a === "knife" && b === "vegetable") return "cutting"
if(a === "spoon" && b === "bowl") return "eating"
if(a === "laptop" && b === "keyboard") return "input system"

return "co-existing"

}

// 🎯 PURPOSE DETECTION
inferPurpose(scene, objects){

const purposes = {
kitchen: "food preparation",
workspace: "working or studying",
"outdoor transport": "travel",
bedroom: "resting"
}

return purposes[scene] || "general activity"

}

// 📊 CONFIDENCE
computeConfidence(objects){

const avg = objects.reduce((sum,o)=>sum + (o.score || 0.5),0) / objects.length

return Math.min(1, avg)

}

// 🧩 HELPER
match(labels, required){

return required.some(r => labels.includes(r))

}

// 🔄 GET LAST
getLastScene(){
return this.lastScene
}

}

export default new VisualReasoning()
