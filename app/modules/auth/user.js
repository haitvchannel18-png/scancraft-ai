// modules/auth/user.js

import Session from "./session.js"

class User {

constructor(){

this.localKey = "scancraft_user"
this.user = null

this.load()

}

// ==============================
// 🔄 LOAD USER (FAST + SAFE)
// ==============================

load(){

try{

// 🔥 session priority
const sessionUser = Session.get()

if(sessionUser){

this.user = {
uid: sessionUser.uid,
name: sessionUser.displayName || "User",
email: sessionUser.email || null,
isPro: this.getLocalPro(sessionUser.uid)
}

}else{

const local = localStorage.getItem(this.localKey)

if(local){
this.user = JSON.parse(local)
}

}

}catch(e){

console.error("💀 User load error:", e)
this.user = null

}

}

// ==============================
// 💾 SAVE USER
// ==============================

save(){

if(!this.user) return

try{
localStorage.setItem(this.localKey, JSON.stringify(this.user))
}catch(e){
console.error("💀 Save error:", e)
}

}

// ==============================
// 🧠 LOCAL PRO CACHE
// ==============================

getLocalPro(uid){

const proKey = "scancraft_pro_" + uid
return localStorage.getItem(proKey) === "true"

}

saveLocalPro(uid){

const proKey = "scancraft_pro_" + uid
localStorage.setItem(proKey, "true")

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
// 💎 PRO SYSTEM (ADVANCED)
// ==============================

isPro(){
return this.user?.isPro === true
}

setPro(){

if(!this.user) return

this.user.isPro = true

// 🔥 save local + cache
this.saveLocalPro(this.user.uid)
this.save()

console.log("🔥 PRO ACTIVATED")

}

// ==============================
// 🚀 GUEST MODE (OFFLINE SAFE)
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

try{
localStorage.removeItem(this.localKey)
}catch(e){
console.error("💀 Logout error:", e)
}

}

// ==============================
// 🔄 SYNC WITH FIREBASE SESSION
// ==============================

syncWithSession(){

const sessionUser = Session.get()

if(!sessionUser) return

this.user = {
uid: sessionUser.uid,
name: sessionUser.displayName || "User",
email: sessionUser.email || null,
isPro: this.getLocalPro(sessionUser.uid)
}

this.save()

console.log("🔄 User synced")

}

}

export default new User()
