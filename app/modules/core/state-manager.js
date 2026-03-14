/**
 * ScanCraft AI
 * Global State Manager
 * Reactive AI Application State System
 */

class StateManager {

    constructor() {

        this.state = {
            camera: null,
            frame: null,
            detections: [],
            objects: [],
            scene: null,
            ai: null,
            knowledge: null,
            viewer: null,
            ui: {},
            voice: null,
            network: null,
            cache: {}
        }

        this.listeners = {}

    }

    /**
     * Get state value
     */
    get(key) {

        return this.state[key]

    }

    /**
     * Set state value
     */
    set(key, value) {

        this.state[key] = value

        this.notify(key, value)

    }

    /**
     * Update object state
     */
    update(key, patch) {

        if (typeof this.state[key] !== "object" || this.state[key] === null) {

            this.state[key] = patch

        } else {

            this.state[key] = {
                ...this.state[key],
                ...patch
            }

        }

        this.notify(key, this.state[key])

    }

    /**
     * Subscribe to state changes
     */
    subscribe(key, callback) {

        if (!this.listeners[key]) {

            this.listeners[key] = []

        }

        this.listeners[key].push(callback)

    }

    /**
     * Notify listeners
     */
    notify(key, value) {

        if (!this.listeners[key]) return

        for (const cb of this.listeners[key]) {

            try {

                cb(value)

            } catch (err) {

                console.error("State listener error:", err)

            }

        }

    }

    /**
     * Remove listener
     */
    unsubscribe(key, callback) {

        if (!this.listeners[key]) return

        this.listeners[key] =
            this.listeners[key].filter(cb => cb !== callback)

    }

    /**
     * Reset state
     */
    reset() {

        this.state = {}

        this.listeners = {}

    }

}

const State = new StateManager()

export default State
