// ScanCraft AI
// Ultra UI Animation Engine

const AnimationEngine = (() => {

let activeAnimations = new Set()
let running = false

// Easing functions
const Easing = {
    
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),

    easeInOutQuad: t =>
        t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2,

    smooth: t => t * t * (3 - 2 * t)
}


// core animation runner
function animate({

    duration = 400,
    easing = Easing.easeOutCubic,
    update,
    complete

}){

    const start = performance.now()

    const anim = time => {

        let progress = (time - start) / duration
        progress = Math.min(progress, 1)

        const eased = easing(progress)

        update(eased)

        if(progress < 1){

            requestAnimationFrame(anim)

        }else{

            activeAnimations.delete(anim)

            if(complete) complete()
        }
    }

    activeAnimations.add(anim)

    requestAnimationFrame(anim)
}



// Scan pulse animation
function scanPulse(element){

    animate({

        duration:800,

        update:(p)=>{

            const scale = 1 + p * 0.4
            const opacity = 1 - p

            element.style.transform =
                `scale(${scale})`

            element.style.opacity = opacity
        }

    })

}



// Panel open animation
function openPanel(panel){

    panel.style.display = "block"
    panel.style.transform = "translateY(40px)"
    panel.style.opacity = 0

    animate({

        duration:350,

        easing:Easing.easeOutCubic,

        update:(p)=>{

            panel.style.opacity = p

            panel.style.transform =
                `translateY(${40 - p*40}px)`
        }

    })
}



// Panel close animation
function closePanel(panel){

    animate({

        duration:250,

        easing:Easing.easeInOutQuad,

        update:(p)=>{

            panel.style.opacity = 1-p

            panel.style.transform =
                `translateY(${p*40}px)`
        },

        complete:()=>{

            panel.style.display = "none"
        }

    })
}



// AI thinking animation
function aiThinking(element){

    let angle = 0

    function loop(){

        angle += 2

        element.style.transform =
            `rotate(${angle}deg)`

        requestAnimationFrame(loop)
    }

    loop()
}



// Object highlight animation
function highlightObject(element){

    element.style.transition =
        "box-shadow 0.25s ease"

    element.style.boxShadow =
        "0 0 30px rgba(0,255,255,0.8)"

    setTimeout(()=>{

        element.style.boxShadow = "none"

    },1200)
}



// button micro interaction
function buttonPress(button){

    button.style.transform = "scale(0.92)"

    setTimeout(()=>{

        button.style.transform = "scale(1)"

    },120)
}



return{

    animate,
    scanPulse,
    openPanel,
    closePanel,
    aiThinking,
    highlightObject,
    buttonPress

}

})()


export default AnimationEngine
