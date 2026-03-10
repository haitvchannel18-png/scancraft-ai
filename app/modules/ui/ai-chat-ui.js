// ================= IMPORT =================

import { emit, on } from "../core/events.js"
import { speak } from "../voice/narration.js"
import { playAIResponseSound, playThinkingSound } from "../audio/ai-sounds.js"


// ================= DOM =================

let chatContainer
let inputBox
let sendButton
let typingIndicator


// ================= INIT =================

export function initAIChatUI(){

chatContainer = document.getElementById("ai-chat-container")
inputBox = document.getElementById("ai-input")
sendButton = document.getElementById("ai-send")
typingIndicator = document.getElementById("ai-typing")

sendButton.addEventListener("click", sendMessage)
inputBox.addEventListener("keypress", e => {

if(e.key === "Enter"){

sendMessage()

}

})

listenPipelineResponses()

}



// ================= SEND MESSAGE =================

async function sendMessage(){

const message = inputBox.value.trim()

if(!message) return

renderUserMessage(message)

inputBox.value = ""

emit("ai:user-question", message)

showTyping()

playThinkingSound()

}



// ================= LISTEN AI RESPONSES =================

function listenPipelineResponses(){

on("ai:response", data => {

hideTyping()

renderAIMessage(data.text)

playAIResponseSound()

speak(data.text)

})

}



// ================= RENDER USER MESSAGE =================

function renderUserMessage(text){

const bubble = document.createElement("div")

bubble.className = "chat-bubble user"

bubble.innerHTML = `

<div class="bubble-content">
${escapeHTML(text)}
</div>

`

chatContainer.appendChild(bubble)

scrollChat()

}



// ================= RENDER AI MESSAGE =================

function renderAIMessage(text){

const bubble = document.createElement("div")

bubble.className = "chat-bubble ai"

bubble.innerHTML = `

<div class="bubble-avatar">🤖</div>

<div class="bubble-content">
${renderFormattedText(text)}
</div>

`

chatContainer.appendChild(bubble)

animateBubble(bubble)

scrollChat()

}



// ================= FORMATTING =================

function renderFormattedText(text){

return text
.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>")
.replace(/\n/g,"<br>")

}



// ================= TYPING =================

function showTyping(){

typingIndicator.style.display = "flex"

}

function hideTyping(){

typingIndicator.style.display = "none"

}



// ================= ANIMATION =================

function animateBubble(bubble){

bubble.style.opacity = "0"

bubble.style.transform = "translateY(10px)"

requestAnimationFrame(()=>{

bubble.style.transition = "all 0.4s ease"

bubble.style.opacity = "1"

bubble.style.transform = "translateY(0)"

})

}



// ================= SCROLL =================

function scrollChat(){

chatContainer.scrollTop = chatContainer.scrollHeight

}



// ================= SECURITY =================

function escapeHTML(text){

const div = document.createElement("div")

div.innerText = text

return div.innerHTML

}



// ================= OBJECT EXPLAIN =================

export function showObjectExplanation(objectData){

renderAIMessage(`

**Object detected:** ${objectData.name}

${objectData.description}

`)

}



// ================= IMAGE CARDS =================

export function renderImageGallery(images){

const gallery = document.createElement("div")

gallery.className = "chat-gallery"

images.forEach(img => {

const image = document.createElement("img")

image.src = img

image.className = "gallery-image"

gallery.appendChild(image)

})

chatContainer.appendChild(gallery)

scrollChat()

}
