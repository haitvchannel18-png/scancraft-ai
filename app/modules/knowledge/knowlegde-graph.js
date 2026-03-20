// modules/knowledge/knowledge-graph.js

import Cache from "../memory/knowledge-cache.js"
import { EventBus } from "../core/events.js"

class KnowledgeGraph {

constructor(){
this.graph = {}
}

// 🔥 MAIN BUILD FUNCTION
build(objectData){

if(!objectData) return null

EventBus.emit("graphBuildStart", objectData.object)

const node = this.createNode(objectData)

// 🧠 ADD RELATIONS
this.addRelations(node, objectData)

// 💾 STORE GRAPH
this.graph[node.id] = node

EventBus.emit("graphBuildComplete", node)

return node

}

// 🧠 CREATE NODE
createNode(data){

return {
id: data.object,
type: data.category || "object",
properties: {
use: data.use,
materials: data.materials,
price: data.price,
summary: data.summary
},
relations: []
}

}

// 🔗 ADD RELATIONS
addRelations(node, data){

// material relations
if(data.materials){
data.materials.forEach(m=>{
node.relations.push({
type: "made_of",
target: m
})
})
}

// product relations
if(data.products){
data.products.slice(0,3).forEach(p=>{
node.relations.push({
type: "related_product",
target: p.name || p
})
})
}

// category relation
if(data.category){
node.relations.push({
type: "belongs_to",
target: data.category
})
}

// usage relation
if(data.use){
node.relations.push({
type: "used_for",
target: data.use
})
}

}

// 🔍 QUERY GRAPH
query(object){

return this.graph[object] || null

}

// 🔗 FIND RELATED OBJECTS
findRelated(object){

const node = this.graph[object]

if(!node) return []

return node.relations.map(r => r.target)

}

// 📊 GRAPH STATS
stats(){

return {
nodes: Object.keys(this.graph).length
}

}

}

export default new KnowledgeGraph()
