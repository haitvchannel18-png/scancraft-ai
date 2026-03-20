// modules/knowledge/wiki.js

import Cache from "../memory/knowledge-cache.js"
import { EventBus } from "../core/events.js"

class Wiki {

constructor(){
this.api = "https://en.wikipedia.org/api/rest_v1/page/summary/"
}

// 🔥 MAIN SEARCH
async search(query){

if(!query) return null

const key = "wiki_" + query.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("wikiStart", {query})

try{

// 🧠 FETCH SUMMARY
const url = this.api + encodeURIComponent(query)
const res = await fetch(url)

if(!res.ok){
throw new Error("Wiki not found")
}

const data = await res.json()

// 🎯 FORMAT
const result = this.format(data)

// 💾 CACHE
Cache.set(key, result)

EventBus.emit("wikiComplete", result)

return result

}catch(err){

EventBus.emit("wikiError", err)

// 🔁 fallback try (lowercase / trimmed)
return this.fallback(query)

}

}

// 🔁 FALLBACK (simple retry)
async fallback(query){

try{
const q = query.split(" ").slice(0,2).join(" ")
const res = await fetch(this.api + encodeURIComponent(q))
if(!res.ok) return null

const data = await res.json()
return this.format(data)

}catch(e){
return null
}

}

// 🎯 FORMAT OUTPUT
format(data){

return {
title: data.title || "",
summary: data.extract || "",
image: data.thumbnail?.source || null,
source: data.content_urls?.desktop?.page || "",
facts: this.extractFacts(data.extract || "")
}

}

// 🧠 EXTRACT FACTS (simple NLP)
extractFacts(text){

if(!text) return []

const sentences = text.split(".")
return sentences.slice(0,5).map(s => s.trim()).filter(Boolean)

}

}

export default new Wiki()
