// modules/audio/sound-loader.js

import SoundManager from "./sound-manager.js"

class SoundLoader {

init(){

// AI
SoundManager.load("typing","/sounds/ai/typing.mp3")
SoundManager.load("thinking","/sounds/ai/thinking.mp3")
SoundManager.load("response","/sounds/ai/response.mp3")
SoundManager.load("listening","/sounds/ai/listening.mp3")

// UI
SoundManager.load("click","/sounds/ui/click.mp3")
SoundManager.load("hover","/sounds/ui/hover.mp3")
SoundManager.load("open_panel","/sounds/ui/open-panel.mp3")

// SCAN
SoundManager.load("scan_start","/sounds/scan/scan-start.mp3")
SoundManager.load("detect","/sounds/scan/detect.mp3")
SoundManager.load("scan_complete","/sounds/scan/scan-complete.mp3")

// EDITOR
SoundManager.load("brush","/sounds/editor/brush.mp3")
SoundManager.load("paint","/sounds/editor/paint.mp3")
SoundManager.load("texture","/sounds/editor/texture.mp3")

// AMBIENCE
SoundManager.load("background","/sounds/ambience/background.mp3")

}

}

export default new SoundLoader()
