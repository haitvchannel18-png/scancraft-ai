// modules/data/history.js

import { EventBus } from "../core/events.js"

const LOCAL_HISTORY_DB = {

bottle:{
origin:"Ancient civilizations used clay and glass vessels.",
timeline:[
"3000 BC – early clay containers",
"1600s – glass bottles used widely in Europe",
"1900s – industrial bottle manufacturing",
"1970s – plastic PET bottles introduced"
],
summary:"Bottles evolved from clay containers to modern plastic and glass storage vessels."
},

chair:{
origin:"Ancient Egypt used ceremonial chairs for royalty.",
timeline:[
"2000 BC – Egyptian ceremonial chairs",
"Middle Ages – wooden furniture becomes common",
"1800s – mass production furniture",
"Modern era – ergonomic and design chairs"
],
summary:"Chairs evolved from royal seating to everyday ergonomic furniture."
},

car:{
origin:"First automobiles appeared in the late 19th century.",
timeline:[
"1886 – Karl Benz patents first automobile",
"1908 – Ford Model T mass production",
"1950s – global automotive expansion",
"Modern era – electric and autonomous vehicles"
],
summary:"Cars evolved from early combustion engines to modern electric mobility."
}

}



export async function getHistoryInfo(label){

if(!label) return null

const key = label.toLowerCase()

// 1️⃣ Local database
if(LOCAL_HISTORY_DB[key]){

EventBus.emit("historyLocalFound",key)

return LOCAL_HISTORY_DB[key]

}

// 2️⃣ Wikipedia API fallback
const wikiData = await fetchWikipedia(label)

if(wikiData){

EventBus.emit("historyWikiFound",label)

return wikiData

}

// 3️⃣ AI inferred history
return inferHistory(label)

}



async function fetchWikipedia(label){

try{

const url =
`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(label)}`

const res = await fetch(url)

if(!res.ok) return null

const data = await res.json()

return {

origin:data.title || label,

timeline:[],

summary:data.extract || null,

source:"wikipedia"

}

}catch{

return null

}

}



function inferHistory(label){

const guess = {

origin:`The object "${label}" likely developed as human technology evolved.`,

timeline:[
"Early concept and primitive versions",
"Industrial manufacturing phase",
"Modern optimized design"
],

summary:`${label} is a man-made object that evolved over time through engineering improvements.`,

source:"ai-inferred"

}

EventBus.emit("historyInferred",label)

return guess

}
