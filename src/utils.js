let bpm = 120.0;
let bars = 8;

let globalBeats = 4;
let globalInterval = 0;
let globalDelta = 0;

let playing = false;

let drums = [
    { 
      name: "shime",
      samples: [],
    },
    {
       name: "naga", 
       samples: []
    },
    {
       name: "oo", 
       samples: []
    }
];

let canvasWidth = 2000;
let canvasHeight = canvasWidth * (2/3);
let canvasMinWidth = 800;

let canvasXDiv = 20;
let canvasYDiv = 20;

let canvasXStep = canvasWidth/canvasXDiv;
let canvasYStep = canvasHeight/canvasYDiv;

let baseFontSize = 18;
let fontSize     = 18;

function rectCollision(x1, y1, x2, y2, w, h) {
  return(x1 >= x2 && x1 <= x2 + w && 
          y1 >= y2 && y1 <= y2 + h)
}

function setCanvasSize(sequence) {
  canvasWidth  = windowWidth >= canvasMinWidth ? 
    windowWidth : canvasMinWidth;
  
  canvasXStep = canvasWidth/canvasXDiv;
  canvasYStep = canvasWidth/canvasYDiv;
  
  canvasHeight = sequence.height + canvasYStep * 4;
  fontSize = baseFontSize * (canvasWidth/1600);
}

function resizeSlider(slider, x, y, width) {
  slider.position(x, y);
  slider.style('width', width + 'px');
}

function resizeInterface() {  
  sequence.resize();
  let xo = sequence.xOffset;
  
  setCanvasSize(sequence); 
  let xs = canvasXStep;
  let ys = canvasYStep;
  
  playButton.resize(sequence.height);
  
  resizeCanvas(canvasWidth, canvasHeight);
  draw();
}

function drawSeparator(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
}

function drawHLine(x, y, w, h) {
  image(images.hLine.img, x, y, w, h);
}

function drawVLine(x, y, w, h) {
  image(images.vLine.img, x, y, w, h);
}

function drawInterfaceBounds() {
  
  let xs = canvasXStep;
  let ys = canvasYStep;

  let xo = sequence.xOffset;
  let yo = sequence.yOffset;
  
  let height = sequence.height;
  
  fill(0,0,0,0);
  
  // Drum select separator
  drawSeparator(xo + xs * 0.5, yo - ys/1.6,  xo + xs * 2, yo - ys/1.6);
  
  push();
  fill(sequences[0].instruments[0].color);
  rect(xo + xs * 0.5, ys * 1.5, xs/3, xs/3);
  rect(xo + xs * 1.75, ys * 1.5, xs/3, xs/3);
  
  rect(xo + xs * 2.75, ys * 1.5, xs/3, xs/3);
  rect(xo + xs * 4, ys * 1.5, xs/3, xs/3);
  
  for(let i=0; i < 8; i++) {
    if(i == sequencei) {
      fill(sequences[i].instruments[1].color);
    } else {
      fill(sequences[0].instruments[0].color);
    }
    rect(xo + xs * 9.9 + xs/1.5 * i, ys * 1.75, xs/3, xs/3);
    fill(0,0,0);
    text(i+1, xo + xs * 9.9 + xs/1.5 * i + xs/6, ys * 1.75 + xs/4.5);
  }
  pop();
  
  // Sequencer

  for(let i=0; i < 4; i++) {
    drawHLine(xo + xs/2 * 0.55 + xs/2 * i, yo - ys * 1.25, xs/2, xs/10);
    drawHLine(xo + xs/2 * 0.55 + xs/2 * i, yo - ys * 1 + height, xs/2, xs/10);
    
    // BPM
    drawHLine(xo + xs * 0.25 + xs/2 * i, ys, xs/2, xs/10);
    drawHLine(xo + xs * 0.25 + xs/2 * i, ys * 2, xs/2, xs/10);
    
    // Time signature
    drawHLine(xo + xs * 2.5 + xs/2 * i, ys, xs/2, xs/10);
    drawHLine(xo + xs * 2.5 + xs/2 * i, ys * 2, xs/2, xs/10);
  }
  
  drawVLine(xo + xs * 0.25, ys, ys/10, ys);
  drawVLine(xo + xs * 2.25, ys, ys/10, ys);
  drawVLine(xo + xs * 2.5, ys, ys/10, ys);
  drawVLine(xo + xs * 4.5, ys, ys/10, ys);
  
  for(let i=0; i < 25; i++) {
    drawHLine(xo + xs * 2.5 + xs/2*i, yo - ys * 1.25, xs/2, xs/10);
    drawHLine(xo + xs * 2.5 + xs/2*i, yo - ys * 1 + height, xs/2, xs/ 10);
  }
  
  for(let i=0; i * ys/2 < height; i++) {
    drawVLine(xo + xs * 0.25, yo - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    drawVLine(xo + xs * 2.25, yo - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    drawVLine(xo + xs * 2.5, yo - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    drawVLine(xo + xs * 2.5 + xs/2*24.75, yo - ys * 1.25 + ys/2 * i, ys/10, ys/2);
  }

}

function drawInterfaceLabels() {
  
  let xs = canvasXStep;
  let ys = canvasYStep;
  let xo = sequence.xOffset;
  
  fill(0,0,0);
  textAlign(CENTER, BASELINE);
  textFont(edo);
  
  textSize(fontSize * 3);
  image(images.title.img, canvasXStep * (canvasXDiv/2) - canvasXStep*1.5, canvasYStep - canvasXStep * 0.75, canvasXStep * 3, canvasXStep * 1.5);
  describeElement("Title", "Poly-Taiko-1 taiko music synthesizer");

  textSize(fontSize * 1.25);
  text("Drums",  sequence.xOffset + xs * 1.25, sequence.yOffset - ys * 0.85);
  text("Sequence",  sequence.xOffset + xs * (25/3), sequence.yOffset - ys * 0.85);
  text("BPM", sequence.xOffset + xs * 1.25, ys * 1.35);
  textFont(lato);
  text(bpm, sequence.xOffset + xs * 1.25, ys * 1.75);
  
  textFont(edo);
  text("Time Sig", sequence.xOffset + xs * 3.5, ys * 1.35);
  
  textFont(lato);
  text("" + globalBeats + "/4", sequence.xOffset + xs * 3.5, ys * 1.75);
  
 textSize(fontSize * 1.5);
  text("-", xo + xs * 2.75 + xs/6, ys * 1.55 + xs/4);
  text("+", xo + xs * 4 + xs/6, ys * 1.55 + xs/4);
  
 
  text("-", xo + xs * 0.5 + xs/6, ys * 1.55 + xs/4);
  text("+", xo + xs * 1.75 + xs/6, ys * 1.55 + xs/4);
  

  textFont(lato);
  
}