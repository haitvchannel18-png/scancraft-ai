// modules/vision/knowledge-stage.js

import { EventBus } from "../core/events.js"

import { searchHistory } from "../knowledge/history-search.js"
import { getMaterialInfo } from "../knowledge/material-db.js"
import { searchProductDB } from "../knowledge/product-db.js"
import { getBrandInfo } from "../knowledge/brand-info.js"
import { searchPrice } from "../knowledge/price-search.js"
import { fetchWiki } from "../knowledge/wiki.js"

const MAX_IMAGES = 5

export async function runKnowledgeStage(reasoningResults){

try{

EventBus.emit("visionStageStart","knowledge")

if(!reasoningResults || reasoningResults.length === 0){
return []
}

const enriched = []

for(const item of reasoningResults){

const objectName = item.object || item.label

const history = await searchHistory(objectName)

const materials = await getMaterialInfo(objectName)

const product = await searchProductDB(objectName)

const brand = await getBrandInfo(item.brand)

const price = await searchPrice(objectName)

const wiki = await fetchWiki(objectName)

const images = extractImages(wiki)

const knowledge = {

object: objectName,

confidence: item.confidence,

brand,

category: product?.category || "unknown",

description: wiki?.summary || "",

history,

materials,

manufacturing: product?.manufacturing || [],

price,

images,

source: "knowledge-stage"

}

enriched.push(knowledge)

}

EventBus.emit("visionKnowledgeComplete",enriched)

return enriched

}catch(err){

console.error("Knowledge stage error",err)

EventBus.emit("visionKnowledgeError",err)

return []

}

}



function extractImages(wiki){

if(!wiki || !wiki.images) return []

return wiki.images.slice(0,MAX_IMAGES)

}
