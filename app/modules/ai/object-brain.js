// ================= IMPORTS =================

import { runVisionPipeline } from "../vision/vision-pipeline.js"
import { runKnowledgeStage, getPrimaryKnowledge } from "../vision/knowledge-stage.js"

import { speak } from "../voice/narration.js"

import { searchAmazon } from "../commerce/amazon-search.js"
import { searchFlipkart } from "../commerce/flipkart-search.js"
import { compareProducts } from "../commerce/product-compare.js"

import { renderObjectPanel } from "../ui/object-panel.js"
import { renderCards } from "../ui/card-renderer.js"

import { emit } from "../core/events.js"



// ================= MAIN ENTRY =================

export async function analyzeScene(frame){

try{

emit("brain:analysis:start")

// 1️⃣ vision pipeline

const visionResults = await runVisionPipeline(frame)

if(!visionResults || visionResults.length === 0){

emit("brain:no-object")

return null

}


// 2️⃣ knowledge stage

const knowledgeResults = await runKnowledgeStage(visionResults)

const primary = getPrimaryKnowledge(knowledgeResults)

if(!primary){

emit("brain:no-knowledge")

return null

}


// 3️⃣ render UI

renderObjectPanel(primary)

renderCards(primary)


// 4️⃣ voice explanation

await speak(primary.description)


// 5️⃣ commerce search

loadCommerce(primary.name)

emit("brain:analysis:complete")

return primary

}catch(err){

console.error("Object brain error", err)

emit("brain:error")

return null

}

}



// ================= COMMERCE =================

async function loadCommerce(objectName){

try{

const amazon = await searchAmazon(objectName)

const flipkart = await searchFlipkart(objectName)

const products = compareProducts([...amazon,...flipkart])

emit("commerce:results", products)

}catch(err){

console.warn("Commerce search failed")

}

}



// ================= OBJECT CHAT =================

export async function askObject(objectData, question){

try{

emit("brain:question:start")

const context = buildContext(objectData)

const answer = await queryAI(context, question)

emit("brain:question:answer", answer)

await speak(answer)

return answer

}catch(err){

console.error("Object chat error")

return "Sorry, I could not answer that."

}

}



// ================= CONTEXT BUILDER =================

function buildContext(object){

return {

name: object.name,

category: object.category,

purpose: object.purpose,

materials: object.material,

history: object.history

}

}



// ================= AI QUERY =================

async function queryAI(context, question){

const prompt = `
Object: ${context.name}
Category: ${context.category}
Purpose: ${context.purpose}
Materials: ${context.materials}
History: ${context.history}

User Question: ${question}

Answer clearly.
`

// future AI integration

return "This object is commonly used for " + context.purpose

}



// ================= FUTURE IDEAS =================

export function generateFutureIdeas(object){

const ideas = []

if(object.category === "vehicle"){

ideas.push("AI self driving upgrade")

ideas.push("electric powered version")

}

if(object.category === "furniture"){

ideas.push("smart ergonomic design")

ideas.push("adjustable AI posture support")

}

return ideas

}



// ================= DIY IDEAS =================

export function generateDIY(object){

const diy = []

diy.push(`Repair guide for ${object.name}`)

diy.push(`Creative reuse of ${object.name}`)

return diy

}
