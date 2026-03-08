let model
let detecting = false

export async function loadModel(){

    console.log("Loading AI detection model...")

    model = await cocoSsd.load({
        base: "lite_mobilenet_v2"
    })

    console.log("AI Model Ready")
}

export async function detectFrame(video){

    if(!model || detecting) return []

    detecting = true

    const predictions = await model.detect(video)

    detecting = false

    return predictions
}
