// modules/ui/ai-chat-ui.js

import { EventBus } from "../core/events.js"
import Audio from "../audio/ai-sounds.js"

class AIChatUI {

constructor(){
this.container = document.getElementById("ai-chat")
this.messages = []
}

// 🔥 INIT
init(){

if(!this.container) return

this.container.innerHTML = `
<div class="chat-window"></div>
<div class="chat-input">
<input id="chat-input" placeholder="Ask anything about this object..." />
<button id="send-btn">➤</button>
</div>
`

this.bindEvents()
}

// 🎯 EVENTS
bindEvents(){

const input = document.getElementById("chat-input")
const btn = document.getElementById("send-btn")

btn.onclick = () => this.handleSend(input.value)

input.addEventListener("keydown", (e)=>{
if(e.key === "Enter"){
this.handleSend(input.value)
}
})

}

// 🧠 SEND MESSAGE
handleSend(text){

if(!text.trim()) return

this.addMessage("user", text)
Audio.play("typing")

EventBus.emit("userQuestion", text)

// clear input
document.getElementById("chat-input").value = ""

}

// 🤖 RECEIVE AI RESPONSE
addAIResponse(text){

Audio.play("response")

this.addMessage("ai", text, true)
}

// 💬 ADD MESSAGE
addMessage(type, text, animate=false){

const chatWindow = this.container.querySelector(".chat-window")

const msg = document.createElement("div")
msg.className = "msg " + type

if(animate){
this.typeEffect(msg, text)
}else{
msg.innerText = text
}

chatWindow.appendChild(msg)

chatWindow.scrollTop = chatWindow.scrollHeight
}

// ✨ TYPEWRITER EFFECT
typeEffect(element, text){

let i = 0

const interval = setInterval(()=>{
element.innerText += text[i]
i++

if(i >= text.length){
clearInterval(interval)
}
},15)

}

// 🧠 CONNECT AI RESPONSE
listen(){

EventBus.on("aiResponse", (data)=>{
this.addAIResponse(data.text || data)
})

}

}

export default new AIChatUI()
