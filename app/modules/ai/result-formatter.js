// modules/ai/result-formatter.js

import { EventBus } from "../core/events.js"

class ResultFormatter {

constructor(){
this.keywords = [
"material","use","function","working",
"future","price","history","structure"
]
}

// 🔥 MAIN FORMAT FUNCTION
format(rawText, context){

if(!rawText){
return {
text: "No data available",
cards: [],
highlights: []
}
}

// 🧠 CLEAN TEXT
const cleanText = this.clean(rawText)

// 🎯 SPLIT INTO SECTIONS
const sections = this.extractSections(cleanText)

// ⭐ HIGHLIGHTS
const highlights = this.extractHighlights(cleanText)

// 🧾 CARDS
const cards = this.buildCards(sections, context)

// 📦 FINAL OUTPUT
const output = {
object: context.object,
text: cleanText,
sections,
cards,
highlights,
timestamp: Date.now()
}

EventBus.emit("resultFormatted", output)

return output

}

// 🧹 CLEAN TEXT
clean(text){
return text
.replace(/\*\*/g,"")
.replace(/\n{2,}/g,"\n")
.trim()
}

// 📚 EXTRACT SECTIONS
extractSections(text){

const lines = text.split("\n")

return lines.map(line => {
return {
title: this.detectTitle(line),
content: line
}
})

}

// 🧠 DETECT TITLE
detectTitle(line){

const lower = line.toLowerCase()

for(const k of this.keywords){
if(lower.includes(k)){
return k.toUpperCase()
}
}

return "INFO"
}

// ⭐ EXTRACT HIGHLIGHTS
extractHighlights(text){

const words = text.split(" ")

return words.filter(w => 
this.keywords.includes(w.toLowerCase())
)

}

// 🧾 BUILD UI CARDS
buildCards(sections, context){

return sections.map(sec => {
return {
title: sec.title,
content: sec.content,
icon: this.getIcon(sec.title)
}
})

}

// 🎨 ICON MAPPER
getIcon(type){

const icons = {
MATERIAL:"🧱",
USE:"⚙️",
FUNCTION:"🧠",
WORKING:"🔄",
FUTURE:"🚀",
PRICE:"💰",
HISTORY:"📜",
STRUCTURE:"🏗️"
}

return icons[type] || "📌"

}

}

export default new ResultFormatter()
