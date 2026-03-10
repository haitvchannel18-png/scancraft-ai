// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { logAI } from "../utils/AILogger.js"


// ================= STATE =================

let audioContext
let masterGain

const soundCache = {}


// ================= INIT AUDIO =================

export async function initAudio(){

if(audioContext) return

audioContext = new (window.AudioContext || window.webkitAudioContext)()

masterGain = audioContext.createGain()

masterGain.gain.value = 0.9

masterGain.connect(audioContext.destination)

logAI("Audio engine initialized")

emit("audio:ready")

}


// ================= LOAD SOUND =================

export async function loadSound(name, url){

if(soundCache[name]) return soundCache[name]

const response = await fetch(url)

const arrayBuffer = await response.arrayBuffer()

const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

soundCache[name] = audioBuffer

return audioBuffer

}


// ================= PLAY SOUND =================

export function playSound(name, volume = 1){

if(!soundCache[name]){

logAI("Sound not loaded: " + name)

return

}

const source = audioContext.createBufferSource()

const gain = audioContext.createGain()

source.buffer = soundCache[name]

gain.gain.value = volume

source.connect(gain)

gain.connect(masterGain)

source.start(0)

emit("audio:play", name)

}


// ================= PRELOAD SOUNDS =================

export async function preloadSounds(soundList){

for(const sound of soundList){

await loadSound(sound.name, sound.url)

}

logAI("All sounds preloaded")

emit("audio:preloaded")

}


// ================= STOP ALL =================

export function stopAllSounds(){

audioContext.close()

audioContext = null

emit("audio:stopped")

}


// ================= SET MASTER VOLUME =================

export function setVolume(value){

if(!masterGain) return

masterGain.gain.value = value

emit("audio:volume", value)

}


// ================= SPATIAL SOUND =================

export function playSpatialSound(name, x = 0, y = 0, z = 0){

if(!soundCache[name]) return

const source = audioContext.createBufferSource()

const panner = audioContext.createPanner()

const gain = audioContext.createGain()

source.buffer = soundCache[name]

panner.setPosition(x,y,z)

source.connect(panner)

panner.connect(gain)

gain.connect(masterGain)

source.start()

emit("audio:spatial", name)

}
