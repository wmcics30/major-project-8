// Bunny vs Bunny
// Jinny Kim
// 02. 08. 2021
//
// Extra:

//NOTE TO SELF: 
//    NEXT STEPS:
//        - Fix audio !!! or Fix setup() call when pressing back from tic tac toe
//        - Closet Icon + Entrance to closet
//        - Carrot Gameplay
//        - Scoring system
//        - MORE (Check agenda)


//GLOBAL VARIABLES

let gameState = "start"; 

//tic tac toe
let grid;
let rows, cols, cellSize;
let ghostImg, snowImg;
let victoryScreen, victoryScreenImg, otherVictoryScreenImg, drawScreenImg, startMenuImg;

let bunVsComp, bunVsBun, playAgainButton;
let optionButtonWidth, optionButtonHeight, optionButtonX, pvpButtonY, pvcompButtonY;
let playButtonWidth, playButtonHeight, playButtonX, playButtonY;

let yourTurn;
let waitTime = 2000;
let lastSwitchTime = 0;

let randomX, randomY;
let blanks; //to count how many tiles are empty (for a draw situation)

let bgMusic, playerClick, otherClick;


//general
let mainMenuImg;
let lobbyImg, closetIcon;

let backButtonImg, backButtonImgX, backButtonImgY, backButtonImgWidth, backButtonImgHeight;

let startButtonImg, startButtonX, startButtonY, startButtonWidth, startButtonHeight;
let ticTacToeIcon, ticTacToeIconX, ticTacToeIconY, ticTacToeIconWidth, ticTacToeIconHeight;
let carrotGameIcon, carrotGameIconX, carrotGameIconY, carrotGameIconWidth, carrotGameIconHeight;
let shopIcon, shopIconX, shopIconY, shopIconWidth, shopIconHeight;

let wallet = 0; //player is poor :(

//shop
let shopBgImg, shopMenuImg;

//carrot game
let carrotGameBgImg, carrotImg;

class Carrot {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.dx = 0;
    this.dy = random(5, 10);
    this.notCaught = true;
    
  }

  move() {
    this.y += this.dy;
  }

  display() {
    if (this.notCaught) {
      image(carrotImg, this.x, this.y, 15, 15);
    }
  }
}


//PRELOAD + SETUP
function preload() {
  //sound preload
  bgMusic = loadSound("assets/bgMusic.ogg");
  playerClick = loadSound("assets/playerSound.wav");
  otherClick = loadSound("assets/otherPlayerSound.wav");

  //"X" and "O" image preload
  ghostImg = loadImage("assets/ghostBun.png");
  snowImg = loadImage("assets/snowBun.png");

  //end game screen image preload
  victoryScreenImg = loadImage("assets/snowBunWin.png");
  otherVictoryScreenImg = loadImage("assets/ghostBunWin.png");
  drawScreenImg = loadImage("assets/drawScreen.png");
  startMenuImg = loadImage("assets/menuScreen.png");

  //button image preload
  bunVsComp = loadImage("assets/bunAndComp.png");
  bunVsBun = loadImage("assets/pvp.png");
  playAgainButton = loadImage("assets/playAgain.png");

  startButtonImg = loadImage("assets/start-button.png");
  backButtonImg = loadImage("assets/back-button.png");
  
  ticTacToeIcon = loadImage("assets/tic-tac-toe-button.png");
  carrotGameIcon = loadImage("assets/carrot-game-button.png");
  shopIcon = loadImage("assets/shop-button.png");
  closetIcon = loadImage("assets/customize-button.png");

  //background images preload
  mainMenuImg = loadImage("assets/start-menu.png");
  lobbyImg = loadImage("assets/lobby-bg.png");

  //shop
  shopBgImg = loadImage("assets/shop-bg.png");
  shopMenuImg = loadImage("assets/shop-menu.png");

  //carrot game
  carrotGameBgImg = loadImage("assets/carrot-game-bg.png");
  carrotImg = loadImage("assets/good-carrot.png");


}

function displayMainStart() {
  if (gameState === "start") {
    image(mainMenuImg, 0, 0, width, height);
    image(startButtonImg, startButtonX, startButtonY, startButtonWidth, startButtonHeight);
  }
}

function displayLobby() {
  if (gameState === "lobby") {

    //lobby bg
    image(lobbyImg, 0, 0, width, height);

    //icons in the lobby:
    image(ticTacToeIcon, ticTacToeIconX, ticTacToeIconY, ticTacToeIconWidth, ticTacToeIconHeight);
    image(carrotGameIcon, carrotGameIconX, carrotGameIconY, carrotGameIconWidth, carrotGameIconHeight);
    image(shopIcon, shopIconX, shopIconY, shopIconWidth, shopIconHeight);
        //closet icon

  }
}

function displayCarrotGameBg() {
  if (gameState === "carrot game") {
    image(carrotGameBgImg, 0, 0, width, height);
  }
}

function displayStart() {
  if (gameState === "startTicTacToe") {
    image(startMenuImg, 0, 0, width, height);
    image(bunVsComp, optionButtonX, pvcompButtonY, optionButtonWidth, optionButtonHeight);
    image(bunVsBun, optionButtonX, pvpButtonY, optionButtonWidth, optionButtonHeight);
  }
}

function shouldBackButtonClick() {
  return gameState === "startTicTacToe" || gameState === "comp" || gameState === "pvp" || gameState === "carrot game" || gameState === "shop";
}

function displayBackButton() {
  if (shouldBackButtonClick()) {
    image(backButtonImg, backButtonImgX, backButtonImgY, backButtonImgWidth, backButtonImgHeight);
  }
}

function displayShop() {
  if (gameState === "shop") {
    image(shopBgImg, 0, 0, width, height);
  }
}

function displayPlayAgain() {
  if (gameState !== "startTicTacToe" && gameEnd()) {
    image(playAgainButton, playButtonX, playButtonY, playButtonWidth, playButtonHeight);
  }
}

function gameEnd() {
  return victoryScreen === "other player win" || victoryScreen === "main player win" || victoryScreen === "draw";
}

function setup() {
  bgMusic.stop(); //put stop at the beginning so when setup is called again, the songs don't layer on top
  bgMusic.loop();

  //makes sure canvas is square no matter the window's dimensions
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight, windowHeight);
  }
  else if (windowHeight > windowWidth) {
    createCanvas(windowWidth, windowWidth);
  }
  else {
    createCanvas(windowWidth, windowHeight);
  }
  
  grid = createEmptyBoard();
  
  //setting up values
  rows = grid.length;
  cols = grid[0].length;
  cellSize = width / cols;
  
  optionButtonWidth = bunVsComp.width * 0.4;
  optionButtonHeight = bunVsComp.height * 0.4;
  optionButtonX = width *0.7;
  pvpButtonY = height * 0.7;
  pvcompButtonY = height * 0.5;
  
  playButtonWidth = playAgainButton.width * 0.5;
  playButtonHeight = playAgainButton.height * 0.5;
  playButtonX = width/2 - playButtonWidth/2;
  playButtonY = height * 0.7;

  startButtonWidth = startButtonImg.width * 0.35;
  startButtonHeight = startButtonImg.height * 0.35;
  startButtonX = width/2 - startButtonWidth/2;
  startButtonY = height * 0.75;

  backButtonImgWidth = backButtonImg.width * 0.4;
  backButtonImgHeight = backButtonImg.height * 0.4;
  backButtonImgX = width * 0.05;
  backButtonImgY = height * 0.9;

  ticTacToeIconWidth = ticTacToeIcon.width * 0.3;
  ticTacToeIconHeight = ticTacToeIcon.height *0.3;
  ticTacToeIconX = width * 0.85;
  ticTacToeIconY = height * 0.25;

  carrotGameIconWidth = ticTacToeIconWidth; //the icons in the right side of the lobby have same size
  carrotGameIconHeight = ticTacToeIconHeight;
  carrotGameIconX = ticTacToeIconX;
  carrotGameIconY = ticTacToeIconY + ticTacToeIconHeight + 40;

  shopIconWidth = ticTacToeIconWidth;
  shopIconHeight = ticTacToeIconHeight;
  shopIconX = ticTacToeIconX;
  shopIconY = carrotGameIconY + carrotGameIconHeight + 40;

  
  victoryScreen = false;
  yourTurn = true;
  
  blanks = 9;
}

function checkBackButton() {
  if (shouldBackButtonClick()) {
    if (mouseX > backButtonImgX && mouseX < backButtonImgX + backButtonImgWidth && mouseY > backButtonImgY && mouseY < backButtonImgY + backButtonImgHeight) {
      gameState = "lobby";
      setup();
    }
  }
}

//INTERACTIVE CONTROLS

function mousePressed() {
  if (gameState === "start") {
    if (mouseX > startButtonX && mouseX < startButtonX + startButtonWidth && mouseY > startButtonY && mouseY < startButtonY + startButtonHeight) {
      gameState = "lobby";
    }
  }
  //icons in the lobby
  else if (gameState === "lobby") {
    //tic tac toe
    if (mouseX > ticTacToeIconX && mouseX < ticTacToeIconX + ticTacToeIconWidth && mouseY > ticTacToeIconY && mouseY < ticTacToeIconY + ticTacToeIconHeight) {
      gameState = "startTicTacToe";
    }
    //carrot game
    if (mouseX > carrotGameIconX && mouseX < carrotGameIconX + carrotGameIconWidth && mouseY > carrotGameIconY && mouseY < carrotGameIconY + carrotGameIconHeight) {
      gameState = "carrot game";
    }
    //shop
    if (mouseX > shopIconX && mouseX < shopIconX + shopIconWidth && mouseY > shopIconY && mouseY < shopIconY + shopIconHeight) {
      gameState = "shop";
    }
  }

  //shop
  else if (gameState === "shop") {
    checkBackButton();
  }

  //carrot game
  else if (gameState === "carrot game") {
    checkBackButton();
  }

  //tic tac toe start menu
  else if (gameState === "startTicTacToe") {
    checkBackButton();
    //pvp button
    if (mouseX > optionButtonX && mouseX < optionButtonX + optionButtonWidth && mouseY > pvpButtonY && mouseY < pvpButtonY + optionButtonHeight) {
      gameState = "pvp";
      yourTurn = true;
    }
    //player vs computer button
    if (mouseX > optionButtonX && mouseX < optionButtonX + optionButtonWidth && mouseY > pvcompButtonY && mouseY < pvcompButtonY + optionButtonHeight) {
      gameState = "comp";
      yourTurn = true;
    }
  }
  
  //play again button
  else if (gameEnd()) {
    if (mouseX > playButtonX && mouseX < playButtonX + playButtonWidth && mouseY > playButtonY && mouseY < playButtonY + playButtonHeight) {
      setup();
    }
    checkBackButton();
  }

  //placing tokens
  else if (gameState !== "startTicTacToe" && noBlanks() === false) {

    checkBackButton();

    let x = Math.floor(mouseX / cellSize);
    let y = Math.floor(mouseY / cellSize);
  
    if (yourTurn && grid[y][x] === 0) { //o
      playerClick.play();
      
      grid[y][x] = 2;
      yourTurn = !yourTurn;
      lastSwitchTime = millis();
      blanks--;
      
    }
    if (gameState === "pvp" && !yourTurn && grid[y][x] === 0) {
      otherClick.play();
      
      grid[y][x] = 1;
      yourTurn = !yourTurn;
      blanks--;
    }

  }
}

//FUNCTIONS FOR THE BOARD ITSELF
function createEmptyBoard() {
  let emptyBoard = [];
  
  for (let y = 0; y < 3; y++) {
    emptyBoard.push([]);
    for (let x = 0; x < 3; x++) {
      emptyBoard[y].push(0);
    }
  }
  return emptyBoard;
}

function displayBoard() {
  if (gameState === "comp" || gameState === "pvp") {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x] === 0) {
          fill("white");
          rect(x*cellSize, y*cellSize, cellSize, cellSize); //blank space
        }
        else if (grid[y][x] === 1) {
          image(ghostImg, x*cellSize, y*cellSize, cellSize, cellSize); //X
        }
        else if (grid[y][x] === 2) {
          image(snowImg, x*cellSize, y*cellSize, cellSize, cellSize); //O
        }
      }
    }
  }
}

//FUNCTIONS CONTROLLING COMPUTER PLAYER
function computerTurn() {
  //if gameState is player vs computer, if it is not the player's turn, and it is not at the end of the game,
  //computer takes its turn after 2 seconds.
  if (gameState === "comp" && yourTurn === false && !gameEnd() && millis() - lastSwitchTime > waitTime) {
    randomX = int(random(3));
    randomY = int(random(3));

    //place X where COMPUTER might win (prioritize its own victory)
    if (grid[0][0] === 1 && grid[0][1] === 1 && grid[0][2] === 0) {
      grid[0][2] = 1;
    }
    else if (grid[0][0] === 1 && grid[0][2] === 1 && grid[0][1] === 0) {
      grid[0][1] = 1;
    }
    else if (grid[0][1] === 1 && grid[0][2] === 1 && grid[0][0] === 0) {
      grid[0][0] = 1;
    }

    //middle row-- across
    else if (grid[1][0] === 1 && grid[1][1] === 1 && grid[1][2] === 0) {
      grid[1][2] = 1;
    }
    else if (grid[1][0] === 1 && grid[1][2] === 1 && grid[1][1] === 0) {
      grid[1][1] = 1;
    }
    else if (grid[1][1] === 1 && grid[1][2] === 1 && grid[1][0] === 0) {
      grid[1][0] = 1;
    }

    //bottom row-- across
    else if (grid[2][0] === 1 && grid[2][1] === 1 && grid[2][2] === 0) {
      grid[2][2] = 1;
    }
    else if (grid[2][0] === 1 && grid[2][2] === 1 && grid[2][1] === 0) {
      grid[2][1] = 1;
    }
    else if (grid[2][1] === 1 && grid[2][2] === 1 && grid[2][0] === 0) {
      grid[2][0] = 1;
    }

    //1st column-- down
    else if (grid[0][0] === 1 && grid[1][0] === 1 && grid[2][0] === 0) {
      grid[2][0] = 1;
    }
    else if (grid[0][0] === 1 && grid[2][0] === 1 && grid[1][0] === 0) {
      grid[1][0] = 1;
    }
    else if (grid[1][0] === 1 && grid[2][0] === 1 && grid[0][0] === 0) {
      grid[0][0] = 1;
    }

    //2nd column-- down
    else if (grid[0][1] === 1 && grid[1][1] === 1 && grid[2][1] === 0) {
      grid[2][1] = 1;
    }
    else if (grid[0][1] === 1 && grid[2][1] === 1 && grid[1][1] === 0) {
      grid[1][1] = 1;
    }
    else if (grid[1][1] === 1 && grid[2][1] === 1 && grid[0][1] === 0) {
      grid[0][1] = 1;
    }

    //3rd column-- down
    else if (grid[0][2] === 1 && grid[1][2] === 1 && grid[2][2] === 0) {
      grid[2][2] = 1;
    }
    else if (grid[0][2] === 1 && grid[2][2] === 1 && grid[1][2] === 0) {
      grid[1][2] = 1;
    }
    else if (grid[1][2] === 1 && grid[2][2] === 1 && grid[0][2] === 0) {
      grid[0][2] = 1;
    }

    //top left to bottom right diagonal
    else if (grid[0][0] === 1 && grid[1][1] === 1 && grid[2][2] === 0) {
      grid[2][2] = 1;
    }
    else if (grid[0][0] === 1 && grid[2][2] === 1 && grid[1][1] === 0) {
      grid[1][1] = 1;
    }
    else if (grid[1][1] === 1 && grid[2][2] === 1 && grid[0][0] === 0) {
      grid[0][0] = 1;
    }

    //top right to bottom left diagonal
    else if (grid[0][2] === 1 && grid[1][1] === 1 && grid[2][0] === 0) {
      grid[2][0] = 1;
    }
    else if (grid[0][2] === 1 && grid[2][0] === 1 && grid[1][1] === 0) {
      grid[1][1] = 1;
    }
    else if (grid[2][0] === 1 && grid[1][1] === 1 && grid[0][2] === 0) {
      grid[0][2] = 1;
    }

    //place X where PLAYER might win
    //top row-- across
    else if (grid[0][0] === 2 && grid[0][1] === 2 && grid[0][2] === 0) {
      grid[0][2] = 1;
    }
    else if (grid[0][0] === 2 && grid[0][2] === 2 && grid[0][1] === 0) {
      grid[0][1] = 1;
    }
    else if (grid[0][1] === 2 && grid[0][2] === 2 && grid[0][0] === 0) {
      grid[0][0] = 1;
    }

    //middle row-- across
    else if (grid[1][0] === 2 && grid[1][1] === 2 && grid[1][2] === 0) {
      grid[1][2] = 1;
    }
    else if (grid[1][0] === 2 && grid[1][2] === 2 && grid[1][1] === 0) {
      grid[1][1] = 1;
    }
    else if (grid[1][1] === 2 && grid[1][2] === 2 && grid[1][0] === 0) {
      grid[1][0] = 1;
    }

    //bottom row-- across
    else if (grid[2][0] === 2 && grid[2][1] === 2 && grid[2][2] === 0) {
      grid[2][2] = 1;
    }
    else if (grid[2][0] === 2 && grid[2][2] === 2 && grid[2][1] === 0) {
      grid[2][1] = 1;
    }
    else if (grid[2][1] === 2 && grid[2][2] === 2 && grid[2][0] === 0) {
      grid[2][0] = 1;
    }

    //1st column-- down
    else if (grid[0][0] === 2 && grid[1][0] === 2 && grid[2][0] === 0) {
      grid[2][0] = 1;
    }
    else if (grid[0][0] === 2 && grid[2][0] === 2 && grid[1][0] === 0) {
      grid[1][0] = 1;
    }
    else if (grid[1][0] === 2 && grid[2][0] === 2 && grid[0][0] === 0) {
      grid[0][0] = 1;
    }

    //2nd column-- down
    else if (grid[0][1] === 2 && grid[1][1] === 2 && grid[2][1] === 0) {
      grid[2][1] = 1;
    }
    else if (grid[0][1] === 2 && grid[2][1] === 2 && grid[1][1] === 0) {
      grid[1][1] = 1;
    }
    else if (grid[1][1] === 2 && grid[2][1] === 2 && grid[0][1] === 0) {
      grid[0][1] = 1;
    }

    //3rd column-- down
    else if (grid[0][2] === 2 && grid[1][2] === 2 && grid[2][2] === 0) {
      grid[2][2] = 1;
    }
    else if (grid[0][2] === 2 && grid[2][2] === 2 && grid[1][2] === 0) {
      grid[1][2] = 1;
    }
    else if (grid[1][2] === 2 && grid[2][2] === 2 && grid[0][2] === 0) {
      grid[0][2] = 1;
    }

    //top left to bottom right diagonal
    else if (grid[0][0] === 2 && grid[1][1] === 2 && grid[2][2] === 0) {
      grid[2][2] = 1;
    }
    else if (grid[0][0] === 2 && grid[2][2] === 2 && grid[1][1] === 0) {
      grid[1][1] = 1;
    }
    else if (grid[1][1] === 2 && grid[2][2] === 2 && grid[0][0] === 0) {
      grid[0][0] = 1;
    }

    //top right to bottom left diagonal
    else if (grid[0][2] === 2 && grid[1][1] === 2 && grid[2][0] === 0) {
      grid[2][0] = 1;
    }
    else if (grid[0][2] === 2 && grid[2][0] === 2 && grid[1][1] === 0) {
      grid[1][1] = 1;
    }
    else if (grid[2][0] === 2 && grid[1][1] === 2 && grid[0][2] === 0) {
      grid[0][2] = 1;
    }

    //random placing
    else {
      while (grid[randomY][randomX] !== 0) {
        randomX = int(random(3));
        randomY = int(random(3));
      }
      if (grid[randomY][randomX] === 0) {
        grid[randomY][randomX] = 1;
      }
    }

    blanks--;
    otherClick.play();
    yourTurn = !yourTurn;
  }
}

//VICTORY CONDITIONS
function winCheck(oOrX, whoseVictory) {
  
  //across, down, zigzag from top left
  if (grid[0][0] === oOrX && grid[0][0] === grid[0][1] && grid[0][0] === grid[0][2]) {
    victoryScreen = whoseVictory;
  }
  else if (grid[0][0] === oOrX && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) {
    victoryScreen = whoseVictory;
  }
  else if (grid[0][0] === oOrX && grid[0][0] === grid[1][0] && grid[0][0] === grid[2][0]) {
    victoryScreen = whoseVictory;
  }
  
  //across horizontal middle
  else if (grid[1][0] === oOrX && grid[1][0] === grid[1][1] && grid[1][0] === grid[1][2]) { 
    victoryScreen = whoseVictory;
  }
  
  //down vertical middle
  else if (grid[0][1] === oOrX && grid[0][1] === grid[1][1] && grid[0][1] === grid[2][1]) {
    victoryScreen = whoseVictory;
  }
  
  //down vertical right
  else if (grid[0][2] === oOrX && grid[0][2] === grid[1][2] && grid[0][2] === grid[2][2]) {
    victoryScreen = whoseVictory;
  }
  
  //across, zigzag from bottom left
  else if (grid[2][0] === oOrX && grid[2][0] === grid[2][1] && grid[2][0] === grid[2][2]) {
    victoryScreen = whoseVictory;
  }
  else if (grid[2][0] === oOrX && grid[2][0] === grid[1][1] && grid[2][0] === grid[0][2]) {
    victoryScreen = whoseVictory;
  }

  //no one wins
  else if (noBlanks()) {
    victoryScreen = "draw";
  }


}

//DISPLAY UI
function displayVictoryScreen() {
  if (victoryScreen === "other player win") { 
    image(otherVictoryScreenImg, 0, 0, width, height); //ghost buns win
  }
  else if (victoryScreen === "main player win") {
    image(victoryScreenImg, 0, 0, width, height); //snow buns win
  }
  else if (victoryScreen === "draw") {
    image(drawScreenImg, 0, 0, width, height); //draw screen
  }
}

//if all tiles are filled, return true
function noBlanks() {
  return blanks === 0;
}

//DRAW LOOP (PUT EVERYTHING TOGETHER!)
function draw() {
  background("white");

  computerTurn();
  displayBoard();

  winCheck(1, "other player win");
  winCheck(2, "main player win");

  displayVictoryScreen();
  displayPlayAgain();
  displayStart();

  displayMainStart();
  displayLobby();
  displayCarrotGameBg();
  displayShop();

  displayBackButton();
}