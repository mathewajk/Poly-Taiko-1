let bpm = 80.0;
let bars = 8;
let globalBeats = 4;

let interval = 0;
let playing = false;

let canvasWidth = 2000;
let canvasHeight = canvasWidth * (2/3);
let canvasMinWidth = 800;

let canvasXDiv = 15;
let canvasYDiv = 15;

let canvasXStep = canvasWidth/canvasXDiv;
let canvasYStep = canvasHeight/canvasYDiv;

let baseFontSize = 18;
let fontSize     = 18;

let globalInterval = 0;
let globalDelta = 0;
let globalBeatsPerBar = 4;

let drums;

function setCanvasSize() {
  canvasWidth  = windowWidth >= canvasMinWidth ? windowWidth : canvasMinWidth;
  
  canvasXStep = canvasWidth/canvasXDiv;
  canvasYStep = canvasWidth/canvasYDiv;
  
  canvasHeight = instAreaHeight + canvasYStep * 4;
  
}