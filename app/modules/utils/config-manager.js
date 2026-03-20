// modules/utils/config.js

const CONFIG = {

APP: {
name: "ScanCraft AI",
version: "5.1",
env: "production", // development | production
debug: true
},

AI: {
maxConcurrentInference: 2,
confidenceThreshold: 0.6,
similarityThreshold: 0.7,
enableOpenWorld: true
},

MODEL: {
basePath: "/models/",
cacheEnabled: true,
preload: true,
warmup: true
},

CAMERA: {
width: 640,
height: 480,
fps: 30
},

PERFORMANCE: {
enableGPU: true,
targetFPS: 30,
maxQueueSize: 5
},

NETWORK: {
timeout: 5000,
retryAttempts: 2,
offlineMode: true
},

UI: {
animations: true,
sound: true,
theme: "dark"
},

FEATURES: {
voice: true,
xray: true,
3d: true,
commerce: true,
learning: true
}

}

export default CONFIG
