// modules/interaction/object-select.js

import { EventBus } from "../core/events.js"
import AILogger from "../utils/ai-logger.js"

class ObjectSelect {

constructor(){
this.selected = null
}

// 🎯 select object
select(object){

this.selected = object

EventBus.emit("objectSelected", object)

AILogger.log("info","Object selected",{object})

}

// ❌ clear selection
clear(){

this.selected = null

EventBus.emit("objectCleared")

}

// 📦 get selected
get(){
return this.selected
}

}

export default new ObjectSelect()
