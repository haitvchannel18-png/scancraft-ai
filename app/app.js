/* =========================
   CONFIG
========================= */

const AI_PROXY_URL = "https://your-ai-proxy-url.workers.dev"; // change
const UNSPLASH_KEY = "demo"; // optional if you have key

/* =========================
   GLOBAL STATE
========================= */

let video = document.getElementById("camera");
let canvas = document.getElementById("overlay");
let ctx = canvas.getContext("2d");

let scanBtn = document.getElementById("scanBtn");
let voiceBtn = document.getElementById("voiceBtn");

let model;
let scanning = false;

/* =========================
   SOUND SYSTEM
========================= */

const scanSound = new Howl({
src:["sounds/scan.mp3"],
volume:0.5
});

const detectSound = new Howl({
src:["sounds/detect.mp3"],
volume:0.4
});

const clickSound = new Howl({
src:["sounds/click.mp3"],
volume:0.4
});

/* =========================
   CAMERA START
========================= */

async function startCamera(){

try{

const stream = await navigator.mediaDevices.getUserMedia({
video:{facingMode:"environment"},
audio:false
});

video.srcObject = stream;

}catch(e){

alert("Camera access denied");

}

}

startCamera();

/* =========================
   LOAD AI MODEL
========================= */

async function loadModel(){

model = await cocoSsd.load();

console.log("AI Model Loaded");

}

loadModel();

/* =========================
   CANVAS RESIZE
========================= */

function resizeCanvas(){

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

}

video.addEventListener("loadeddata", resizeCanvas);

/* =========================
   SCAN OBJECTS
========================= */

async function detectObjects(){

if(!model || !scanning) return;

const predictions = await model.detect(video);

ctx.clearRect(0,0,canvas.width,canvas.height);

predictions.forEach(pred=>{

if(pred.score > 0.6){

drawBox(pred);

}

});

requestAnimationFrame(detectObjects);

}

/* =========================
   DRAW BOUNDING BOX
========================= */

function drawBox(pred){

let [x,y,w,h] = pred.bbox;

ctx.strokeStyle = "#ff3cac";
ctx.lineWidth = 3;
ctx.strokeRect(x,y,w,h);

ctx.fillStyle = "#ff3cac";
ctx.font = "16px sans-serif";

ctx.fillText(
`${pred.class} ${(pred.score*100).toFixed(1)}%`,
x,
y>20?y-5:20
);

}

/* =========================
   SCAN BUTTON
========================= */

scanBtn.addEventListener("click",()=>{

clickSound.play();

if(!scanning){

scanning = true;

scanSound.play();

detectObjects();

scanBtn.innerText = "Scanning...";

}else{

scanning = false;

scanBtn.innerText = "Scan Object";

}

});

/* =========================
   AI ASK SYSTEM
========================= */

async function askAI(question){

let response = await fetch(AI_PROXY_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:question
})
});

let data = await response.json();

return data.reply;

}

/* =========================
   VOICE RECOGNITION
========================= */

function startVoice(){

const recognition = new (window.SpeechRecognition ||
window.webkitSpeechRecognition)();

recognition.lang="en-US";

recognition.start();

recognition.onresult = async function(e){

let text = e.results[0][0].transcript;

addChat("You",text);

let reply = await askAI(text);

addChat("AI",reply);

speak(reply);

};

}

/* =========================
   VOICE BUTTON
========================= */

if(voiceBtn){

voiceBtn.addEventListener("click",()=>{

clickSound.play();

startVoice();

});

}

/* =========================
   SPEECH SYNTHESIS
========================= */

function speak(text){

let speech = new SpeechSynthesisUtterance(text);

speech.lang="en-US";

speech.rate=1;

speechSynthesis.speak(speech);

}

/* =========================
   CHAT UI
========================= */

function addChat(role,text){

let box = document.getElementById("aiInfo");

if(!box) return;

let div = document.createElement("div");

div.innerHTML = `<b>${role}:</b> ${text}`;

box.appendChild(div);

}

/* =========================
   WIKIPEDIA INFO
========================= */

async function fetchWiki(term){

let url =
`https://en.wikipedia.org/api/rest_v1/page/summary/${term}`;

let res = await fetch(url);

let data = await res.json();

return data.extract;

}

/* =========================
   UNSPLASH IMAGES
========================= */

async function fetchImages(term){

let url =
`https://api.unsplash.com/search/photos?query=${term}&per_page=6&client_id=${UNSPLASH_KEY}`;

let res = await fetch(url);

let data = await res.json();

displayGallery(data.results);

}

/* =========================
   IMAGE GALLERY
========================= */

function displayGallery(images){

let gallery = document.getElementById("gallery");

if(!gallery) return;

gallery.innerHTML="";

images.forEach(img=>{

let i=document.createElement("img");

i.src=img.urls.small;

gallery.appendChild(i);

});

}

/* =========================
   INDEXEDDB HISTORY
========================= */

let db;

let request = indexedDB.open("ScanHistory",1);

request.onupgradeneeded = function(e){

db = e.target.result;

db.createObjectStore("objects",{autoIncrement:true});

};

request.onsuccess = function(e){

db = e.target.result;

};

/* =========================
   SAVE SCAN
========================= */

function saveScan(object){

let tx = db.transaction(["objects"],"readwrite");

let store = tx.objectStore("objects");

store.add(object);

}

/* =========================
   GSAP UI ANIMATIONS
========================= */

window.addEventListener("load",()=>{

gsap.from(".logo",{
y:-30,
opacity:0,
duration:1
});

gsap.from(".scan-btn",{
scale:0,
duration:1,
delay:0.4
});

});
