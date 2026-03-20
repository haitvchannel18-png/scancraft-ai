/**
 * ScanCraft AI
 * Tool Agent (AI Action Execution Engine)
 */

import Events from "../core/events.js"

class ToolAgent {

constructor(){
this.tools = {
search: this.webSearch,
shop: this.openShopping,
image: this.generateImage,
viewer3d: this.open3DViewer
}
}

// 🔥 MAIN EXECUTOR
async execute(action, payload){

if(!action) return null

Events.emit("tool:executing", {action, payload})

const tool = this.tools[action]

if(!tool){
console.warn("Unknown tool:", action)
return null
}

try{

const result = await tool(payload)

Events.emit("tool:completed", {action, result})

return result

}catch(err){

console.error("Tool execution error:", err)

Events.emit("tool:error", err)

return null

}

}

// 🌐 WEB SEARCH
async webSearch({query}){

const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
window.open(url, "_blank")

return {
type: "search",
query,
url
}

}

// 🛒 SHOPPING
async openShopping({query}){

const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`
window.open(url, "_blank")

return {
type: "shopping",
query,
url
}

}

// 🖼 IMAGE GENERATION (placeholder)
async generateImage({prompt}){

// future: integrate Stable Diffusion API
return {
type: "image",
prompt,
url: null,
message: "Image generation will be available in future upgrade"
}

}

// 🧊 3D VIEWER OPEN
async open3DViewer({model}){

Events.emit("viewer:open", model)

return {
type: "viewer3d",
model
}

}

// 🧠 AUTO ACTION (AI decides)
autoAction(aiResponse){

if(!aiResponse) return null

const text = aiResponse.toLowerCase()

if(text.includes("buy") || text.includes("price")){
return {
action: "shop",
payload: {query: text}
}
}

if(text.includes("search") || text.includes("more info")){
return {
action: "search",
payload: {query: text}
}
}

if(text.includes("3d") || text.includes("view")){
return {
action: "viewer3d",
payload: {model: text}
}
}

return null

}

}

const Tool = new ToolAgent()

export default Tool
