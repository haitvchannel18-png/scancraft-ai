// ================= IMPORTS =================

import { playSound, loadSound } from "./audio-engine.js"
import { logAI } from "../utils/AILogger.js"


// ================= SOUND MAP =================

const EDITOR_SOUNDS = {

brush: "/sounds/editor/brush.mp3",

paint: "/sounds/editor/paint.mp3",

sketch: "/sounds/editor/sketch.mp3",

texture: "/sounds/editor/texture.mp3",

clear: "/sounds/editor/clear.mp3",

export: "/sounds/editor/export.mp3"

}


// ================= INIT =================

export async function initEditorSounds(){

logAI("Initializing editor sounds")

for(const key in EDITOR_SOUNDS){

await loadSound(key, EDITOR_SOUNDS[key])

}

}


// ================= BRUSH =================

export function playBrush(){

playSound("brush",0.5)

}


// ================= PAINT =================

export function playPaint(){

playSound("paint",0.5)

}


// ================= SKETCH =================

export function playSketch(){

playSound("sketch",0.4)

}


// ================= TEXTURE APPLY =================

export function playTextureApply(){

playSound("texture",0.6)

}


// ================= CLEAR CANVAS =================

export function playClear(){

playSound("clear",0.5)

}


// ================= EXPORT =================

export function playExport(){

playSound("export",0.6)

}
