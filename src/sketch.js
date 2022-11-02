let images = {
  don:  {name: "don", img: null},
  maru: {name: "maru", img: null},
  tsu:  {name: "tsu", img: null},
  ka:   {name: "ka", img: null},
  maruPlay: {name: "maru_trig", img: null}, 
  donPlay:  {name: "don_trig", img: null},
  tsuPlay:  {name: "tsu_trig", img: null},
  kaPlay:   {name: "ka_trig", img: null},
  title: {name: "name", img: null},
  playOff: {name: "play", img: null},
  playBeat: {name: "play_beat", img: null},
  hLine: {name: "line", img: null},
  vLine: {name: "lineV", img: null}
};

let shime, nagado, oodaiko;
let beatGraphics;

let sequence;

function windowResized() {
  resizeInterface(sequence);
}

function preload(){
  
  lato = loadFont("assets/fonts/Lato-Regular.ttf");
  
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
  createCanvas(canvasWidth, canvasHeight);
  sequence = new Sequence([new Instrument(0),
                           new Instrument(1), 
                           new Instrument(2)]);
  sequence.setup();
  resizeInterface(sequence); 
}

function draw() {
  
  background(220);
  drawInterfaceBounds();
  drawInterfaceLabels()
  
  cursor(ARROW);
  
  let bpm = sequence.bpmSlider.value();
  let beatDuration = 60.0/bpm * 1000;
  globalDelta = deltaTime;
  
  sequence.draw(bpm, globalInterval, playing);
  
  if(playing) {
    if(globalBeats != sequence.tsSlider.value()) {
      sequence.instruments.forEach((instrument, i) => {
        if(instrument.bars.length == globalBeats * 2) {
         instrument.updateBarCount(tsSlider.value() * 2);
        }
      });
      resize();
      globalBeats = sequence.tsSlider.value();
    }
    
    globalInterval += globalDelta;
    if(globalInterval >= beatDuration) {      
      globalInterval = beatDuration - globalInterval;
    }
  }
  
  sequence.playButton.draw(globalInterval);
  
}

function mouseClicked() {
  
  if(Beat.prototype.isPrototypeOf(sequence.colliding)) {
      sequence.colliding.active = (++sequence.colliding.active) % states.length;
  }
  
  if(Instrument.prototype.isPrototypeOf(sequence.colliding)) {
      sequence.colliding.type = (sequence.colliding.type + 1) % 3; 
  }
  
  if(Bar.prototype.isPrototypeOf(sequence.colliding)) {
      if(mouseX >= sequence.colliding.decButX && mouseX <= sequence.colliding.decButX + colliding.butW && 
          mouseY >= sequence.colliding.decButY && mouseY <= sequence.colliding.decButY + sequence.colliding.butH) {
          sequence.colliding.updateBeatCount(sequence.colliding.beats.length - 1);
      }
      
     if(mouseX >= sequence.colliding.incButX && mouseX <= sequence.colliding.incButX + sequence.colliding.butW && 
          mouseY >= sequence.colliding.incButY && mouseY <= sequence.colliding.incButY + sequence.colliding.butH) {
          cursor(CROSS);
          sequence.colliding.updateBeatCount(sequence.colliding.beats.length + 1);
      }
     }
  
  if(dist(mouseX, mouseY, sequence.playButton.x, sequence.playButton.y) <= sequence.playButton.c/2) {
    togglePlayback();
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
  toggleSlider(sequence.bpmSlider);
  toggleSlider(sequence.tsSlider);
  
  globalInterval = 0;

  sequence.instruments.forEach((instrument) => {
    
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

function toggleSlider(slider) {
  if(slider.attribute("disabled")) {
    slider.removeAttribute("disabled");
  } else {
    slider.attribute("disabled", true);
  }
}