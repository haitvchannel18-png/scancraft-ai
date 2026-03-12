// modules/data/manufacturing.js

import { EventBus } from "../core/events.js"

const MANUFACTURING_DB = {

bottle:{
rawMaterials:["PET plastic","glass","aluminum"],
process:[
"raw material preparation",
"molding or glass blowing",
"cooling and shaping",
"quality inspection",
"packaging"
],
method:"Injection molding or glass blowing"
},

chair:{
rawMaterials:["wood","plastic","metal"],
process:[
"material cutting",
"frame assembly",
"surface finishing",
"quality testing",
"packaging"
],
method:"Carpentry or industrial molding"
},

laptop:{
rawMaterials:["aluminum","silicon","plastic","glass"],
process:[
"chip fabrication",
"PCB manufacturing",
"component assembly",
"software installation",
"final testing"
],
method:"Electronics manufacturing"
},

car:{
rawMaterials:["steel","aluminum","rubber","glass"],
process:[
"metal stamping",
"body welding",
"paint coating",
"engine assembly",
"final inspection"
],
method:"Automotive assembly line"
},

phone:{
rawMaterials:["glass","aluminum","silicon","plastic"],
process:[
"display manufacturing",
"chip fabrication",
"circuit assembly",
"software installation",
"testing and packaging"
],
method:"Electronics micro-assembly"
}

}



export async function getManufacturingInfo(label){

if(!label) return null

const key = label.toLowerCase()

if(MANUFACTURING_DB[key]){

EventBus.emit("manufacturingFound",key)

return MANUFACTURING_DB[key]

}

return inferManufacturing(label)

}



function inferManufacturing(label){

// fallback manufacturing reasoning for unknown objects

const guess = {

rawMaterials:["metal","plastic","composite materials"],

process:[
"material preparation",
"shaping or molding",
"assembly",
"quality inspection",
"packaging"
],

method:"General industrial manufacturing"

}

EventBus.emit("manufacturingInferred",label)

return guess

}
