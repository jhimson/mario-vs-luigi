const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
// Hide the canvas in the intialize load of the game.
canvas.classList.add('hidden');
const marioImg = new Image();
const luigiImg = new Image();
const marioFireball = new Image();
const luigiFireball = new Image();
const fireballSound = new Audio('./sounds/fireball-sound.mp3');
let marioBgMusic = new Audio('./sounds/mario-bg-music.mp3');
marioImg.src = './images/mario-front.png';
luigiImg.src = './images/luigi-front.png';
marioFireball.src = './images/fireball.png';
luigiFireball.src = './images/fireball-2.png';
const startBtn = document.getElementById('start-button');

canvas.width = innerWidth;
canvas.height = innerHeight;

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
  }

  //? Instantiate Mario object
  const mario = new Player(
    marioImg,
    { x: 100, y: 100 },
    { x: 0, y: 0 },
    200,
    200
  );

  //? Instantiate Luigi object
  const luigi = new Player(
    luigiImg,
    { x: 1500, y: 100 },
    { x: 0, y: 0 },
    200,
    200
  );

  startBtn.addEventListener('click', (e) => {
    marioBgMusic.play();
    canvas.classList.remove('hidden');
    startBtn.classList.add('hidden');
  });
}); //! End of Player class ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
