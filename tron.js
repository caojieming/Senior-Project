import Player from './player.js';
import Game from './game.js';
import constants from './constants.js';

const { UP_KEY, DOWN_KEY, LEFT_KEY, RIGHT_KEY, W_KEY, S_KEY, A_KEY, D_KEY, SPACE_KEY, UNIT } = constants;

const canvas = document.getElementById('canvas');//"const" cannot change, canvas is the grid
canvas.width = UNIT * 80;
canvas.height = UNIT * 60;

let p1;//"let" is temporary within its brackets
let p2;
let playerList = [];

p1 = new Player('Blue', 1, 1, '#75A4FF', {up: W_KEY, down: S_KEY, left: A_KEY, right: D_KEY});
p2 = new Player('Red', (canvas.width / UNIT) - 2, (canvas.height / UNIT) - 2, '#FF5050', {up: UP_KEY, down: DOWN_KEY, left: LEFT_KEY, right: RIGHT_KEY});
playerList = [p1, p2];

let tron = new Game(playerList, canvas);
tron.play();

// updates players' directions given a key event
function handleKeys(event) {
  const key = event.keyCode;

  if (key == UP_KEY || key == DOWN_KEY || key == SPACE_KEY) {
    event.preventDefault();
  }
  if (tron.gameOver && key == SPACE_KEY) {
    tron.end();
    p1 = new Player('Blue', 1, 1, '#75A4FF', {up: W_KEY, down: S_KEY, left: A_KEY, right: D_KEY});
    p2 = new Player('Red', (canvas.width / UNIT) - 2, (canvas.height / UNIT) - 2, '#FF5050', {up: UP_KEY, down: DOWN_KEY, left: LEFT_KEY, right: RIGHT_KEY});
    playerList = [p1, p2];
    tron = new Game(playerList, canvas);
    tron.play();
  }

  playerList.forEach(p => p.setKeys(key));
}
document.addEventListener('keydown', handleKeys);
