// ================= IMPORTS =================

import { logAI } from "../utils/AILogger.js"
import { aggregateKnowledge } from "../knowledge/knowledge-aggregator.js"
import { narrate } from "../voice/narration.js"
import { emit } from "../core/events.js"


// ================= MAIN EXPLANATION =================

export async function explainObject(objectInfo){

logAI("AI explanation pipeline started")

emit("ai:explain-start", objectInfo)

const knowledge = await aggregateKnowledge(objectInfo)

const explanation = buildExplanation(objectInfo, knowledge)

emit("ai:explain-complete", explanation)

return explanation

}


// ================= BUILD EXPLANATION =================

function buildExplanation(objectInfo, knowledge){

const explanation = {

title: objectInfo.name,

category: objectInfo.category || "Unknown",

brand: objectInfo.brand || null,

confidence: objectInfo.confidence || 0,

summary: generateSummary(objectInfo, knowledge),

history: knowledge.history || [],

materials: knowledge.materials || [],

manufacturing: knowledge.manufacturing || [],

futureIdeas: knowledge.futureIdeas || [],

images: knowledge.images || [],

similarObjects: knowledge.similarObjects || []

}

return explanation

}


// ================= SUMMARY GENERATOR =================

function generateSummary(objectInfo, knowledge){

let text = ""

text += `${objectInfo.name} is generally categorized under ${objectInfo.category}. `

if(objectInfo.brand){

text += `This object appears to be associated with the brand ${objectInfo.brand}. `

}

if(knowledge.description){

text += knowledge.description

}

if(knowledge.primaryUse){

text += ` It is mainly used for ${knowledge.primaryUse}.`

}

return text

}


// ================= INTERACTIVE Q&A =================

export function answerObjectQuestion(question, explanation){

question = question.toLowerCase()

if(question.includes("material")){

return `This object is usually made from ${explanation.materials.join(", ")}.`

}

if(question.includes("history")){

return explanation.history.join(" ")

}

if(question.includes("future")){

return explanation.futureIdeas.join(" ")

}

if(question.includes("use")){

return explanation.summary

}

return "This object is part of a broader category. You can explore more details in the information panel."

}


// ================= VOICE EXPLANATION =================

export function speakExplanation(explanation){

const voiceText = `
${explanation.title}.
${explanation.summary}.
Main materials include ${explanation.materials.join(", ")}.
`

narrate(voiceText)

}


// ================= EXPLANATION CARD FORMAT =================

export function formatExplanationCard(explanation){

return{

header:{

title: explanation.title,
category: explanation.category,
confidence: Math.round(explanation.confidence*100)+"%"

},

sections:[

{

title:"Overview",
content: explanation.summary

},

{

title:"History",
content: explanation.history

},

{

title:"Materials",
content: explanation.materials

},

{

title:"Manufacturing",
content: explanation.manufacturing

},

{

title:"Future Innovations",
content: explanation.futureIdeas

}

],

images: explanation.images,

similarObjects: explanation.similarObjects

}

}
