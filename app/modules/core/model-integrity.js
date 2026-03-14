/**
 * ScanCraft AI
 * Model Integrity Checker
 * Verifies AI model files before loading
 */

import Events from "./events.js"

class ModelIntegrity {

constructor(){

this.hashes = {}

}

async calculateHash(buffer){

const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)

const hashArray = Array.from(new Uint8Array(hashBuffer))

return hashArray.map(b=>b.toString(16).padStart(2,"0")).join("")

}

async verifyModel(url,expectedHash){

try{

Events.emit("model:verify:start",url)

const response = await fetch(url)

const buffer = await response.arrayBuffer()

const hash = await this.calculateHash(buffer)

if(expectedHash && hash !== expectedHash){

Events.emit("model:verify:failed",{url,hash})

console.error("Model integrity failed:",url)

return false

}

this.hashes[url] = hash

Events.emit("model:verify:success",{url,hash})

return true

}catch(err){

console.error("Integrity check error:",err)

Events.emit("model:verify:error",err)

return false

}

}

getHash(url){

return this.hashes[url]

}

listVerified(){

return Object.keys(this.hashes)

}

}

const Integrity = new ModelIntegrity()

export default Integrity
