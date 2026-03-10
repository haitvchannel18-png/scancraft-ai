// ================= IMPORT =================

import { emit } from "../core/events.js"



// ================= MANUFACTURING DATABASE =================

const manufacturingDB = {

electronics:{
steps:[
"Raw material preparation (silicon, copper, plastic)",
"Semiconductor fabrication",
"Printed Circuit Board (PCB) production",
"Component mounting using SMT machines",
"Circuit testing and calibration",
"Final assembly and casing"
],
tools:[
"Pick and place machines",
"Reflow ovens",
"Testing rigs"
],
time:"Several hours to several days",
industry:"Electronics manufacturing industry"
},

mechanical:{
steps:[
"Metal extraction and refining",
"Casting or forging of base components",
"Precision machining",
"Surface finishing and heat treatment",
"Assembly of mechanical parts",
"Quality inspection"
],
tools:[
"CNC machines",
"Metal lathes",
"Milling machines"
],
time:"Hours to weeks depending on complexity",
industry:"Mechanical engineering industry"
},

furniture:{
steps:[
"Raw wood harvesting",
"Wood drying and conditioning",
"Cutting and shaping components",
"Surface finishing and polishing",
"Assembly using adhesives or fasteners",
"Quality inspection"
],
tools:[
"Saws",
"CNC wood cutters",
"Sanding machines"
],
time:"Several hours to days",
industry:"Furniture manufacturing industry"
},

plastic:{
steps:[
"Polymer preparation",
"Melting and injection molding",
"Mold cooling and shaping",
"Trimming and finishing",
"Quality inspection"
],
tools:[
"Injection molding machines",
"Plastic extrusion machines"
],
time:"Minutes to hours",
industry:"Plastic manufacturing industry"
}

}



// ================= GET MANUFACTURING PROCESS =================

export function getManufacturingProcess(category){

emit("manufacturing:fetch",category)

return manufacturingDB[category] || null

}



// ================= MANUFACTURING ANALYSIS =================

export function analyzeManufacturing(object){

emit("manufacturing:analyze:start")

const category = object.category?.toLowerCase()

let process = manufacturingDB[category]

if(!process){

process = manufacturingDB["plastic"]

}

emit("manufacturing:analyze:complete",process)

return process

}



// ================= STEP EXPLANATION =================

export function explainManufacturingSteps(category){

const process = manufacturingDB[category]

if(!process){

return []

}

return process.steps.map((step,index)=>{

return {

step:index+1,
description:step

}

})

}



// ================= TOOL LIST =================

export function getManufacturingTools(category){

const process = manufacturingDB[category]

if(!process){

return []

}

return process.tools

}



// ================= PROCESS TIMELINE =================

export function manufacturingTimeline(category){

const process = manufacturingDB[category]

if(!process){

return "Unknown manufacturing duration"

}

return `Typical manufacturing time: ${process.time}`

}



// ================= INDUSTRY INFO =================

export function manufacturingIndustry(category){

const process = manufacturingDB[category]

if(!process){

return "General manufacturing sector"

}

return process.industry

}
