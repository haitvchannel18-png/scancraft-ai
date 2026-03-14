// ScanCraft AI
// Chat Interface Controller

import AnimationEngine from "../animations/ui-animations.js"
import EventBus from "../../modules/core/events.js"

class ChatUI {

constructor(){

this.chatContainer = document.getElementById("aiChat")
this.messages = []
this.typingIndicator = null

this.init()
}

init(){

if(!this.chatContainer) return

EventBus.on("AI_RESPONSE", data => {

this.addAIMessage(data.text)

})

EventBus.on("USER_MESSAGE", data => {

this.addUserMessage(data.text)

})

}

createMessage(text, type){

const msg = document.createElement("div")

msg.className = `chat-message ${type}`

msg.innerHTML = `
<div class="bubble">
${text}
</div>
`

return msg
}

addUserMessage(text){

const msg = this.createMessage(text,"user")

this.chatContainer.appendChild(msg)

AnimationEngine.openPanel(msg)

this.scrollBottom()

}

addAIMessage(text){

const msg = this.createMessage(text,"ai")

this.chatContainer.appendChild(msg)

AnimationEngine.openPanel(msg)

this.scrollBottom()

}

showTyping(){

this.typingIndicator = document.createElement("div")

this.typingIndicator.className="typing"

this.typingIndicator.innerHTML = "AI thinking..."

this.chatContainer.appendChild(this.typingIndicator)

}

hideTyping(){

if(this.typingIndicator){

this.typingIndicator.remove()

this.typingIndicator = null

}

}

scrollBottom(){

this.chatContainer.scrollTop = this.chatContainer.scrollHeight

}

}

export default new ChatUI()
