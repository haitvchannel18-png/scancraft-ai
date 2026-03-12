// modules/vision/logo-stage.js

import { EventBus } from "../core/events.js"
import { detectLogos } from "../detection/logo-detector.js"

const LOGO_CONFIDENCE = 0.4

export async function runLogoStage(frame, objects){

try{

EventBus.emit("visionStageStart","logo")

const logos = await detectLogos(frame)

if(!logos || logos.length === 0){
return []
}

const filtered = logos.filter(l=>l.score >= LOGO_CONFIDENCE)

const mapped = mapLogosToObjects(filtered, objects)

EventBus.emit("visionLogoDetected",mapped)

return mapped

}catch(err){

console.error("Logo stage error",err)

EventBus.emit("visionLogoError",err)

return []

}

}



function mapLogosToObjects(logos, objects){

if(!objects || objects.length === 0) return logos

const results = []

logos.forEach(logo=>{

const [lx,ly,lw,lh] = logo.bbox

const logoCenterX = lx + lw/2
const logoCenterY = ly + lh/2

let matchedObject = null

objects.forEach(obj=>{

const {x,y,width,height} = obj.bbox

if(
logoCenterX > x &&
logoCenterX < x + width &&
logoCenterY > y &&
logoCenterY < y + height
){

matchedObject = obj.label

}

})

results.push({

brand: logo.label || "unknown",
confidence: logo.score,
bbox: logo.bbox,
object: matchedObject

})

})

return results

}
