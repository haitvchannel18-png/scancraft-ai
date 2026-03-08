export function drawBoxes(canvas,predictions){

    const ctx = canvas.getContext("2d")

    ctx.clearRect(0,0,canvas.width,canvas.height)

    predictions.forEach(p=>{

        const [x,y,w,h] = p.bbox

        ctx.strokeStyle = "#00f7ff"
        ctx.lineWidth = 4

        ctx.shadowColor = "#00f7ff"
        ctx.shadowBlur = 20

        ctx.strokeRect(x,y,w,h)

        ctx.fillStyle = "#00f7ff"
        ctx.font = "bold 18px Orbitron"

        ctx.fillText(
            `${p.class} ${(p.score*100).toFixed(1)}%`,
            x,
            y>20?y-5:20
        )

    })
}
