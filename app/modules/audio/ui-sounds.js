// modules/audio/ui-sounds.js

import SoundManager from "./sound-manager.js"
import AudioEngine from "./audio-engine.js"
import CONFIG from "../utils/config.js"

class UISounds {

constructor(){
this.enabled = CONFIG.UI.sound
this.cooldown = {}
}

// ⚡ anti-spam system
canPlay(key, delay=100){
const now = Date.now()

if(!this.cooldown[key] || now - this.cooldown[key] > delay){
this.cooldown[key] = now
return true
}

return false
}

// 🔘 click
click(){

if(!this.enabled || !this.canPlay("click",80)) return

SoundManager.play("click",0.5)

}

// 🖱 hover
hover(){

if(!this.enabled || !this.canPlay("hover",120)) return

SoundManager.play("hover",0.25)

}

// 📂 panel open (premium feel)
openPanel(){

if(!this.enabled) return

SoundManager.play("open_panel",0.6)

// subtle spatial echo
AudioEngine.playSpatial("/sounds/ui/open-panel.mp3",0,0,2)

}

// ❌ panel close
closePanel(){

if(!this.enabled) return

SoundManager.play("click",0.3)

}

// ⚠️ error feedback
error(){

if(!this.enabled) return

SoundManager.play("click",0.2)

// deeper spatial tone
AudioEngine.playSpatial("/sounds/ui/click.mp3",-1,0,2)

}

// ✅ success feedback
success(){

if(!this.enabled) return

SoundManager.play("hover",0.4)

// right side spatial positive tone
AudioEngine.playSpatial("/sounds/ui/hover.mp3",1,0,2)

}

// 🔄 loading tick
loading(){

if(!this.enabled || !this.canPlay("loading",200)) return

SoundManager.play("hover",0.15)

}

// 🎯 focus (important UI element)
focus(){

if(!this.enabled) return

AudioEngine.playSpatial("/sounds/ui/hover.mp3",0,0,1)

}

// 🔊 toggle sound
toggle(state){
this.enabled = state
}

}

export default new UISounds()
