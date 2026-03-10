// ================= IMPORT =================

import { emit } from "../core/events.js"



// ================= MATERIAL DATABASE =================

const materialDB = {

plastic:{
name:"Plastic",
properties:[
"Lightweight",
"Corrosion resistant",
"Flexible",
"Low manufacturing cost"
],
uses:[
"Electronics casing",
"Consumer products",
"Packaging"
],
density:"0.9–1.4 g/cm³",
strength:"Moderate"
},

steel:{
name:"Steel",
properties:[
"High strength",
"Durable",
"Heat resistant",
"Recyclable"
],
uses:[
"Machinery",
"Construction",
"Mechanical components"
],
density:"7.8 g/cm³",
strength:"Very High"
},

aluminum:{
name:"Aluminum",
properties:[
"Lightweight",
"Corrosion resistant",
"Good thermal conductivity"
],
uses:[
"Aerospace",
"Electronics frames",
"Automotive components"
],
density:"2.7 g/cm³",
strength:"Medium"
},

glass:{
name:"Glass",
properties:[
"Transparent",
"Chemical resistant",
"Hard but brittle"
],
uses:[
"Displays",
"Optical devices",
"Containers"
],
density:"2.5 g/cm³",
strength:"Low impact strength"
},

wood:{
name:"Wood",
properties:[
"Renewable",
"Lightweight",
"Insulating",
"Natural aesthetic"
],
uses:[
"Furniture",
"Construction",
"Decor"
],
density:"0.4–0.9 g/cm³",
strength:"Moderate"
},

rubber:{
name:"Rubber",
properties:[
"Elastic",
"Water resistant",
"Shock absorbing"
],
uses:[
"Tires",
"Seals",
"Gaskets"
],
density:"1.1 g/cm³",
strength:"Flexible strength"
}

}



// ================= GET MATERIAL =================

export function getMaterial(name){

emit("material:fetch",name)

return materialDB[name] || null

}



// ================= MATERIAL PROPERTIES =================

export function getMaterialProperties(name){

const material = materialDB[name]

if(!material){

return null

}

return {

name:material.name,
properties:material.properties,
density:material.density,
strength:material.strength

}

}



// ================= MATERIAL USES =================

export function getMaterialUses(name){

const material = materialDB[name]

if(!material){

return []

}

return material.uses

}



// ================= MATERIAL ANALYSIS =================

export function analyzeMaterials(object){

emit("material:analyze:start")

const category = object.category?.toLowerCase()

let likelyMaterials = []

if(category === "electronics"){

likelyMaterials = ["plastic","copper","aluminum"]

}

else if(category === "mechanical"){

likelyMaterials = ["steel","aluminum"]

}

else if(category === "furniture"){

likelyMaterials = ["wood","steel"]

}

else{

likelyMaterials = ["plastic","steel"]

}

const materials = likelyMaterials.map(m => materialDB[m])

emit("material:analyze:complete",materials)

return materials

}



// ================= MATERIAL COMPARISON =================

export function compareMaterials(matA, matB){

const a = materialDB[matA]
const b = materialDB[matB]

if(!a || !b){

return null

}

return {

materialA:a.name,
materialB:b.name,
densityComparison:`${a.density} vs ${b.density}`,
strengthComparison:`${a.strength} vs ${b.strength}`

}

}



// ================= MATERIAL SEARCH =================

export function searchMaterialByProperty(property){

const results = []

Object.values(materialDB).forEach(material=>{

if(material.properties.some(p =>
p.toLowerCase().includes(property.toLowerCase())
)){

results.push(material)

}

})

return results

}
