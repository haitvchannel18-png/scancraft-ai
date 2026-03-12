// modules/knowledge/knowledge-aggregator.js

import { EventBus } from "../core/events.js"

import { getHistoryInfo } from "../data/history.js"
import { getMaterialInfo } from "../data/materials.js"
import { getManufacturingInfo } from "../data/manufacturing.js"

import { searchWiki } from "./wiki.js"
import { searchPrice } from "./price-search.js"
import { predictFuture } from "./future-predict.js"



export async function aggregateKnowledge(input){

const {label, reasoning} = input

try{

const [

history,
materials,
manufacturing,
wiki,
price,
future

] = await Promise.all([

safeHistory(label),
safeMaterial(reasoning),
safeManufacturing(label),
safeWiki(label),
safePrice(label),
safeFuture(label)

])



const knowledge = {

object: label,

category: reasoning.category,

material: reasoning.material,

confidence: reasoning.confidence,

history,

materials,

manufacturing,

price,

wiki,

future,

summary: generateSummary({
label,
history,
materials,
wiki
})

}


EventBus.emit("knowledgeReady",knowledge)

return knowledge


}catch(err){

console.error("Knowledge aggregation error",err)

EventBus.emit("knowledgeError",err)

return null

}

}



async function safeHistory(label){

try{
return await getHistoryInfo(label)
}catch{
return null
}

}



async function safeMaterial(reasoning){

try{
return await getMaterialInfo(reasoning.material)
}catch{
return null
}

}



async function safeManufacturing(label){

try{
return await getManufacturingInfo(label)
}catch{
return null
}

}



async function safeWiki(label){

try{
return await searchWiki(label)
}catch{
return null
}

}



async function safePrice(label){

try{
return await searchPrice(label)
}catch{
return null
}

}



async function safeFuture(label){

try{
return await predictFuture(label)
}catch{
return null
}

}



function generateSummary(data){

const parts = []

if(data.label){
parts.push(`${data.label} is a commonly used object.`)
}

if(data.history){
parts.push(`Historically it evolved as: ${data.history.short || ""}`)
}

if(data.materials){
parts.push(`It is often made using ${data.materials.primary || "various materials"}.`)
}

if(data.wiki){
parts.push(data.wiki.extract || "")
}

return parts.join(" ")

}
