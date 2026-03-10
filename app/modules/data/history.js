// ================= IMPORT =================

import { emit } from "../core/events.js"



// ================= HISTORY DATABASE =================

const historyDB = {

headphones:{
timeline:[
{year:1881,event:"First telephone headsets used by switchboard operators"},
{year:1910,event:"Commercial audio headphones introduced"},
{year:1958,event:"Stereo headphones invented"},
{year:2000,event:"Wireless Bluetooth headphones introduced"},
{year:2020,event:"AI noise cancellation technology developed"}
],
inventors:[
"Ezra Gilliland",
"John C. Koss"
],
origin:"United States",
category:"electronics"
},

laptop:{
timeline:[
{year:1975,event:"Portable computer concept developed"},
{year:1981,event:"First commercially available laptop released"},
{year:1990,event:"Lightweight laptops introduced"},
{year:2005,event:"Modern thin laptops developed"},
{year:2020,event:"AI optimized laptops released"}
],
inventors:[
"Adam Osborne",
"Bill Moggridge"
],
origin:"United States",
category:"electronics"
},

chair:{
timeline:[
{year:3000,event:"Ancient Egyptian chairs created"},
{year:1500,event:"Decorative wooden chairs used in Europe"},
{year:1800,event:"Mass produced furniture begins"},
{year:1950,event:"Modern ergonomic chairs designed"},
{year:2000,event:"Smart ergonomic office chairs"}
],
inventors:[
"Various historical designers"
],
origin:"Ancient Egypt",
category:"furniture"
}

}



// ================= GET HISTORY =================

export function getObjectHistory(name){

emit("history:fetch",name)

return historyDB[name] || null

}



// ================= TIMELINE =================

export function getTimeline(name){

const history = historyDB[name]

if(!history){

return []

}

return history.timeline

}



// ================= INVENTORS =================

export function getInventors(name){

const history = historyDB[name]

if(!history){

return []

}

return history.inventors

}



// ================= ORIGIN =================

export function getOrigin(name){

const history = historyDB[name]

if(!history){

return "Unknown origin"

}

return history.origin

}



// ================= HISTORY ANALYSIS =================

export function analyzeHistory(object){

emit("history:analyze:start")

const name = object.name?.toLowerCase()

const history = historyDB[name]

if(!history){

return {

timeline:[],
origin:"Unknown",
inventors:[]

}

}

emit("history:analyze:complete",history)

return history

}



// ================= HISTORY SUMMARY =================

export function historySummary(name){

const history = historyDB[name]

if(!history){

return "Historical information for this object is limited."

}

const firstEvent = history.timeline[0]

return `The ${name} originated around ${firstEvent.year}. 
Over time it evolved through technological improvements and design innovations.`

}



// ================= FUTURE TREND =================

export function predictFutureTrend(category){

if(category === "electronics"){

return "Future versions will integrate AI chips and smart connectivity."

}

if(category === "furniture"){

return "Future designs will focus on ergonomic and sustainable materials."

}

return "Future developments may improve efficiency and automation."

}
