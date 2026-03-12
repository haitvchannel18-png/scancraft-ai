// modules/ui/ai-chat-ui.js

import { EventBus } from "../core/events.js"
import { speak } from "../voice/narration.js"
import { startConversation, stopConversation } from "../voice/conversation.js"

let chatContainer
let messagesContainer
let inputField
let sendBtn
let micBtn

export function initAIChat(containerId="ai-chat"){

chatContainer = document.getElementById(containerId)

messagesContainer = document.createElement("div")
messagesContainer.className = "ai-chat-messages"

const inputArea = document.createElement("div")
inputArea.className = "ai-chat-input"

inputField = document.createElement("input")
inputField.placeholder = "Ask anything about this object..."

sendBtn = document.createElement("button")
sendBtn.innerText = "Send"

micBtn = document.createElement("button")
micBtn.innerText = "🎤"

inputArea.appendChild(inputField)
inputArea.appendChild(sendBtn)
inputArea.appendChild(micBtn)

chatContainer.appendChild(messagesContainer)
chatContainer.appendChild(inputArea)

attachEvents()

}

function attachEvents(){

sendBtn.onclick = sendMessage

inputField.addEventListener("keypress",e=>{
if(e.key === "Enter"){
sendMessage()
}
})

micBtn.onclick = toggleVoice

EventBus.on("voiceResult",handleVoiceResult)

EventBus.on("aiResponse",addAIMessage)

}

function sendMessage(){

const text = inputField.value.trim()

if(!text) return

addUserMessage(text)

EventBus.emit("userQuery",text)

inputField.value = ""

}

function toggleVoice(){

EventBus.emit("voiceToggle")

}

function handleVoiceResult(text){

if(!text) return

addUserMessage(text)

EventBus.emit("userQuery",text)

}

function addUserMessage(text){

const msg = createMessage(text,"user")

messagesContainer.appendChild(msg)

scrollToBottom()

}

export function addAIMessage(text){

const msg = createMessage(text,"ai")

messagesContainer.appendChild(msg)

speak(text)

scrollToBottom()

}

function createMessage(text,type){

const msg = document.createElement("div")

msg.className = `chat-message ${type}`

msg.innerText = text

return msg

}

function scrollToBottom(){

messagesContainer.scrollTop = messagesContainer.scrollHeight

}

export function clearChat(){

messagesContainer.innerHTML = ""

}

export function openChat(){

chatContainer.style.display = "flex"

}

export function closeChat(){

chatContainer.style.display = "none"

}
