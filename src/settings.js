let bpm = 80.0;
let bars = 8;
let globalBeats = 4;

let interval = 0;
let playing = false;

let canvasWidth = 2000;
let canvasHeight = 1000;
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

let drums = [
  { name: "shime", 
    samples: [],
  },
  {
     name: "nagado", 
     samples: []
  },
  {
     name: "odaiko", 
     samples: []
  }
]

function setCanvasSize() {
  canvasWidth  = windowWidth >= canvasMinWidth ? windowWidth : canvasMinWidth;
  canvasHeight = canvasWidth * (2/3);
  canvasXStep = canvasWidth/canvasXDiv;
  canvasYStep = canvasWidth/canvasYDiv;
}