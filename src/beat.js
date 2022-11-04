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
  
  handleBeat(instrument, timing) {
    
    if(!this.active) { return; }
    let samples = drums[instrument.type].samples; 
    
    if(samples.length) {
      let sample = samples[Math.floor(random(samples.length))];

      let vol = 1;
      vol = drums[instrument.type].name == "shime"  ? 0.75 : vol;
      vol = drums[instrument.type].name == "nagado" ? 1.1  : vol;

      if(this.active == 2) {
        vol *= 0.25;
      }
      sample.play(timing/1000, 1, vol, 0, 1);
    }
  }
  
  cycle() {
    this.active = (++this.active) % states.length;
  }
}