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

//class for the pipes
class Pipe {
    //initializes new pipe objects
    constructor(x) {
        this.pos = x;
        this.gap = 150;
        this.width = 80;
        this.endWidth = 90;
        this.endHeight = 50;
        this.top = random(100, 350);
        this.speed = 9;
    }

    //method that draws individual pipes
    draw() {
        push();
        fill(0, 255, 75);
        stroke(0);
        strokeWeight(2);
        rect(this.pos - this.width / 2,
            -5, this.width, this.top + 5);
        rect(this.pos - this.endWidth / 2, this.top - this.endHeight, this.endWidth, this.endHeight);
        rect(this.pos - this.width / 2, this.top + this.gap, this.width, height);
        rect(this.pos - this.endWidth / 2, this.top + this.gap, this.endWidth, this.endHeight);
        pop();
    }

    //moves the pipe
    update() {
        this.pos -= this.speed;
    }

    //checks collision with a circle with certain diameter
    checkCollision(x, y, d) {
        //circle x pos
        let cx = x;
        //circle y pos
        let cy = y;
        //circle radius
        let cr = d / 2;
        //left boundary
        let left = this.pos - this.endWidth / 2;
        //right boundary
        let right = this.pos + this.endWidth / 2;
        //top boundary
        let top = this.top;
        //bottom boundary
        let bottom = this.top + this.gap;
        let testX;
        let topTestY;
        let bottomTestY;

        //checks to see if there is a collision
        if (cx + cr >= left && cx - cr <= right) {
            if (cy - cr <= top || cy + cr >= bottom) {
                return true;
            }
        }

        // if (cx < left) testX = left;
        // else if (cx > right) testX = right;

        //if there isn't a collision then it returns false
        return false;

    }
}