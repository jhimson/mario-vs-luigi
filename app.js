const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const marioImg = new Image();
const luigiImg = new Image();
const marioFireball = new Image();
const luigiFireball = new Image();
const fireballSound = new Audio('./sound/fireball-sound.mp3');
marioImg.src = './images/mario-front.png';
luigiImg.src = './images/luigi-front.png';
marioFireball.src = './images/fireball.png';
luigiFireball.src = './images/fireball-2.png';


