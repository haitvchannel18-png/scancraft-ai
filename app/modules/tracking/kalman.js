// modules/tracking/kalman.js

class KalmanFilter {

constructor(){
this.x = 0
this.p = 1
this.q = 0.01
this.r = 0.1
}

update(measurement){

// prediction
this.p += this.q

// update
const k = this.p / (this.p + this.r)
this.x += k * (measurement - this.x)
this.p *= (1 - k)

return this.x

}

}

export default KalmanFilter
