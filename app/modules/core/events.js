/**
 * ScanCraft AI
 * Global Event Bus
 * High performance event system
 */

class EventBus {

    constructor() {

        this.events = {}

    }

    /**
     * register event listener
     */
    on(event, callback) {

        if (!this.events[event]) {

            this.events[event] = []

        }

        this.events[event].push(callback)

    }

    /**
     * register one time event
     */
    once(event, callback) {

        const wrapper = (data) => {

            callback(data)

            this.off(event, wrapper)

        }

        this.on(event, wrapper)

    }

    /**
     * remove listener
     */
    off(event, callback) {

        if (!this.events[event]) return

        this.events[event] =
            this.events[event].filter(cb => cb !== callback)

    }

    /**
     * emit event
     */
    emit(event, data = null) {

        if (!this.events[event]) return

        for (const cb of this.events[event]) {

            try {

                cb(data)

            } catch (err) {

                console.error("EventBus error:", err)

            }

        }

    }

    /**
     * remove all listeners
     */
    clear(event) {

        if (event) {

            delete this.events[event]

        } else {

            this.events = {}

        }

    }

}

const Events = new EventBus()

export default Events
