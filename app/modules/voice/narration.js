// modules/voice/narration.js

import { EventBus } from "../core/events.js"
import { playAISound } from "../audio/ai-sounds.js"

let speaking = false
let speechQueue = []
let currentUtterance = null

const synth = window.speechSynthesis

export function speak(text, options = {}) {

if (!text) return

speechQueue.push({ text, options })

processQueue()

}

function processQueue() {

if (speaking) return
if (speechQueue.length === 0) return

const { text, options } = speechQueue.shift()

currentUtterance = new SpeechSynthesisUtterance(text)

configureVoice(currentUtterance, options)

attachEvents(currentUtterance)

synth.speak(currentUtterance)

speaking = true

EventBus.emit("aiSpeaking", text)

playAISound("response")

}

function configureVoice(utterance, options) {

const voices = synth.getVoices()

const preferredLang = options.lang || detectLanguage(options.text)

const selectedVoice =
voices.find(v => v.lang.startsWith(preferredLang)) ||
voices.find(v => v.lang.startsWith("en")) ||
voices[0]

utterance.voice = selectedVoice

utterance.rate = options.rate || 1
utterance.pitch = options.pitch || 1
utterance.volume = options.volume || 1

}

function attachEvents(utterance) {

utterance.onstart = () => {

EventBus.emit("voiceStart")

}

utterance.onend = () => {

speaking = false

EventBus.emit("voiceEnd")

processQueue()

}

utterance.onerror = () => {

speaking = false

processQueue()

}

}

export function stopNarration() {

speechQueue = []

if (synth.speaking) {

synth.cancel()

}

speaking = false

EventBus.emit("voiceStopped")

}

export function isSpeaking() {

return speaking

}

function detectLanguage(text) {

if (!text) return "en"

const hindiPattern = /[\u0900-\u097F]/

if (hindiPattern.test(text)) return "hi"

return "en"

}

export function interruptSpeak(text, options = {}) {

stopNarration()

speak(text, options)

}

export function queueLength() {

return speechQueue.length

}

export function clearQueue() {

speechQueue = []

}

export function pauseNarration() {

if (synth.speaking) {

synth.pause()

EventBus.emit("voicePaused")

}

}

export function resumeNarration() {

if (synth.paused) {

synth.resume()

EventBus.emit("voiceResumed")

}

}
