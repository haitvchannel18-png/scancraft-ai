// modules/voice/speech.js

import { EventBus } from "../core/events.js"

let recognition = null
let listening = false

export function initSpeech(){

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition

if(!SpeechRecognition){
console.warn("Speech recognition not supported")
return
}

recognition = new SpeechRecognition()

recognition.continuous = false
recognition.interimResults = true
recognition.lang = "en-US"

recognition.onstart = () => {

listening = true

EventBus.emit("voiceListening")

}

recognition.onresult = (event)=>{

let transcript = ""

for(let i = event.resultIndex;i < event.results.length;i++){

transcript += event.results[i][0].transcript

}

EventBus.emit("voiceResult",transcript)

}

recognition.onend = ()=>{

listening = false

EventBus.emit("voiceStop")

}

recognition.onerror = (e)=>{

console.error("Speech error",e)

EventBus.emit("voiceError",e)

}

}

export function startListening(){

if(!recognition) return

recognition.start()

}

export function stopListening(){

if(!recognition) return

recognition.stop()

}

export function isListening(){
return listening
}
