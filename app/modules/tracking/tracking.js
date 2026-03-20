// modules/tracking/tracking.js

import KalmanFilter from "./kalman.js"
import MotionTracker from "./motion.js"

class TrackingSystem {

constructor(){
this.kx = new KalmanFilter()
this.ky = new KalmanFilter()
}

track(point){

const smoothX = this.kx.update(point.x)
const smoothY = this.ky.update(point.y)

const speed = MotionTracker.detect({x:smoothX, y:smoothY})

return {
x: smoothX,
y: smoothY,
speed
}

}

}

export default new TrackingSystem()
