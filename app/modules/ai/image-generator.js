/**
 * ScanCraft AI
 * Image Generator (AI Imagination Engine)
 */

import Events from "../core/events.js"
import Performance from "../core/performance.js"
import Network from "../core/network-manager.js"

class ImageGenerator {

async generate(input){

if(!input) return null

Performance.start("image-generation")

const {object, mode} = input

// 🧠 build prompt
const prompt = this.buildPrompt(object, mode)

// 🌐 online or fallback
const isOnline = await Network.isOnline()

let result

if(isOnline){
result = await this.generateOnline(prompt)
}else{
result = this.generateFallback(object)
}

// 📡 notify UI
Events.emit("ai:image-generated", result)

Performance.end("image-generation")

return result

}

// 🧠 PROMPT BUILDER
buildPrompt(object, mode){

switch(mode){

case "future":
return `futuristic version of ${object}, ultra modern design, sci-fi`

case "whatif":
return `modified version of ${object}, creative redesign`

case "realistic":
return `${object}, high quality realistic photo`

default:
return `${object}`

}

}

// 🌐 ONLINE IMAGE (FREE API)
async generateOnline(prompt){

try{

const res = await fetch("https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt))

return {
type: "ai-generated",
url: res.url,
prompt
}

}catch(err){

console.warn("Image API failed")

return this.generateFallback(prompt)

}

}

// ⚡ OFFLINE FALLBACK
generateFallback(object){

return {
type: "placeholder",
url: `https://via.placeholder.com/512?text=${encodeURIComponent(object)}`,
message: "Offline mode image"
}

}

}

const ImageGen = new ImageGenerator()

export default ImageGen
