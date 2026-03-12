// modules/ai/similarity.js

import { EventBus } from "../core/events.js"
import { getMaterialInfo } from "../knowledge/material-db.js"
import { searchProductDB } from "../knowledge/product-db.js"

import { cacheKnowledge } from "../memory/cache-manager.js"
import { logAI } from "../utils/ai-logger.js"

let lastComparison = null

export async function compareObjects(objectA, objectB){

try{

if(!objectA || !objectB){
return null
}

const infoA = await collectObjectInfo(objectA)
const infoB = await collectObjectInfo(objectB)

const score = calculateSimilarity(infoA,infoB)

const explanation = buildExplanation(infoA,infoB,score)

const result = {

objectA,
objectB,

similarityScore: score,

materialsMatch: compareMaterials(infoA.materials,infoB.materials),

categoryMatch: infoA.category === infoB.category,

analysis: explanation,

generatedAt: Date.now()

}

lastComparison = result

cacheKnowledge("similarity-"+objectA+"-"+objectB,result)

EventBus.emit("similarityComparisonReady",result)

logAI("SimilarityComparison",result)

return result

}catch(err){

console.error("Similarity AI error",err)

EventBus.emit("similarityAIError",err)

return null

}

}



async function collectObjectInfo(objectName){

const materials = await getMaterialInfo(objectName)

const product = await searchProductDB(objectName)

return {

object: objectName,

materials: materials || [],

category: product?.category || "unknown"

}

}



function calculateSimilarity(a,b){

let score = 0

if(a.category === b.category){
score += 0.4
}

const materialScore = computeMaterialSimilarity(a.materials,b.materials)

score += materialScore

return Math.min(score,1)

}



function computeMaterialSimilarity(matA,matB){

if(!matA || !matB) return 0

const common = matA.filter(m => matB.includes(m))

return common.length / Math.max(matA.length,matB.length) * 0.6

}



function compareMaterials(matA,matB){

if(!matA || !matB) return []

return matA.filter(m => matB.includes(m))

}



function buildExplanation(a,b,score){

let text = `Comparison between ${a.object} and ${b.object}:\n`

if(a.category === b.category){

text += "Both objects belong to the same category.\n"

}

const common = compareMaterials(a.materials,b.materials)

if(common.length){

text += `They share similar materials such as ${common.join(", ")}.\n`

}

text += `Overall similarity score: ${(score*100).toFixed(1)}%.`

return text

}



export function getLastComparison(){

return lastComparison

}



export function clearComparison(){

lastComparison = null

EventBus.emit("similarityComparisonCleared")

}
