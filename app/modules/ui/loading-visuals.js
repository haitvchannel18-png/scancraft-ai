// ================= IMPORT =================

import { on } from "../core/events.js"
import { floatElement } from "./animation-engine.js"



// ================= DOM =================

let loadingContainer
let spinner
let progressRing
let skeletonCards = []



// ================= INIT =================

export function initLoadingVisuals(){

loadingContainer = document.getElementById("ai-loading")
spinner = document.getElementById("ai-spinner")
progressRing = document.getElementById("ai-progress-ring")

listenLoadingEvents()

if(spinner){
floatElement(spinner)
}

}



// ================= EVENTS =================

function listenLoadingEvents(){

on("ai:processing:start", showLoading)

on("ai:processing:stop", hideLoading)

on("ai:progress:update", updateProgress)

}



// ================= SHOW LOADING =================

function showLoading(){

if(!loadingContainer) return

loadingContainer.style.display = "flex"

animateSpinner()

renderSkeletonCards()

}



// ================= HIDE LOADING =================

function hideLoading(){

if(!loadingContainer) return

loadingContainer.style.display = "none"

clearSkeleton()

}



// ================= SPINNER =================

function animateSpinner(){

if(!spinner) return

spinner.animate(

[
{ transform:"rotate(0deg)" },
{ transform:"rotate(360deg)" }

],

{
duration:1200,
iterations:Infinity,
easing:"linear"
}

)

}



// ================= PROGRESS =================

function updateProgress(value){

if(!progressRing) return

const radius = progressRing.r.baseVal.value
const circumference = radius * 2 * Math.PI

progressRing.style.strokeDasharray = `${circumference}`

const offset = circumference - value / 100 * circumference

progressRing.style.strokeDashoffset = offset

}



// ================= SKELETON UI =================

function renderSkeletonCards(){

const container = document.getElementById("ai-skeleton")

if(!container) return

container.innerHTML = ""

for(let i=0;i<3;i++){

const card = document.createElement("div")

card.className = "skeleton-card"

card.innerHTML = `

<div class="skeleton-title"></div>
<div class="skeleton-line"></div>
<div class="skeleton-line short"></div>

`

container.appendChild(card)

skeletonCards.push(card)

animateSkeleton(card)

}

}



// ================= SKELETON ANIMATION =================

function animateSkeleton(card){

card.animate(

[
{ opacity:.4 },
{ opacity:1 },
{ opacity:.4 }
],

{
duration:900,
iterations:Infinity
}

)

}



// ================= CLEAR =================

function clearSkeleton(){

const container = document.getElementById("ai-skeleton")

if(container){

container.innerHTML = ""

}

skeletonCards = []

}
