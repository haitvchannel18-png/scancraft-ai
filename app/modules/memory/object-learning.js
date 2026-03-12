// modules/knowledge/object-info.js

import { getKnowledge, storeKnowledge } from "../memory/knowledge-cache.js"
import { fetchWikiInfo } from "./wiki.js"
import { aggregateKnowledge } from "./knowledge-aggregator.js"

export async function getObjectInfo(objectName){

if(!objectName) return null

const name = normalizeName(objectName)

// 1️⃣ check cached knowledge
const cached = await getKnowledge(name)

if(cached) return cached

// 2️⃣ fetch knowledge sources
const wikiData = await fetchWikiInfo(name)

const knowledge = await aggregateKnowledge({
name,
wiki:wikiData
})

// 3️⃣ store cache
await storeKnowledge(name,knowledge)

return knowledge

}

export function normalizeName(name){

return name
.toLowerCase()
.replace(/[_\-]/g," ")
.trim()

}

export function createBasicObjectInfo(objectName){

return {
name:objectName,
description:`${objectName} is a physical object that can be used for various purposes.`,
materials:[],
uses:[],
history:"",
similar:[]
}

}

export function mergeObjectInfo(base,newData){

return {

name:base.name,

description:newData.description || base.description,

materials:newData.materials || base.materials,

uses:newData.uses || base.uses,

history:newData.history || base.history,

similar:newData.similar || base.similar

}

}

export function createObjectSummary(info){

if(!info) return ""

return `
${info.name}

${info.description}

Materials: ${info.materials?.join(", ") || "Unknown"}

Uses: ${info.uses?.join(", ") || "Various"}

History: ${info.history || "Information not available"}
`

}

export function extractKeyFacts(info){

if(!info) return []

const facts = []

if(info.materials?.length){

facts.push({
title:"Materials",
text:info.materials.join(", ")
})

}

if(info.uses?.length){

facts.push({
title:"Uses",
text:info.uses.join(", ")
})

}

if(info.history){

facts.push({
title:"History",
text:info.history
})

}

return facts

}
