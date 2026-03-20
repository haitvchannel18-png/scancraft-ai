// modules/tracking/motion.js

import AILogger from "../utils/ai-logger.js"

class MotionTracker {

constructor(){
this.prev = null
}

detect(current){

if(!this.prev){
this.prev = current
return 0
}

const dx = current.x - this.prev.x
const dy = current.y - this.prev.y

const speed = Math.sqrt(dx*dx + dy*dy)

this.prev = current

AILogger.log("info","Motion detected",{speed})

return speed

}

}

export default new MotionTracker()
