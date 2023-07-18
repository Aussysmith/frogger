// getting the html id and adding a click listener to be able to click start the game/interact
const interfaceCanvas = document.getElementById("interfaceCanvas");
interfaceCanvas.addEventListener("click", function(event) {
  startGame(event);
});
let startButton;


// loading sprite image so i can trace it to draw characters
const spritesImg = new Image();
spritesImg.onload = function() {
  showStartScreen();
};
spritesImg.src = "../assets/sprites.png";

const deadImg = new Image();
deadImg.src = "../assets/dead.png";

// getting all html ids to be able to draw on them
const spriteCanvas = document.getElementById("spriteCanvas");
const backgroundCanvas = document.getElementById("backgroundCanvas");

const interfaceCtx = interfaceCanvas.getContext("2d");
const spriteCtx = spriteCanvas.getContext("2d");
const backgroundCtx = backgroundCanvas.getContext("2d");

// needs to be here to start game correctly
class Lane {
  constructor(direction, speed, sprites, y, isInRiver) {
    this.direction = direction;
    this.speed = speed;
    this.sprites = sprites;
    this.y = y;
    this.isInRiver = isInRiver;
  }
}

// collison for start game 
function isPointCollision(px, py, bx, by, bw, bh) {
  if (px >= bx && px <= bx + bw && py >= by && py <= by + bh) {
    return true;
  } else {
    return false;
  }
}


function showStartScreen() {
    // black background
    backgroundCtx.fillStyle = "black";
    backgroundCtx.fillRect(0, 0, interfaceCanvas.width, 
    interfaceCanvas.height);

    // draw "F R O G G E R" title
    backgroundCtx.drawImage(spritesImg, 0, 0, 
      spritesImg.width, spritesImg.height / 10, 20, 200, 
      spritesImg.width, 
      spritesImg.height / 11);

    backgroundCtx.drawImage(spritesImg,
      0, 360, 40, 40,
      160, 470, 70, 70);
    
    // draw button
    interfaceCtx.beginPath();
    interfaceCtx.rect(interfaceCanvas.width/2 - 75, 300, 150, 50);
    interfaceCtx.fillStyle = "#00ff00";
    interfaceCtx.fill();
    interfaceCtx.font = "bold 24px Arial";
    interfaceCtx.fillStyle = "black";
    interfaceCtx.fillText("START", interfaceCanvas.width/2 - 40, 335);
    startButton = document.createElement("button");
    startButton.id = "startButton";
}

// starts game + loads all functions 
function startGame(event) {
  if (player.state === "start") {
    const buttonX = interfaceCanvas.width / 2;
    const buttonY = 300;
    const buttonWidth = 200;
    const buttonHeight = 70;

    if (isPointCollision(event.offsetX, event.offsetY, buttonX, buttonY, buttonWidth, buttonHeight)) {
      player.state = "playing";
      interfaceCtx.clearRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);
      backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
      renderBackground();
      renderFrog(spriteCtx);
      renderLives();
      renderScore();
      renderTime();
      let spriteObjects = renderSprites();
      animateSprites(spriteObjects);
      moveFrog();
      checkCollisions();
      addScorePoint();
    }
  }
}

// frog object literal to access properties
let frog = {
    x: 160,
    y: 470,
    direction: "up",
    speed: 30,
    width: 40,
    height: 40,
};

// player object literal to access properties
const player = {
    time: 60,
    lives: 5,
    state: "start",
    score: 0,
    safeHomes: [true, true, true, true]
};

const addScorePoint = () => {
  if (frog.y <= 70) {
    frog.x = 160;
    frog.y = 470;
    frog.direction = "up";
    player.score++
    renderScore();
  }
};

// draws the background of the game
function renderBackground() {
    
    // draw the grass area
    backgroundCtx.fillStyle = 'rgb(93, 180, 80)';
    backgroundCtx.fillRect(0, 0, backgroundCanvas.width, 120);
  
    // draw the full road area
    backgroundCtx.fillStyle = 'gray';
    backgroundCtx.fillRect(0, 100, backgroundCanvas.width, 420);

    // draw black lowerbackground
    backgroundCtx.fillStyle = 'black';
    backgroundCtx.fillRect(0, 520, backgroundCanvas.width, 421);

    // draw the safe homes
    let safeHomes = backgroundCtx.drawImage(spritesImg, 0, 60, 
      spritesImg.width, spritesImg.height / 10, 0, 1, 
      spritesImg.width, 
      spritesImg.height / 4.5);
}

// renders the frog character onto screen
function renderFrog() {
  let frogWidth = frog.width;
  let frogHeight = frog.height;
  let frogX = frog.x;
  let frogY = frog.y;

  interfaceCtx.drawImage(spritesImg,
    0, 360, frogWidth, frogHeight,
    frogX, frogY, 70, 70); 
}


// renders the lives counter in the bottom left
function renderLives() {
  for (let i = 0; i < player.lives; i++) {
    backgroundCtx.drawImage(spritesImg, 0, 360, 40, 40, i * 30, backgroundCanvas.height - 43, 25, 25);
  }
}
  

// renders score count close to lives
function renderScore() {
    backgroundCtx.fillStyle = "white";
    backgroundCtx.font = "bold 24px Arial";
    backgroundCtx.fillText("Score: " + player.score, 0, backgroundCanvas.height - 1);
}


// time counter 60 seconds when hits 0 gg game
function renderTime() {
  backgroundCtx.font = "bold 30px Arial";
  backgroundCtx.fillStyle = "white";
  backgroundCtx.fillText("Time: " + player.time, backgroundCanvas.width - 120, backgroundCanvas.height - 1);

  const interval = setInterval(() => {
    player.time--;
    backgroundCtx.fillStyle = "black";
    backgroundCtx.fillRect(backgroundCanvas.width - 120, backgroundCanvas.height - 31, 120, 30);
    backgroundCtx.fillStyle = "white";
    backgroundCtx.fillText("Time: " + player.time, backgroundCanvas.width - 120, backgroundCanvas.height - 1);

    if (player.time === 0) {
      clearInterval(interval);
      }
  }, 1000);
}




// adding an event listener for keys so i can access them for player movement
document.addEventListener("keydown", moveFrog);

// switch case for movement 
function moveFrog(event) {
  if (!event) {
    return;
  }

  let newX = frog.x;
  let newY = frog.y;
// if theres no keys pressed nothing occurs otherwise:
// increments in proper direction dependant on key press selection
  switch (event.key) {
    case "ArrowLeft":
      if (frog.x > 10) {
        newX -= 29;
      }
      break;
    case "ArrowUp":
      if (frog.y > 10) {
        newY -= 29;
      }
      break;
    case "ArrowRight":
      if (frog.x < interfaceCanvas.width - frog.width - 50) {
        newX += 29;
      }
      break;
    case "ArrowDown":
      if (frog.y < interfaceCanvas.height - frog.height - 80) {
        newY += 29;
      }
      break;
  }

  frog.x = newX;
  frog.y = newY;
  checkCollisions();
  addScorePoint();
  
  interfaceCtx.clearRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);
  renderFrog();
}

// 3.
class Sprite {
  constructor(width, height, ix, iy, x, speed, lane) {
    this.width = width; // width of sprite in pixels
    this.height = height; // height of sprite in pixels
    this.ix = ix; // x coord of sprite on image file
    this.iy = iy; // y coord of sprite on image file
    this.x = x; // x coord on canvas
    this.speed = speed;
    this.lane = lane;
  }
}

// change pictures to true form and adjust classes.
class Crocodile extends Sprite {
  constructor(lane) {
    super(100, 20, 160, 370, 0, -90, lane);
  }
}

class Snake extends Sprite {
  constructor(lane) {
    super(60, 20, 160, 270, 330, 130, lane);
  }
}

class Car extends Sprite {
  constructor(lane) {
    super(100, 15, 10, 270, 330, 100, lane);
  }
}

class Lilypad extends Sprite {
  constructor(lane) {
    super(40, 15, 85, 410, 0, -50, lane);
  }
}

const car = new Car(0);
const crocodile = new Crocodile(1);
const snake = new Snake (2);
const lilypad = new Lilypad(3);

const spriteObjects = [car, crocodile, snake, lilypad];

// 6.
function renderSprites() {
 
      // draw the road
      backgroundCtx.drawImage(spritesImg, 0, 110, 
        spritesImg.width, spritesImg.height / 10, 0, 305, 
        spritesImg.width, 
        spritesImg.height / 11);
  
      backgroundCtx.drawImage(spritesImg, 0, 110, 
        spritesImg.width, spritesImg.height / 10, 0, 130, 
        spritesImg.width, 
        spritesImg.height / 11);
    
      // draw the river area
      backgroundCtx.fillStyle = 'blue';
      backgroundCtx.fillRect(0, 400, backgroundCanvas.width, 30);
  
      backgroundCtx.fillStyle = 'blue';
      backgroundCtx.fillRect(0, 225, backgroundCanvas.width, 30);


  return spriteObjects;
}

function animateSprites(spriteObjects) {
  const startPositions = [
    { x: spriteCanvas.width, y: 137 },
    { x: spriteCanvas.width, y: 215 },
    { x: spriteCanvas.width, y: 300 },
    { x: spriteCanvas.width, y: 400 }
  ];

  setInterval(() => {
    // Clear the canvas
    spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);

    for (let i = 0; i < spriteObjects.length; i++) {
      const sprite = spriteObjects[i];
      sprite.x -= sprite.speed / 50; // Move sprite to the left

      if (sprite.x + sprite.width < 0) { // Reset sprite position when off screen on the left
        sprite.x = spriteCanvas.width;
      } else if (sprite.x > spriteCanvas.width) { // Reset sprite position when off screen on the right
        sprite.x = -sprite.width;
      }

      // Draw sprite on canvas
      const startPosition = startPositions[sprite.lane];

      spriteCtx.drawImage(
        spritesImg,
        sprite.ix,
        sprite.iy,
        sprite.width,
        sprite.height,
        sprite.x,
        startPosition.y,
        sprite.width,
        sprite.height * 2
      );
    }

    checkCollisions(); 
  }, 15);
}

function checkCollisions() {
  for (let i = 0; i < spriteObjects.length; i++) {
    const sprite = spriteObjects[i];
    if (
      frog.x < sprite.x + sprite.width &&
      frog.x + frog.width > sprite.x &&
      frog.y < sprite.y + sprite.height &&
      frog.y + frog.height > sprite.y
    ) {
      if (sprite instanceof Lilypad) {
        continue; // Skip collisions with Lilypad
      } else {
        frog.x = 160;
        frog.y = 470;
        frog.direction = "up";
        player.lives--;
        break; // Exit the loop if collision is detected with any other sprite
      }
    }
  }
}


// to do list:
// 1. frog dies if hits water/snake/car/crocodile and live goes down 1
// 2. frog is able to stand on lilypad and move with it when on Path
// 3. if frog hits grass score goes +1 and frog resets to starting post
// 4. if lives = 0 then display game over with a restart button
// 5. if player timer = 0 also game over


