// ScanCraft AI
// X-Ray Vision Interface

import AnimationEngine from "../animations/ui-animations.js"
import EventBus from "../../modules/core/events.js"

class XRayUI {

constructor(){

this.panel = document.getElementById("xrayPanel")
this.canvas = document.getElementById("xrayCanvas")
this.ctx = this.canvas ? this.canvas.getContext("2d") : null

this.currentObject = null

this.init()

}

init(){

EventBus.on("XRAY_ANALYSIS",(data)=>{

this.render(data)

})

}

render(data){

this.currentObject = data

if(!this.ctx) return

this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

const layers = data.layers || []

layers.forEach(layer=>{

this.drawLayer(layer)

})

AnimationEngine.openPanel(this.panel)

}

drawLayer(layer){

this.ctx.save()

this.ctx.globalAlpha = layer.opacity || 0.5
this.ctx.strokeStyle = layer.color || "#00ffff"
this.ctx.lineWidth = 2

this.ctx.beginPath()

layer.points.forEach((p,i)=>{

if(i===0){

this.ctx.moveTo(p.x,p.y)

}else{

this.ctx.lineTo(p.x,p.y)

}

})

this.ctx.stroke()

this.ctx.restore()

}

hide(){

AnimationEngine.closePanel(this.panel)

}

}

export default new XRayUI()
