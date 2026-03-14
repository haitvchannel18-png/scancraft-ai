/**
 * ScanCraft AI
 * Performance Monitor
 * Tracks FPS, inference latency, module timing
 */

import Events from "./events.js"

class PerformanceMonitor {

    constructor() {

        this.metrics = {
            fps: 0,
            frameTime: 0,
            inferenceTime: 0,
            pipelineTime: 0,
            memory: 0,
            modules: {}
        }

        this.frameCount = 0
        this.lastTime = performance.now()

    }

    /**
     * start timing
     */
    start(label) {

        if (!this.metrics.modules[label]) {

            this.metrics.modules[label] = {}

        }

        this.metrics.modules[label].start = performance.now()

    }

    /**
     * end timing
     */
    end(label) {

        const mod = this.metrics.modules[label]

        if (!mod || !mod.start) return

        mod.time = performance.now() - mod.start

        Events.emit("performance:module", {
            module: label,
            time: mod.time
        })

    }

    /**
     * track frame rate
     */
    frame() {

        this.frameCount++

        const now = performance.now()

        const delta = now - this.lastTime

        if (delta >= 1000) {

            this.metrics.fps = this.frameCount

            this.frameCount = 0

            this.lastTime = now

            Events.emit("performance:fps", this.metrics.fps)

        }

    }

    /**
     * pipeline latency
     */
    pipelineStart() {

        this.pipelineTimer = performance.now()

    }

    pipelineEnd() {

        this.metrics.pipelineTime =
            performance.now() - this.pipelineTimer

        Events.emit("performance:pipeline", this.metrics.pipelineTime)

    }

    /**
     * inference timing
     */
    inferenceStart() {

        this.inferenceTimer = performance.now()

    }

    inferenceEnd() {

        this.metrics.inferenceTime =
            performance.now() - this.inferenceTimer

        Events.emit("performance:ai", this.metrics.inferenceTime)

    }

    /**
     * memory usage
     */
    updateMemory() {

        if (performance.memory) {

            this.metrics.memory = performance.memory.usedJSHeapSize

            Events.emit("performance:memory", this.metrics.memory)

        }

    }

    /**
     * get performance stats
     */
    getStats() {

        return this.metrics

    }

}

const Performance = new PerformanceMonitor()

export default Performance
