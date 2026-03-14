/**
 * ScanCraft AI
 * Core Vision Pipeline Orchestrator
 * MARK 5.1 Architecture
 */

import State from "./state-manager.js"
import Events from "./events.js"

class VisionPipeline {

    constructor() {

        this.modules = {}

        this.running = false

        this.stages = [
            "camera",
            "detection",
            "vision",
            "ai",
            "knowledge",
            "viewer",
            "ui",
            "voice"
        ]

    }

    /**
     * register pipeline modules
     */
    register(name, module) {

        this.modules[name] = module

    }

    /**
     * initialize modules
     */
    async init() {

        for (const name in this.modules) {

            const mod = this.modules[name]

            if (mod.init) {

                await mod.init()

            }

        }

        console.log("VisionPipeline initialized")

    }

    /**
     * start full AI pipeline
     */
    async start(frame) {

        if (this.running) return

        this.running = true

        let data = frame

        try {

            Events.emit("pipeline:start")

            for (const stage of this.stages) {

                data = await this.runStage(stage, data)

                State.update("pipeline", {
                    lastStage: stage
                })

            }

            Events.emit("pipeline:complete", data)

        }

        catch (err) {

            console.error("Pipeline Error:", err)

            Events.emit("pipeline:error", err)

        }

        finally {

            this.running = false

        }

        return data

    }

    /**
     * execute stage
     */
    async runStage(stage, input) {

        const module = this.modules[stage]

        if (!module) {

            return input

        }

        try {

            Events.emit(`stage:${stage}:start`, input)

            let result

            if (module.process) {

                result = await module.process(input)

            } else {

                result = input

            }

            Events.emit(`stage:${stage}:complete`, result)

            return result

        }

        catch (err) {

            Events.emit(`stage:${stage}:error`, err)

            throw err

        }

    }

    /**
     * stop pipeline
     */
    stop() {

        this.running = false

        Events.emit("pipeline:stop")

    }

}

const Pipeline = new VisionPipeline()

export default Pipeline
