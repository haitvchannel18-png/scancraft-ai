// modules/cloud/history-sync.js

import CloudSync from "./cloud-sync.js"

class HistorySync {

// 💾 SAVE SCAN HISTORY
async save(userId, result){

let history = await CloudSync.get(userId, "history") || []

history.unshift({
...result,
time: Date.now()
})

// keep last 20 scans
history = history.slice(0, 20)

await CloudSync.save(userId, "history", history)

}

// 📥 GET HISTORY
async get(userId){

return await CloudSync.get(userId, "history") || []

}

}

export default new HistorySync()
