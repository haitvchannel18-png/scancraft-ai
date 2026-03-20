// modules/audio/sound-manager.js

import CONFIG from "../utils/config.js"
import AILogger from "../utils/ai-logger.js"

class SoundManager {

constructor(){
this.sounds = {}
this.enabled = CONFIG.UI.sound
}

// 🔥 load sound
load(name, path){

const audio = new Audio(path)
audio.preload = "auto"

this.sounds[name] = audio

}

// 🔊 play sound
play(name, volume = 1){

if(!this.enabled) return

const sound = this.sounds[name]

if(!sound){
AILogger.log("warn","Sound not found",{name})
return
}

sound.currentTime = 0
sound.volume = volume
sound.play().catch(()=>{})

}

// 🔁 loop (background)
loop(name, volume = 0.3){

const sound = this.sounds[name]

if(!sound) return

sound.loop = true
sound.volume = volume
sound.play().catch(()=>{})

}

// ⛔ stop
stop(name){

const sound = this.sounds[name]

if(sound){
sound.pause()
sound.currentTime = 0
}

}

// 🔇 toggle
toggle(state){
this.enabled = state
}

}

export default new SoundManager()
