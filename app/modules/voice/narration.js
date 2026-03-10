// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { logAI } from "../utils/AILogger.js"


// ================= STATE =================

let speechEnabled = true
let currentVoice = null

let recognition = null
let listening = false


// ================= INIT =================

export function initVoiceSystem(){

logAI("Voice system initializing")

loadVoices()

initSpeechRecognition()

emit("voice:ready")

}


// ================= LOAD VOICES =================

function loadVoices(){

const voices = speechSynthesis.getVoices()

if(!voices.length){

speechSynthesis.onvoiceschanged = ()=>{

setPreferredVoice()

}

}else{

setPreferredVoice()

}

}


function setPreferredVoice(){

const voices = speechSynthesis.getVoices()

currentVoice = voices.find(v =>
v.lang.includes("en")
) || voices[0]

}


// ================= SPEAK =================

export function narrate(text){

if(!speechEnabled) return

const utterance = new SpeechSynthesisUtterance(text)

utterance.voice = currentVoice
utterance.rate = 1
utterance.pitch = 1

emit("voice:speaking", text)

speechSynthesis.speak(utterance)

}


// ================= STOP =================

export function stopNarration(){

speechSynthesis.cancel()

emit("voice:stopped")

}


// ================= ENABLE / DISABLE =================

export function enableVoice(){

speechEnabled = true

}

export function disableVoice(){

speechEnabled = false

}


// ================= SPEECH RECOGNITION =================

function initSpeechRecognition(){

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition

if(!SpeechRecognition){

logAI("Speech recognition not supported")

return

}

recognition = new SpeechRecognition()

recognition.continuous = true
recognition.interimResults = true
recognition.lang = "en-US"

recognition.onstart = ()=>{

listening = true

emit("voice:listening")

}

recognition.onend = ()=>{

listening = false

emit("voice:stopped-listening")

}

recognition.onresult = (event)=>{

let transcript = ""

for(let i = event.resultIndex; i < event.results.length; i++){

transcript += event.results[i][0].transcript

}

emit("voice:transcript", transcript)

}

}


// ================= START LISTENING =================

export function startListening(){

if(!recognition) return

recognition.start()

}


// ================= STOP LISTENING =================

export function stopListening(){

if(!recognition) return

recognition.stop()

}


// ================= VOICE QUESTION =================

export function handleVoiceQuestion(callback){

emit("voice:waiting-question")

startListening()

document.addEventListener("voice:transcript", async (e)=>{

const question = e.detail

emit("voice:question", question)

const answer = await callback(question)

narrate(answer)

})

}
