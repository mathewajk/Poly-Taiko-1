let images = {
  don: {name: "don", img: null},
 maru: {name: "maru", img: null},
  tsu: {name: "tsu", img: null},
   ka: {name: "ka", img: null},
maruPlay: {name: "maru_trig", img: null}, 
donPlay: {name: "don_trig", img: null},
tsuPlay: {name: "tsu_trig", img: null},
kaPlay: {name: "ka_trig", img: null},
title: {name: "name", img: null},
playOff: {name: "play", img: null},
playOn: {name: "play_beat", img: null},
hLine: {name: "line", img: null},
vLine: {name: "lineV", img: null}
};

// Global controls
let playButton = new PlayButton();
let sequences = [];

let sequencei;
let sequence;

let mouseFrames = 0;

function windowResized() {
resizeInterface(sequence);
}

function preload(){

lato = loadFont("assets/fonts/Lato-Regular.ttf");
edo = loadFont("assets/fonts/edo.ttf");

Object.keys(images).forEach((key) => {
images[key].img = loadImage('assets/images/' + images[key].name + '.png');
})

drums.forEach((drum) => {
drum.img = loadImage('assets/images/' + drum.name + '.png');
});

soundFormats('mp3', 'ogg');

drums[0].samples = [
loadSound('assets/samples/shime_001'),
loadSound('assets/samples/shime_002'),
loadSound('assets/samples/shime_003'),
loadSound('assets/samples/shime_004'),
loadSound('assets/samples/shime_005')
];

drums[0].samples_ka = [
loadSound('assets/samples/shime_ka_001'),
loadSound('assets/samples/shime_ka_002'),
loadSound('assets/samples/shime_ka_003'),
loadSound('assets/samples/shime_ka_004')
];

drums[1].samples = [
loadSound('assets/samples/nagado_001'),
loadSound('assets/samples/nagado_002'),
loadSound('assets/samples/nagado_003'),
loadSound('assets/samples/nagado_004'),
loadSound('assets/samples/nagado_005')
];

drums[1].samples_ka = [
loadSound('assets/samples/nagado_ka_001'),
loadSound('assets/samples/nagado_ka_002'),
loadSound('assets/samples/nagado_ka_003'),
loadSound('assets/samples/nagado_ka_004')
];

drums[2].samples = [
loadSound('assets/samples/odaiko_001'),
loadSound('assets/samples/odaiko_002'),
loadSound('assets/samples/odaiko_003'),
loadSound('assets/samples/odaiko_004'),
loadSound('assets/samples/odaiko_005')
];

drums[2].samples_ka = [
loadSound('assets/samples/odaiko_ka_001'),
loadSound('assets/samples/odaiko_ka_002'),
loadSound('assets/samples/odaiko_ka_003'),
loadSound('assets/samples/odaiko_ka_004')
];
}

function setup() {

textFont(lato);

createCanvas(canvasWidth, canvasHeight);

for(let i = 0; i < 8; i++) {
let seq = new Sequence([new Instrument(0),
                      new Instrument(1), 
                      new Instrument(2)]);
sequences.push(seq);
}

sequencei = 0;
sequence = sequences[0];

playButton = new PlayButton();
playButton.color = sequence.instruments[0].color;

setCanvasSize(sequence); 
resizeInterface(sequence); 
}

function draw() {

background(220);
drawInterfaceBounds();
drawInterfaceLabels()

cursor(ARROW);

let beatDuration = 60.0/bpm * 1000;
globalDelta = deltaTime;

sequence.draw(bpm, globalInterval, playing);

if(playing) {
globalInterval += globalDelta;
if(globalInterval >= beatDuration) {      
 globalInterval = beatDuration - globalInterval;
}
}

playButton.draw(globalInterval);
checkCollisions();
}

function changeSequence(i) {

let delay = !playing ? 0 : 60.0/bpm * 1000 - globalInterval;

sequence.instruments.forEach((instrument) => {
instrument.reset();
setTimeout(() => {
 instrument.turnOff();
}, delay);
});

sequencei = i;
sequence = sequences[i];
sequence.setup();
resizeInterface();

}

function checkCollisions() {
let xo = sequence.xOffset;
let xs = canvasXStep;
let ys = canvasYStep;

if(rectCollision(mouseX, mouseY, xo + xs * 2.75, ys * 1.5, xs/3, xs/3))
{
cursor(CROSS);
}

if(rectCollision(mouseX, mouseY, xo + xs * 4, ys * 1.5, xs/3, xs/3)) {
cursor(CROSS);
}

if(rectCollision(mouseX, mouseY, xo + xs * 0.5, ys * 1.5, xs/3, xs/3)) {
cursor(CROSS);
if(mouseIsPressed) {
 mouseFrames++;
 if(mouseFrames >= 10) bpm--;
} else { mouseFrames = 0 }
}

if(rectCollision(mouseX, mouseY, xo + xs * 1.75, ys * 1.5, xs/3, xs/3)) {
cursor(CROSS);
if(mouseIsPressed) {
 mouseFrames++;
 if(mouseFrames >= 10) bpm++;
} else { mouseFrames = 0 }
}

for(let i=0; i < 8; i++) {
if(rectCollision(mouseX, mouseY, xo + xs * 9.9 + xs/1.5 * i, ys * 1.75, xs/3, xs/3)) {
cursor(CROSS);
}
}
}

function mouseClicked() {

let xo = sequence.xOffset;
let xs = canvasXStep;
let ys = canvasYStep;
let beatDuration = 60.0/bpm * 1000;

for(let i=0; i < 8; i++) {
let delay = !playing ? 0 : 60.0/bpm * 1000 - globalInterval;
if(rectCollision(mouseX, mouseY, xo + xs * 9.9 + xs/1.5 * i, ys * 1.75, xs/3, xs/3)) {
 setTimeout(() => {  
   changeSequence(i);
 }, delay);
 return;
}
}

sequence.instruments.forEach((instrument) => {
instrument.checkCollisions();
});

if(sequence.colliding != null) {
sequence.handleCollision();
}

if(dist(mouseX, mouseY, playButton.x, playButton.y) <= playButton.c/2) {
togglePlayback();
}

if(rectCollision(mouseX, mouseY, xo + xs * 2.75, ys * 1.5, xs/3, xs/3)) {
if(globalBeats > 2) {
 globalBeats--;
 sequence.instruments.forEach((instrument, i) => {
instrument.updateBarCount(globalBeats * 2);
 });
 resizeInterface(sequence);
}
}

if(rectCollision(mouseX, mouseY, xo + xs * 4, ys * 1.5, xs/3, xs/3)) {
if(globalBeats < 10) {
 globalBeats++;
 sequence.instruments.forEach((instrument, i) => {
instrument.updateBarCount(globalBeats * 2);
 });
 resizeInterface(sequence);
}
}

if(rectCollision(mouseX, mouseY, xo + xs * 0.5, ys * 1.5, xs/3, xs/3)) {
cursor(CROSS);
bpm--;
}

if(rectCollision(mouseX, mouseY, xo + xs * 1.75, ys * 1.5, xs/3, xs/3)) {
cursor(CROSS);
bpm++;
}

}

function keyPressed() {
if (keyCode == 32) {
togglePlayback();
return false;
}
}

function togglePlayback() {

playing = !playing;
let beatDuration = 60.0/bpm * 1000;

if(!playing) {
sequence.instruments.forEach((instrument) => {   
 instrument.reset();
 setTimeout(() => {
   instrument.turnOff();
 }, beatDuration - globalInterval);
});
}

globalInterval = 0;

}