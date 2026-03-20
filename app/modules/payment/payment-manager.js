// modules/payment/payment-manager.js

import User from "../auth/user.js"
import AdsController from "../ads/ads-controller.js"

class PaymentManager {

constructor(){
this.isProcessing = false
}

// 🔥 start purchase
async startPurchase(){

if(this.isProcessing) return

this.isProcessing = true

try{

// ⚠️ Web version fallback
if(!window.AndroidBilling){

console.warn("⚠️ Running in Web → fallback mode")

// test unlock (dev only)
this.unlockPro()
return

}

// 📱 call native android billing
window.AndroidBilling.purchase("scancraft_pro")

}catch(e){

console.error("💀 Payment Error:", e)

}finally{

this.isProcessing = false

}

}

// 🔓 unlock
unlockPro(){

User.setPro()

AdsController.disableAds()

console.log("🔥 PRO ACTIVATED")

}

}

export default new PaymentManager()
