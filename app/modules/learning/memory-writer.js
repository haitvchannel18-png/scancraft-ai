// modules/learning/memory-writer.js

import AILogger from "../utils/ai-logger.js"

class MemoryWriter {

constructor(){
this.memory = []
}

// 🔥 store new knowledge
save(entry){

this.memory.push({
...entry,
timestamp: Date.now()
})

AILogger.log("info","Memory saved",entry)

}

// 🔍 get memory
getAll(){
return this.memory
}

}

export default new MemoryWriter()
