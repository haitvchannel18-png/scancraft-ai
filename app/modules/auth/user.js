// modules/auth/user.js

import Session from "./session.js"

class User {

getId(){
return Session.get()?.uid || null
}

getName(){
return Session.get()?.displayName || "Guest"
}

getEmail(){
return Session.get()?.email || null
}

isLoggedIn(){
return !!Session.get()
}

}

export default new User()
