
export async function startCamera(video){

    const stream = await navigator.mediaDevices.getUserMedia({

        video:{
            facingMode:"environment",
            width:{ideal:1280},
            height:{ideal:720}
        },

        audio:false

    })

    video.srcObject = stream

    await video.play()
}
