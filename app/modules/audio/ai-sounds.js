// ================= IMPORTS =================

import { playSound, loadSound } from "./audio-engine.js"
import { logAI } from "../utils/AILogger.js"


// ================= SOUND MAP =================

const AI_SOUNDS = {

listening: "/sounds/ai/listening.mp3",

thinking: "/sounds/ai/thinking.mp3",

response: "/sounds/ai/response.mp3",

typing: "/sounds/ai/typing.mp3",

voiceStart: "/sounds/ai/voice-start.mp3",

voiceStop: "/sounds/ai/voice-stop.mp3"

}


// ================= INIT =================

export async function initAISounds(){

logAI("Initializing AI sounds")

for(const key in AI_SOUNDS){

await loadSound(key, AI_SOUNDS[key])

}

}


// ================= AI LISTENING =================

export function playListening(){

playSound("listening",0.5)

}


// ================= AI THINKING =================

export function playThinking(){

playSound("thinking",0.5)

}


// ================= AI RESPONSE =================

export function playResponse(){

playSound("response",0.6)

}


// ================= AI TYPING =================

export function playTyping(){

playSound("typing",0.3)

}


// ================= VOICE START =================

export function playVoiceStart(){

playSound("voiceStart",0.6)

}


// ================= VOICE STOP =================

export function playVoiceStop(){

playSound("voiceStop",0.6)

}
