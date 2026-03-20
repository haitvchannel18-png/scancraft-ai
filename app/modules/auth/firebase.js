import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

// 🔥 CONFIG (तूने सही डाला है)
const firebaseConfig = {
  apiKey: "AIzaSyBZeGyBzzPvBZA-48wDO_X8oyI9BrFx83Q",
  authDomain: "scancraft-ai-bb44c.firebaseapp.com",
  projectId: "scancraft-ai-bb44c",
  storageBucket: "scancraft-ai-bb44c.firebasestorage.app",
  messagingSenderId: "111231789622",
  appId: "1:111231789622:web:b0d35dabff675427f9c697"
}

// 🚀 INIT
const app = initializeApp(firebaseConfig)

// 🔐 AUTH
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
