const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
//* Hide the canvas in the intialize load of the game.
canvas.classList.add('hidden');
const marioImg = new Image();
const luigiImg = new Image();
const marioFireball = new Image();
const luigiFireball = new Image();
const fireballSound = new Audio('./sounds/fireball-sound.mp3');
let marioBgMusic = new Audio('./sounds/mario-bg-music.mp3');
let marioJump = new Audio('./sounds/mario-jump.mp3');
marioImg.src = './images/mario-front.png';
luigiImg.src = './images/luigi-front.png';
marioFireball.src = './images/fireball.png';
luigiFireball.src = './images/fireball-2.png';
const startBtn = document.getElementById('start-button');

canvas.width = innerWidth;
canvas.height = innerHeight;

//? Use to the set the value of the player's gravity.
const gravity = 0.5;

window.addEventListener('DOMContentLoaded', (e) => {
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
        this.position.y + this.height + this.velocity.y + 30 <=
        canvas.height
      ) {
        this.velocity.y += gravity;
      } else this.velocity.y = 0;
    }
  } //! End of Player class ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>

  const keys = {
    mario: {
      right: {
        pressed: false,
      },
      left: {
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
    },
  };

  //* Instantiate Mario object
  const mario = new Player(
    marioImg,
    { x: 100, y: 100 },
    { x: 0, y: 0 },
    200,
    200
  );

  //* Instantiate Luigi object
  const luigi = new Player(
    luigiImg,
    { x: 1500, y: 100 },
    { x: 0, y: 0 },
    200,
    200
  );

  startBtn.addEventListener('click', (e) => {
    // marioBgMusic.play();
    canvas.classList.remove('hidden');
    startBtn.classList.add('hidden');
    mario.position.y = 0;
    luigi.position.y = 0;

    //? A Function to constantly render the players and fireballs using the requestAnimationFrame built in function (Works the same as a recursion).
    //? Invokes the update method for each player to constantly display the changes on the players' position.
    const animate = () => {
      window.requestAnimationFrame(animate);
      c.clearRect(0, 0, canvas.width, canvas.height);
      mario.update();
      luigi.update();

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

    animate();
    window.addEventListener('keydown', ({ keyCode }) => {
      console.log(keyCode);
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
          luigi.velocity.y -= 20;
          break;

        case 17:
          console.log('Luigi Shoot');
          luigiImg.src = './images/luigi-shoot-2.png';
          break;

        case 32:
          console.log('shooot');
          marioImg.src = './images/mario-fireball-2.png';
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
          mario.velocity.y -= 20;
          break;

        default:
          break;
      }
    }); //! END OF KEYDOWN EVENTLISTENER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>

    window.addEventListener('keyup', ({ keyCode }) => {
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
          console.log('Shoot');
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
          setTimeout(() => {
            marioImg.src = './images/mario-front.png';
          }, 500);
          break;

        default:
          break;
      }
    }); //! END OF KEYUP EVENTLISTENER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
  }); //! END OF StartBtn CLICK EVENTLISTENER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
}); //! END OF DOMContentLoaded eventListener ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
