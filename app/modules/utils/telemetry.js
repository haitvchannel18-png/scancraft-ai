// modules/utils/telemetry.js

class Telemetry {

constructor(){
this.metrics = {
fps: 0,
inferenceTime: 0,
frameCount: 0,
lastTime: performance.now()
}
}

// 🎯 update FPS
updateFPS(){

const now = performance.now()
this.metrics.frameCount++

if(now - this.metrics.lastTime >= 1000){

this.metrics.fps = this.metrics.frameCount
this.metrics.frameCount = 0
this.metrics.lastTime = now

}

}

// ⏱ inference tracking
startInference(){
this.startTime = performance.now()
}

endInference(){

this.metrics.inferenceTime =
performance.now() - this.startTime

}

// 📊 get metrics
get(){

return this.metrics

}

}

export default new Telemetry()
