// represents each player, stores color, location, etc
export default class Player {

  constructor(name, x, y, color = '#fff', keys) {
    // sets the player name
    this.name = name;
    
    // x and y coordinates, does not corralate directly to canvas coordinates
    this.x = x;
    this.y = y;
    
    this.color = color;
    this.direction = ''; // movement key pressed
    this.dead = false;
    this.keys = keys;

    // sets id to name; this means names must be unique
    this.id = name;
  }

  // sets given player's direction based on keycode
  setKeys(key) {
    switch (key) {
      case this.keys.up:
        if (this.direction != 'DOWN') {
          this.direction = 'UP'
        }
        break;
      case this.keys.down:
        if (this.direction != 'UP') {
          this.direction = 'DOWN';
        }
        break;
      case this.keys.left:
        if (this.direction != 'RIGHT') {
          this.direction = 'LEFT';
        }
        break;
      case this.keys.right:
        if (this.direction != 'LEFT') {
          this.direction = 'RIGHT';
        }
      default:
        break;
    }
  }

  move(game) {
    if (this.direction == 'UP') this.y -= 1;
    if (this.direction == 'DOWN') this.y += 1;
    if (this.direction == 'LEFT') this.x -= 1;
    if (this.direction == 'RIGHT') this.x += 1;
  }

};
