console.log("moo");

const canvas = document.getElementById('canvas');//"const" cannot change
const ctx = canvas.getContext('2d');
const unit = 15;

class Player{

  constructor(x, y, color){
    this.color = color || '#fff';
    this.sX = x;//starting positions
    this.sY = y;
    this.cX = x;//current positions
    this.cY = y;
    this.key = '';
    this.direction = '';
    this.dead = false;

    this.constructor.counter = (this.constructor.counter || 0) + 1;
    this.id = this.constructor.counter;

    Player.playerList.push(this);
  };

};

Player.playerList = [];
let p1 = new Player(unit*5, unit*5, '#75A4FF');//"let" is temporary within its brackets
let p2 = new Player(unit*50, unit*50, '#FF5050');

function setKeys(key, player, up, down, left, right){

}

function handleKeys(event){

}

function getPlayableCells(canvas, unit){

}

function drawBackground(){

}

function drawStartingPositions(players){

}

function draw(){

}

function resetGame(){

}

// ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 150, 100);//startx, starty, endx, endy
