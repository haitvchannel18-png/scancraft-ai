// modules/learning-ai/learning-logger.js

class LearningLogger {

constructor(){
this.logs = []
}

// 📊 log learning event
log(event, data){

this.logs.push({
event,
data,
time: Date.now()
})

if(this.logs.length > 300){
this.logs.shift()
}

}

// 📈 stats
getStats(){

return {
totalEvents: this.logs.length,
recent: this.logs.slice(-10)
}

}

// ❌ clear
clear(){
this.logs = []
}

}

export default new LearningLogger()
