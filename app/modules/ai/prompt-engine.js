/**
 * ScanCraft AI
 * Prompt Engine (Controls AI Thinking Style)
 */

import Events from "../core/events.js"

class PromptEngine {

constructor(){
this.mode = "explain" // explain | chat | xray | future | diy
}

// 🔥 MAIN BUILDER
build(data){

if(!data) return ""

let prompt = ""

// 🧠 SELECT MODE
switch(this.mode){

case "chat":
prompt = this.chatPrompt(data)
break

case "xray":
prompt = this.xrayPrompt(data)
break

case "future":
prompt = this.futurePrompt(data)
break

case "diy":
prompt = this.diyPrompt(data)
break

default:
prompt = this.explainPrompt(data)

}

Events.emit("prompt:generated", prompt)

return prompt

}

// 📘 DEFAULT EXPLAIN MODE (MAIN)
explainPrompt(data){

return `
Explain the object in a premium, clear and structured way.

Object: ${data.object}

Category: ${data.category}
Material: ${data.material}

Provide:
- What it is
- Uses
- Key features
- Real-world applications

Keep it simple but intelligent.
`

}

// 💬 CHAT MODE
chatPrompt(data){

return `
You are an intelligent AI assistant.

User is asking about: ${data.object}

Answer in a conversational tone like ChatGPT.

Include:
- Short explanation
- Friendly tone
- Easy language
`

}

// 🔍 XRAY MODE
xrayPrompt(data){

return `
Analyze internal structure of this object.

Object: ${data.object}

Explain:
- Internal components
- Materials used
- How it works internally
`

}

// 🔮 FUTURE MODE
futurePrompt(data){

return `
Predict the future of this object.

Object: ${data.object}

Explain:
- Future innovations
- Smart upgrades
- AI integration possibilities
`

}

// 🛠 DIY MODE
diyPrompt(data){

return `
Explain how to build or repair this object.

Object: ${data.object}

Provide:
- Steps
- Tools required
- Safety tips
`

}

// 🔄 MODE SWITCH
setMode(mode){

this.mode = mode
Events.emit("prompt:mode-changed", mode)

}

}

const Prompt = new PromptEngine()

export default Prompt
