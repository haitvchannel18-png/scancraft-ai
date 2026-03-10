// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { CONFIG } from "../utils/config.js"



// ================= STATE =================

let currentObject = null



// ================= SET OBJECT =================

export function setDIYObject(object){

currentObject = object

emit("diy:object:set", object)

}



// ================= MAIN GENERATOR =================

export async function generateDIYIdeas(){

if(!currentObject){

emit("diy:error","No object selected")

return []

}

emit("diy:start")

try{

const ideas = await buildDIYIdeas(currentObject)

emit("diy:complete", ideas)

return ideas

}catch(err){

console.error("DIY generation failed", err)

emit("diy:error")

return []

}

}



// ================= IDEA ENGINE =================

async function buildDIYIdeas(object){

const name = object.name.toLowerCase()

const ideas = []



if(name.includes("bottle")){

ideas.push({

title:"Bottle Plant Pot",

description:"Turn the bottle into a hanging plant pot",

steps:[
"Cut bottle in half",
"Add soil",
"Insert small plant",
"Hang using rope"
]

})

ideas.push({

title:"Bottle Lamp",

description:"Create decorative lamp using LED lights",

steps:[
"Insert LED string",
"Decorate bottle surface",
"Connect power source"
]

})

}



else if(name.includes("chair")){

ideas.push({

title:"Chair Repair",

description:"Fix loose chair legs",

steps:[
"Remove damaged screws",
"Apply wood glue",
"Tighten new screws"
]

})

ideas.push({

title:"Chair Shelf",

description:"Convert old chair into wall shelf",

steps:[
"Cut chair seat",
"Attach to wall",
"Use as storage shelf"
]

})

}



else if(name.includes("box") || name.includes("container")){

ideas.push({

title:"Storage Organizer",

description:"Convert container into desk organizer",

steps:[
"Clean container",
"Divide sections",
"Store office tools"
]

})

}



else{

ideas.push({

title:`Creative Reuse of ${object.name}`,

description:`Repurpose ${object.name} into a creative DIY project`,

steps:[
"Analyze object shape",
"Design creative idea",
"Assemble using simple tools"
]

})

}



return ideas

}



// ================= REPAIR GUIDE =================

export function generateRepairGuide(object){

return {

title:`Repair Guide for ${object.name}`,

tools:["screwdriver","glue","replacement parts"],

steps:[
"Inspect damaged part",
"Remove broken components",
"Install replacement parts",
"Test functionality"
]

}

}



// ================= MATERIAL REUSE =================

export function suggestMaterialReuse(object){

const reuse = []

reuse.push(`Use ${object.name} parts for craft projects`)
reuse.push(`Recycle materials from ${object.name}`)
reuse.push(`Convert ${object.name} into decorative item`)

return reuse

}



// ================= DIY SCORE =================

export function diyCreativityScore(object){

let score = 60

if(object.category === "container") score += 20
if(object.category === "furniture") score += 15
if(object.category === "electronics") score += 10

return Math.min(score,100)

}



// ================= SUMMARY =================

export function summarizeDIY(ideas){

return ideas.map(i => i.title)

}
