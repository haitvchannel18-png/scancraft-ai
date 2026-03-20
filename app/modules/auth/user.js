// modules/auth/user.js

import Session from "./session.js"

class User {

constructor(){

this.localKey = "scancraft_user"
this.user = null

this.load()

}

// ==============================
// 🔄 LOAD USER (FAST CACHE)
// ==============================

load(){

// 🔥 priority: session → local

const sessionUser = Session.get()

if(sessionUser){

this.user = {
uid: sessionUser.uid,
name: sessionUser.displayName || "User",
email: sessionUser.email || null,
isPro: false // default
}

}else{

const local = localStorage.getItem(this.localKey)

if(local){
this.user = JSON.parse(local)
}

}

}

// ==============================
// 💾 SAVE USER
// ==============================

save(){

if(this.user){
localStorage.setItem(this.localKey, JSON.stringify(this.user))
}

}

// ==============================
// 👤 GETTERS
// ==============================

get(){

return this.user

}

getId(){

return this.user?.uid || null

}

getName(){

return this.user?.name || "Guest"

}

getEmail(){

return this.user?.email || null

}

isLoggedIn(){

return !!this.user?.uid

}

// ==============================
// 💎 PRO SYSTEM
// ==============================

isPro(){

return this.user?.isPro === true

}

setPro(){

if(!this.user) return

this.user.isPro = true
this.save()

console.log("🔥 PRO ACTIVATED")

}

// ==============================
// 🚀 CREATE GUEST USER (OFFLINE)
// ==============================

createGuest(){

this.user = {
uid: "guest_" + Date.now(),
name: "Guest",
email: null,
isPro: false
}

this.save()

return this.user

}

// ==============================
// 🔐 LOGOUT
// ==============================

logout(){

this.user = null
localStorage.removeItem(this.localKey)

}

// ==============================
// 🔄 REFRESH FROM SESSION
// ==============================

syncWithSession(){

const sessionUser = Session.get()

if(sessionUser){

this.user = {
uid: sessionUser.uid,
name: sessionUser.displayName,
email: sessionUser.email,
isPro: this.user?.isPro || false
}

this.save()

}

}

}

export default new User()
