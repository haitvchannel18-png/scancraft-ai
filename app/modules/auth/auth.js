import { auth, provider } from "./firebase.js"
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

class Auth {

async login(){
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
