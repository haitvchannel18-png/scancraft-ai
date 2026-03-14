/**
 * ScanCraft AI
 * Inference Queue Manager
 * Controls AI model execution order
 */

import Events from "./events.js"

class InferenceQueue {

    constructor() {

        this.queue = []
        this.running = false
        this.maxParallel = 2
        this.active = 0

    }

    /**
     * add task to queue
     */
    add(task, label = "ai-task") {

        return new Promise((resolve, reject) => {

            this.queue.push({
                task,
                resolve,
                reject,
                label
            })

            this.process()

        })

    }

    /**
     * process queue
     */
    async process() {

        if (this.running) return

        this.running = true

        while (this.queue.length > 0 && this.active < this.maxParallel) {

            const item = this.queue.shift()

            this.active++

            this.execute(item)

        }

        this.running = false

    }

    /**
     * execute task
     */
    async execute(item) {

        try {

            Events.emit("inference:start", item.label)

            const result = await item.task()

            item.resolve(result)

            Events.emit("inference:complete", item.label)

        }

        catch (err) {

            item.reject(err)

            Events.emit("inference:error", err)

        }

        finally {

            this.active--

            this.process()

        }

    }

    /**
     * clear queue
     */
    clear() {

        this.queue = []

    }

    /**
     * queue size
     */
    size() {

        return this.queue.length

    }

}

const InferenceQueueManager = new InferenceQueue()

export default InferenceQueueManager
