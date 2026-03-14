/**
 * ScanCraft AI
 * Model Preloader
 * Preloads AI models in background
 */

import Events from "./events.js"
import ModelLoader from "./model-loader.js"
import ModelManager from "./model-manager.js"

class ModelPreloader {

    constructor(){

        this.queue = []

        this.loading = false

    }

    /**
     * add model to preload queue
     */
    add(name,path){

        this.queue.push({name,path})

    }

    /**
     * preload all models
     */
    async preloadAll(){

        if(this.loading) return

        this.loading = true

        Events.emit("models:preload:start")

        for(const model of this.queue){

            try{

                Events.emit("model:preloading",model.name)

                const session =
                    await ModelLoader.loadModel(model.name,model.path)

                if(session){

                    ModelManager.register(model.name,session)

                }

            }catch(err){

                console.error("Preload error:",model.name,err)

            }

        }

        Events.emit("models:preload:complete")

        this.loading = false

    }

    /**
     * preload critical models first
     */
    async preloadCritical(){

        const critical = this.queue.slice(0,2)

        for(const model of critical){

            const session =
                await ModelLoader.loadModel(model.name,model.path)

            if(session){

                ModelManager.register(model.name,session)

            }

        }

    }

    /**
     * clear preload queue
     */
    clear(){

        this.queue = []

    }

}

const Preloader = new ModelPreloader()

export default Preloader
