// modules/audio/audio-engine.js

class AudioEngine {

constructor(){
this.ctx = null
this.listener = null
this.initialized = false
}

init(){

this.ctx = new (window.AudioContext || window.webkitAudioContext)()
this.listener = this.ctx.listener

this.listener.positionX.value = 0
this.listener.positionY.value = 0
this.listener.positionZ.value = 0

this.initialized = true

}

// 🔥 create spatial sound
async playSpatial(url, x=0,y=0,z=1){

if(!this.initialized) this.init()

const res = await fetch(url)
const buffer = await res.arrayBuffer()
const audioBuffer = await this.ctx.decodeAudioData(buffer)

const source = this.ctx.createBufferSource()
source.buffer = audioBuffer

const panner = this.ctx.createPanner()

panner.panningModel = "HRTF"
panner.distanceModel = "inverse"

panner.positionX.value = x
panner.positionY.value = y
panner.positionZ.value = z

source.connect(panner)
panner.connect(this.ctx.destination)

source.start()

}

// 🎧 move listener
setListener(x,y,z){
this.listener.positionX.value = x
this.listener.positionY.value = y
this.listener.positionZ.value = z
}

}

export default new AudioEngine()
