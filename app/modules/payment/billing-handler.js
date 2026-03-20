// modules/payment/billing-handler.js

import PaymentManager from "./payment-manager.js"

class BillingHandler {

init(){

// Android se callback
window.onPurchaseSuccess = (data)=>{

console.log("✅ Purchase Success:", data)

PaymentManager.unlockPro()

}

window.onPurchaseFailed = (err)=>{

console.error("❌ Purchase Failed:", err)

}

}

}

export default new BillingHandler()
