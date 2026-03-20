// modules/reasoning/context-reasoner.js

import Context from "../ai/context.js"

class ContextReasoner {

analyze(objects, frame){

// 🔥 scene from AI context
const scene = Context.getSceneContext(objects)

// 🔥 environment inference
let environment = "unknown"

if(scene.includes("road") || scene.includes("vehicle")){
environment = "outdoor"
}

if(scene.includes("table") || scene.includes("bed")){
environment = "indoor"
}

// 🔥 density
const density = objects.length > 5 ? "crowded" : "sparse"

return {
scene,
environment,
density
}

}

}

export default new ContextReasoner()
