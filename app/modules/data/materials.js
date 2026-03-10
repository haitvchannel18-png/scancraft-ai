// ================= IMPORTS =================

import { emit } from "../core/events.js"



// ================= MATERIAL DATABASE =================

const MATERIAL_DB = {

bicycle:[
{
name:"Steel",
properties:["high strength","durable","cost effective"],
usage:"Frame construction"
},
{
name:"Aluminum",
properties:["lightweight","corrosion resistant"],
usage:"Modern bicycle frames"
},
{
name:"Rubber",
properties:["flexible","shock absorbing"],
usage:"Tires"
}
],

headphones:[
{
name:"Plastic",
properties:["lightweight","moldable"],
usage:"Headphone body"
},
{
name:"Metal",
properties:["durable","strong"],
usage:"Driver housing"
},
{
name:"Foam",
properties:["soft","sound insulation"],
usage:"Ear cushions"
}
],

phone:[
{
name:"Glass",
properties:["smooth","scratch resistant"],
usage:"Display panel"
},
{
name:"Aluminum",
properties:["lightweight","strong"],
usage:"Frame"
},
{
name:"Lithium",
properties:["high energy density"],
usage:"Battery"
}
],

chair:[
{
name:"Wood",
properties:["strong","natural","renewable"],
usage:"Chair structure"
},
{
name:"Metal",
properties:["durable","rigid"],
usage:"Support frame"
},
{
name:"Plastic",
properties:["lightweight","cheap"],
usage:"Seat molding"
}
]

}



// ================= MAIN FUNCTION =================

export async function getMaterialInfo(objectName){

try{

emit("materials:search:start", objectName)

const key = objectName?.toLowerCase()

let materials = MATERIAL_DB[key]

if(!materials){

materials = generateGenericMaterials(objectName)

}

emit("materials:search:complete", materials)

return materials

}catch(err){

console.error("Material search failed", err)

emit("materials:error")

return []

}

}



// ================= GENERIC MATERIAL ESTIMATION =================

function generateGenericMaterials(objectName){

return [

{
name:"Composite materials",
properties:["durable","multi purpose"],
usage:`Used in ${objectName} structure`
},

{
name:"Metal components",
properties:["structural support"],
usage:`Internal framework of ${objectName}`
},

{
name:"Polymer materials",
properties:["lightweight","moldable"],
usage:`External casing of ${objectName}`
}

]

}



// ================= MATERIAL SUMMARY =================

export function summarizeMaterials(materials){

return materials.map(m => m.name)

}



// ================= MATERIAL DETAILS =================

export function getMaterialProperties(materialName){

for(const obj in MATERIAL_DB){

const match = MATERIAL_DB[obj].find(m => m.name === materialName)

if(match){

return match.properties

}

}

return []

}



// ================= MATERIAL REUSE =================

export function suggestMaterialReuse(materialName){

const reuseIdeas = []

if(materialName === "Wood"){

reuseIdeas.push("Furniture repair")
reuseIdeas.push("Craft projects")
reuseIdeas.push("Decorative items")

}

if(materialName === "Metal"){

reuseIdeas.push("Recycling")
reuseIdeas.push("Mechanical parts reuse")

}

if(materialName === "Plastic"){

reuseIdeas.push("DIY containers")
reuseIdeas.push("Recycling plastic items")

}

return reuseIdeas

}



// ================= MATERIAL SCORE =================

export function computeMaterialQuality(material){

if(!material) return 0

let score = 50

if(material.properties.includes("durable")) score += 20
if(material.properties.includes("lightweight")) score += 10
if(material.properties.includes("strong")) score += 20

return Math.min(score,100)

}
