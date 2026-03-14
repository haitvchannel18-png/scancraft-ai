/**
 * ScanCraft AI
 * Model Warmup Engine
 * Runs dummy inference to reduce first-run latency
 */

import Events from "./events.js"
import ModelManager from "./model-manager.js"

class ModelWarmup {

    constructor(){

        this.warmed = {}

    }

    /**
     * warmup specific model
     */
    async warmup(name, dummyInput){

        try{

            const session = ModelManager.get(name)

            if(!session){

                console.warn("Warmup skipped, model not loaded:",name)
                return
            }

            Events.emit("model:warmup:start",name)

            await session.run(dummyInput)

            this.warmed[name] = true

            Events.emit("model:warmup:complete",name)

        }catch(err){

            console.error("Warmup error:",name,err)

            Events.emit("model:warmup:error",{name,err})

        }

    }

    /**
     * warmup YOLO model
     */
    async warmupYOLO(){

        const input = {
            images: new ort.Tensor(
                "float32",
                new Float32Array(1*3*640*640),
                [1,3,640,640]
            )
        }

        await this.warmup("yolo",input)

    }

    /**
     * warmup CLIP model
     */
    async warmupCLIP(){

        const input = {
            input: new ort.Tensor(
                "float32",
                new Float32Array(1*3*224*224),
                [1,3,224,224]
            )
        }

        await this.warmup("clip",input)

    }

    /**
     * warmup MiDaS depth model
     */
    async warmupDepth(){

        const input = {
            input: new ort.Tensor(
                "float32",
                new Float32Array(1*3*256*256),
                [1,3,256,256]
            )
        }

        await this.warmup("depth",input)

    }

    /**
     * warmup all models
     */
    async warmupAll(){

        await this.warmupYOLO()

        await this.warmupCLIP()

        await this.warmupDepth()

    }

}

const Warmup = new ModelWarmup()

export default Warmup
