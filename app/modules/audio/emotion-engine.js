// modules/audio/emotion-engine.js

class EmotionEngine {

detect(text){

text = text.toLowerCase()

if(text.includes("danger") || text.includes("warning")){
return "alert"
}

if(text.includes("great") || text.includes("good")){
return "happy"
}

if(text.includes("error") || text.includes("failed")){
return "serious"
}

return "neutral"

}

getVoiceConfig(emotion){

const map = {

happy: {rate:1.1, pitch:1.2},
serious: {rate:0.9, pitch:0.8},
alert: {rate:1.2, pitch:1},
neutral: {rate:1, pitch:1}

}

return map[emotion] || map.neutral

}

}

export default new EmotionEngine()
