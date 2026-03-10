// ================= IMPORTS =================

import { emit } from "../core/events.js"
import { getCachedModel, cacheModel } from "../core/performance.js"

let session = null

const MODEL_PATH = "/models/vision/clip-vit-base.onnx"
const INPUT_SIZE = 224


// ================= LOAD MODEL =================

export async function loadCLIP(){

const cached = getCachedModel("clip")

if(cached){

session = cached
return session

}

emit("ai:model-loading","CLIP")

session = await ort.InferenceSession.create(
MODEL_PATH,
{
executionProviders:["webgl","wasm"]
}
)

cacheModel("clip",session)

emit("ai:model-ready","CLIP")

return session

}



// ================= EXTRACT IMAGE EMBEDDING =================

export async function extractEmbedding(imageData){

if(!session){

await loadCLIP()

}

const tensor = preprocess(imageData)

const feeds = { input:tensor }

const results = await session.run(feeds)

const embedding = results.embedding.data

emit("ai:clip-embedding",embedding)

return embedding

}



// ================= PREPROCESS =================

function preprocess(image){

const canvas = document.createElement("canvas")

canvas.width = INPUT_SIZE
canvas.height = INPUT_SIZE

const ctx = canvas.getContext("2d")

const temp = document.createElement("canvas")

temp.width = image.width
temp.height = image.height

temp.getContext("2d").putImageData(image,0,0)

ctx.drawImage(temp,0,0,INPUT_SIZE,INPUT_SIZE)

const img = ctx.getImageData(0,0,INPUT_SIZE,INPUT_SIZE)

const data = img.data

const floatData = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE)

for(let i=0;i<INPUT_SIZE*INPUT_SIZE;i++){

floatData[i] = data[i*4] / 255
floatData[i + INPUT_SIZE*INPUT_SIZE] = data[i*4+1] / 255
floatData[i + 2*INPUT_SIZE*INPUT_SIZE] = data[i*4+2] / 255

}

return new ort.Tensor(
"float32",
floatData,
[1,3,INPUT_SIZE,INPUT_SIZE]
)

}



// ================= SIMILARITY =================

export function cosineSimilarity(a,b){

let dot = 0
let normA = 0
let normB = 0

for(let i=0;i<a.length;i++){

dot += a[i] * b[i]
normA += a[i] * a[i]
normB += b[i] * b[i]

}

return dot / (Math.sqrt(normA) * Math.sqrt(normB))

}



// ================= OBJECT GUESS =================

export function guessObjectFromEmbedding(embedding, database){

let best = null
let bestScore = -Infinity

database.forEach(item=>{

const score = cosineSimilarity(
embedding,
item.embedding
)

if(score > bestScore){

bestScore = score
best = item

}

})

emit("ai:clip-match",best)

return {

name: best?.name || "unknown object",
confidence: bestScore

}

}
