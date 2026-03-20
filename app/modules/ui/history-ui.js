// modules/ui/history-ui.js

import HistorySync from "../cloud/history-sync.js"
import User from "../auth/user.js"
import UISounds from "../audio/ui-sounds.js"

class HistoryUI {

constructor(){
this.container = null
}

// 🚀 INIT
init(){

this.container = document.createElement("div")
this.container.id = "history-panel"
this.container.classList.add("hidden")

document.body.appendChild(this.container)

this.renderBase()

}

// 🎨 BASE UI
renderBase(){

this.container.innerHTML = `

<div class="history-header">
<h2>Scan History</h2>
<button id="close-history">✕</button>
</div>

<div id="history-list"></div>

`

document.getElementById("close-history").onclick = ()=>{
this.hide()
}

}

// 📥 LOAD HISTORY
async load(){

const userId = User.getId()

if(!userId){
this.renderEmpty("Login required")
return
}

const history = await HistorySync.get(userId)

if(!history || history.length === 0){
this.renderEmpty("No scans yet")
return
}

this.renderList(history)

}

// 📜 RENDER LIST
renderList(data){

const list = document.getElementById("history-list")

list.innerHTML = ""

data.forEach(item => {

const card = document.createElement("div")
card.className = "history-card"

card.innerHTML = `

<h3>${item.vision?.label || "Unknown"}</h3>
<p>${new Date(item.time).toLocaleString()}</p>

`

card.onclick = ()=>{
UISounds.click()
this.showDetails(item)
}

list.appendChild(card)

})

}

// 📄 DETAILS VIEW
showDetails(item){

const panel = document.getElementById("object-panel")

panel.classList.remove("hidden")

document.getElementById("object-name").innerText =
item.vision?.label || "Unknown"

document.getElementById("object-info").innerText =
item.explanation || "No data"

}

// ❌ EMPTY STATE
renderEmpty(msg){

const list = document.getElementById("history-list")

list.innerHTML = `<p style="text-align:center;color:#888">${msg}</p>`

}

// 👁 SHOW
async show(){

this.container.classList.remove("hidden")

await this.load()

}

// 🙈 HIDE
hide(){

this.container.classList.add("hidden")

}

}

export default new HistoryUI()
