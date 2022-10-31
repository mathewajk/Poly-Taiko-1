let colliding = null;
let bpmSlider;
let playButton;


let instruments = [new Instrument(0), new Instrument(1), new Instrument(2)];
let instAreaHeight = 0;

function windowResized() {
  
  setCanvasSize();
  
  playButton.resize();
  
  let sliderWidth = canvasXStep;
  bpmSlider.position(canvasXStep * 0.5, canvasYStep * 2.25 + instAreaHeight);
  bpmSlider.style('width', sliderWidth + 'px');
  
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
  bpmSlider.position(canvasXStep * 0.5, canvasYStep * 2.25 + instAreaHeight);
  
  let sliderWidth = canvasXStep;
  bpmSlider.style('width', sliderWidth + 'px');
  
}

function drawInterfaceBounds() {
  
  let xs = canvasXStep;
  let ys = canvasYStep;
  
  fill(0,0,0,0);
  
  // Drum select
  rect(xs * 0.25, ys * 1.5, xs * 1.5, instAreaHeight);
  line(xs * 0.5, ys * 2, xs * 1.5, ys * 2);
  
  // Sequencer
  rect(xs * 2, ys * 1.5, xs * (canvasXDiv * (8.4/10)), instAreaHeight);
  
  // BPM select
  rect(xs * 0.25, ys * 1.88 + instAreaHeight, xs * 1.5, ys * 1);

}

function drawInterfaceLabels() {
  
  fill(0,0,0);
  textFont(lato);
  textAlign(CENTER, BASELINE);
  
  textSize(fontSize * 3);
  text("Poly-Taiko-1", canvasXStep * (canvasXDiv/2), canvasYStep);

  textSize(fontSize * 1.25);
  text("Drm Select", canvasXStep * 1, canvasYStep * 1.8);
  text("Sequence", canvasXStep * 8, canvasYStep * 1.8);
  text("BPM: " + bpmSlider.value(), canvasXStep, canvasYStep * 2.25 + instAreaHeight);
  
  textSize(fontSize);
  text("60", canvasXStep * 0.5, canvasYStep * 2.75 + instAreaHeight);
  text("200", canvasXStep * 1.5, canvasYStep * 2.75 + instAreaHeight);
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
  
  instruments.forEach((instrument, i) => {
    
    if(playing) {

      let thisBar = instrument.bars[instrument.barPos];
      let thisBeat = thisBar.beats[instrument.beatPos];
      
      let noteDuration = (60.0/bpm) * (4.0 / (thisBar.beatDivision * 4.0)) * 1000;
      let prevDuration = (60.0/bpm) * (4.0 / (instrument.prevBar.beatDivision * 4.0)) * 1000;
      let noteStart = noteDuration * (instrument.beatPos);
      //console.log(globalInterval);
      
      if(globalInterval >= noteStart - prevDuration && globalInterval <= noteStart) {         
                    
          if(instrument.type == 0) {
            //console.log("Global interv: " + globalInterval); 
           // console.log("Beat duration: " + beatDuration);
            //console.log("Note pos:      " + (noteDuration * (instrument.beatPos)));
            //console.log("Bar: " + thisBar.i);
            //console.log("Beat: " + thisBeat.j);
          }

          if(thisBeat.active) {
            
            if(instrument.type == 0) {
              console.log("Schedule: " + (noteStart - globalInterval));
            }
            
            let samples = drums[instrument.type].samples; 
            if(samples.length) {
              let sample = samples[Math.floor(random(samples.length))];

              let vol = 1;
              vol = drums[instrument.type].name == "shime"  ? 0.75 : vol;
              vol = drums[instrument.type].name == "nagado" ? 1.1  : vol;

              sample.play((noteStart - globalInterval)/1000, 1, vol, 0, 1.5);
            }
          }
      
          setTimeout(() => {        
            if(instrument.prevBeat) {
              instrument.prevBeat.color = null;
            }                
            thisBeat.color = [255, 255, 255];
            instrument.prevBeat = thisBeat;
            instrument.prevBar  = thisBar;
          }, (noteStart - globalInterval)/1000);
        
          instrument.beatPos++;
          if(instrument.beatPos > instrument.bars[instrument.barPos].beatDivision - 1) {
            instrument.beatPos = 0;
            instrument.barPos++;
          }
          if(instrument.barPos > 7) {
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
    
    if(instrument.bars.length != tsSliderVal * 2) {
      instrument.updateBarCount(tsSliderVal * 2);
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
      bpmSlider.position(canvasXStep * 0.5, canvasYStep * 2.25 + instAreaHeight);
    playButton.resize();
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
        if(mouseX >= beat.x && mouseX <= beat.x + canvasXStep/4 && 
          mouseY >= beat.y && mouseY <= beat.y + canvasXStep/4) {
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
    
    if(playing) {
      console.log(globalInterval);
      console.log("Beat!");
    }
    
    globalInterval = beatDuration - globalInterval;
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
  
  globalInterval = 0;

  instruments.forEach((instrument) => {
    
    instrument.beatPos = 0;
    instrument.barPos = 0;
    instrument.prevBar = instrument.bars[7];
    instrument.prevBeat = instrument.prevBar[instrument.prevBar.length];
    instrument.interval = 0;
    instrument.triggered = false;

    toggleSlider(instrument.slider);

    instrument.bars.forEach((bar) => {
      bar.beats.forEach((beat) => {
        beat.color = null;
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