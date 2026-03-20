// modules/audio/voice-brain.js

import VoiceEngine from "./voice-engine-pro.js"

class VoiceBrain {

speakInsight(data){

let text = ""

if(data.object){
text += `This looks like a ${data.object}. `
}

if(data.material){
text += `It is made of ${data.material}. `
}

if(data.category){
text += `Category is ${data.category}. `
}

if(data.confidence){
text += `Confidence is ${Math.round(data.confidence*100)} percent.`
}

VoiceEngine.speak(text)

}

}

export default new VoiceBrain()
