// modules/audio/voice-engine-pro.js

import EmotionEngine from "./emotion-engine.js"

class VoiceEnginePro {

speak(text){

const emotion = EmotionEngine.detect(text)
const config = EmotionEngine.getVoiceConfig(emotion)

const utter = new SpeechSynthesisUtterance(text)

utter.rate = config.rate
utter.pitch = config.pitch
utter.volume = 1

// 🔥 best available voice
const voices = speechSynthesis.getVoices()

utter.voice = voices.find(v=>v.lang.includes("en")) || voices[0]

speechSynthesis.speak(utter)

}

stop(){
speechSynthesis.cancel()
}

}

export default new VoiceEnginePro()
