// ================= IMPORTS =================

import { emit } from "../core/events.js"



// ================= KNOWLEDGE SOURCES =================

const localKnowledge = {

materials:{
electronics:["plastic","copper","silicon","aluminum"],
mechanical:["steel","iron","alloy"],
furniture:["wood","metal","plastic"]
},

uses:{
electronics:["signal processing","audio playback","communication"],
mechanical:["power transfer","motion control"],
furniture:["support","sitting","storage"]
},

manufacturing:{
electronics:"PCB fabrication and electronic assembly",
mechanical:"industrial machining and metal forming",
furniture:"cutting, shaping and structural assembly"
}

}



// ================= AGGREGATE KNOWLEDGE =================

export async function aggregateKnowledge(object){

emit("knowledge:start")

try{

const sources = await Promise.all([

getLocalKnowledge(object),
fetchWikipediaData(object.name),
generateAIInsights(object)

])

const merged = mergeKnowledge(sources)

emit("knowledge:complete",merged)

return merged

}catch(err){

console.error("Knowledge aggregation failed",err)

emit("knowledge:error")

return getLocalKnowledge(object)

}

}



// ================= LOCAL KNOWLEDGE =================

function getLocalKnowledge(object){

const category = object.category || "general"

return {

materials: localKnowledge.materials[category] || [],

uses: localKnowledge.uses[category] || [],

manufacturing: localKnowledge.manufacturing[category] || "Industrial fabrication"

}

}



// ================= WIKIPEDIA FETCH =================

async function fetchWikipediaData(name){

try{

const url =
`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`

const response = await fetch(url)

if(!response.ok){

throw new Error("Wiki fetch failed")

}

const data = await response.json()

return {

history: data.extract || null,

thumbnail: data.thumbnail?.source || null

}

}catch(err){

return {

history:null,
thumbnail:null

}

}

}



// ================= AI INSIGHTS =================

async function generateAIInsights(object){

return {

future: predictFuture(object),

category: object.category || "general"

}

}



// ================= FUTURE PREDICTION =================

function predictFuture(object){

const cat = object.category?.toLowerCase()

if(cat === "electronics"){

return "Future versions may integrate AI chips and improved power efficiency."

}

if(cat === "mechanical"){

return "Future designs may include lighter alloys and automated manufacturing."

}

return "Future developments may improve efficiency and durability."

}



// ================= MERGE KNOWLEDGE =================

function mergeKnowledge(sources){

const result = {}

sources.forEach(source=>{

Object.keys(source).forEach(key=>{

if(!result[key]){

result[key] = source[key]

}

})

})

return result

}
