// modules/utils/helpers.js

// ⏱️ delay
export const sleep = (ms) => new Promise(res => setTimeout(res, ms))

// 📏 normalize (0–1)
export function normalize(value, min, max){
return (value - min) / (max - min)
}

// 🎯 clamp
export function clamp(value, min, max){
return Math.max(min, Math.min(max, value))
}

// 🔢 random id
export function uid(){
return Math.random().toString(36).substring(2, 10)
}

// 📊 average
export function average(arr){
if(!arr.length) return 0
return arr.reduce((a,b)=>a+b,0) / arr.length
}

// 🧠 cosine similarity
export function cosineSimilarity(a,b){

let dot = 0, magA = 0, magB = 0

for(let i=0;i<a.length;i++){
dot += a[i]*b[i]
magA += a[i]*a[i]
magB += b[i]*b[i]
}

magA = Math.sqrt(magA)
magB = Math.sqrt(magB)

return dot / (magA * magB)

}

// 📦 debounce
export function debounce(fn, delay){

let t

return (...args)=>{
clearTimeout(t)
t = setTimeout(()=>fn(...args), delay)
}

}

// ⚡ throttle
export function throttle(fn, limit){

let waiting = false

return (...args)=>{

if(!waiting){
fn(...args)
waiting = true

setTimeout(()=>waiting=false, limit)
}

}

}
