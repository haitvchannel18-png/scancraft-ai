// ================= IMPORTS =================

import { playSound, loadSound } from "./audio-engine.js"
import { logAI } from "../utils/AILogger.js"


// ================= SOUND MAP =================

const UI_SOUNDS = {

click: "/sounds/ui/click.mp3",

hover: "/sounds/ui/hover.mp3",

panelOpen: "/sounds/ui/open-panel.mp3",

panelClose: "/sounds/ui/close-panel.mp3",

menuMove: "/sounds/ui/menu-move.mp3"

}


// ================= INIT =================

export async function initUISounds(){

logAI("Initializing UI sounds")

for(const key in UI_SOUNDS){

await loadSound(key, UI_SOUNDS[key])

}

}


// ================= BUTTON CLICK =================

export function playClick(){

playSound("click",0.6)

}


// ================= HOVER =================

export function playHover(){

playSound("hover",0.3)

}


// ================= PANEL OPEN =================

export function playPanelOpen(){

playSound("panelOpen",0.7)

}


// ================= PANEL CLOSE =================

export function playPanelClose(){

playSound("panelClose",0.7)

}


// ================= MENU MOVE =================

export function playMenuMove(){

playSound("menuMove",0.4)

}


// ================= AUTO ATTACH =================

export function attachUISounds(){

document.querySelectorAll("button").forEach(btn=>{

btn.addEventListener("click",playClick)

btn.addEventListener("mouseenter",playHover)

})

}
