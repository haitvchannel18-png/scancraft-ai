// modules/viewer/tool-manager.js

import { EventBus } from "../core/events.js"
import { logAI } from "../utils/ai-logger.js"

let activeTool = "brush"

const tools = {

brush: {
name: "Brush Tool",
cursor: "crosshair"
},

eraser: {
name: "Eraser Tool",
cursor: "cell"
},

shape: {
name: "Shape Tool",
cursor: "crosshair"
},

magic: {
name: "Magic Tool",
cursor: "pointer"
},

color: {
name: "Color Picker",
cursor: "copy"
},

texture: {
name: "Texture Tool",
cursor: "grab"
}

}



export function setTool(toolName){

if(!tools[toolName]){

console.warn("Unknown tool:",toolName)
return

}

activeTool = toolName

updateCursor()

EventBus.emit("toolChanged",toolName)

logAI("ToolChanged",toolName)

}



export function getActiveTool(){

return activeTool

}



export function getTools(){

return tools

}



export function toggleTool(toolName){

if(activeTool === toolName){

setTool("brush")

}else{

setTool(toolName)

}

}



function updateCursor(){

const tool = tools[activeTool]

if(!tool) return

document.body.style.cursor = tool.cursor

}



export function toolAction(x,y,data){

EventBus.emit("toolAction",{

tool: activeTool,
x,
y,
data

})

}



export function resetTools(){

activeTool = "brush"

updateCursor()

EventBus.emit("toolReset")

}
