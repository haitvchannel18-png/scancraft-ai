// modules/knowledge/web-search.js

import Cache from "../memory/knowledge-cache.js"
import { EventBus } from "../core/events.js"

class WebSearch {

constructor(){
this.apiEndpoint = "https://api.duckduckgo.com/"
}

// 🔥 MAIN SEARCH
async search(query){

if(!query) return null

// ⚡ CACHE
const cached = Cache.get("web_" + query)
if(cached){
return cached
}

EventBus.emit("webSearchStart", {query})

try{

// 🧠 FETCH (free API)
const url = `${this.apiEndpoint}?q=${encodeURIComponent(query)}&format=json`

const res = await fetch(url)
const data = await res.json()

const result = this.format(data)

// 💾 CACHE
Cache.set("web_" + query, result)

EventBus.emit("webSearchComplete", result)

return result

}catch(err){

EventBus.emit("webSearchError", err)

return null

}

}

// 🎯 FORMAT RESULT
format(data){

return {
title: data.Heading || "",
summary: data.Abstract || "",
source: data.AbstractURL || "",
related: (data.RelatedTopics || []).slice(0,5).map(r => ({
text: r.Text,
url: r.FirstURL
}))
}

}

}

export default new WebSearch()
