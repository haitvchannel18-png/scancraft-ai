// modules/cloud/user-data.js

import CloudSync from "./cloud-sync.js"

class UserData {

// 💾 SAVE USER PROFILE
async saveProfile(user){

await CloudSync.save(user.uid, "profile", {
name: user.displayName,
email: user.email,
photo: user.photoURL,
lastLogin: Date.now()
})

}

// 📥 GET PROFILE
async getProfile(userId){

return await CloudSync.get(userId, "profile")

}

}

export default new UserData()
