// modules/audio/ai-sounds.js

import SoundManager from "./sound-manager.js"

class AISounds {

thinking(){
SoundManager.play("ai_typing",0.4)
}

listening(){
SoundManager.play("listening",0.5)
}

response(){
SoundManager.play("response",0.6)
}

}

export default new AISounds()
