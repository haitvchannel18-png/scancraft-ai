/**
 * ScanCraft AI
 * Model Downloader
 * Handles remote AI model download + local caching
 */

import Events from "./events.js"

class ModelDownloader {

constructor(){

this.models = new Map()

this.dbName = "scancraft-models"

}

async initDB(){

return new Promise((resolve,reject)=>{

const request = indexedDB.open(this.dbName,1)

request.onupgradeneeded = (e)=>{

const db = e.target.result

if(!db.objectStoreNames.contains("models")){

db.createObjectStore("models")

}

}

request.onsuccess = ()=> resolve(request.result)

request.onerror = reject

})

}

async saveModel(name,data){

const db = await this.initDB()

const tx = db.transaction("models","readwrite")

const store = tx.objectStore("models")

store.put(data,name)

}

async getModel(name){

const db = await this.initDB()

return new Promise((resolve,reject)=>{

const tx = db.transaction("models","readonly")

const store = tx.objectStore("models")

const req = store.get(name)

req.onsuccess = ()=> resolve(req.result)

req.onerror = reject

})

}

async download(url,name){

try{

Events.emit("model:download:start",name)

const response = await fetch(url)

const reader = response.body.getReader()

let chunks = []

let received = 0

while(true){

const {done,value} = await reader.read()

if(done) break

chunks.push(value)

received += value.length

Events.emit("model:download:progress",{
name,
received
})

}

const blob = new Blob(chunks)

await this.saveModel(name,blob)

Events.emit("model:download:complete",name)

return blob

}catch(err){

console.error("Model download error:",err)

Events.emit("model:download:error",{name,err})

return null

}

}

async loadOrDownload(url,name){

const cached = await this.getModel(name)

if(cached){

Events.emit("model:cache:hit",name)

return cached

}

Events.emit("model:cache:miss",name)

return await this.download(url,name)

}

}

const Downloader = new ModelDownloader()

export default Downloader
