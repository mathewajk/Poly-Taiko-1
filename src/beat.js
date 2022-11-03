let states = ["maru", "don", "tsu", "ka"];

class Beat {
  constructor(i, j) {
    this.active = 0;
    this.triggering = false;
    
    this.setSize();
    this.i = i;
    this.j = j;
  }
  
  setSize() {
    this.size = canvasXStep/5 * 2.5;
  }
  
  draw(i, beatsPerBar, col) {
    
    if(this.color) {
      // Playing beats are set to white
      fill(this.color);
    }
    else {  
      // ColorIntl defines gradient step based on
      // The number of beats in a bar
      let colorInterval = Math.floor(i / beatsPerBar)/4;

      if(this.active) {
          // Brighten selected beats
          fill(col[1]+50, col[2]+50, col[0]+50);
      } else {
        // Create a subtle gradient
        fill(col[0] + colorInterval * 50, 
             col[1] + colorInterval * 25, 
             col[2] + colorInterval * 50);
      }
    }
    
    let category = this.triggering ? "Play" : "";
    image(images[states[this.active] + category].img, this.x, this.y, this.size, this.size);
  }
  
  handleCollision() {
    this.cycle();
  }
  
  cycle() {
    this.active = (++this.active) % states.length;
  }
}