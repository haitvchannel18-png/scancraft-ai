// modules/reasoning/object-relations.js

class ObjectRelations {

constructor(){

this.graph = {
car:["road","driver","wheel"],
phone:["hand","pocket","network"],
laptop:["table","user","keyboard"],
chair:["table","room"],
bottle:["liquid","hand"]
}

}

// 🔥 relation strength
getRelations(label){

const relations = this.graph[label] || []

return relations.map(r=>({
node:r,
weight: Math.random()*0.5 + 0.5
}))

}

}

export default new ObjectRelations()
