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
   
    if(playing) {
        //console.log("In play button: " + interval);
        if(interval <= 0) {
            buttonFill = [255, 255, 255];
            triangleFill = this.color;       
        }
    }
    
    fill(buttonFill);
    ellipse(playButton.x, playButton.y, playButton.c, playButton.c);

    fill(triangleFill);
    triangle(playButton.x - (playButton.c/6), 
             playButton.y - (playButton.c/4), 
             playButton.x - (playButton.c/6), 
             playButton.y + (playButton.c/4), 
             playButton.x + (playButton.c/3.5), 
             playButton.y)
  }

  resize() {
    this.x = canvasXStep * canvasXDiv * 5/10;
    this.y = canvasYStep * 9.25;
    this.c = canvasXStep/1.5;
  }
}