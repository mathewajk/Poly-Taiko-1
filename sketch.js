let colliding = null;
let bpmSlider;
let playButton;

instruments = [new Instrument(0), new Instrument(1), new Instrument(2)];

drums = [
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
  canvasHeight = canvasWidth * (3/4);
  
  canvasXStep = canvasWidth/10;
  canvasYStep = canvasHeight/10;
  
}

function windowResized() {
  
  setCanvasSize();
  
  playButton.resize();
  
  let sliderWidth = canvasXStep;
  bpmSlider.position(canvasXStep * 0.5, canvasYStep * 9);
  bpmSlider.style('width', sliderWidth + 'px');
  
  fontSize = baseFontSize * (canvasWidth/1200);
  
  instruments.forEach((instrument, i) => {
    instrument.calculatePos(i);
  });
  
  resizeCanvas(canvasWidth, canvasHeight);
  
}

function preload(){
  
  lato = loadFont("assets/fonts/Lato-Regular.ttf");
  
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
  
  fontSize = baseFontSize * (canvasWidth/1200);
  createCanvas(canvasWidth, canvasHeight);
  
  instruments.forEach((instrument, i) => {  
    instrument.slider = createSlider(2, 10, 4);
    instrument.calculatePos(i);
  });
  
  playButton.color = instruments[0].color;
  
  bpmSlider = createSlider(60, 200, 120, 1);
  bpmSlider.position(canvasXStep * 0.5, canvasYStep * 9);
  
  let sliderWidth = canvasXStep;
  bpmSlider.style('width', sliderWidth + 'px');
  
}

function doOnBeat(timedFunc, currentInterval, measureDuration, timeSignature) {
  if(currentInterval >= beatDuration/timeSignature) {
   timedFunc(); 
  }
}

function drawInterfaceBounds() {
  
  let xs = canvasXStep;
  let ys = canvasYStep;
  
  fill(0,0,0,0);
  
  // Drum select
  rect(xs * 0.25, ys * 1.75, xs, ys * 6.5);
  line(xs * 0.5, ys * 2.15, xs, ys * 2.15);
  
  // Sequencer
  rect(xs * 1.5, ys * 1.75, xs * 8, ys * 6.5);
  
  // BPM select
  rect(xs * 0.25, ys * 8.6, xs * 1.5, ys * 1);

}

function drawInterfaceLabels() {
  
  fill(0,0,0);
  textFont(lato);
  textAlign(CENTER, BASELINE);
  
  textSize(fontSize * 3);
  text("Poly-Taiko-1", canvasXStep * 5, canvasYStep);

  textSize(fontSize * 1.25);
  text("Drm Select", canvasXStep * 0.75, canvasYStep * 2);
  text("Sequence", canvasXStep * 5.5, canvasYStep * 2);
  text("BPM: " + bpmSlider.value(), canvasXStep, canvasYStep * 9);
  
  textSize(fontSize);
  text("60", canvasXStep * 0.5, canvasYStep * 9.4);
  text("200", canvasXStep * 1.5, canvasYStep * 9.4);
}

function draw() {
  
  background(220);
  drawInterfaceBounds();
  drawInterfaceLabels()
  
  cursor(ARROW);
  
  bpm = bpmSlider.value();
  colliding = null;

  let beatDuration = 60.0/bpm;
    
  instruments.forEach((instrument, i) => {

    if(playing) {

      let noteDuration = (60.0/bpm) * (4.0 / (instrument.beatsPerBar * 4.0));

      if(globalInterval <= 0 || instrument.interval <= 0) {     

        instrument.interval = 0;
        let samples = drums[instrument.type].samples;       

        instrument.beats.forEach((beat, i) => {

          if(instrument.pos == i) {
            beat.color = [255, 255, 255];

            if(beat.active) {
              if(samples.length) {
                let sample = samples[Math.floor(random(samples.length))];
                if(drums[instrument.type].name == "shime") {
                  sample.setVolume(0.75);
                }
                else if (drums[instrument.type].name == "nagado") {
                  sample.setVolume(1.25);
                }
                sample.play();
              }       
            }
          } else {
            beat.color = null;
          }
        });
        instrument.pos = (instrument.pos + 1) % (bars * instrument.beatsPerBar);
      }
    }

    // Check if the user has adjusted an instrument's time division
    let beatSliderVal = instrument.slider.value();  
    if(instrument.beatsPerBar != beatSliderVal) {
        instrument.updateBeatCount(beatSliderVal);
    }
    
    instrument.draw();

    instrument.beats.forEach((beat) => {
      if(mouseX >= beat.x && mouseX <= beat.x + canvasXStep/4 && 
        mouseY >= beat.y && mouseY <= beat.y + canvasXStep/4) {
        cursor(CROSS);
        colliding = beat;
      }
    });

    if(dist(mouseX, mouseY, instrument.x, instrument.y) <= instrument.c/2) {
        cursor(CROSS);
        colliding = instrument;
    }  
  });

  globalDelta = deltaTime/1000;
  globalInterval += globalDelta;
  
  instruments.forEach((instrument) => {
    instrument.interval += globalDelta;
    let noteDuration = (60.0/bpm) * (4.0 / (instrument.beatsPerBar * 4.0));
    if(instrument.interval >= noteDuration) {   
      instrument.interval = noteDuration - instrument.interval;
      //console.log("Instrument interval: " + instrument.interval);
    }
  });
  
  if(globalInterval >= beatDuration) {
    globalInterval = 0;
  }
  
  //console.log("Beat duration: " + beatDuration);
  playButton.draw(globalInterval);

}

function mouseClicked() {
  
  if(Beat.prototype.isPrototypeOf(colliding)) {
      colliding.active = !colliding.active;
  }
  
  if(Instrument.prototype.isPrototypeOf(colliding)) {
      colliding.type = (colliding.type + 1) % 3; 
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
  
  globalInterval = 0;

  instruments.forEach((instrument) => {
    
    instrument.pos = 0;
    instrument.interval = 0;

    toggleSlider(instrument.slider);

    instrument.beats.forEach((beat) => {
      beat.color = null;
    });
  });
}

function toggleSlider(slider) {
  if(slider.attribute("disabled")) {
    slider.removeAttribute("disabled");
  } else {
    slider.attribute("disabled", true);
  }
}