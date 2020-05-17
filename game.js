import constants from './constants.js';
const { UNIT } = constants;
export default class Game {

  constructor(playerList, canvas) {
    this.playerList = playerList;
    this.gameOver = false;
    this.canvas = canvas; // canvas to draw game on
    this.ctx = this.canvas.getContext('2d');
    
    // creates a set that stores the cells that players can move on without dying
    this.safeCells = new Set();
    for (let i = 0; i < canvas.width / UNIT; i++) {
      for (let j = 0; j < canvas.height / UNIT; j++) {
        this.safeCells.add(`${i}x${j}y`);
      }
    }
  }

  // draws initial game on canvas
  initializeGame() {
    // draws background
    this.ctx.fillStyle = '#001900';
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fill();

    // draws players' in their starting positions
    this.playerList.forEach( p => {
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x * UNIT, p.y * UNIT, UNIT, UNIT);
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeRect(p.x * UNIT, p.y * UNIT, UNIT, UNIT);
    });
  }

  // the game's "step," updates the game based on events
  draw() { // the "step," causes the game to move forward
    // "every" returns true if every element in a list passes the given argument
    if (this.playerList.every(p => !!p.direction)) {
      this.playerList.forEach(p => {

        // draws player on canvas
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(p.x * UNIT, p.y * UNIT, UNIT, UNIT);
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(p.x * UNIT, p.y * UNIT, UNIT, UNIT);

        // kills player if they don't move onto a safe cell
        if (!this.safeCells.has(`${p.x}x${p.y}y`) && p.dead == false) {
          this.gameOver = true;

          p.dead = true;
          p.direction = '';

          const winner = this.playerList.filter(q => q.id != p.id)[0];
          this.ctx.font = '60px Sans Serif';
          this.ctx.fillStyle = '#ffffff';
          this.ctx.textBaseline = 'middle';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(`Congrats ${winner.name}! Press space to play again!`, this.canvas.width / 2, this.canvas.height / 2);
        }

        // sets the player's cell to unsafe
        this.safeCells.delete(`${p.x}x${p.y}y`);

        // updates the player's position based on key pressed if not dead
        if (!p.dead) {
          if (p.direction == 'UP') p.y -= 1;
          if (p.direction == 'DOWN') p.y += 1;
          if (p.direction == 'LEFT') p.x -= 1;
          if (p.direction == 'RIGHT') p.x += 1;
        }
      });
    }
  }

  // starts the game
  play() {
    this.initializeGame();
    this.interval = setInterval(this.draw.bind(this), 100);
  }

  // stops the game
  end() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

};
