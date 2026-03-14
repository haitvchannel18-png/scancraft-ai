/**
 * ScanCraft AI
 * Model Manager
 * Controls lifecycle of AI models
 */

import Events from "./events.js"
import ModelLoader from "./model-loader.js"

class ModelManager {

    constructor(){

        this.models = {}

    }

    /**
     * register loaded model
     */
    register(name, session){

        this.models[name] = {
            session,
            loaded: true,
            lastUsed: Date.now(),
            health: "ok"
        }

        Events.emit("model:registered", name)

    }

    /**
     * get model session
     */
    get(name){

        const model = this.models[name]

        if(!model) return null

        model.lastUsed = Date.now()

        return model.session

    }

    /**
     * load model if not loaded
     */
    async ensure(name, path){

        if(this.models[name]){

            return this.models[name].session

        }

        const session = await ModelLoader.loadModel(name, path)

        if(session){

            this.register(name, session)

        }

        return session

    }

    /**
     * check model health
     */
    checkHealth(){

        const now = Date.now()

        for(const name in this.models){

            const model = this.models[name]

            const idle = now - model.lastUsed

            if(idle > 300000){

                model.health = "idle"

            }else{

                model.health = "active"

            }

        }

    }

    /**
     * unload model
     */
    unload(name){

        if(!this.models[name]) return

        delete this.models[name]

        Events.emit("model:unloaded", name)

    }

    /**
     * unload idle models
     */
    cleanup(){

        const now = Date.now()

        for(const name in this.models){

            const model = this.models[name]

            const idle = now - model.lastUsed

            if(idle > 600000){

                this.unload(name)

            }

        }

    }

    /**
     * list models
     */
    list(){

        return Object.keys(this.models)

    }

}

const Manager = new ModelManager()

export default Manager
