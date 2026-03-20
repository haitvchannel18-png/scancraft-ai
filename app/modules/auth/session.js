// modules/auth/session.js

class Session {

constructor(){
this.user = null
}

// 👤 set user
set(user){
this.user = user
localStorage.setItem("user_session", JSON.stringify(user))
}

// 📥 get user
get(){

if(this.user) return this.user

const data = localStorage.getItem("user_session")

if(data){
this.user = JSON.parse(data)
}

return this.user
}

// ❌ clear
clear(){
this.user = null
localStorage.removeItem("user_session")
}

}

export default new Session()
