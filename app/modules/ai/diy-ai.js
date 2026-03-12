// modules/ai/diy-ai.js

import { EventBus } from "../core/events.js"

import { getMaterialInfo } from "../knowledge/material-db.js"
import { logAI } from "../utils/ai-logger.js"
import { cacheKnowledge } from "../memory/cache-manager.js"

let activeObject = null
let diyCache = null

export function initDIYAI(){

EventBus.on("objectBrainComplete",setObjectContext)

EventBus.emit("diyAIReady")

}



function setObjectContext(payload){

activeObject = payload

}



export async function generateDIYIdeas(objectName){

try{

if(!objectName && activeObject){
objectName = activeObject.object
}

if(!objectName){
return null
}

const materials = await getMaterialInfo(objectName)

const ideas = buildDIYIdeas(objectName,materials)

const result = {

object: objectName,

materials,

ideas,

generatedAt: Date.now()

}

diyCache = result

cacheKnowledge("diy-"+objectName,result)

EventBus.emit("diyIdeasReady",result)

logAI("DIYIdeas",result)

return result

}catch(err){

console.error("DIY AI error",err)

EventBus.emit("diyAIError",err)

return null

}

}



function buildDIYIdeas(objectName,materials){

const ideas = []

const name = objectName.toLowerCase()

if(name.includes("bottle")){

ideas.push({
title:"Plant Pot",
description:"Cut the bottle and use it as a small plant pot."
})

ideas.push({
title:"DIY Lamp",
description:"Add LED lights inside to create a decorative lamp."
})

ideas.push({
title:"Storage Container",
description:"Use the bottle to store small screws or tools."
})

}

if(name.includes("chair")){

ideas.push({
title:"Chair Repaint",
description:"Repaint the chair using spray paint for a modern look."
})

ideas.push({
title:"Cushion Upgrade",
description:"Add soft foam cushions to increase comfort."
})

}

if(name.includes("phone")){

ideas.push({
title:"DIY Phone Stand",
description:"Use cardboard or plastic to build a phone stand."
})

ideas.push({
title:"Lens Macro Attachment",
description:"Attach a small lens to convert camera into macro camera."
})

}

if(materials && materials.includes("plastic")){

ideas.push({
title:"Recycled Craft",
description:"Melt and reshape plastic into new creative objects."
})

}

if(materials && materials.includes("wood")){

ideas.push({
title:"Wood Polishing",
description:"Sand and polish wood surface to restore finish."
})

}

return ideas

}



export function getLastDIYIdeas(){

return diyCache

}



export function clearDIYIdeas(){

diyCache = null

EventBus.emit("diyIdeasCleared")

}
