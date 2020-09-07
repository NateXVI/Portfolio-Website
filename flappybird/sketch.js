/*######################
The way I ran this code is through the live server extension on Visual Studio Code.
If you want to run this code to test it download VS Code, and install the "Live Server" extension.
Then open the project folder, right click on the html file, and click open with live server.
It will open the game in a browser window. I have only ever tested it in Chrome, so I recommend running it in there.
If it automatically opens in an incompatible web browser, copy the link and open it in Google Chrome.

Hopefully that is enough information for anyone reading this to run the code.

Author: Nathan Diven
Date: 1/7/2020
########################*/

let flappyFont;
let flappyFont2;
let backgroundColor;
let gameStarted = false;
let endScreen = false;
let startFrame;
let endFrame;
let bird;
let pipes = [];

//funtion runs before the setup function
function preload() {
  //variable that holds the picture for the bird
  birdPicture = loadImage("flappybird/assets/bird.png");
  //variable that holds the first font
  flappyFont = loadFont("http://natediven.com/flappybird/assets/Pixeled.ttf");
  //variable that holds the second font
  flappyFont2 = loadFont("http://natediven.com/flappybird/assets/flappy.TTF");
}

//function runs once at the start of the program
function setup() {
  //creates the canvas
  createCanvas(1000, 600);
  //sets the background color
  backgroundColor = color(0, 200, 255);
  background(backgroundColor);
  //locks framerate
  frameRate(30);
  //sets angle mode to degrees
  angleMode(DEGREES);

  //create the bird object
  bird = new Bird();

  //creates the pipe objects
  pipes.push(new Pipe(width + 100));

  //set text color yellow
  fill(255, 255, 0);
  //set outline color to black
  stroke(0);
  //set boarder thickness
  strokeWeight(2);
  //set font to flappyFont with the fontsize 0
  textFont(flappyFont, 0);
  //set text alignment
  textAlign(CENTER, CENTER);
  //write the text
  text("Flappy Bird", width / 2, height / 2 - 200);

  //ignore this.............................
  // for (let i = 0; i < 75 * 1000; i++) {
  //     background(backgroundColor);
  //     textSize(i / 1000);
  //     //text('Flappy Bird', width / 2, height / 2 - 150);
  // }
}

//function loops after setup function runs
function draw() {
  //if statement for the starting animation
  if (frameCount <= 75) {
    //does the starting animation until frame 76
    background(backgroundColor);
    drawBackground();
    textSize(frameCount);
    text("Flappy Bird", width / 2, height / 2 - 150);
  }
  //if the starting animation is done this stuff happens
  else {
    //game will run if the game is started and the bird isn't dead
    if (gameStarted && !endScreen) {
      //These funtions are self explanitory
      background(backgroundColor);
      drawBackground();
      runGame();
    }
    //this will run if the game is started, but the bird is dead
    else if (gameStarted && endScreen) {
      //Draws the background
      background(backgroundColor);
      drawBackground();
      //and then the bird and pipes
      bird.update();
      for (let i = 0; i < pipes.length; i++) {
        pipes[i].draw();
      }
      bird.draw();

      //Shows score and high score when the bird dies
      drawEndScreen();

      //starts the game again once "n" is pressed
      if (keyIsDown(78)) {
        startGame();
        endScreen = false;
      }
    }
    //does this if the game hasn't started yet
    else {
      //draws title screen
      background(backgroundColor);
      drawBackground();
      text("Flappy Bird", width / 2, height / 2 - 150);
      push();
      //draws instruction text
      fill(255);
      textSize(20);
      text("space to start", width / 2, height / 2 + 50);
      pop();

      //checks to see if space is pressed so game can start
      if (keyIsDown(32)) {
        startGame();
      }
    }
  }
}

//draws background things
function drawBackground() {
  //sets the colors for the hills
  push();
  fill(0, 255, 0);
  stroke(0, 200, 0);
  strokeWeight(5);

  //both for loops draw the green hills
  for (let i = 0; i < 6; i++) {
    const r = 300 + 50 * pow(-1, i);
    circle(i * (width / 5), height, r);
  }
  for (let i = 0; i < 17; i++) {
    const r = 100 + 20 * pow(-1, i);
    circle(width - i * (width / 15), height, r);
  }

  // sets colors for the clouds
  fill(255);
  stroke(255);
  strokeWeight(3);
  //draws clouds
  let cloudr = 30;
  let cloudx = 100;
  let cloudy = 100;
  for (let i = 0; i < 3; i++) {
    const x = cloudx + cloudr / 2 + i * cloudr;
    circle(x, cloudy - 15, cloudr);
  }
  for (let i = 0; i < 3; i++) {
    const x = cloudx + cloudr / 2 + i * cloudr;
    circle(x, cloudy + cloudr / 2, cloudr);
  }
  for (let i = 0; i < 4; i++) {
    const x = cloudx + i * 30;
    circle(x, cloudy, cloudr);
  }

  cloudx = 700;
  cloudy = 200;
  for (let i = 0; i < 3; i++) {
    const x = cloudx + 15 + i * 30;
    circle(x, cloudy - 15, 50);
  }
  for (let i = 0; i < 3; i++) {
    const x = cloudx + 15 + i * 30;
    circle(x, cloudy + 15, 50);
  }
  for (let i = 0; i < 4; i++) {
    const x = cloudx + i * 30;
    circle(x, cloudy, 50);
  }

  pop();
}

//function that starts the game
function startGame() {
  gameStarted = true;
  // endScreen = false;
  startFrame = frameCount;
  bird.pos.x = 150;
  bird.pos.y = height / 2 - 100;
  bird.rotation = 0;
  bird.score = 0;
  pipes = [];
  pipes.push(new Pipe(width + 100));
}

//function that runs the game
function runGame() {
  //does bird intro animation
  let aniframe = frameCount - startFrame;
  if (aniframe <= 60) {
    bird.pos.x = lerp(-75, 150, aniframe / 60);
    bird.draw();
    displayScore();
  }
  //runs the game once the animation is finished
  else {
    //loops through the pipes and updates each of them
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].update();
      pipes[i].draw();
    }
    //updates the bird
    bird.update();
    bird.draw();
    //shows the score at the top
    displayScore();

    //if the bird is dead then end the game
    if (bird.checkDead()) endGame();

    //function that adds pipes and then deletes them when they go off screen
    updatePipes();
  }
}

//function that ends the game
function endGame() {
  endScreen = true;
}

//howmany pixels between the middle of the pipes
let pipeGap = 200;

//function that updates add and deletes pipes from array
function updatePipes() {
  if (pipes[pipes.length - 1].pos <= width - pipeGap) {
    pipes.push(new Pipe(width + 100));
  }
  if (pipes[0].pos <= -100) {
    pipes.splice(0, 1);
  }
}

//shows the score at the top during gameplay
function displayScore() {
  push();
  fill(255);
  stroke(0);
  strokeWeight(10);
  textFont(flappyFont2, 50);
  textAlign(CENTER);
  text(bird.score, width / 2, 60);
  pop();
}

//draws the end screen that shows high score and score
function drawEndScreen() {
  push();
  rectMode(CENTER);
  textAlign(LEFT);
  textFont(flappyFont2, 30);
  fill(255, 200, 0);
  stroke(0);
  strokeWeight(5);
  rect(width / 2, height / 2, 500, 300);
  fill(255);
  strokeWeight(3);
  text("SCORE: " + bird.score, width / 2 - 200, height / 2 - 80);
  text("HIGH SCORE: " + bird.highScore, width / 2 - 200, height / 2 - 0);
  textAlign(CENTER);
  text("n TO PLAY AGAIN", width / 2, height / 2 + 100);
  pop();
}
