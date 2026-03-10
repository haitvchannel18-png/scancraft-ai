// ================= IMPORT MODULES =================

import { initPipeline } from "./modules/core/pipeline.js"
import { initEvents } from "./modules/core/events.js"
import { initAudio } from "./modules/audio/audio-engine.js"

import { startCamera } from "./modules/camera/camera.js"

import { askAI } from "./modules/ai/object-chat.js"

import { startVoice } from "./modules/voice/conversation.js"


// ================= DOM REFERENCES =================

const loadingScreen = document.getElementById("loading-screen")

const cameraVideo = document.getElementById("camera")

const scanBtn = document.getElementById("scanBtn")

const aiChat = document.getElementById("ai-chat")

const aiInput = document.getElementById("aiQuestion")

const askBtn = document.getElementById("askBtn")

const voiceBtn = document.getElementById("voiceToggle")

const voiceUI = document.getElementById("voice-ui")

const resultPanel = document.getElementById("result-panel")


// ================= TAB SYSTEM =================

const tabButtons = document.querySelectorAll("#result-tabs button")

const tabs = document.querySelectorAll(".result-tab")

tabButtons.forEach(btn => {

btn.addEventListener("click", () => {

const target = btn.dataset.tab

tabs.forEach(tab => tab.classList.add("hidden"))

document.getElementById(target + "-panel").classList.remove("hidden")

})

})


// ================= APP BOOT =================

async function bootApp(){

console.log("Booting ScanCraft AI")

initEvents()

await initAudio()

await initPipeline()

await startCamera(cameraVideo)

loadingScreen.style.display = "none"

console.log("ScanCraft AI Ready")

}

bootApp()


// ================= SCAN BUTTON =================

scanBtn.addEventListener("click", () => {

console.log("Scan triggered")

// future detection trigger

})


// ================= AI CHAT =================

askBtn.addEventListener("click", async () => {

const question = aiInput.value

if(!question) return

addUserMessage(question)

aiInput.value = ""

const reply = await askAI(question)

addAIMessage(reply)

})


// ================= CHAT MESSAGE HELPERS =================

function addUserMessage(text){

const div = document.createElement("div")

div.className = "user-message"

div.innerText = text

aiChat.appendChild(div)

aiChat.scrollTop = aiChat.scrollHeight

}


function addAIMessage(text){

const div = document.createElement("div")

div.className = "ai-message"

div.innerText = text

aiChat.appendChild(div)

aiChat.scrollTop = aiChat.scrollHeight

}


// ================= VOICE SYSTEM =================

voiceBtn.addEventListener("click", async () => {

voiceUI.classList.remove("hidden")

const text = await startVoice()

voiceUI.classList.add("hidden")

addUserMessage(text)

const reply = await askAI(text)

addAIMessage(reply)

})


// ================= OBJECT RESULT DISPLAY =================

export function showObjectResult(data){

resultPanel.classList.remove("hidden")

document.getElementById("objectName").innerText = data.name

document.getElementById("objectConfidence").innerText = "Confidence: " + data.confidence

document.getElementById("objectPreview").src = data.image

}


// ================= FUTURE HOOKS =================

window.ScanCraft = {

showObjectResult,

}
