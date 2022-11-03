class Sequence {
  
    constructor(instruments) {
      this.instruments = instruments;
      this.colliding = null;
      
      this.height = 0;
      this.xOffset = 0;
      this.yOffset = 0;
    }
    
    setup() {
      
      let xs = canvasXStep;
      let ys = canvasYStep;
      
      this.instruments.forEach((instrument, i) => {  
      
        instrument.slider   = createSlider(2, 7, 4);
        instrument.tsSlider = createSlider(2, 10, 4);
  
        instrument.sliderPos   = 4;
        instrument.tsSliderPos = globalBeats;
        instrument.calculatePos(this, i);
      });
      
      this.calculateHeight();
  
    }
    
    calculateHeight() {
      let ys = canvasYStep;     
      this.height = 0;
      this.instruments.forEach((instrument, i) => {
        instrument.calculatePos(sequence, i); 
        let offset = instrument.bars.length % 4 == 0 ? 0 : 1;
        let rows = Math.floor(instrument.bars.length / 4) + offset;
        rows = Math.max(rows, 2);
        this.height += ys * 0.8 * rows + ys/2;
      });
      this.height += ys;
    }
    
    
    
    resize() {
      
      let xs = canvasXStep;
      let ys = canvasYStep; 
      
      this.instruments.forEach((instrument, i) => {
         instrument.calculatePos(this, i);
       });
      this.calculateHeight();
      
      this.xOffset = this.instruments[0].x - xs;
      this.yOffset = this.instruments[0].y;
    }
    
    draw(bpm, globalInterval, playing) {
      
      this.colliding = null;
      
      this.instruments.forEach((instrument, i) => {
  
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
        }
  
        // Check if the user has adjusted an instrument's global beat division or time signature
        let beatSliderVal = instrument.slider.value();  
        let tsSliderVal = instrument.tsSlider.value(); 
  
        if(instrument.sliderPos != beatSliderVal) {
            instrument.bars.forEach((bar) => {
              instrument.beatDivision = beatSliderVal;
              bar.updateBeatCount(beatSliderVal);
              instrument.sliderPos = beatSliderVal;
            });
        }
  
        if(instrument.tsSliderPos != tsSliderVal && instrument.bars.length != tsSliderVal * 2) {
         instrument.updateBarCount(tsSliderVal * 2);
         resizeInterface(this);
         instrument.tsSliderPos = tsSliderVal;
        }
  
        instrument.draw();
  
        instrument.bars.forEach((bar) => {
  
          if(mouseX >= bar.decButX && mouseX <= bar.decButX + bar.butW && 
              mouseY >= bar.decButY && mouseY <= bar.decButY + bar.butH) {
              cursor(CROSS);
              this.colliding = bar;
          }
  
         if(mouseX >= bar.incButX && mouseX <= bar.incButX + bar.butW && 
              mouseY >= bar.incButY && mouseY <= bar.incButY + bar.butH) {
              cursor(CROSS);
              this.colliding = bar;
          }
  
          bar.beats.forEach((beat) => {
            if(dist(mouseX, mouseY, beat.x + beat.size/2, beat.y + beat.size/2) <= beat.size/2) {
              cursor(CROSS);
              this.colliding = beat;
            }
          });
        });
  
        if(dist(mouseX, mouseY, instrument.x, instrument.y) <= instrument.c/2) {
            cursor(CROSS);
            this.colliding = instrument;
        }  
      });
    }
    
    checkCollisions() {
      
    }
    
    handleCollision() {
      
      let collider = sequence.colliding;
      
      if(Beat.prototype.isPrototypeOf(collider) || 
         Instrument.prototype.isPrototypeOf(collider)) {
        collider.handleCollision();
      }
    
      if(Bar.prototype.isPrototypeOf(collider)) {
        if(rectCollision(mouseX, mouseY, collider.decButX, collider.decButY, collider.butW, collider.butH)) {
            sequence.colliding.updateBeatCount(sequence.colliding.beats.length - 1);
        }
        
       if(mouseX >= sequence.colliding.incButX && mouseX <= sequence.colliding.incButX + sequence.colliding.butW && 
            mouseY >= sequence.colliding.incButY && mouseY <= sequence.colliding.incButY + sequence.colliding.butH) {
            cursor(CROSS);
            sequence.colliding.updateBeatCount(sequence.colliding.beats.length + 1);
        }
       }
    }
    
    
  }