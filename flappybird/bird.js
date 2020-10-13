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

//class for the bird

class Bird {
    //function that runs when bird is created
    constructor() {
        this.pos = createVector(150, height / 2);
        this.rotation = 0;
        this.width = 75;
        this.height = 40;
        this.scale = 0.25;
        this.showHitBox = false;
        this.hitBoxDiameter = 45;
        this.velocity = createVector(0, 0);
        this.maxVelocity = 30;
        this.jumpPower = 13;
        this.gravity = 2;
        this.score = 0;
        this.highScore = 0;
        this.lastPressed = false;
    }

    //function to draw the bird
    draw() {
        push();
        imageMode(CENTER);
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        image(birdPicture, 0, 0, this.width, this.height);

        if (this.showHitBox) {
            stroke(255);
            fill(0, 0);
            circle(0, 0, this.hitBoxDiameter);
        }
        pop();
    }

    //updates the position of the bird
    update() {
        //gravity accelerates the bird down
        this.velocity.y += this.gravity;

        //if space is press and wasn't held down then make the bird jump
        if (keyIsDown(32) && !endScreen && !this.lastPressed) {
            this.lastPressed = true
            this.velocity.y = -this.jumpPower;
        } 
        //if space isn't pressed then it logs it
        else if (!keyIsDown(32) && !endScreen) {
            this.lastPressed = false;
        }
        //limits the falling speed
        if (abs(this.velocity.y) > this.maxVelocity) {
            constrain(this.velocity.y, -this.maxVelocity, this.maxVelocity);
        }
        //moves the bird based on its velocity
        this.pos.y += this.velocity.y;

        //finds how much the bird should be rotated based on its y velocity
        this.rotation = map(this.velocity.y, -this.maxVelocity, this.jumpPower, 0, 1);
        this.rotation = lerp(-70, 10, this.rotation);
        // console.log(this.rotation);

        //keeps the bird on the screen
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.velocity.y = 0;
            this.rotation = 0;
        } else if (this.pos.y > height - this.width / 2 + 10) {
            this.pos.y = height - this.width / 2 + 10;
            this.velocity.y = 0;
            this.rotation = lerp(this.rotation, 115, 0.8);
            endFrame = frameCount;
        }

        //checks if the bird passed the pipe and if so it rewards a point
        if (!endScreen) {
            for (let i = 0; i < pipes.length; i++) {
                if (pipes[i].pos < this.pos.x && pipes[i].pos + pipes[i].speed >= this.pos.x) {
                    this.score += 1;
                    // console.log(this.score);

                    if (this.score > this.highScore) {
                        this.highScore = this.score;
                        saveHighScore();
                        // console.log("hs: " + this.highScore);
                    }
                }
            }
        }

        // console.log(this.pos, this.previousePos);
    }

    //method that checks to see if the bird has died
    checkDead() {
        //if the bird hits the ground it dies
        if (this.pos.y >= height - this.width / 2 + 10) {
            return true;
        }
        //if the bird hits a pipe it dies
        for (let i = 0; i < pipes.length; i++) {
            if (pipes[i].checkCollision(this.pos.x, this.pos.y, this.hitBoxDiameter)) {
                return true;
            }
        }

        return false;
    }
}