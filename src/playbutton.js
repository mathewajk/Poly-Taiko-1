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
    let triangleFill = [0, 0, 0];
    let img = playOff;
    
    if(playing) {
        //console.log("In play button: " + interval);
        if(interval <= 100) {
            //buttonFill = [255, 255, 255];
            //triangleFill = this.color;
            img = playBeat;
        }
    }
    
    fill(buttonFill);
    push();
    noStroke();
    ellipse(playButton.x, playButton.y, playButton.c, playButton.c);
    pop();
    
    image(img, playButton.x - playButton.c/2 * 1.25, playButton.y - playButton.c/2 * 1.25, playButton.c * 1.25, playButton.c * 1.25);


    // fill(triangleFill);
    // triangle(playButton.x - (playButton.c/6), 
    //          playButton.y - (playButton.c/4), 
    //          playButton.x - (playButton.c/6), 
    //          playButton.y + (playButton.c/4), 
    //          playButton.x + (playButton.c/3.5), 
    //          playButton.y)
  }

  resize() {
    this.x = canvasXStep * canvasXDiv * 5/10;
    this.y = canvasYStep * 3.25 + instAreaHeight;
    this.c = canvasXStep;
  }
}