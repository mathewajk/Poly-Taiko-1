class Beat {
  constructor() {
    this.active = false;
    this.setSize(canvasXStep);
  }
  
  setSize() {
    this.size = canvasXStep/5;
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
    
    // Beat square
    rect(this.x, this.y, this.size, this.size);
    
    // Beat number
    fill(0, 0, 0);
    textAlign(CENTER,CENTER);
    text(i % beatsPerBar + 1, this.x + this.size/2, this.y + this.size/2);
  }
  
}