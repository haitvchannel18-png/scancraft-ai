// ================= IMPORTS =================

import { logAI } from "../utils/AILogger.js"

const WIKI_API =
"https://en.wikipedia.org/api/rest_v1/page/summary/"

const IMAGE_API =
"https://api.unsplash.com/search/photos?per_page=5&query="

const UNSPLASH_KEY = ""


// ================= MAIN AGGREGATOR =================

export async function aggregateKnowledge(objectInfo){

logAI("Knowledge aggregation started")

const name = objectInfo.name

const [

wikiData,
imageData,
materialData,
manufacturingData,
futureIdeas

] = await Promise.all([

fetchWikipedia(name),
fetchImages(name),
estimateMaterials(objectInfo),
estimateManufacturing(objectInfo),
predictFutureIdeas(objectInfo)

])

return{

description: wikiData.description,
history: wikiData.history,

images: imageData,

materials: materialData,

manufacturing: manufacturingData,

futureIdeas: futureIdeas,

similarObjects: wikiData.similar

}

}


// ================= WIKIPEDIA FETCH =================

async function fetchWikipedia(name){

try{

const res = await fetch(WIKI_API + encodeURIComponent(name))

const data = await res.json()

return{

description: data.extract || "",
history: extractHistory(data.extract),
similar: extractSimilar(data.extract)

}

}catch(e){

return{

description:"",
history:[],
similar:[]

}

}

}


// ================= IMAGE SEARCH =================

async function fetchImages(name){

if(!UNSPLASH_KEY) return []

try{

const res = await fetch(
IMAGE_API + encodeURIComponent(name) +
"&client_id=" + UNSPLASH_KEY
)

const data = await res.json()

return data.results.map(img=>img.urls.small)

}catch(e){

return[]

}

}


// ================= MATERIAL ESTIMATION =================

function estimateMaterials(objectInfo){

const name = objectInfo.name.toLowerCase()

if(name.includes("bottle")){

return ["plastic","glass","metal cap"]

}

if(name.includes("phone")){

return ["aluminium","glass","silicon chip"]

}

if(name.includes("chair")){

return ["wood","plastic","steel"]

}

return ["metal","plastic","composite materials"]

}


// ================= MANUFACTURING PROCESS =================

function estimateManufacturing(objectInfo){

const name = objectInfo.name.toLowerCase()

if(name.includes("bottle")){

return[
"plastic molding",
"cooling process",
"label printing",
"packaging"
]

}

if(name.includes("phone")){

return[
"chip fabrication",
"screen assembly",
"battery integration",
"final device assembly"
]

}

return[
"raw material preparation",
"component shaping",
"assembly",
"quality inspection"
]

}


// ================= FUTURE IDEAS =================

function predictFutureIdeas(objectInfo){

const name = objectInfo.name.toLowerCase()

if(name.includes("bicycle")){

return[
"AI assisted bicycles",
"self balancing bikes",
"solar powered electric bikes"
]

}

if(name.includes("phone")){

return[
"transparent smartphones",
"holographic displays",
"AI integrated assistants"
]

}

return[
"eco friendly materials",
"smart sensors integration",
"AI assisted automation"
]

}


// ================= HISTORY EXTRACTOR =================

function extractHistory(text){

if(!text) return []

const sentences = text.split(". ")

return sentences.slice(0,3)

}


// ================= SIMILAR OBJECTS =================

function extractSimilar(text){

if(!text) return []

const words = text.split(" ")

return words.slice(0,5)

}
