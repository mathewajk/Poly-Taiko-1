let bpm = 120.0;
let bars = 8;
let globalBeats = 4;

let interval = 0;
let playing = false;

let canvasWidth = 2000;
let canvasHeight = canvasWidth * (2/3);
let canvasMinWidth = 800;

let canvasXDiv = 20;
let canvasYDiv = 20;

let canvasXStep = canvasWidth/canvasXDiv;
let canvasYStep = canvasHeight/canvasYDiv;

let baseFontSize = 18;
let fontSize     = 18;

let globalInterval = 0;
let globalDelta = 0;
let globalBeatsPerBar = 4;

let drums;

function setCanvasSize(sequence) {
  canvasWidth  = windowWidth >= canvasMinWidth ? 
    windowWidth : canvasMinWidth;
  
  canvasXStep = canvasWidth/canvasXDiv;
  canvasYStep = canvasWidth/canvasYDiv;
  
  canvasHeight = sequence.height + canvasYStep * 4;
  fontSize = baseFontSize * (canvasWidth/1600);
}

function resizeInterface(sequence) {
  setCanvasSize(sequence);
  sequence.resize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function drawSeparator(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
}

function drawHLine(x, y, w, h) {
  image(intLineH, x, y, w, h);
}

function drawVLine(x, y, w, h) {
  image(intLineV, x, y, w, h);
}

function drawInterfaceBounds() {
  
  let xs = canvasXStep;
  let ys = canvasYStep;

  let xo = sequence.xOffset;
  let yo = sequence.yOffset;
  
  let height = sequence.height;
  
  fill(0,0,0,0);
  
  // Drum select separator
  drawSeparator(xo + xs * 0.5, yo - ys/1.6,  xo + xs * 1.6, yo - ys/1.6);
  
  // Sequencer

  for(let i=0; i < 3; i++) {
    drawHLine(xo + xs/2 * 0.55 + xs/2 * i, yo - ys * 1.25, xs/2, xs/10);
    drawHLine(xo + xs/2 * 0.55 + xs/2 * i, yo - ys * 1 + height, xs/2, xs/10);
    
    // BPM
    drawHLine(xo + xs/2 * 0.55 + xs/2 * i, ys, xs/2, xs/10);
    drawHLine(xo + xs/2 * 0.55 + xs/2 * i, ys * 2, xs/2, xs/10);
    
    // Time signature
    drawHLine(xo + xs/2 * 4 + xs/2 * i, ys, xs/2, xs/10);
    drawHLine(xo + xs/2 * 4 + xs/2 * i, ys * 2, xs/2, xs/10);
  }
  
  drawVLine(xo + xs * 0.25, ys, ys/10, ys);
  drawVLine(xo + xs * 1.75, ys, ys/10, ys);
  drawVLine(xo + xs * 2, ys, ys/10, ys);
  drawVLine(xo + xs * 3.5, ys, ys/10, ys);
  
  for(let i=0; i < 25; i++) {
    drawHLine(xo + xs * 2 + xs/2*i, yo - ys * 1.25, xs/2, xs/10);
    drawHLine(xo + xs * 2 + xs/2*i, yo - ys * 1 + height, xs/2, xs/ 10);
  }
  
  for(let i=0; i * ys/2 < height; i++) {
    drawVLine(xo + xs * 0.25, yo - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    drawVLine(xo + xs * 1.75, yo - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    drawVLine(xo + xs * 2, yo - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    drawVLine(xo + xs * 2 + xs/2*24.75, yo - ys * 1.25 + ys/2 * i, ys/10, ys/2);
  }

}

function drawInterfaceLabels() {
  
  let xs = canvasXStep;
  let ys = canvasYStep;
  
  fill(0,0,0);
  textFont(lato);
  textAlign(CENTER, BASELINE);
  
  textSize(fontSize * 3);
  image(name, canvasXStep * (canvasXDiv/2) - canvasXStep*1.5, canvasYStep - canvasXStep * 0.75, canvasXStep * 3, canvasXStep * 1.5);
  describeElement("Title", "Poly-Taiko-1 taiko music synthesizer");
  
  //text("Poly-Taiko-1", canvasXStep * (canvasXDiv/2), canvasYStep);

  textSize(fontSize * 1.25);
  text("Drm Select",  sequence.xOffset + xs, sequence.yOffset - ys * 0.85);
  text("Sequence",  sequence.xOffset + xs * 7, sequence.yOffset - ys * 0.85);
  text("BPM: " + sequence.bpmSlider.value(), sequence.xOffset + xs, ys * 1.35);
  text("Time sig:\n" + sequence.tsSlider.value() + "/4", sequence.xOffset + xs * 2.75, ys * 1.35);
  
  textSize(fontSize);
  text("60",  sequence.xOffset + xs * 0.5, ys * 1.9);
  text("200",  sequence.xOffset + xs * 1.5, ys * 1.9);
}