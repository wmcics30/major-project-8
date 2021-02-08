// Pet Game
// Jinny Kim
// 02. 08. 2021
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let drawTime = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  
}

function mousePressed() {
  if (drawTime) {
    ellipse(mouseX, mouseY, 3, 3);
  }
}


