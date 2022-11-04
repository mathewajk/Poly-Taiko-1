class Bar {
  
  constructor(beatDivision, i, x, y) {
    
    this.beatDivision = beatDivision;
    
    this.i = i;
    this.x = x;
    this.y = y;
    
    this.beats = [];
    
    for(let j=0; j < this.beatDivision; j++)
    {
      this.beats.push(new Beat(i, j));
    }
    
    this.calculateButtonPos();
    
  }
  
  updateBeatCount(val) { 
    
    
    if(val < 2 || val > 7) {
      return;
    }
    
    this.beatDivision = val;
    
    if(this.beats.length < val) {
      for(let j=0; j < (val - this.beats.length) * bars; j++) {
        this.beats.push(new Beat(this.i, j + val - 1));
      }
    } else if(this.beats.length > val) {
      for(let j=0; j < (this.beats.length - val) * bars; j++) {
        this.beats.pop();
      }
    }  
    this.calculateBeatPos();
  }
  
  calculateBeatPos() {
    
    this.beats.forEach((beat, i) => {
      
      beat.setSize();
      
      let row = Math.floor(i / (this.beatDivision * 2))
      let col = (i % (this.beatDivision * 2));
      let step = (canvasXStep * 3)/(this.beatDivision);
      
      beat.x = this.x + canvasXStep + col * step;
      beat.y = this.y - canvasYStep/2 + row * canvasYStep/2;
    });
    
  }
  
  calculateButtonPos() {
    this.decButX = this.x + canvasXStep;
    this.decButY = this.y - canvasYStep/1.5;
    
    this.butW = canvasXStep * 0.25;
    this.butH = canvasYStep/10;
    
    this.incButX = this.x + canvasXStep * 3.5;
    this.incButY = this.y - canvasYStep/1.5;
  }
  
  handleCollision() {
    if(rectCollision(mouseX, mouseY, this.decButX, this.decButY, this.butW, this.butH)) {
        this.updateBeatCount(this.beats.length - 1);
      }
  }
  
  draw(i, col) {
    
    fill(col[0], col[1], col[2], 100);
    
    rect(this.decButX, this.decButY, this.butW, this.butH);
    rect(this.incButX, this.incButY, this.butW, this.butH);
    
    fill(50, 50, 50)
    textAlign(CENTER, BASELINE);
    text(">>", this.incButX + this.butW/2, this.incButY + this.butH);
    text("<<", this.decButX + this.butW/2, this.decButY + this.butH);

    text(this.beatDivision, this.x + canvasXStep * 2.5, this.decButY - this.butH * 1.5);
    
    push();
    stroke(100);
    line(this.decButX + this.butW/2, this.decButY - this.butH, 
         this.incButX + this.butW/2, this.incButY - this.butH);
    
    line(this.decButX + this.butW/2, this.decButY - this.butH, 
         this.decButX + this.butW/2, this.incButY - this.butH/2);
    line(this.incButX + this.butW/2, this.decButY - this.butH, 
         this.incButX + this.butW/2, this.incButY - this.butH/2);
    pop();
    
    this.beats.forEach((beat, j) => {
      beat.draw((i * 4 + j), this.beatDivision, col);
    });
  }
  
}

class Instrument {
  
  constructor(type) {
    
    this.i = type;
    this.type = type;
    
    this.beatDivision = 4;
    this.bars  = [];
    
    this.x = 0;
    this.y = 0;
    
    this.beatPos = 0;
    this.barPos = 0;
    
    this.color = [Math.random() * 200 + 50, 
                  Math.random() * 100 + 50, 
                  Math.random() * 200 + 50];
    this.pos = 0;
    this.interval = 0;
    this.initial = false;
    
    for(let i = 0; i < bars; i++) {
      this.bars.push(new Bar(this.beatDivision, i, this.x, this.y));
    }
    this.prevBar = this.bars[7];
  }
  
  cycle() {
    this.type = (++this.type) % drums.length; 
  }
  
  checkCollisions() {
    if(rectCollision(mouseX, mouseY, this.x - canvasXStep/1.5, this.y + canvasYStep/2, canvasXStep/3, canvasXStep/3)) {
      if(this.beatDivision > 2) {
        this.beatDivision--;
        this.bars.forEach((bar) => {
          bar.updateBeatCount(this.beatDivision);
        });
      }
      return;
    }
    
    if(rectCollision(mouseX, mouseY, this.x + canvasXStep/2, this.y + canvasYStep/2, canvasXStep/3, canvasXStep/3)) {
      if(this.beatDivision < 7) {
        this.beatDivision++;
        this.bars.forEach((bar) => {
          bar.updateBeatCount(this.beatDivision);
        });
      }
      return;
    }
    
    if(rectCollision(mouseX, mouseY, this.x - canvasXStep/1.5, this.y + canvasYStep, canvasXStep/3, canvasXStep/3)) {
      this.updateBarCount(this.bars.length - 2);
      resizeInterface();
    }

    if(rectCollision(mouseX, mouseY, this.x + canvasXStep/2, this.y + canvasYStep, canvasXStep/3, canvasXStep/3)) {
      this.updateBarCount(this.bars.length + 2);
      resizeInterface();
    }
  }
  
  handleCollision() {
    this.cycle();
  }
  
  calculateBarPos() {
    this.bars.forEach((bar, i) => {
      bar.x = this.x + canvasXStep/2 + (i % 4) * canvasXStep * 3;
      bar.y = this.y + canvasYStep/2 + Math.floor(i / 4) * canvasYStep / 1.25;
      bar.calculateButtonPos();
      bar.calculateBeatPos();
    });

  }
  
  updateBarCount(val) { 
    
    if(this.bars.length < val) {
      for(let j=0; j < (val - this.bars.length) * bars; j++) {
        this.bars.push(new Bar(this.beatDivision, j + this.bars.length - 1, this.x, this.y));
      }
    } else if(this.bars.length > val) {
      for(let j=0; j < (this.bars.length - val) * bars; j++) {
        this.bars.pop();
      }
    }
    
    this.calculateBarPos();
    
  }
  
  turnOff() {
  this.bars.forEach((bar) => {
      bar.beats.forEach((beat) => {
        beat.triggering = false;
      });
    });
  }
  
  reset() {
    this.beatPos = 0;
    this.barPos = 0;
    this.prevBar = this.bars[this.bars.length-1];
    this.prevBeat = this.prevBar[this.prevBar.length-1];
    this.interval = 0;
    this.triggered = false;
  }
  
  draw() {
    
    // Drum icon
    fill(this.color);
    push();
    noStroke();
    ellipse(this.x, this.y, this.c, this.c);
    pop();
    
    push();
    fill(this.color);
    
    rect(this.x - canvasXStep/1.5, this.y + canvasYStep/2, canvasXStep/3, canvasXStep/3);
    rect(this.x + canvasXStep/2, this.y + canvasYStep/2, canvasXStep/3, canvasXStep/3);
    
    rect(this.x - canvasXStep/1.5, this.y + canvasYStep, canvasXStep/3, canvasXStep/3);
    rect(this.x + canvasXStep/2, this.y + canvasYStep, canvasXStep/3, canvasXStep/3);
    pop();
    
    // Drum name
    fill(0, 0, 0);
    textSize(fontSize * 1.5);
    textAlign(CENTER, CENTER);
    
    text("-", this.x - canvasXStep/1.5 + canvasXStep/6, this.y + canvasYStep/2.25 + canvasXStep/6);
    text("+", this.x + canvasXStep/2 + canvasXStep/6, this.y + canvasYStep/2.25 + canvasXStep/6);
    
    text("-", this.x - canvasXStep/1.5 + canvasXStep/6, this.y + canvasYStep/1.05 + canvasXStep/6);
    text("+", this.x + canvasXStep/2 + canvasXStep/6, this.y + canvasYStep/1.05 + canvasXStep/6);
    
    //text(drums[this.type].name, this.x, this.y);
    image(drums[this.type].img, this.x - (this.c + this.c/4)/2, this.y - (this.c + this.c/4)/2, this.c + this.c/4, this.c + this.c/4);
    
    // Separator
    line(this.x + canvasXStep * 1.75, this.y - canvasYStep/1.6, 
         this.x + canvasXStep * 13,  this.y - canvasYStep/1.6);
    
    textSize(fontSize * 1.25);
    text("" + this.beatDivision + "s", this.x + canvasXStep/15, this.y + canvasYStep/1.5);
    text("" + (this.bars.length/2) + "/4", this.x + canvasXStep/15, this.y + canvasYStep * 1.1);
    
    textSize(fontSize);
    
    this.bars.forEach((bar, i) => {     
      bar.draw(i, this.color);
    });
    
  }
  
  incrementPos() {
    this.beatPos++;
    if(this.beatPos >= this.bars[this.barPos].beatDivision) {
      this.beatPos = 0;
      this.barPos++;
    }
    if(this.barPos >= this.bars.length) {
      this.barPos = 0;
    }
  }
  
  handleInput() {
    if(rectCollision(mouseX, mouseY, this.x - canvasXStep/1.5, this.y + canvasYStep/2, canvasXStep/3, canvasXStep/3) || 
    rectCollision(mouseX, mouseY, this.x + canvasXStep/2, this.y + canvasYStep/2, canvasXStep/3, canvasXStep/3) || 
    
    rectCollision(mouseX, mouseY, this.x - canvasXStep/1.5, this.y + canvasYStep, canvasXStep/3, canvasXStep/3) || 
    rectCollision(mouseX, mouseY, this.x + canvasXStep/2, this.y + canvasYStep, canvasXStep/3, canvasXStep/3)) {
      cursor(CROSS);
    }
  }
  
  getPrev() {
    let prevBeat = this.beatPos - 1;
    let prevBar = this.barPos;
    
    if(prevBeat < 0) {
      prevBar = this.barPos - 1;
      if(prevBar < 0) {
        prevBar = this.bars.length - 1;
      }
      prevBeat = this.bars[prevBar].beats.length - 1;
    }
    
    return([this.bars[prevBar], this.bars[prevBar].beats[prevBeat]]);
    
  }
  
  calculatePos(sequence, i) {
    
    let prevY = canvasYStep * 3;
    let prevLen = 0;
    
    if(i > 0){
      prevY = sequence.instruments[i-1].y;
      let offset = sequence.instruments[i-1].bars.length % 4 == 0 ? 0 : 1;
      prevLen = Math.max(Math.floor(sequence.instruments[i-1].bars.length / 4) + offset, 2);
    }
    
    this.y = canvasYStep * prevLen * 0.8 + prevY + canvasYStep/2;
    this.x = canvasXStep * 3.5;
    this.c = canvasXStep / 1.5;

    this.calculateBarPos();
  
  }
  
}