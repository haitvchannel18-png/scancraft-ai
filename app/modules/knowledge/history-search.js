// modules/knowledge/history-search.js

import HistoryDB from "./history-db.js"
import Wiki from "./wiki.js"
import WebSearch from "./web-search.js"
import Cache from "../memory/knowledge-cache.js"
import { EventBus } from "../core/events.js"

class HistorySearch {

constructor(){
this.maxTimeline = 5
}

// 🔥 MAIN FUNCTION
async search(object){

if(!object) return null

const key = "history_search_" + object.toLowerCase()

// ⚡ CACHE
const cached = Cache.get(key)
if(cached) return cached

EventBus.emit("historySearchStart", {object})

try{

// 🧠 MULTI SOURCE
const [offline, wiki, web] = await Promise.all([
HistoryDB.get(object),
Wiki.search(object),
WebSearch.search(object + " history")
])

// 🧠 MERGE DATA
const result = this.combine(object, offline, wiki, web)

// 💾 CACHE
Cache.set(key, result)

EventBus.emit("historySearchComplete", result)

return result

}catch(err){

EventBus.emit("historySearchError", err)
return null

}

}

// 🧠 COMBINE ENGINE
combine(object, offline, wiki, web){

const summary =
offline?.summary ||
wiki?.summary ||
web?.summary ||
"No history available"

const timeline = this.buildTimeline(offline, wiki)

return {
object,
summary,
timeline,
facts: wiki?.facts || [],
source: wiki?.source || web?.source || "",
confidence: this.computeConfidence(offline, wiki, web),
timestamp: Date.now()
}

}

// 📜 BUILD TIMELINE
buildTimeline(offline, wiki){

const timeline = []

// offline timeline
if(offline?.timeline){
timeline.push(...offline.timeline)
}

// wiki facts → timeline style
if(wiki?.facts){
wiki.facts.slice(0, this.maxTimeline).forEach((fact, i)=>{
timeline.push({
year: "unknown",
event: fact
})
})
}

return timeline.slice(0, this.maxTimeline)

}

// 📊 CONFIDENCE
computeConfidence(offline, wiki, web){

let score = 0

if(offline) score += 0.4
if(wiki) score += 0.4
if(web) score += 0.2

return Math.min(1, score)

}

}

export default new HistorySearch()
