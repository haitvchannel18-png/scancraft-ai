/**
 * ScanCraft AI
 * Model Loader
 * Handles ONNX model loading and initialization
 */

import Events from "./events.js"

class ModelLoader {

    constructor(){

        this.models = {}
        this.sessions = {}

    }

    async loadModel(name,path){

        try{

            Events.emit("model:loading",name)

            const session = await ort.InferenceSession.create(path,{
                executionProviders:["wasm"]
            })

            this.sessions[name] = session

            this.models[name] = {
                name,
                path,
                loaded:true
            }

            Events.emit("model:loaded",name)

            return session

        }catch(err){

            console.error("Model load error:",name,err)

            Events.emit("model:error",{name,err})

            return null

        }

    }

    getSession(name){

        return this.sessions[name]

    }

    isLoaded(name){

        return !!this.sessions[name]

    }

    async preload(){

        await this.loadModel("yolo","/models/detection/yolov8n.onnx")

        await this.loadModel("clip","/models/vision/clip-vit-base.onnx")

        await this.loadModel("depth","/models/depth/midas.onnx")

        await this.loadModel("logo","/models/logo/logo-detect.onnx")

    }

    listModels(){

        return Object.keys(this.sessions)

    }

}

const ModelLoaderInstance = new ModelLoader()

export default ModelLoaderInstance
