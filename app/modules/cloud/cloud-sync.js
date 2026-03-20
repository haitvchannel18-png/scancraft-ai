// modules/cloud/cloud-sync.js

import { db } from "../auth/firebase.js"
import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

class CloudSync {

// 💾 SAVE DATA
async save(userId, key, data){

await setDoc(doc(db, key, userId), {
data,
updatedAt: Date.now()
})

}

// 📥 GET DATA
async get(userId, key){

const ref = doc(db, key, userId)
const snap = await getDoc(ref)

if(snap.exists()){
return snap.data().data
}

return null

}

}

export default new CloudSync()
