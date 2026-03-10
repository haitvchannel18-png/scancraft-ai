// ================= IMPORTS =================

import { logAI } from "../utils/AILogger.js"

let clipSession = null

const MODEL_PATH = "/models/vision/clip-vit-base.onnx"
const INPUT_SIZE = 224


// ================= LOAD MODEL =================

export async function loadFeatureModel(){

if(clipSession) return clipSession

logAI("Loading CLIP feature model")

clipSession = await ort.InferenceSession.create(

MODEL_PATH,
{executionProviders:["webgl","wasm"]}

)

logAI("Feature model ready")

return clipSession

}


// ================= MAIN FEATURE EXTRACTION =================

export async function extractFeatures(imageData){

if(!clipSession){

await loadFeatureModel()

}

const clipVector = await extractClipEmbedding(imageData)

const colorVector = extractColorHistogram(imageData)

const shapeVector = extractShapeFeatures(imageData)

const textureVector = extractTextureFeatures(imageData)

return combineFeatures(
clipVector,
colorVector,
shapeVector,
textureVector
)

}


// ================= CLIP EMBEDDING =================

async function extractClipEmbedding(imageData){

const tensor = preprocess(imageData)

const feeds = { pixel_values: tensor }

const result = await clipSession.run(feeds)

return normalize(result.last_hidden_state.data)

}


// ================= IMAGE PREPROCESS =================

function preprocess(imageData){

const width = imageData.width
const height = imageData.height
const data = imageData.data

const tensor = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE)

for(let y=0;y<INPUT_SIZE;y++){

for(let x=0;x<INPUT_SIZE;x++){

const srcX = Math.floor(x * width / INPUT_SIZE)
const srcY = Math.floor(y * height / INPUT_SIZE)

const idx = (srcY * width + srcX) * 4

const r = data[idx] / 255
const g = data[idx+1] / 255
const b = data[idx+2] / 255

const pos = y * INPUT_SIZE + x

tensor[pos] = r
tensor[pos + INPUT_SIZE*INPUT_SIZE] = g
tensor[pos + INPUT_SIZE*INPUT_SIZE*2] = b

}

}

return new ort.Tensor("float32",tensor,[1,3,INPUT_SIZE,INPUT_SIZE])

}


// ================= COLOR HISTOGRAM =================

function extractColorHistogram(imageData){

const bins = 16

const hist = new Float32Array(bins*3)

const data = imageData.data

for(let i=0;i<data.length;i+=4){

const r = data[i]
const g = data[i+1]
const b = data[i+2]

hist[Math.floor(r/16)]++
hist[bins + Math.floor(g/16)]++
hist[bins*2 + Math.floor(b/16)]++

}

return normalize(hist)

}


// ================= SHAPE FEATURES =================

function extractShapeFeatures(imageData){

const width = imageData.width
const height = imageData.height

const aspect = width / height

const area = width * height

const vector = new Float32Array(3)

vector[0] = aspect
vector[1] = Math.sqrt(area)
vector[2] = width / (width + height)

return normalize(vector)

}


// ================= TEXTURE FEATURES =================

function extractTextureFeatures(imageData){

const data = imageData.data

let contrast = 0
let energy = 0

for(let i=0;i<data.length;i+=4){

const gray = (data[i] + data[i+1] + data[i+2]) / 3

contrast += gray * gray
energy += Math.abs(gray)

}

const vec = new Float32Array(2)

vec[0] = contrast
vec[1] = energy

return normalize(vec)

}


// ================= FEATURE COMBINATION =================

function combineFeatures(...vectors){

let totalLength = 0

vectors.forEach(v => totalLength += v.length)

const combined = new Float32Array(totalLength)

let offset = 0

vectors.forEach(v => {

combined.set(v, offset)

offset += v.length

})

return normalize(combined)

}


// ================= NORMALIZATION =================

function normalize(vec){

let sum = 0

for(let i=0;i<vec.length;i++){

sum += vec[i]*vec[i]

}

const norm = Math.sqrt(sum)

const out = new Float32Array(vec.length)

for(let i=0;i<vec.length;i++){

out[i] = vec[i] / norm

}

return out

}
