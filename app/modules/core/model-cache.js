/**
 * ScanCraft AI
 * Model Cache
 * Stores inference results for faster responses
 */

import Events from "./events.js"

class ModelCache {

    constructor(){

        this.cache = new Map()

        this.maxSize = 200

    }

    /**
     * generate cache key
     */
    createKey(model,input){

        return model + ":" + JSON.stringify(input).slice(0,200)

    }

    /**
     * get cached result
     */
    get(model,input){

        const key = this.createKey(model,input)

        if(this.cache.has(key)){

            const item = this.cache.get(key)

            item.lastUsed = Date.now()

            Events.emit("cache:hit",model)

            return item.value

        }

        Events.emit("cache:miss",model)

        return null

    }

    /**
     * store result
     */
    set(model,input,value){

        const key = this.createKey(model,input)

        if(this.cache.size >= this.maxSize){

            this.cleanup()

        }

        this.cache.set(key,{
            value,
            lastUsed:Date.now()
        })

        Events.emit("cache:set",model)

    }

    /**
     * remove oldest items
     */
    cleanup(){

        const entries = Array.from(this.cache.entries())

        entries.sort((a,b)=>a[1].lastUsed-b[1].lastUsed)

        const removeCount = Math.floor(this.maxSize*0.25)

        for(let i=0;i<removeCount;i++){

            this.cache.delete(entries[i][0])

        }

        Events.emit("cache:cleanup")

    }

    /**
     * clear cache
     */
    clear(){

        this.cache.clear()

    }

    /**
     * cache stats
     */
    stats(){

        return {
            size:this.cache.size,
            maxSize:this.maxSize
        }

    }

}

const Cache = new ModelCache()

export default Cache
