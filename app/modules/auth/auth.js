// modules/auth/auth.js

import { auth } from "./firebase.js"
import {
GoogleAuthProvider,
signInWithPopup,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"

class Auth {

async login(){

const provider = new GoogleAuthProvider()
const result = await signInWithPopup(auth, provider)

return result.user

}

logout(){
return signOut(auth)
}

onChange(callback){
onAuthStateChanged(auth, callback)
}

}

export default new Auth()
