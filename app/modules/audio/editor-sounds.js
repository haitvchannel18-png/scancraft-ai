// modules/audio/editor-sounds.js

import SoundManager from "./sound-manager.js"

class EditorSounds {

brush(){
SoundManager.play("brush",0.4)
}

paint(){
SoundManager.play("paint",0.5)
}

texture(){
SoundManager.play("texture",0.6)
}

}

export default new EditorSounds()
