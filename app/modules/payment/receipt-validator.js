// modules/payment/receipt-validator.js

class ReceiptValidator {

validate(receipt){

// ⚠️ future: server validation

if(!receipt) return false

return true

}

}

export default new ReceiptValidator()
