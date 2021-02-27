// Bunny vs Bunny
// Jinny Kim
// 02. 08. 2021 --> 02. 26. 2021

// NOTE: The purpose of my game is to mainly be for children, with
//      mini-games that they could enjoy (I wish I could have
//      had more time to play around with even more mini-games).
//      I also thought that people would like a customization factor,
//      where they could customize their own little bunnyp5.BandPass()

// CREDIT: All sounds used are from OpenGameArt.org :)


//GLOBAL VARIABLES

//general
let mainMenuImg;
let lobbyMusic, carrotBgm, ticTacToeBgm;
let equipSound;

let lobbyImg;

let backButtonImg, backButtonImgX, backButtonImgY, backButtonImgWidth, backButtonImgHeight;

let startButtonImg, startButtonX, startButtonY, startButtonWidth, startButtonHeight;
let ticTacToeIcon, ticTacToeIconX, ticTacToeIconY, ticTacToeIconWidth, ticTacToeIconHeight;
let carrotGameIcon, carrotGameIconX, carrotGameIconY, carrotGameIconWidth, carrotGameIconHeight;
let shopIcon, shopIconX, shopIconY, shopIconWidth, shopIconHeight;
let closetIcon, closetX, closetY, closetIconSize;

let playerImg, playerX, playerY, playerWidth, playerHeight;

let wallet = 0; //player is poor :(

//used to only run certain things one time, even if setup is called multiple times
let initialCreation = true;

let allowedPlayTicTacToeBgm = true;
let allowedPlayLobbyBgm = true;
let allowedPlayCarrotBgm = true;

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

let playerClick, otherClick;

let previousVictory;
let previousGameMode;

//shop
let shopBgImg, shopMenuImg, shopKeeperMessageOne;

let carrotDollImg, determinedFaceImg, droopyFaceImg, excitedFaceImg;
let eyeMaskImg, headBowImg, royalOutfitImg, scarfImg, yellowHoodieImg;

let shopMenuX, shopMenuY, shopMenuWidth, shopMenuHeight;
let shopMsgWidth, shopMsgHeight, shopMsgX, shopMsgY;

let txtSize = 15;

let leftArrowImg, rightArrowImg, arrowY, arrowSize, leftArrowX, rightArrowX;

let royalOutfit, hoodie, carrotDoll, eyeMask, scarf, determinedLook, droopyEyes, excitedFace, headBow;
let shopList = [];
let menuPage;

let purchaseSound;

//per page on shop's menu
let firstItemY, secondItemY, thirdItemY, fourthItemY, fifthItemY;

//closet + customization
let closetBg;
let otherTabImg;
let tabX, tabY, tabWidth, tabHeight;

let playerList = [];
let firstOwnedY, secondOwnedY, thirdOwnedY, fourthOwnedY;

//carrot game
//carrot + basket 
let carrotImg, carrotGameBg, basketImg;
let basketWidth, basketHeight;
let basketX, basketY;
let basketdX = 5;
let carrotSize = 40;

let carrots;
let carrotGetSound;

//health bar + score
let fullHealthImg, twoHeartsImg, oneHeartImg, deadImg;
let healthBarWidth, healthBarHeight, healthBarX, healthBarY;
let carrotDeathScreen;

let health, score;
let points = 0;

//carrot game state
let carrotGamePlaying;
let timer;

//CLASSES
class Carrot {
  constructor() {
    this.size = carrotSize;
    this.x = random(width - this.size);
    this.y = 0;
    this.dx = 0;
    this.dy = random(5, 10);
  }

  //check if carrot has been caught by the player
  notCaught() {
    if (this.x < basketX + basketWidth && this.x > basketX && this.y + this.size > basketY && this.y < basketY + basketHeight) {
      return false;
    }
    else if (this.x + this.size < basketX + basketWidth && this.x + this.size > basketX && this.y + this.size > basketY && this.y < basketY + basketHeight) {
      return false;
    }
    else {
      return true;
    }
  }

  move() {
    if (this.y + this.size < height && this.notCaught()) {
      this.y += this.dy;
    }
  }

  display() {
    if (this.notCaught() && this.onScreen()) {
      image(carrotImg, this.x, this.y, this.size, this.size);
    }
  }

  //check if the carrot has reached the bottom (player has missed the carrot)
  onScreen() {
    return this.y + this.size < height;
  }
  
}

class Timer {
  constructor() {
    this.interval = 1500;
    this.lastSpawn = 0;
  }

  spawnCarrot() {
    if (millis() - this.lastSpawn > this.interval && carrotGamePlaying) {
      let someCarrot = new Carrot();
      carrots.push(someCarrot);
      
      this.lastSpawn = millis();
    }
  }
}

class ShopItem {
  constructor(name, img, desc, price, y, page) {
    this.itemImg = img;
    this.item = name;

    this.price = price;
    this.desc = desc;

    this.width = this.itemImg.width * 0.2;
    this.height = this.itemImg.height * 0.2;

    //appearance in the shop
    this.storeShopX = width * 0.62;
    this.storeShopY = y;
 
    this.x = this.storeShopX;
    this.y = this.storeShopY;

    //appearance in the wardrobe
    this.wardrobePage = 1;

    this.storePage = page;
    this.wardrobeX = width * 0.57;
    this.wardrobeY;

    //states
    this.bought = false;
    this.wearing = false;

    //y values of the order of purchases per page
    firstOwnedY = 130;
    secondOwnedY = 240;
    thirdOwnedY = 350;
    fourthOwnedY = 460;
    
    //text in the shop
    this.text = this.item + "\nCost: " + str(this.price) + "\n" + this.desc;
  }

  menuDisplay() {
    
    if (gameState === "shop") {
      if (menuPage === this.storePage) {
        this.x = this.storeShopX;
        this.y = this.storeShopY;

        //white space + preview of item
        noStroke();
        fill("white");
        rect(this.x + this.width + 10, this.y, 160, this.height);
        image(this.itemImg, this.x, this.y, this.width, this.height);
    
        //text description for the shop
        textAlign(LEFT, CENTER);
        fill("black");
        textSize(txtSize);
        text(this.text, this.x + this.width + 20, this.y + 45);
    
        //when bought, gray it out to let player know it's been purchased
        if (this.bought) {
          fill(0, 0, 0, 150);
          rect(this.x, this.y, this.width + 170, this.height);

          fill("white");
          textAlign(LEFT, CENTER);
          textSize(txtSize + 20);
          text("BOUGHT", this.x + 40, this.y + 45);
        }
      }
    }
    //in the wardrobe
    else if (gameState === "customize") {
      //button to click on item
      if (this.playerOwns()) {
        if (menuPage === this.wardrobePage) {
          //white space + preview item
          noStroke();
          fill("white");
          rect(this.x + this.width + 10, this.y, 160, this.height);
          image(this.itemImg, this.x, this.y, this.width, this.height);
      
          //text for wardrobe
          textAlign(LEFT, CENTER);
          fill("black");
          textSize(txtSize);
          text(this.text, this.x + this.width + 20, this.y + 45);
        }
      }
    }
  }

  displayOutfit() {
    if (this.wearing) {
      noStroke();
      image(this.itemImg, playerX, playerY, playerWidth, playerHeight);
    }
  }

  //clicked button to buy from shop
  buy() {
    if (gameState === "shop") {
      if (menuPage === this.storePage) {
        if (mouseX > this.x && mouseX < this.x + this.width + 170 && mouseY > this.y && mouseY < this.y + this.height) {
          if (wallet >= this.price && !this.bought) {
            this.bought = true;
            wallet -= this.price;
            purchaseSound.play();

            //add it to the list of items player owns
            playerList.push(this);

            //calculate the page it needs to be in (in the wardrobe menu)
            if (playerList.length > 4) {
              this.wardrobePage = Math.floor((playerList.length + 4)/4);
            }

            //determine the y value in the wardrobe menu
            for (let i = 0; i < playerList.length; i++) {
              if (findPosition(i) === 0) {
                this.wardrobeY = firstOwnedY;
              }
              else if (findPosition(i) === 1) {
                this.wardrobeY = secondOwnedY;
              }
              else if (findPosition(i) === 2) {
                this.wardrobeY = thirdOwnedY;
              }
              else if (findPosition(i) === 3) {
                this.wardrobeY = fourthOwnedY;
              }
            } 
          }
        }
      }
    }
  }

  //clicked button to wear from wardrobe
  wardrobeClick() {
    if (gameState === "customize") {
      if (menuPage === this.wardrobePage) {
        if (mouseX > this.wardrobeX && mouseX < this.wardrobeX + this.width + 170 && mouseY > this.wardrobeY && mouseY < this.wardrobeY + this.height) {
          this.wearing = !this.wearing;
          equipSound.setVolume(0.6);
          equipSound.play();
        }
      }
    }
  }

  //used to detect page location
  pageNumber() {
    return this.storePage;
  }

  //will be used to detect whether an item should appear in the storage/closet later
  playerOwns() {
    return this.bought;
  }

  //change some values when transitioning into the wardrobe
  moveToCloset() {
    if (this.playerOwns() && gameState === "customize") {
      this.text = this.item + "\n" + this.desc;

      this.x = this.wardrobeX;
      this.y = this.wardrobeY;
    }
  }
}

//function to help find y position of wardrobe items
function findPosition(number) {
  if (number >= 4) {
    number -= 4;
  }
  else {
    return number;
  }
  return number;
}

//PRELOAD
function preload() {
  //sound preload
  lobbyMusic = loadSound("assets/TownTheme.mp3");
  carrotBgm = loadSound("assets/happy.mp3");
  ticTacToeBgm = loadSound("assets/bgMusic.ogg");

  playerClick = loadSound("assets/playerSound.wav");
  otherClick = loadSound("assets/otherPlayerSound.wav");

  equipSound = loadSound("assets/cloth-heavy.wav");

  carrotGetSound = loadSound("assets/coin1.wav");
  purchaseSound = loadSound("assets/coin8.wav");

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

  //starting img 
  mainMenuImg = loadImage("assets/start-menu.png");
  
  //carrot game
  carrotImg = loadImage("assets/good-carrot.png");
  carrotGameBg = loadImage("assets/carrot-game-bg.png");
  basketImg = loadImage("assets/basket.png");
  
  fullHealthImg = loadImage("assets/threeHearts.png");
  twoHeartsImg = loadImage("assets/twoHearts.png");
  oneHeartImg = loadImage("assets/oneHeart.png");
  deadImg = loadImage("assets/noHearts.png");
  
  carrotDeathScreen = loadImage("assets/loss-screen.png");

  //lobby images
  playerImg = loadImage("assets/player-character.png");
  lobbyImg = loadImage("assets/lobby-bg.png");

  //shop + wardrobe
  shopBgImg = loadImage("assets/shop-bg.png");
  shopMenuImg = loadImage("assets/shop-menu.png");

  shopKeeperMessageOne = loadImage("assets/shop-keeper-msg1.png");
  
  carrotDollImg = loadImage("assets/carrot-doll.png");
  determinedFaceImg = loadImage("assets/determined-face.png");
  droopyFaceImg = loadImage("assets/droopy-eyes.png");
  excitedFaceImg = loadImage("assets/excited-face.png");
  eyeMaskImg = loadImage("assets/eye-mask.png");
  headBowImg = loadImage("assets/head-bow.png");
  royalOutfitImg = loadImage("assets/royal-outfit.png");
  scarfImg = loadImage("assets/scarf.png");
  yellowHoodieImg = loadImage("assets/yellow-hoodie.png");

  rightArrowImg = loadImage("assets/right-arrow.png");
  leftArrowImg = loadImage("assets/left-arrow.png");

  closetBg = loadImage("assets/closet-bg.png");
  otherTabImg = loadImage("assets/other-tab.png");

}

//DISPLAYING UI FUNCTIONS
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
    image(closetIcon, closetX, closetY, closetIconSize, closetIconSize);

  }
}

//(start menu of tic tac toe)
function displayStart() {
  if (gameState === "startTicTacToe") {
    image(startMenuImg, 0, 0, width, height);
    
    //game mode options in tic tac toe
    image(bunVsComp, optionButtonX, pvcompButtonY, optionButtonWidth, optionButtonHeight);
    image(bunVsBun, optionButtonX, pvpButtonY, optionButtonWidth, optionButtonHeight);
  }
}

function displayBackButton() {
  if (shouldBackButtonClick()) {
    image(backButtonImg, backButtonImgX, backButtonImgY, backButtonImgWidth, backButtonImgHeight);
  }
}

function displayTicTacToePlayAgain() {
  if (gameState !== "startTicTacToe" && gameEnd()) {
    image(playAgainButton, playButtonX, playButtonY, playButtonWidth, playButtonHeight);
  }
}

//player
function displayPlayer() {
  if (gameState === "lobby") {
    image(playerImg, playerX, playerY, playerWidth, playerHeight);
  }
  else if (gameState === "customize") {
    image(playerImg, playerX, playerY, playerWidth, playerHeight);
  }
}

//shop
//items in stock
function displayItems() {
  for (let item of shopList) {
    if (item.pageNumber() === menuPage) {
      for (let i = 0; i < shopList.length; i++) {
        shopList[i].menuDisplay();
      }
    }
  }
}

function displayShop() {
  if (gameState === "shop") {
    image(shopBgImg, 0, 0, width, height);
    image(shopMenuImg, shopMenuX, shopMenuY, shopMenuWidth, shopMenuHeight);
  }
}

function displayArrowKeys() {
  if (gameState === "shop" || gameState === "customize") {
    if (menuPage >= 1) {
      image(rightArrowImg, rightArrowX, arrowY, arrowSize, arrowSize);
    }
    if (menuPage > 1) {
      image(leftArrowImg, leftArrowX, arrowY, arrowSize, arrowSize);
    }
  }
}

function displayWallet() {
  if (gameState !== "start") {
    if (gameState === "shop") {
      noStroke();
      fill("white");
    }
    else {
      noStroke();
      fill("black");
    }

    textSize(20);
    textFont("VERDANA");
    textAlign(LEFT);

    text("Coins: " + wallet, width * 0.05, height * 0.05);
  }
}

function displayShopMessages() {
  if (gameState === "shop") {
    image(shopKeeperMessageOne, shopMsgX, shopMsgY, shopMsgWidth, shopMsgHeight);
  }
}

//carrot game
function carrotScore() {
  if (gameState === "carrot game") {
    score = "Score: " + points;
    
    noStroke();
    fill("black");
    textSize(20);
    textFont("VERDANA");
    textAlign(CENTER);
    
    text(score, width/2, height * 0.96);
  }
}

function displayHealthBar() {
  if (gameState === "carrot game") {
    if (health === 3) {
      image(fullHealthImg, healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    }
    else if (health === 2) {
      image(twoHeartsImg, healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    }
    else if (health === 1) {
      image(oneHeartImg, healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    }
    else {
      image(deadImg, healthBarX, healthBarY, healthBarWidth, healthBarHeight);
      carrotGamePlaying = false; //signal to display the loss screen
    }
  }
}

function displayLossScreen() {
  if (!carrotGamePlaying && gameState === "carrot game") {
    image(carrotDeathScreen, 0, 0, width, height); 
  }
}

function displayCarrotGameBg() {
  if (gameState === "carrot game") {
    image(carrotGameBg, 0, 0, width, height);
    carrotGamePlaying = true;
  }
}

function displayBasket() {
  if (carrotGamePlaying) {
    image(basketImg, basketX, basketY, basketWidth, basketHeight);
  }
}

//tic tac toe
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

function displayBoard() {
  if (gameState === "comp" || gameState === "pvp") {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x] === 0) {
          if (noStroke()) {
            stroke("black");
          }
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

function shouldBackButtonClick() {
  return gameState !== "start" && gameState !== "lobby" && (!carrotGamePlaying);
}

//closet
function displayClosetBg() {
  if (gameState === "customize") {
    image(closetBg, 0, 0, width, height);
  }
}

function displayWardrobeTab() {
  if (gameState === "customize") {
    image(otherTabImg, tabX, tabY, tabWidth, tabHeight);
  }
}

function displayWardrobeItems() {
  //display as buttons (preview)
  if (gameState === "customize") {
    for (let item of playerList) {
      item.moveToCloset();
      item.menuDisplay();
    }
  }
  //display when worn
  if (gameState === "customize" || gameState === "lobby") {
    for (let item of playerList) {
      item.displayOutfit();
    }
  }
}

//OTHER FUNCTIONS:
//GENERAL
function checkBackButton() {
  if (shouldBackButtonClick()) {
    if (mouseX > backButtonImgX && mouseX < backButtonImgX + backButtonImgWidth && mouseY > backButtonImgY && mouseY < backButtonImgY + backButtonImgHeight) {
      gameState = "lobby";
      setup();
    }
  }
}

function checkArrowKeys() {
  //used for both shop and wardrobe
  if (mouseX > rightArrowX && mouseX < rightArrowX + arrowSize && mouseY > arrowY && mouseY < arrowY + arrowSize) {
    menuPage++;
  }
  else if (menuPage > 1 && mouseX > leftArrowX && mouseX < leftArrowX + arrowSize && mouseY > arrowY && mouseY < arrowY + arrowSize) {
    menuPage--;
  }
}

//CARROT GAME
function keepBasketIn() {
  if (basketX < 0) {
    basketX = 0;
  }
  if (basketX + basketWidth > width) {
    basketX = width - basketWidth;
  }
}

function controlBasket() {
  if (carrotGamePlaying) {
    if (keyIsDown(65)) { //a
      basketX -= basketdX;
    }
    if (keyIsDown(68)) { //d
      basketX += basketdX;
    }
  }
}

function dropCarrot() {
  if (gameState === "carrot game") {
    for (let i = carrots.length - 1; i >= 0; i--) {
      if (!carrots[i].notCaught()) { //caught!
        carrots.splice(i, 1);

        carrotGetSound.setVolume(0.5);
        carrotGetSound.play();
        
        points++;
      }
      else if (!carrots[i].onScreen()) { //missed carrot
        carrots.splice(i, 1);
        health--;
      }
      else {
        carrots[i].move();
        carrots[i].display();
      }
    }
  }
}

//TIC TAC TOE
function gameEnd() {
  return victoryScreen === "other player win" || victoryScreen === "main player win" || victoryScreen === "draw";
}

//controlling the computer player (tic tac toe)
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

//victory conditions (tic tac toe)
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

  //helps determine if player should get points when setup is called
  if (oOrX === 2 && victoryScreen === "main player win") {
    previousVictory = "player";
  }
  else if (oOrX === 1 && victoryScreen === "other player win") {
    previousVictory = "other";
  }

}

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

//if all tiles are filled, return true
function noBlanks() {
  return blanks === 0;
}

function givePoint() {
  if (previousVictory === "player" && previousGameMode === "comp") {
    points += 25;
  }
}

//SHOP
function createShopObjects() {
  //page 1
  royalOutfit = new ShopItem("Royal Outfit", royalOutfitImg, '"Fits just right. \nYou are worthy!"', 800, firstItemY, 1, "top");
  hoodie = new ShopItem("Yellow Hoodie", yellowHoodieImg, '"So comfortable!"', 100, secondItemY, 1, "top");
  carrotDoll = new ShopItem("Carrot Doll", carrotDollImg, '"Can and will \nbecome your best \nfriend!"', 150, thirdItemY, 1, "other");
  eyeMask = new ShopItem("Eye Mask", eyeMaskImg, '"Perfect for the \nperfect nap!"', 80, fourthItemY, 1, "hat");
  scarf = new ShopItem("Red Scarf", scarfImg, '"I feel pretty \nadventurous!"', 80, fifthItemY, 1, "neck");

  //page 2
  determinedLook = new ShopItem("Determined", determinedFaceImg, '"Determined as \never!"', 50, firstItemY, 2, "other");
  droopyEyes = new ShopItem("Droopy", droopyFaceImg, '"Is it nap time \nyet?"', 50, secondItemY, 2, "other");
  excitedFace = new ShopItem("Excited", excitedFaceImg, '"WOW! So excited!"', 50, thirdItemY, 2, "other");
  headBow = new ShopItem("Blue Bow", headBowImg, '"Blue like the sky! \nWill carrots fall \nfrom here too?"', 80, fourthItemY, 2, "hat");

  //don't make more copies of these objects when setup is called again
  initialCreation = false;

}

//INTERACTIVE CONTROLS
function mousePressed() {
  //get past the main menu
  if (gameState === "start") {
    if (mouseX > startButtonX && mouseX < startButtonX + startButtonWidth && mouseY > startButtonY && mouseY < startButtonY + startButtonHeight) {
      gameState = "lobby";
    }
  }
  //icons in the lobby
  else if (gameState === "lobby") {
    //into tic tac toe
    if (mouseX > ticTacToeIconX && mouseX < ticTacToeIconX + ticTacToeIconWidth && mouseY > ticTacToeIconY && mouseY < ticTacToeIconY + ticTacToeIconHeight) {
      gameState = "startTicTacToe";

      //call setup() to play music
      setup();
    }
    //into carrot game
    if (mouseX > carrotGameIconX && mouseX < carrotGameIconX + carrotGameIconWidth && mouseY > carrotGameIconY && mouseY < carrotGameIconY + carrotGameIconHeight) {
      gameState = "carrot game";

      //call setup() to play music
      setup();
    }
    //into shop
    if (mouseX > shopIconX && mouseX < shopIconX + shopIconWidth && mouseY > shopIconY && mouseY < shopIconY + shopIconHeight) {
      gameState = "shop";
    }
    //into closet
    if (mouseX > closetX && mouseX < closetX + closetIconSize && mouseY > closetY && mouseY < closetY + closetIconSize) {
      gameState = "customize";

      //change player + arrow values to show it differently in closet
      playerX -= 175;
      arrowY = height * 0.89;
      leftArrowX = width * 0.54;
      rightArrowX = width * 0.9;
    }
  }

  //inside closet
  else if (gameState === "customize") {
    checkBackButton();
    
    //clicked to wear
    for (let object of playerList) {
      object.wardrobeClick();
    }

    checkArrowKeys();
  }

  //inside shop
  else if (gameState === "shop") {
    checkBackButton();

    //purchase action
    for (let item of shopList) {
      item.buy();
    }

    checkArrowKeys();
  }

  //inside carrot game
  else if (gameState === "carrot game") {
    checkBackButton();
  }

  //inside tic tac toe start menu
  else if (gameState === "startTicTacToe") {
    checkBackButton();
    //pvp button
    if (mouseX > optionButtonX && mouseX < optionButtonX + optionButtonWidth && mouseY > pvpButtonY && mouseY < pvpButtonY + optionButtonHeight) {
      gameState = "pvp";
      yourTurn = true;
      previousGameMode = "pvp";
    }
    //player vs computer button
    if (mouseX > optionButtonX && mouseX < optionButtonX + optionButtonWidth && mouseY > pvcompButtonY && mouseY < pvcompButtonY + optionButtonHeight) {
      gameState = "comp";
      yourTurn = true;
      previousGameMode = "comp";
    }
  }
  
  //play again button
  else if (gameEnd()) {
    if (mouseX > playButtonX && mouseX < playButtonX + playButtonWidth && mouseY > playButtonY && mouseY < playButtonY + playButtonHeight) {
      setup();
    }
    checkBackButton();
  }

  //placing tokens in tic tac toe
  else if (gameState === "pvp" || gameState === "comp" && noBlanks() === false) {

    let x = Math.floor(mouseX / cellSize);
    let y = Math.floor(mouseY / cellSize);
  
    if (yourTurn && grid[y][x] === 0) { //your turn
      grid[y][x] = 2;
      lastSwitchTime = millis();
    }

    if (gameState === "pvp" && !yourTurn && grid[y][x] === 0) { //pvp (other player turn)
      grid[y][x] = 1;
    }

    checkBackButton();

    //plays sound and changes turn if the back button is not called
    if (yourTurn && gameState === "pvp" || gameState === "comp") {
      playerClick.play();
      yourTurn = !yourTurn;
      blanks--;
    }
    else if (!yourTurn && gameState === "pvp") {
      otherClick.play();
      yourTurn = !yourTurn;
      blanks--;
    }
  }
}

//functions that help categorize + clean up the functions in the draw loop
function ticTacToeGame() {
  computerTurn();
  displayBoard();

  winCheck(1, "other player win");
  winCheck(2, "main player win");

  displayVictoryScreen();
  displayTicTacToePlayAgain();
  displayStart();
}

function carrotGame() {
  timer.spawnCarrot();

  displayCarrotGameBg();

  displayBasket();
  controlBasket();
  keepBasketIn();

  dropCarrot();

  displayHealthBar();
  carrotScore();
  displayLossScreen();
}

function shop() {
  displayShop();
  displayWallet();
  displayShopMessages();

  displayItems();
}

function closet() {
  displayClosetBg();
  displayWardrobeTab();

  displayPlayer();

  displayWardrobeItems();

  //works for both shop and closet
  displayArrowKeys();
}

//SETUP
function setup() {
  
  //give points (money) whenever a mini-game ends
  givePoint();
  wallet += points;

  //pre-selected canvas size
  createCanvas(657, 657);
  
  grid = createEmptyBoard();
  
  //setting up values
  //(other)
  startButtonWidth = startButtonImg.width * 0.35;
  startButtonHeight = startButtonImg.height * 0.35;
  startButtonX = width/2 - startButtonWidth/2;
  startButtonY = height * 0.75;

  backButtonImgWidth = backButtonImg.width * 0.4;
  backButtonImgHeight = backButtonImg.height * 0.4;
  backButtonImgX = width * 0.05;
  backButtonImgY = height * 0.9;

  //(icons in lobby)
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

  closetX = width * 0.15;
  closetY = height * 0.77;
  closetIconSize = 90;
  
  //(tic tac toe)
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

  //(wardrobe + player character)
  tabX = width * 0.5;
  tabY = height * 0.1;
  tabWidth = otherTabImg.width * 1.2;
  tabHeight = otherTabImg.height * 1.2;

  playerWidth = playerImg.width * 0.8;
  playerHeight = playerImg.height * 0.8;
  playerX = width/2 - playerWidth/2;
  playerY = height * 0.25;

  //(shop)
  shopMenuWidth = shopMenuImg.width * 1.3;
  shopMenuHeight = shopMenuImg.height * 1.3;
  shopMenuX = width * 0.6;
  shopMenuY = height * 0.05;

  shopMsgWidth = shopKeeperMessageOne.width * 0.5;
  shopMsgHeight = shopKeeperMessageOne.height * 0.5;
  shopMsgX = width * 0.025;
  shopMsgY = height * 0.15;

  arrowY = height * 0.91;
  arrowSize = 30;
  leftArrowX = width * 0.625;
  rightArrowX = width * 0.93;

  //y values of shop items in the menu
  firstItemY = 50;
  secondItemY = 160;
  thirdItemY = 270;
  fourthItemY = 380;
  fifthItemY = 490;
  
  //(carrot game)
  basketWidth = basketImg.width * 0.3;
  basketHeight = basketImg.height * 0.3;
  
  basketX = width/2;
  basketY = height * 0.65;
  
  healthBarWidth = fullHealthImg.width * 0.5;
  healthBarHeight = fullHealthImg.height * 0.5;
  healthBarX = width * 0.7;
  healthBarY = height * 0.9;
  
  points = 0;
  health = 3;

  //only make these once
  if (initialCreation) {
    createShopObjects();

    timer = new Timer();
  }

  //play different bgm in different areas (but don't overlap)
  if (allowedPlayLobbyBgm && (gameState === "lobby" || gameState === "start" || gameState === "shop" || gameState === "customize")) {
    carrotBgm.stop();
    ticTacToeBgm.stop();
    
    lobbyMusic.setVolume(0.5);
    lobbyMusic.loop();

    allowedPlayLobbyBgm = false;
    allowedPlayTicTacToeBgm = true;
  }
  else if (allowedPlayCarrotBgm && gameState === "carrot game") {
    lobbyMusic.stop();
    
    carrotBgm.setVolume(0.3);
    carrotBgm.loop();

    allowedPlayLobbyBgm = true;
    allowedPlayTicTacToeBgm = true;
  }
  else if (allowedPlayTicTacToeBgm && gameState === "startTicTacToe") {
    lobbyMusic.stop();

    ticTacToeBgm.setVolume(0.5);
    ticTacToeBgm.loop();

    allowedPlayTicTacToeBgm = false;
    allowedPlayLobbyBgm = true;

  }

  //put into a list so i can use for loops to run display() and buy() on each item efficiently
  shopList = [royalOutfit, hoodie, carrotDoll, eyeMask, scarf, determinedLook, droopyEyes, excitedFace, headBow];
  
  menuPage = 1; //always start on the first page on menus
  
  //tic tac toe states
  victoryScreen = false;
  yourTurn = true;
  
  blanks = 9;
  previousVictory = "blank";
  
  //carrot game states
  carrotGamePlaying = false;
  carrots = [];
}

//DRAW LOOP (PUT EVERYTHING TOGETHER!)
function draw() {
  background("white");

  //tic tac toe
  ticTacToeGame();

  //general
  displayMainStart();
  displayShop();
  
  //carrot game
  carrotGame();
  
  //shop
  shop();
  
  //lobby
  displayLobby();

  //closet
  closet();

  displayBackButton();
  displayWallet();
}