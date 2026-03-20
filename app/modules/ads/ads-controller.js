// modules/ads/ads-controller.js

import User from "../auth/user.js"

class AdsController {

constructor(){

this.enabled = true

this.init()

}

// ==============================
// 🚀 INIT
// ==============================

init(){

// 💎 Pro user → ads OFF
if(User.isPro()){
this.enabled = false
}

}

// ==============================
// 📊 SHOULD SHOW?
// ==============================

shouldShow(){

return this.enabled

}

// ==============================
// 🎯 SHOW BANNER
// ==============================

showBanner(){

if(!this.shouldShow()) return

console.log("📢 Banner Ad")

// 🔥 future: AdMob banner

}

// ==============================
// 💥 SHOW INTERSTITIAL
// ==============================

showInterstitial(){

if(!this.shouldShow()) return

console.log("📢 Interstitial Ad")

// 🔥 future: AdMob interstitial

}

// ==============================
// 🔄 REFRESH AFTER UPGRADE
// ==============================

disableAds(){

this.enabled = false
console.log("🚫 Ads Disabled (PRO USER)")

}

}

export default new AdsController()
