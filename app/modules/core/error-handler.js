/**
 * ScanCraft AI
 * Global Error Handler
 * Production grade error management
 */

import Events from "./events.js"

class ErrorHandler {

    constructor() {

        this.errors = []

        this.maxErrors = 200

    }

    /**
     * capture error
     */
    capture(error, context = "unknown") {

        const record = {
            message: error?.message || String(error),
            stack: error?.stack || null,
            context: context,
            time: Date.now()
        }

        this.errors.push(record)

        if (this.errors.length > this.maxErrors) {

            this.errors.shift()

        }

        console.error("ScanCraft Error:", record)

        Events.emit("system:error", record)

    }

    /**
     * wrap async functions safely
     */
    async safeAsync(fn, context = "async") {

        try {

            return await fn()

        }

        catch (err) {

            this.capture(err, context)

            return null

        }

    }

    /**
     * wrap sync functions safely
     */
    safe(fn, context = "sync") {

        try {

            return fn()

        }

        catch (err) {

            this.capture(err, context)

            return null

        }

    }

    /**
     * global browser error capture
     */
    initGlobalHandlers() {

        window.addEventListener("error", (event) => {

            this.capture(event.error || event.message, "window")

        })

        window.addEventListener("unhandledrejection", (event) => {

            this.capture(event.reason, "promise")

        })

    }

    /**
     * get error history
     */
    getErrors() {

        return this.errors

    }

    /**
     * clear errors
     */
    clear() {

        this.errors = []

    }

}

const ErrorManager = new ErrorHandler()

export default ErrorManager
