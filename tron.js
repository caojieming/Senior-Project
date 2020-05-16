console.log("moo");

const canvas = document.getElementById('canvas');//"const" cannot change, canvas is the grid
const unit = 15;
canvas.width = unit * 80;
canvas.height = unit * 60;
const ctx = canvas.getContext('2d');

let p1;//"let" is temporary within its brackets
let p2;
let playerList = [];

let gameOver = false;

// represents each player, stores color, location, etc
class Player{

  constructor(name, x, y, color = '#fff') {
    // sets the player name
    this.name = name;
    
    // x and y coordinates, does not corralate directly to canvas coordinates
    this.x = x;
    this.y = y;
    
    this.color = color;
    this.key = ''; // movement key pressed
    this.dead = false;

    // sets auto incrementing player id
    this.constructor.counter = this.constructor.counter || 0;
    this.id = this.constructor.counter;
    this.constructor.counter++;
  }

}

// sets given player's direction based on keycode
function setKeys(key, player, up, down, left, right) {
  switch (key) {
    case up:
      if (player.key != 'DOWN') {
        player.key = 'UP'
      }
      break;
    case down:
      if (player.key != 'UP') {
        player.key = 'DOWN';
      }
      break;
    case left:
      if (player.key != 'RIGHT') {
        player.key = 'LEFT';
      }
      break;
    case right:
      if (player.key != 'LEFT') {
        player.key = 'RIGHT';
      }
    default:
      break;
  }
}

// updates players' directions given a key event
function handleKeys(event) {
  const key = event.keyCode;

  if (key == 38 || key == 40) {
    event.preventDefault();
  }
  if (gameOver && key == 32) {
    resetGame();
  }

  setKeys(key, p1, 87, 83, 65, 68);
  setKeys(key, p2, 38, 40, 37, 39);
}
document.addEventListener('keydown', handleKeys);

// creates a set that stores the cells that players can move on without dying
function getSafeCells(canvas, unit) {
  let safeCells = new Set();
  for (let i = 0; i < canvas.width / unit; i++) {
    for (let j = 0; j < canvas.height / unit; j++) {
      safeCells.add(`${i}x${j}y`);
    }
  }
  return safeCells;
}
let safeCells = getSafeCells(canvas, unit);

// draws initial game on canvas
function initializeGame() {
  // create new players
  p1 = new Player('BLOO', 1, 1, '#75A4FF');
  p2 = new Player('RAAD', (canvas.width / unit) - 2, (canvas.height / unit) - 2, '#FF5050');
  playerList = [p1, p2];

  // mark all cells to be safe
  safeCells = getSafeCells(canvas, unit);

  // draws background
  ctx.fillStyle = '#001900';
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  // draws players' in their starting positions
  playerList.forEach( p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x * unit, p.y * unit, unit, unit);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(p.x * unit, p.y * unit, unit, unit);
  });
}
initializeGame(playerList);


let outcome;
let winnerColor;

// the game's "step," updates the game based on events
const draw = () => {//the "step," causes the game to move forward
// "every" returns true if every element in a list passes the given argument
if (playerList.every(p => !!p.key)) {
    playerList.forEach(p => {

      // draws player on canvas
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x * unit, p.y * unit, unit, unit);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(p.x * unit, p.y * unit, unit, unit);

      // kills player if they don't move onto a safe cell
      if (!safeCells.has(`${p.x}x${p.y}y`) && p.dead == false) {
        gameOver = true;

        p.dead = true;
        p.key = '';

        const winner = playerList.filter(q => q.id != p.id)[0];
        ctx.font = '60px Sans Serif';
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(`Congrats ${winner.name}! Press space to play again!`, canvas.width / 2, canvas.height / 2);
      }

      // sets the player's cell to unsafe
      safeCells.delete(`${p.x}x${p.y}y`);

      // updates the player's position based on key pressed if not dead
      if (!p.dead) {
        if (p.key == 'UP') p.y -= 1;
        if (p.key == 'DOWN') p.y += 1;
        if (p.key == 'LEFT') p.x -= 1;
        if (p.key == 'RIGHT') p.x += 1;
      }
    });
  }
};
const game = setInterval(draw, 100);

function resetGame() {
  initializeGame();
}
