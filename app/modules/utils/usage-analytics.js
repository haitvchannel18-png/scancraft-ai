// modules/utils/usage-analytics.js

import AILogger from "./ai-logger.js"

class UsageAnalytics {

constructor(){
this.data = {
featureUsage: {},
events: []
}
}

// 🎯 track feature
trackFeature(feature){

this.data.featureUsage[feature] =
(this.data.featureUsage[feature] || 0) + 1

AILogger.log("info", "Feature used", {feature})

}

// 🧠 track event
trackEvent(name, payload = {}){

const event = {
name,
time: Date.now(),
payload
}

this.data.events.push(event)

// limit
if(this.data.events.length > 200){
this.data.events.shift()
}

}

// 📊 get analytics
getData(){

return this.data

}

// 💾 save
save(){

localStorage.setItem(
"usage_analytics",
JSON.stringify(this.data)
)

}

// 📥 load
load(){

const d = localStorage.getItem("usage_analytics")

if(d){
this.data = JSON.parse(d)
}

}

}

export default new UsageAnalytics()
