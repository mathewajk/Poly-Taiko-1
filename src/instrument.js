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
    }) 
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
  
  calculateBarPos() {
    this.bars.forEach((bar, i) => {
      bar.x = this.x + canvasXStep/4 + (i % 4) * canvasXStep * 3;
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
  
  draw() {
    
    // Drum icon
    fill(this.color);
    push();
    noStroke();
    ellipse(this.x, this.y, this.c, this.c);
    pop();
    
    // Drum name
    fill(0, 0, 0);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    //text(drums[this.type].name, this.x, this.y);
    image(drums[this.type].img, this.x - (this.c + this.c/4)/2, this.y - (this.c + this.c/4)/2, this.c + this.c/4, this.c + this.c/4);
    
    // Separator
    line(this.x + canvasXStep * 1.4, this.y - canvasYStep/1.6, 
         this.x + canvasXStep * 13,    this.y - canvasYStep/1.6);
    
    textSize(fontSize/1.5);
    text("Global division: " + this.slider.value() + "s", this.x, this.y + canvasYStep / 1.1);
    text("Time signature: "  + this.tsSlider.value() + "/4", this.x, this.y + canvasYStep * 1.5);
    
    textSize(fontSize);
    
    this.bars.forEach((bar, i) => {     
      bar.draw(i, this.color);
    });
    
  }
  
  calculatePos(i) {
    
    let prevY = canvasYStep * 3;
    let prevLen = 0;
    
    if(i > 0){
      prevY = instruments[i-1].y;
      let offset = instruments[i-1].bars.length % 4 == 0 ? 0 : 1;
      prevLen = Math.max(Math.floor(instruments[i-1].bars.length / 4) + offset, 2);
    }
    
    this.y = canvasYStep * 0.8 * prevLen + prevY + canvasYStep/2;
    this.x = canvasXStep * 3.5;
    this.c = canvasXStep / 1.5;

    this.calculateBarPos();
    
    this.slider.position(this.x - canvasXStep/3, this.y + canvasYStep/2.5);
    this.tsSlider.position(this.x - canvasXStep/3, this.y + canvasYStep);
    
    let sliderWidth = canvasXStep * (2/3);
    this.slider.style('width', sliderWidth + 'px');
    this.tsSlider.style('width', sliderWidth + 'px');
  }
  
}