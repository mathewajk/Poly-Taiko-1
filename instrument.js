class Instrument {
  
  constructor(type) {
    this.type = type;
    this.beatsPerBar = 4;
    this.beats = []
    this.color = [Math.random() * 200 + 50, 
                  Math.random() * 100 + 50, 
                  Math.random() * 200 + 50];
    this.pos = 0;
    this.interval = 0;
    this.initial = false;
    this.triggered = false;
    
    
    for(let i = 0; i < this.beatsPerBar * bars; i++) {
      this.beats.push(new Beat());
    }
  }

  updateBeatCount(val) { 
    
    if(this.beatsPerBar < val) {
      for(let j=0; j < (val - this.beatsPerBar) * bars; j++) {
        this.beats.push(new Beat());
      }
    } else if(this.beatsPerBar > val) {
      for(let j=0; j < (this.beatsPerBar - val) * bars; j++) {
        this.beats.pop();
      }
    }  
    this.beatsPerBar = val;
    this.calculateBeatPos();
  }
  
  calculateBeatPos() {
    this.beats.forEach((beat, i) => {
      
      beat.setSize();
      
      let row = Math.floor(i / (this.beatsPerBar * 2))
      let col = (i % (this.beatsPerBar * 2));
      let step = (canvasWidth - canvasXStep * 2.25)/(this.beatsPerBar * 2);
      
      beat.x = this.x + canvasXStep + col * step;
      beat.y = this.y - canvasYStep/2 + row * canvasYStep/2;
    });
  }
  
  draw() {
    
    // Drum icon
    fill(this.color);
    ellipse(this.x, this.y, this.c, this.c);
    
    // Drum name
    fill(0, 0, 0);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    text(drums[this.type].name, this.x, this.y);
    
    // Separator
    line(canvasXStep * 1.75, this.y - canvasYStep/1.6, 
         canvasXStep * 9.25,    this.y - canvasYStep/1.6);
    
    textSize(fontSize/1.5);
    text("Beat division: " + this.slider.value() + "s", this.x, this.y + canvasYStep);
    
    textSize(fontSize);
    
    this.beats.forEach((beat, i) => {     
      beat.draw(i, this.beatsPerBar, this.color);
    });
    
  }
  
  calculatePos(i) {
    this.y = i * canvasYStep * 2 + canvasYStep * 2.75;
    this.x = canvasXStep * 0.75;
    this.c = canvasXStep / 2;

    this.calculateBeatPos();
    this.slider.position(this.x - canvasXStep/3, this.y + canvasYStep/2);
    
    let sliderWidth = canvasXStep * (2/3);
    this.slider.style('width', sliderWidth + 'px');
  }
}