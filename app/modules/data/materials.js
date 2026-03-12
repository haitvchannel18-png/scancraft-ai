// modules/data/materials.js

import { EventBus } from "../core/events.js"

const MATERIAL_DB = {

metal:{
name:"Metal",
strength:"High",
durability:"Very high",
weight:"Medium to heavy",
ecoImpact:"Recyclable",
uses:["vehicles","tools","machines","structures"]
},

plastic:{
name:"Plastic",
strength:"Medium",
durability:"Medium",
weight:"Light",
ecoImpact:"Low biodegradability",
uses:["containers","electronics casing","bottles","toys"]
},

glass:{
name:"Glass",
strength:"Low impact resistance",
durability:"High if handled carefully",
weight:"Medium",
ecoImpact:"Highly recyclable",
uses:["bottles","windows","optics","containers"]
},

wood:{
name:"Wood",
strength:"Medium",
durability:"Moderate",
weight:"Medium",
ecoImpact:"Biodegradable",
uses:["furniture","construction","decor"]
},

ceramic:{
name:"Ceramic",
strength:"Hard but brittle",
durability:"High temperature resistance",
weight:"Medium",
ecoImpact:"Natural mineral based",
uses:["tiles","pottery","insulation"]
},

rubber:{
name:"Rubber",
strength:"Elastic",
durability:"High flexibility",
weight:"Light",
ecoImpact:"Moderate",
uses:["tires","seals","grips"]
}

}



export async function getMaterialInfo(material){

if(!material) return null

if(MATERIAL_DB[material]){

EventBus.emit("materialFound",material)

return MATERIAL_DB[material]

}

return inferMaterial(material)

}



function inferMaterial(material){

// fallback reasoning for unknown materials

const guess = {

name: material,

strength:"Unknown",

durability:"Unknown",

weight:"Unknown",

ecoImpact:"Unknown",

uses:["general purpose"]

}

EventBus.emit("materialInferred",material)

return guess

}
