// ================= IMPORT =================

import { on, emit } from "../core/events.js"
import { animateCardReveal } from "./animation-engine.js"



// ================= GLOBAL =================

let panel
let selectedObject = null



// ================= INIT =================

export function initObjectPanel(){

panel = document.getElementById("object-panel")

if(!panel) return

panel.addEventListener("click", handlePanelClick)

listenObjectEvents()

}



// ================= LISTEN EVENTS =================

function listenObjectEvents(){

on("object:selected", object => {

selectedObject = object

openPanel(object)

})

}



// ================= OPEN PANEL =================

function openPanel(object){

if(!panel) return

panel.style.display = "flex"

panel.innerHTML = generatePanelHTML(object)

animateCardReveal(panel)

}



// ================= CLOSE PANEL =================

export function closeObjectPanel(){

if(panel){

panel.style.display = "none"

}

}



// ================= PANEL HTML =================

function generatePanelHTML(object){

return `

<div class="panel-header">
<div class="panel-title">${escapeHTML(object.label)}</div>
<div class="panel-close" data-action="close">✕</div>
</div>

<div class="panel-actions">

<button data-action="explain">🧠 AI Explain</button>

<button data-action="view3d">🧊 3D View</button>

<button data-action="paint">🎨 Paint</button>

<button data-action="buy">🛒 Buy</button>

<button data-action="compare">📊 Compare</button>

</div>

`

}



// ================= HANDLE CLICK =================

function handlePanelClick(e){

const action = e.target.dataset.action

if(!action) return



switch(action){

case "close":

closeObjectPanel()

break



case "explain":

emit("ai:explain-object", selectedObject)

break



case "view3d":

emit("viewer:open", selectedObject)

break



case "paint":

emit("painter:open", selectedObject)

break



case "buy":

emit("commerce:search", selectedObject)

break



case "compare":

emit("commerce:compare", selectedObject)

break

}

}



// ================= SECURITY =================

function escapeHTML(text){

const div = document.createElement("div")

div.innerText = text

return div.innerHTML

}
