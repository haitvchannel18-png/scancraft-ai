// modules/reasoning/scene-logic.js

class SceneLogic {

infer(objects){

const labels = objects.map(o=>o.label)

if(labels.includes("bed") && labels.includes("lamp")){
return "bedroom"
}

if(labels.includes("stove") || labels.includes("pan")){
return "kitchen"
}

if(labels.includes("car") || labels.includes("road")){
return "street"
}

return "unknown"

}

// 🔥 behavior prediction
predictNext(objects){

if(objects.includes("car")){
return "movement expected"
}

if(objects.includes("phone")){
return "interaction expected"
}

return "static scene"

}

}

export default new SceneLogic()
