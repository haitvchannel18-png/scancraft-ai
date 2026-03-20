// modules/utils/config.js

const CONFIG = {

APP: {
name: "ScanCraft AI",
version: "5.1",
env: "production", // development | production
debug: true,
logLevel: "info" // debug | info | warn | error
},

AI: {
maxConcurrentInference: 3,
confidenceThreshold: 0.6,
similarityThreshold: 0.7,
enableOpenWorld: true,
adaptiveLearning: true,
reasoningDepth: 2
},

MODEL: {
basePath: "/models/",
cacheEnabled: true,
preload: true,
warmup: true,
lazyLoad: true,
maxModelsInMemory: 3
},

CAMERA: {
width: 640,
height: 480,
fps: 30,
autoAdjust: true
},

PERFORMANCE: {
enableGPU: true,
targetFPS: 30,
maxQueueSize: 5,
adaptiveFPS: true,
lowPowerMode: false
},

NETWORK: {
timeout: 5000,
retryAttempts: 2,
offlineMode: true,
adaptiveQuality: true
},

UI: {
animations: true,
sound: true,
theme: "dark",
fpsCounter: false
},

FEATURES: {
voice: true,
xray: true,
3d: true,
commerce: true,
learning: true,
reconstruction: true,
depth: true
}

}

export default CONFIG
