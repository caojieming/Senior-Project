console.log("moo");

const canvas = document.getElementById('canvas');//"const" cannot change, canvas is the grid
const unit = 15;
canvas.width = unit * 80;
canvas.height = unit * 60;
const ctx = canvas.getContext('2d');


class Player{

  constructor(x, y, color) {
    this.color = color || '#fff';
    this.x = x;//current positions
    this.y = y;
    this.key = '';//movement key pressed
    this.direction = '';//the player's true movement
    this.dead = false;

    this.constructor.counter = (this.constructor.counter || 0) + 1;
    this.id = this.constructor.counter;

    Player.playerList.push(this);
  }

}

Player.playerList = [];
let p1 = new Player(1, 1, '#75A4FF');//"let" is temporary within its brackets
let p2 = new Player((canvas.width / unit) - 2, (canvas.height / unit) - 2, '#FF5050');

function setKeys(key, player, up, down, left, right) {
  switch (key) {
    case up:
      if (player.direction != 'DOWN') {
        player.key = 'UP'
      }
      break;
    case down:
      if (player.direction != 'UP') {
        player.key = 'DOWN';
      }
      break;
    case left:
      if (player.direction != 'RIGHT') {
        player.key = 'LEFT';
      }
      break;
    case right:
      if (player.direction != 'LEFT') {
        player.key = 'RIGHT';
      }
    default:
      break;
  }
}

function handleKeys(event) {
  const key = event.keyCode;

  if (key == 38 || key == 40) {
    event.preventDefault();
  }

  setKeys(key, p1, 87, 83, 65, 68);
  setKeys(key, p2, 38, 40, 37, 39);
}
document.addEventListener('keydown', handleKeys);

function getPlayableCells(canvas, unit) {
  let pCells = new Set();
  for (let i = 0; i < canvas.width / unit; i++) {
    for (let j = 0; j < canvas.height / unit; j++) {
      pCells.add(`${i}x${j}y`);
    }
  }
  return pCells;
}
let pCells = getPlayableCells(canvas, unit);

function drawBackground() {//low priority for now
  ctx.fillStyle = '#001900';
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
}
drawBackground();

function drawStartingPositions(players) {
  players.forEach( p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x * unit, p.y * unit, unit, unit);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(p.x * unit, p.y * unit, unit, unit);
  });
}
drawStartingPositions(Player.playerList);


let outcome;
let winnerColor;
let playerCount = Player.playerList.length;
//"all" returns true if every element in a list passes the given arguement
//"=>" a way to define a function
const draw = () => {//the "step," causes the game to move forward
  if (Player.playerList.every(p => !!p.key)) {
    Player.playerList.forEach(p => {

      if (p.key) {
        p.direction = p.key;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x * unit, p.y * unit, unit, unit);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(p.x * unit, p.y * unit, unit, unit);

        if (!pCells.has(`${p.x}x${p.y}y`) && p.dead == false) {
          p.dead = true;
          p.direction = '';
          playerCount--;
        }

        pCells.delete(`${p.x}x${p.y}y`);

        if (!p.dead) {
          if (p.key == 'UP') p.y -= 1;
          if (p.key == 'DOWN') p.y += 1;
          if (p.key == 'LEFT') p.x -= 1;
          if (p.key == 'RIGHT') p.x += 1;
        }
      }
    });
  }
};
const game = setInterval(draw, 100);

function resetGame() {//low-ish priority for now

}

// ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 150, 100);//startx, starty, endx, endy
