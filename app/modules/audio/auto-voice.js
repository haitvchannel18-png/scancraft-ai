// modules/audio/auto-voice.js

import { EventBus } from "../core/events.js"
import VoiceBrain from "./voice-brain.js"

class AutoVoice {

init(){

EventBus.on("reasoningComplete",(data)=>{
VoiceBrain.speakInsight(data)
})

}

}

export default new AutoVoice()
