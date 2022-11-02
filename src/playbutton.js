class PlayButton {
  
  constructor() {
    
    this.x = canvasXStep * canvasXDiv * 5/10;
    this.y = canvasYStep * 9.25;
    this.c = canvasXStep/1.5;
    
    this.interval = 0;
    
    this.color = [];
    
  }

  draw(interval) {
  
    let buttonFill = this.color;
    let img = images.playOff.img;
    
    if(playing && interval <= 100) {
      img = images.playOn.img;
    }
    
    fill(buttonFill);
    push();
    noStroke();
    ellipse(this.x, this.y, this.c, this.c);
    pop();
    
    image(img, this.x - this.c/2 * 1.25, this.y - this.c/2 * 1.25, this.c * 1.25, this.c * 1.25);
  }

  resize(height) {
    this.x = canvasXStep * canvasXDiv * 5/10;
    this.y = canvasYStep * 3.25 + height;
    this.c = canvasXStep;
  }
}