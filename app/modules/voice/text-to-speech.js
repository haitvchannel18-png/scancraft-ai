// modules/voice/text-to-speech.js

import { EventBus } from "../core/events.js"

const synth = window.speechSynthesis

let voices = []

export function initTTS(){

voices = synth.getVoices()

if(!voices.length){
synth.onvoiceschanged = () => {
voices = synth.getVoices()
}
}

EventBus.emit("ttsReady")

}

export function getVoices(){
return voices
}

export function speakText(text,options={}){

if(!text) return

const utterance = new SpeechSynthesisUtterance(text)

utterance.rate = options.rate || 1
utterance.pitch = options.pitch || 1
utterance.volume = options.volume || 1

const lang = options.lang || detectLanguage(text)

const voice = voices.find(v => v.lang.startsWith(lang)) || voices[0]

if(voice) utterance.voice = voice

utterance.onstart = () => {
EventBus.emit("ttsStart",text)
}

utterance.onend = () => {
EventBus.emit("ttsEnd")
}

utterance.onerror = (e)=>{
console.error("TTS error",e)
EventBus.emit("ttsError",e)
}

synth.speak(utterance)

}

export function stopTTS(){

if(synth.speaking){
synth.cancel()
}

EventBus.emit("ttsStopped")

}

function detectLanguage(text){

const hindiPattern = /[\u0900-\u097F]/

if(hindiPattern.test(text)){
return "hi"
}

return "en"

}
