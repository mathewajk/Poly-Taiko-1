let colliding = null;

let don, maru, tsu, ka, maru_trig, don_trig, tsu_trig, ka_trig;
let shime, nagado, oodaiko;
let name, playOff, playBeat;
let intLineH, intLineV;

let beatGraphics;

let bpmSlider;
let playButton;
let tsSlider;

let instruments = [new Instrument(0), new Instrument(1), new Instrument(2)];

let instAreaHeight = 0;

function windowResized() {
  
  setCanvasSize();
  
  playButton.resize();
  
  let sliderWidth = canvasXStep;
  bpmSlider.position(canvasXStep * 0.5, canvasYStep * 1.35);
  bpmSlider.style('width', sliderWidth + 'px');
  
  tsSlider.position(canvasXStep * 2.25, canvasYStep * 1.6);
  tsSlider.style('width', sliderWidth + 'px');
  
  fontSize = baseFontSize * (canvasWidth/1600);
  
  instAreaHeight = 0;
  
  instruments.forEach((instrument, i) => {
    instrument.calculatePos(i);
    
    let offset = instrument.bars.length % 4 == 0 ? 0 : 1;
    let widthMult = Math.max(Math.floor(instrument.bars.length / 4) + offset, 2);
    instAreaHeight += canvasYStep * 0.8 * widthMult + canvasYStep/2;
    
  });
  
  instAreaHeight += canvasYStep;
  
  resizeCanvas(canvasWidth, canvasHeight);
  
}

function preload(){
  
  lato = loadFont("assets/fonts/Lato-Regular.ttf");
  
  name     = loadImage('assets/images/name.png');
  playOff     = loadImage('assets/images/play.png');
  playBeat = loadImage('assets/images/play_beat.png');
  intLineH = loadImage('assets/images/line.png');
  intLineV = loadImage('assets/images/lineV.png');
  
  don  = loadImage('assets/images/don.png');
  maru = loadImage('assets/images/maru.png');
  tsu  = loadImage('assets/images/tsu.png');
  ka   = loadImage('assets/images/ka.png');
  
  don_trig  = loadImage('assets/images/don_trig.png');
  maru_trig = loadImage('assets/images/maru_trig.png');
  tsu_trig  = loadImage('assets/images/tsu_trig.png');
  ka_trig   = loadImage('assets/images/ka_trig.png');
  
  shime   = loadImage('assets/images/shime.png');
  nagado  = loadImage('assets/images/naga.png');
  oodaiko = loadImage('assets/images/oo.png');
  
  drums = [
    { 
      name: "shime",
      img: shime,
      samples: [],
    },
    {
       name: "nagado", 
       img: nagado,
       samples: []
    },
    {
       name: "odaiko", 
       img: oodaiko,
       samples: []
    }
  ];
  
  beatGraphics = {
    "triggering": [maru_trig, don_trig, tsu_trig, ka_trig],
    "base": [maru, don, tsu, ka]
  }
  
  soundFormats('mp3', 'ogg');
  
  drums[0].samples = [
    loadSound('assets/samples/shime_001'),
    loadSound('assets/samples/shime_002'),
    loadSound('assets/samples/shime_003'),
    loadSound('assets/samples/shime_004'),
    loadSound('assets/samples/shime_005')
  ];
  
  drums[1].samples = [
    loadSound('assets/samples/nagado_001'),
    loadSound('assets/samples/nagado_002'),
    loadSound('assets/samples/nagado_003'),
    loadSound('assets/samples/nagado_004'),
    loadSound('assets/samples/nagado_005')
  ];
    
  drums[2].samples = [
    loadSound('assets/samples/odaiko_001'),
    loadSound('assets/samples/odaiko_002'),
    loadSound('assets/samples/odaiko_003'),
    loadSound('assets/samples/odaiko_004'),
    loadSound('assets/samples/odaiko_005')
  ];
}

function setup() {
  
  setCanvasSize();

  playButton = new PlayButton();
  
  fontSize = baseFontSize * (canvasWidth/1600);
  createCanvas(canvasWidth, canvasHeight);
  
  instAreaHeight = 0;
  
  instruments.forEach((instrument, i) => {  
    
    instrument.slider = createSlider(2, 7, 4);
    instrument.tsSlider = createSlider(2, 10, 4);
    
    instrument.sliderPos = 4;
    instrument.tsSliderPos = globalBeats;
    instrument.calculatePos(i);
    
    let offset = instrument.bars.length % 4 == 0 ? 0 : 1;
    let widthMult = Math.max(Math.floor(instrument.bars.length / 4) + offset, 2);
    instAreaHeight += canvasYStep * 0.8 * widthMult + canvasYStep/2;
  });
  instAreaHeight += canvasYStep;
  
  setCanvasSize();
  playButton.resize();
  resizeCanvas(canvasWidth, canvasHeight);
  
  playButton.color = instruments[0].color;
  
  bpmSlider = createSlider(60, 200, 120, 1);
  bpmSlider.position(canvasXStep * 0.5, canvasYStep * 1.35);
  
  tsSlider = createSlider(2,10,4,1);
  tsSlider.position(canvasXStep * 2.25, canvasYStep * 1.6);
  
  let sliderWidth = canvasXStep;
  bpmSlider.style('width', sliderWidth + 'px');
  tsSlider.style('width', sliderWidth + 'px');
  
}

function drawInterfaceBounds() {
  
  let xs = canvasXStep;
  let ys = canvasYStep;
  
  fill(0,0,0,0);
  
  // Drum select
  //rect(xs * 0.25, ys * 1.5, xs * 1.5, instAreaHeight);
  line(xs * 0.5, instruments[0].y - ys/1.6, xs * 1.6, instruments[0].y - ys/1.6);
  
  // Sequencer
  //rect(xs * 2, ys * 1.5, xs * (canvasXDiv * (8.4/10)), instAreaHeight);
  
  for(let i=0; i < 3; i++) {
    image(intLineH, xs/2 * 0.55 + xs/2 * i, instruments[0].y - ys * 1.25, xs/2, xs/10);
    image(intLineH, xs/2 * 0.55 + xs/2 * i, instruments[0].y - ys * 1.25 + instAreaHeight, xs/2, xs/10);
    
    // BPM
    image(intLineH, xs/2 * 0.55 + xs/2 * i, ys, xs/2, xs/10);
    image(intLineH, xs/2 * 0.55 + xs/2 * i, ys * 2, xs/2, xs/10);
    
    // Time signature
    image(intLineH, xs/2 * 4 + xs/2 * i, ys, xs/2, xs/10);
    image(intLineH, xs/2 * 4 + xs/2 * i, ys * 2, xs/2, xs/10);
  }
  
  image(intLineV, xs * 0.25, ys, ys/10, ys);
  image(intLineV, xs * 1.75, ys, ys/10, ys);
  image(intLineV, xs * 2, ys, ys/10, ys);
  image(intLineV, xs * 3.5, ys, ys/10, ys);
  
  for(let i=0; i < 25; i++) {
    image(intLineH, xs * 2 + xs/2*i, instruments[0].y - ys * 1.25, xs/2, xs/10);
    image(intLineH, xs * 2 + xs/2*i, instruments[0].y - ys * 1.25 + instAreaHeight, xs/2, xs/ 10);
  }
  
  for(let i=0; i * ys/2 < instAreaHeight; i++) {
    image(intLineV, xs * 0.25, instruments[0].y - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    image(intLineV, xs * 1.75, instruments[0].y - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    image(intLineV, xs * 2, instruments[0].y - ys * 1.25 + ys/2 * i, ys/10, ys/2);
    image(intLineV, xs * 2 + xs/2*24.75, instruments[0].y - ys * 1.25 + ys/2 * i, ys/10, ys/2);
  }
  
  // BPM select
  //rect(xs * 0.25, ys * 1.88 + instAreaHeight, xs * 1.5, ys * 1);
  
  //rect(xs * 2, ys * 1.88 + instAreaHeight, xs * 1.5, ys * 1);

}

function drawInterfaceLabels() {
  
  fill(0,0,0);
  textFont(lato);
  textAlign(CENTER, BASELINE);
  
  textSize(fontSize * 3);
  image(name, canvasXStep * (canvasXDiv/2) - canvasXStep*1.5, canvasYStep - canvasXStep * 0.75, canvasXStep * 3, canvasXStep * 1.5);
  describeElement("Title", "Poly-Taiko-1 taiko music synthesizer");
  
  //text("Poly-Taiko-1", canvasXStep * (canvasXDiv/2), canvasYStep);

  textSize(fontSize * 1.25);
  text("Drm Select", canvasXStep * 1, instruments[0].y - canvasYStep * 0.85);
  text("Sequence", canvasXStep * 8, instruments[0].y - canvasYStep * 0.85);
  text("BPM: " + bpmSlider.value(), canvasXStep, canvasYStep * 1.35);
  text("Time sig:\n" + tsSlider.value() + "/4", canvasXStep * 2.75, canvasYStep * 1.35);
  
  textSize(fontSize);
  text("60", canvasXStep * 0.5, canvasYStep * 1.9);
  text("200", canvasXStep * 1.5, canvasYStep * 1.9);
}

function draw() {
  
  background(220);
  drawInterfaceBounds();
  drawInterfaceLabels()
  
  cursor(ARROW);
  
  bpm = bpmSlider.value();
  colliding = null;

  let beatDuration = 60.0/bpm * 1000;
  globalDelta = deltaTime;
  
  if(globalBeats != tsSlider.value()) {
    instruments.forEach((instrument, i) => {
      if(instrument.bars.length == globalBeats * 2) {
       instrument.updateBarCount(tsSlider.value() * 2);
      }
    });
    resizeInstrumentArea();
    globalBeats = tsSlider.value();
  }
  
  instruments.forEach((instrument, i) => {
    
    if(playing) {

      let thisBar = instrument.bars[instrument.barPos];
      let thisBeat = thisBar.beats[instrument.beatPos];
      
      let noteDuration = (60.0/bpm) * (1.0 / thisBar.beatDivision) * 1000;
      let prevDuration = (60.0/bpm) * (1.0 / instrument.prevBar.beatDivision) * 1000;
      
      let noteStart = noteDuration * (instrument.beatPos);
      
      if(globalInterval >= noteStart - prevDuration && globalInterval <= noteStart) {         

          if(thisBeat.active) {
            
            let samples = drums[instrument.type].samples; 
            if(samples.length) {
              let sample = samples[Math.floor(random(samples.length))];

              let vol = 1;
              vol = drums[instrument.type].name == "shime"  ? 0.75 : vol;
              vol = drums[instrument.type].name == "nagado" ? 1.1  : vol;

              if(thisBeat.active == 2) {
                vol *= 0.25;
              }
              sample.play((noteStart - globalInterval)/1000, 1, vol, 0, 1);
            }
          }
      
          let timing = (noteStart - globalInterval)/1000;
        
          setTimeout(() => {
            if(instrument.prevBeat) {
              instrument.prevBeat.triggering = false;
            }                
            thisBeat.triggering = true;
            instrument.prevBeat = thisBeat;
            instrument.prevBar  = thisBar;           
          }, (noteStart - globalInterval));
        
          instrument.beatPos++;
          if(instrument.beatPos == instrument.bars[instrument.barPos].beatDivision) {
            instrument.beatPos = 0;
            instrument.barPos++;
          }
          if(instrument.barPos == instrument.bars.length) {
            instrument.barPos = 0;
          }
      }
      instrument.interval += globalDelta;
    }
 
    // Check if the user has adjusted an instrument's global beat division or time signature
    let beatSliderVal = instrument.slider.value();  
    let tsSliderVal = instrument.tsSlider.value(); 
    
    if(instrument.sliderPos != beatSliderVal) {
        instrument.bars.forEach((bar) => {
          bar.updateBeatCount(beatSliderVal);
          instrument.sliderPos = beatSliderVal;
        });
    }
    
    if(instrument.tsSliderPos != tsSliderVal && instrument.bars.length != tsSliderVal * 2) {
     instrument.updateBarCount(tsSliderVal * 2);
     resizeInstrumentArea();
     instrument.tsSliderPos = tsSliderVal;
    }
    
    instrument.draw();

    instrument.bars.forEach((bar) => {
      
      if(mouseX >= bar.decButX && mouseX <= bar.decButX + bar.butW && 
          mouseY >= bar.decButY && mouseY <= bar.decButY + bar.butH) {
          cursor(CROSS);
          colliding = bar;
      }
      
     if(mouseX >= bar.incButX && mouseX <= bar.incButX + bar.butW && 
          mouseY >= bar.incButY && mouseY <= bar.incButY + bar.butH) {
          cursor(CROSS);
          colliding = bar;
      }
      
      bar.beats.forEach((beat) => {
        if(dist(mouseX, mouseY, beat.x + beat.size/2, beat.y + beat.size/2) <= beat.size/2) {
          cursor(CROSS);
          colliding = beat;
        }
      });
    });

    if(dist(mouseX, mouseY, instrument.x, instrument.y) <= instrument.c/2) {
        cursor(CROSS);
        colliding = instrument;
    }  
  });

  
  globalInterval += globalDelta;
  if(globalInterval >= beatDuration) {      
    globalInterval = beatDuration - globalInterval;
  }
  playButton.draw(globalInterval);

}

function mouseClicked() {
  
  if(Beat.prototype.isPrototypeOf(colliding)) {
      colliding.active = (++colliding.active) % states.length;
  }
  
  if(Instrument.prototype.isPrototypeOf(colliding)) {
      colliding.type = (colliding.type + 1) % 3; 
  }
  
  if(Bar.prototype.isPrototypeOf(colliding)) {
      if(mouseX >= colliding.decButX && mouseX <= colliding.decButX + colliding.butW && 
          mouseY >= colliding.decButY && mouseY <= colliding.decButY + colliding.butH) {
          colliding.updateBeatCount(colliding.beats.length - 1);
      }
      
     if(mouseX >= colliding.incButX && mouseX <= colliding.incButX + colliding.butW && 
          mouseY >= colliding.incButY && mouseY <= colliding.incButY + colliding.butH) {
          cursor(CROSS);
          colliding.updateBeatCount(colliding.beats.length + 1);
      }
     }
  
  if(dist(mouseX, mouseY, playButton.x, playButton.y) <= playButton.c/2) {
    togglePlayback();
  }

}

function keyPressed() {
  if (keyCode == 32) {
    togglePlayback();
  }
}

function togglePlayback() {
  
  playing = !playing;
  toggleSlider(bpmSlider);
  toggleSlider(tsSlider);
  
  globalInterval = 0;

  instruments.forEach((instrument) => {
    
    instrument.beatPos = 0;
    instrument.barPos = 0;
    instrument.prevBar = instrument.bars[instrument.bars.length-1];
    instrument.prevBeat = instrument.prevBar[instrument.prevBar.length-1];
    instrument.interval = 0;
    instrument.triggered = false;

    toggleSlider(instrument.slider);
    toggleSlider(instrument.tsSlider);

    instrument.bars.forEach((bar) => {
      bar.beats.forEach((beat) => {
        beat.triggering = false;
      });
    });
  });
}

function resizeInstrumentArea() {
  instAreaHeight = 0;
  instruments.forEach((instrument, i) => {
    instrument.calculatePos(i);
    let offset = instrument.bars.length % 4 == 0 ? 0 : 1;
    let widthMult = Math.max(Math.floor(instrument.bars.length / 4) + offset, 2);
  instAreaHeight += canvasYStep * 0.8 * widthMult + canvasYStep/2;
  });

  instAreaHeight += canvasYStep;
  
  setCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  
  bpmSlider.position(canvasXStep * 0.5, canvasYStep * 1.35);
  tsSlider.position(canvasXStep * 2.25, canvasYStep * 1.6);

  playButton.resize();
}

function toggleSlider(slider) {
  if(slider.attribute("disabled")) {
    slider.removeAttribute("disabled");
  } else {
    slider.attribute("disabled", true);
  }
}