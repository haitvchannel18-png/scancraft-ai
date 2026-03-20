// modules/auth/session.js

class Session {

constructor(){
this.key = "user_session"
this.user = null
}

// ==============================
// 👤 SET USER (SAFE)
// ==============================

set(user){

if(!user) return

this.user = user

try{

const sessionData = {
data: user,
time: Date.now() // 🔥 future expiry use
}

localStorage.setItem(this.key, JSON.stringify(sessionData))

}catch(e){

console.error("💀 Session save error:", e)

}

}

// ==============================
// 📥 GET USER (SAFE + CACHE)
// ==============================

get(){

if(this.user) return this.user

try{

const raw = localStorage.getItem(this.key)

if(!raw) return null

const parsed = JSON.parse(raw)

// 🔥 optional expiry (7 days)
const maxAge = 7 * 24 * 60 * 60 * 1000

if(Date.now() - parsed.time > maxAge){

this.clear()
return null

}

this.user = parsed.data

return this.user

}catch(e){

console.error("💀 Session load error:", e)
this.clear()
return null

}

}

// ==============================
// ❌ CLEAR SESSION
// ==============================

clear(){

this.user = null

try{
localStorage.removeItem(this.key)
}catch(e){
console.error("💀 Session clear error:", e)
}

}

// ==============================
// 🔄 UPDATE PARTIAL DATA
// ==============================

update(data){

if(!this.user) return

this.user = {
...this.user,
...data
}

this.set(this.user)

}

}

export default new Session()
