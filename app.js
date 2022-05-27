const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
//* Hide the canvas in the intialize load of the game.
canvas.classList.add('hidden');
let winningMessage = document.getElementById('winningMessage');
let instructionMsg = document.getElementById('instructions');
let winingMessageText = document.querySelector('[data-winning-message-text]');
let restartButton = document.getElementById('restartButton');
let introImage = document.getElementById('intro');
let healthContainer = document.querySelector('.health-container');
let marioHealthBar = document.getElementById('mario-hb');
let luigiHealthBar = document.getElementById('luigi-hb');
marioHealthBar.src = './images/5HB.png';
marioHealthBar.height = '200';
marioHealthBar.width = '200';
luigiHealthBar.src = './images/5HB.png';
luigiHealthBar.height = '200';
luigiHealthBar.width = '200';
healthContainer.classList.add('hidden');

let marioHealth = 5;
let luigiHealth = 5;

const marioImg = new Image();
const luigiImg = new Image();
const marioFireball = new Image();
const luigiFireball = new Image();
const fireballSound = new Audio('./sounds/fireball-sound.mp3');
const hadouken = new Audio('./sounds/hadouken.mp3');

let marioBgMusic = new Audio('./sounds/mario-bg-music.mp3');
let gameOverMusic = new Audio('./sounds/gameover.wav');
let thankYouMusic = new Audio('./sounds/thankyou.wav');
let marioHitSound = new Audio('./sounds/mario-hit-sound.mp3');
let luigiHitSound = new Audio('./sounds/luigi-hit-sound.wav');
let marioJump = new Audio('./sounds/mario-jump.mp3');
let pressStart = new Audio('./sounds/press-start.mp3');
marioImg.src = './images/mario-front.png';
luigiImg.src = './images/luigi-front.png';
marioFireball.src = './images/fireball.png';
luigiFireball.src = './images/fireball-2.png';
const startBtn = document.getElementById('start-button');

canvas.width = innerWidth;
canvas.height = innerHeight;
const projectilesArray = [];

//? Use to the set the value of the player's gravity to avoid jumping soo high.
let gravity = 0.6;

window.addEventListener('DOMContentLoaded', (e) => {
  startBtn.addEventListener('mouseover', (e) => {
    pressStart.play();
  });
  
  class Player {
    constructor(url, position, velocity, height, width) {
      this.url = url;
      this.position = position;
      this.velocity = velocity;
      this.height = height;
      this.width = width;
    }

    draw() {
      c.drawImage(
        this.url,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }

    //? A function to update the x and y position of the player object using the velocity property.
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      //? Calls the draw method to apply the updated position.
      this.draw();

      //? Condition below is use to add gravity to the player object, by adjusting the velocity of the player object.
      if (
        this.position.y + this.height + this.velocity.y + 60 <=
        canvas.height
      ) {
        this.velocity.y += gravity;
      } else this.velocity.y = 0;
    }
  } //! End of Player class ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>

  class Projectile {
    constructor(url, x, y, width, height, velocity) {
      this.url = url;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.velocity = velocity;
    }

    draw() {
      c.drawImage(this.url, this.x, this.y, this.width, this.height);
      //
    }

    update() {
      this.draw();
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  } // !End of Projectile Class ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>

  const keys = {
    mario: {
      right: {
        pressed: false,
      },
      left: {
        pressed: false,
      },
      up: {
        pressed: false,
      },
    },
    luigi: {
      right: {
        pressed: false,
      },
      left: {
        pressed: false,
      },
      up: {
        pressed: false,
      },
    },
  };

  //* Instantiate Mario object
  const mario = new Player(
    marioImg,
    { x: 200, y: 0 },
    { x: 0, y: 0 },
    200,
    200
  );

  //* Instantiate Luigi object
  const luigi = new Player(
    luigiImg,
    { x: 1650, y: 0 },
    { x: 0, y: 0 },
    200,
    200
  );

  startBtn.addEventListener('click', (e) => {
    marioBgMusic.play();
    canvas.classList.remove('hidden');
    startBtn.classList.add('hidden');
    introImage.classList.add('hidden');
    instructionMsg.classList.add('hidden');
    mario.position.y = 0;
    luigi.position.y = 0;
    healthContainer.classList.remove('hidden');

    //? A Function to constantly render the players and fireballs using the requestAnimationFrame built in function (Works the same as a recursion).
    //? Invokes the update method for each player to constantly display the changes on the players' position.
    const animate = () => {
      window.requestAnimationFrame(animate);
      c.clearRect(0, 0, canvas.width, canvas.height);
      mario.update();
      luigi.update();

      // ! GARBAGE COLLECTION FUNCTIONALITY
      projectilesArray.forEach((projectile, index) => {
        //? Condition to remove the projectile/fireball object from the array of projectiles whenever the fireball shot by Luigi exits from the screen (For Garbage collection purposes to avoid slowing down the game)
        if (projectile.x + projectile.width <= 0) {
          setTimeout(() => {
            projectilesArray.splice(index, 1);
          }, 0);
          //? Condition to remove the projectile/fireball object from the array of projectiles whenever the fireball shot by Mario exits from the screen (For Garbage collection purposes to avoid slowing down the game)
        } else if (projectile.x + projectile.width > canvas.width) {
          setTimeout(() => {
            projectilesArray.splice(index, 1);
          }, 0);
        } else projectile.update();
      });

      //! COLLISION FUNCTIONALITY
      projectilesArray.forEach((projectile, index) => {
        //? Added 70 to the y position of luigi in the condition below to avoid collision when the fireball is very near the head of Luigi

        //? Deducted 70 to the y position of luigi in the condition below to avoid collision when the fireball is very near the foot of Luigi
        if (
          projectile.x + projectile.width >= luigi.position.x &&
          projectile.x <= luigi.position.x + luigi.width &&
          projectile.y + projectile.height >= luigi.position.y + 70 &&
          projectile.y <= luigi.position.y - 70 + luigi.height
        ) {
          // ? Removes the fireball projectile from the screen when it hits luigi
          setTimeout(() => {
            projectilesArray.splice(index, 1);
          }, 0);
          console.log('Luigi got hit');
          luigiHealth--;
          
          // ? Switch case use to update luigi's health bar image according to luigiHealth value
          switch (luigiHealth) {
            case 4:
              luigiHealthBar.src = './images/4HB.png';
              break;
            case 3:
              luigiHealthBar.src = './images/3HB.png';
              break;
            case 2:
              luigiHealthBar.src = './images/2HB.png';
              break;
            case 1:
              luigiHealthBar.src = './images/1HB.png';
              break;
            case 0:
              luigiHealthBar.src = './images/0HB.png';
              break;

            default:
              break;
          }
          luigiImg.src = './images/luigi-hit.png';
          luigiHitSound.play();

          setTimeout(() => {
            if (luigiHealth === 0) {
              gameOverMusic.play();
              setTimeout(() => {
                thankYouMusic.play();
              }, 800);
              winingMessageText.innerHTML = 'Game Over! Mario Wins';
              winningMessage.classList.add('show');
              removeEventListener('keydown', keyDownHandler);
              removeEventListener('keyup', keyUpHandler);
              marioBgMusic.pause();
              marioBgMusic.currentTime = 0;
            }
          }, 200);

          setTimeout(() => {
            luigiImg.src = './images/luigi-front.png';

            luigi.position.y = 0;
            luigi.position.x = 1650;
          }, 500);
        }

        if (
          projectile.x + projectile.width >= mario.position.x &&
          projectile.x <= mario.position.x + mario.width &&
          projectile.y + projectile.height >= mario.position.y + 70 &&
          projectile.y <= mario.position.y - 70 + mario.height
        ) {
          // ? Removes the fireball projectile from the screen when it hits mario
          setTimeout(() => {
            projectilesArray.splice(index, 1);
          }, 0);

          console.log('Mario got hit');
          marioHealth--;
          // ? Switch case use to update luigi's health bar image according to luigiHealth value
          switch (marioHealth) {
            case 4:
              marioHealthBar.src = './images/4HB.png';
              break;
            case 3:
              marioHealthBar.src = './images/3HB.png';
              break;
            case 2:
              marioHealthBar.src = './images/2HB.png';
              break;
            case 1:
              marioHealthBar.src = './images/1HB.png';
              break;
            case 0:
              marioHealthBar.src = './images/0HB.png';
              break;

            default:
              break;
          }
          marioImg.src = './images/mario-hit.png';
          marioHitSound.play();

          setTimeout(() => {
            if (marioHealth === 0) {
              gameOverMusic.play();
              setTimeout(() => {
                thankYouMusic.play();
              }, 800);
              winingMessageText.innerHTML = 'Game Over! Luigi Wins';
              winningMessage.classList.add('show');
              removeEventListener('keydown', keyDownHandler);
              removeEventListener('keyup', keyUpHandler);
              marioBgMusic.pause();
              marioBgMusic.currentTime = 0;
            }
          }, 200);
          
          setTimeout(() => {
            marioImg.src = './images/mario-front.png';
            mario.position.y = 200;
            mario.position.x = 200;
          }, 500);
        }
      }); //! END OF FOREACH COLLISITION DETECTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>

      //! COLLISITION DETECTION ON THE PLAYER AND CANVAS TO AVOID OVERLAPING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
      //? LUIGI CANVAS COLLISION DETECTION CONDITION
      if (luigi.position.x >= 1720) {
        keys.luigi.right.pressed = false;
      } else if (luigi.position.x <= 0) {
        keys.luigi.left.pressed = false;
      } else if (luigi.position.y <= 0) {
        console.log(luigi.position.y);
        console.log('overlapping');
        luigi.velocity.x = 0;
        luigi.velocity.y = 1;
      }

      //? MARIO CANVAS COLLISION DETECTION CONDITION
      if (mario.position.x >= 1720) {
        keys.mario.right.pressed = false;
      } else if (mario.position.x <= 0) {
        keys.mario.left.pressed = false;
      } else if (mario.position.y <= 0) {
        console.log('overlapping');
        mario.velocity.x = 0;
        mario.velocity.y = 1;
      }
      // ! END OF PLAYER -> CANVAS COLLISION DETECTION

      //? This condition below will accelerate the left and right control for Mario object player by increasing and decreasing the x velocity. To avoid keep on pressing the left and right controls many times.
      if (keys.mario.right.pressed) {
        mario.velocity = { ...mario.velocity, x: 5 };
      } else if (keys.mario.left.pressed) {
        mario.velocity = { ...mario.velocity, x: -5 };
      } else mario.velocity = { ...mario.velocity, x: 0 };

      //? This condition below will accelerate the left and right control for Luigi object player by increasing and decreasing the x velocity. To avoid keep on pressing the left and right controls many times.
      if (keys.luigi.right.pressed) {
        luigi.velocity = { ...luigi.velocity, x: 5 };
      } else if (keys.luigi.left.pressed) {
        luigi.velocity = { ...luigi.velocity, x: -5 };
      } else luigi.velocity = { ...luigi.velocity, x: 0 };
    }; //! END OF ANIMATE FUNCTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>

    // ? Use to handle event when the users presses the key for player controls
    const keyDownHandler = ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          console.log('left');
          keys.luigi.left.pressed = true;
          luigiImg.src = './images/luigi-left.png';
          break;
        case 40:
          console.log('Down');
          break;
        case 39:
          console.log('Right');
          keys.luigi.right.pressed = true;
          luigiImg.src = './images/luigi-right.png';
          break;

        case 38:
          marioJump.play();
          console.log('Up');
          luigiImg.src = './images/luigi-fly.png';
          luigi.velocity.y = -20;
          break;

        case 65:
          console.log('mario left');
          marioImg.src = './images/mario-left.png';
          keys.mario.left.pressed = true;

          break;
        case 83:
          console.log('Down');
          break;
        case 68:
          console.log('Right');
          marioImg.src = './images/mario-right.png';
          keys.mario.right.pressed = true;
          break;

        case 87:
          marioJump.play();
          console.log('Up');
          marioImg.src = './images/mario-fly.png';
          mario.velocity.y = -20;
          break;

        default:
          break;
      }
    };

    // ? Use to handle event when the users releases the key being pressed for player controls
    const keyUpHandler = ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          console.log('left');
          luigi.velocity.x = 0;
          keys.luigi.left.pressed = false;
          break;
        case 40:
          console.log('Down');
          break;
        case 39:
          console.log('Right');
          keys.luigi.right.pressed = false;
          break;
        case 38:
          console.log('Up');
          setTimeout(() => {
            luigiImg.src = './images/luigi-front.png';
          }, 400);
          break;

        case 17:
          fireballSound.play();
          console.log('Luigi Shoot');
          luigiImg.src = './images/luigi-shoot-2.png';
          projectilesArray.push(
            new Projectile(
              luigiFireball,
              //? The x position of the fireball has to be less than the current position of luigi to avoid instant self collision of the fireball when luigi shoots it to Mario. (luigi.position.x - luigi.width)
              luigi.position.x - luigi.width,
              luigi.position.y,
              200,
              200,
              { x: -10, y: 0 }
            )
          );
          setTimeout(() => {
            luigiImg.src = './images/luigi-front.png';
          }, 500);
          break;

        case 65:
          console.log('left');
          mario.velocity.x = 0;
          keys.mario.left.pressed = false;
          break;
        case 83:
          console.log('Down');

          break;
        case 68:
          console.log('Right');
          keys.mario.right.pressed = false;
          break;

        case 87:
          console.log('Up');
          setTimeout(() => {
            marioImg.src = './images/mario-front.png';
          }, 400);
          break;

        case 32:
          console.log('Shoot');
          hadouken.play();
          marioImg.src = './images/mario-fireball-2.png';
          projectilesArray.push(
            //? The x position of the fireball has to be greather than the current position of Mario to avoid instant self collision of the fireball when Mario shoots it to Luigi. (luigi.position.x - luigi.width)
            new Projectile(
              marioFireball,
              mario.position.x + mario.width,
              mario.position.y,
              200,
              200,
              {
                x: 10,
                y: 0,
              }
            )
          );
          console.log(projectilesArray);
          setTimeout(() => {
            marioImg.src = './images/mario-front.png';
          }, 500);
          break;

        default:
          break;
      }
    };

    
    animate();
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    // ! RESET GAME HANDLER!
    restartButton.addEventListener('click', () => {
      winningMessage.classList.remove('show');
      marioBgMusic.play();
      window.addEventListener('keydown', keyDownHandler);
      mario.position.x = 200;
      mario.position.y = 0;
      luigi.position.x = 1650;
      luigi.position.y = 0;

      marioHealth = 5;
      luigiHealth = 5;
      marioHealthBar.src = './images/5HB.png';
      luigiHealthBar.src = './images/5HB.png';
      console.log(marioHealth);
    }); //! END OF restartButton function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
  }); //! END OF StartBtn CLICK EVENTLISTENER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
}); //! END OF DOMContentLoaded eventListener ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
