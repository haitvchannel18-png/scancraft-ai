// modules/auth/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

// 🔥 TERA FIREBASE CONFIG
const firebaseConfig = {

apiKey: "AIzaSyBZeGyBzzPvBZA-48wDO_X8oyI9BrFx83Q",
authDomain: "scancraft-ai-bb44c.firebaseapp.com",
projectId: "scancraft-ai-bb44c",
storageBucket: "scancraft-ai-bb44c.firebasestorage.app",
messagingSenderId: "111231789622",
appId: "1:111231789622:web:b0d35dabff675427f9c697"

}

// ⚡ INIT FIREBASE
const app = initializeApp(firebaseConfig)

// 🔥 EXPORT
export const auth = getAuth(app)
export const db = getFirestore(app)

console.log("🔥 Firebase Connected")
