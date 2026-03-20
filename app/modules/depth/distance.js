// modules/depth/distance.js

import AILogger from "../utils/ai-logger.js"

class DistanceCalculator {

// 🔥 get object distance
getDistance(object, depthPoints){

if(!object.box) return null

const {x, y, width, height} = object.box

// center point
const cx = x + width/2
const cy = y + height/2

// nearest depth point
let closest = null
let minDist = Infinity

for(const p of depthPoints){

const dx = p.x - cx
const dy = p.y - cy

const dist = dx*dx + dy*dy

if(dist < minDist){
minDist = dist
closest = p
}

}

if(!closest) return null

// convert depth → distance (approx)
const distance = (1 - closest.depth) * 5 // meters approx

AILogger.log("info","Distance calculated",{label:object.label, distance})

return distance

}

// 🔥 batch
computeAll(objects, depthPoints){

return objects.map(obj=>({

...obj,
distance: this.getDistance(obj, depthPoints)

}))

}

}

export default new DistanceCalculator()
