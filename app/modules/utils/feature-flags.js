// modules/utils/feature-flags.js

import ConfigManager from "./config-manager.js"

class FeatureFlags {

constructor(){
this.flags = structuredClone(ConfigManager.get("FEATURES") || {})
}

// 🔍 check
isEnabled(feature){

return !!this.flags[feature]

}

// 🔄 enable
enable(feature){

this.flags[feature] = true

}

// ❌ disable
disable(feature){

this.flags[feature] = false

}

// 🔁 toggle
toggle(feature){

this.flags[feature] = !this.flags[feature]

}

// ⚙️ sync with config
sync(){

this.flags = structuredClone(ConfigManager.get("FEATURES") || {})

}

// 📊 get all
getAll(){

return this.flags

}

}

export default new FeatureFlags()
