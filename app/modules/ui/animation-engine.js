// ================= IMPORT =================

import { on } from "../core/events.js"


// ================= GLOBAL =================

const animations = new Map()



// ================= INIT =================

export function initAnimationEngine(){

listenUIEvents()

}



// ================= EVENT LISTENER =================

function listenUIEvents(){

on("ui:scan:start", startScanPulse)

on("ui:scan:complete", stopScanPulse)

on("ui:card:reveal", animateCardReveal)

on("ui:object:highlight", highlightObject)

on("ui:loading:start", startLoading)

on("ui:loading:stop", stopLoading)

}



// ================= SCAN PULSE =================

let scanPulseAnimation = null

function startScanPulse(){

const el = document.getElementById("scan-button")

if(!el) return

scanPulseAnimation = el.animate(

[
{ transform:"scale(1)", boxShadow:"0 0 0px #00f7ff" },
{ transform:"scale(1.08)", boxShadow:"0 0 30px #00f7ff" },
{ transform:"scale(1)", boxShadow:"0 0 0px #00f7ff" }
],

{
duration:1200,
iterations:Infinity,
easing:"ease-in-out"
}

)

}



function stopScanPulse(){

if(scanPulseAnimation){

scanPulseAnimation.cancel()

}

}



// ================= CARD REVEAL =================

function animateCardReveal(card){

card.animate(

[
{ opacity:0, transform:"translateY(30px) scale(.96)" },
{ opacity:1, transform:"translateY(0) scale(1)" }
],

{
duration:420,
easing:"cubic-bezier(.2,.8,.2,1)"
}

)

}



// ================= OBJECT HIGHLIGHT =================

function highlightObject(box){

box.animate(

[
{ outline:"2px solid transparent" },
{ outline:"3px solid #00f7ff" },
{ outline:"2px solid transparent" }
],

{
duration:800
}

)

}



// ================= LOADING SHIMMER =================

let shimmerAnim

function startLoading(){

const el = document.getElementById("ai-loading")

if(!el) return

shimmerAnim = el.animate(

[
{ opacity:.2 },
{ opacity:1 },
{ opacity:.2 }
],

{
duration:900,
iterations:Infinity
}

)

}



function stopLoading(){

if(shimmerAnim){

shimmerAnim.cancel()

}

}



// ================= FLOAT ANIMATION =================

export function floatElement(el){

el.animate(

[
{ transform:"translateY(0px)" },
{ transform:"translateY(-8px)" },
{ transform:"translateY(0px)" }
],

{
duration:2000,
iterations:Infinity,
easing:"ease-in-out"
}

)

}



// ================= BUBBLE POP =================

export function bubblePop(el){

el.animate(

[
{ transform:"scale(.9)", opacity:.5 },
{ transform:"scale(1.1)", opacity:1 },
{ transform:"scale(1)", opacity:1 }
],

{
duration:300,
easing:"ease-out"
}

)

}



// ================= SMOOTH FADE =================

export function fadeIn(el){

el.animate(

[
{ opacity:0 },
{ opacity:1 }
],

{
duration:350
}

)

}



export function fadeOut(el){

el.animate(

[
{ opacity:1 },
{ opacity:0 }
],

{
duration:300
}

)

}



// ================= OBJECT SCAN LINE =================

export function scanLineAnimation(container){

const line = document.createElement("div")

line.className = "scan-line"

container.appendChild(line)

line.animate(

[
{ transform:"translateY(0)" },
{ transform:"translateY(100%)" }
],

{
duration:1500,
iterations:Infinity
}

)

}



// ================= 3D PANEL ROTATION =================

export function rotatePanel(el){

el.animate(

[
{ transform:"rotateY(0deg)" },
{ transform:"rotateY(8deg)" },
{ transform:"rotateY(0deg)" }
],

{
duration:2500,
iterations:Infinity
}

)

}



// ================= PARTICLE BURST =================

export function particleBurst(x,y){

const particleCount = 10

for(let i=0;i<particleCount;i++){

const p = document.createElement("div")

p.className = "ui-particle"

p.style.left = x+"px"
p.style.top = y+"px"

document.body.appendChild(p)

p.animate(

[
{ transform:"translate(0,0)", opacity:1 },
{ transform:`translate(${Math.random()*80-40}px,${Math.random()*80-40}px)`, opacity:0 }
],

{
duration:700
}

)

setTimeout(()=>p.remove(),700)

}

}
