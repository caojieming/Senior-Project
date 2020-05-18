import constants from './constants.js';
import Player from './player.js';
const { UP, DOWN, LEFT, RIGHT, BOARD_WIDTH, BOARD_HEIGHT } = constants;
export default class Bot extends Player {
  
  constructor(...args) {
    super(...args)
    this.direction = UP;
    this.level = 1
  }

  setKeys(key) {
    //does nothing
  }

  move(game) {
    const otherPlayer = game.playerList.filter(p => p.id != this.id)[0];
    const loc = { x: this.x, y: this.y };
    const otherLoc = { x: otherPlayer.x, y: otherPlayer.y };
    const [_, decision] = this.negamax(game.safeCells, loc, otherLoc, this.level, -Infinity, Infinity);
    console.log(decision);
    this.direction = decision;
    if (this.direction == 'UP') this.y -= 1;
    if (this.direction == 'DOWN') this.y += 1;
    if (this.direction == 'LEFT') this.x -= 1;
    if (this.direction == 'RIGHT') this.x += 1;
    //return decision;
  }

  getSafeMoves(safeCells, location) {
    const result = [];
    const loc1 = { x: location.x + 1, y: location.y };
    if (safeCells.has(`${loc1.x}x${loc1.y}y`)) {
      result.push(RIGHT);
    }
    const loc2 = { x: location.x - 1, y: location.y };
    if (safeCells.has(`${loc2.x}x${loc2.y}y`)) {
      result.push(LEFT);
    }
    const loc3 = { x: location.x, y: location.y + 1 };
    if (safeCells.has(`${loc3.x}x${loc3.y}y`)) {
      result.push(DOWN);
    }
    const loc4 = { x: location.x, y: location.y - 1 };
    if (safeCells.has(`${loc4.x}x${loc4.y}y`)) {
      result.push(UP);
    }
    return result;
  }

  nextLocation(direction, location) {
    if (direction === UP) {
      return { x: location.x, y: location.y - 1 };
    }
    if (direction === DOWN) {
      return { x: location.x, y: location.y + 1 };
    }
    if (direction === LEFT) {
      return { x: location.x - 1, y: location.y };
    }
    if (direction === RIGHT) {
      return { x: location.x + 1, y: location.y };
    }
  }

  locAsString(loc) {
    return `${loc.x}x${loc.y}y`;
  }

  calcDists(safeCells, startLoc) {
    //console.log('starting calcDists');
    let frontier = [startLoc];
    let nextFrontier = [];
    const dists = {};
    dists[this.locAsString(startLoc)] = 1;
    let dist = 1;
    while (frontier.length > 0) {
      //console.log('in while', frontier.length);
      dist++;
      frontier.forEach(loc => {
        const safeMoves = this.getSafeMoves(safeCells, loc);
        const nextLocs = safeMoves.map(m => this.nextLocation(m, loc));
        nextLocs.forEach(nextLoc => {
          if (!dists[this.locAsString(nextLoc)]) {
            dists[this.locAsString(nextLoc)] = dist;
            nextFrontier.push(nextLoc);
          }
        });
      });
      frontier = nextFrontier;
      nextFrontier = [];
    }
    return dists;
  }

  reward(safeCells, locP1, locP2) {
    //console.log('starting reward');
    const p1Dists = this.calcDists(safeCells, locP1);
    const p2Dists = this.calcDists(safeCells, locP2);
    let score = 0;
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        const loc = { x, y };
        if (!safeCells.has(this.locAsString(loc))) {
          continue;
        }
        if (!p2Dists[this.locAsString(loc)] && p1Dists[this.locAsString(loc)]) {
          score++;
        }
        else if (!p1Dists[this.locAsString(loc)] && p2Dists[this.locAsString(loc)]) {
          score--;
        }
        else if (p1Dists[this.locAsString(loc)] && p2Dists[this.locAsString(loc)]) {
          let distDiff = p1Dists[this.locAsString(loc)] - p2Dists[this.locAsString(loc)];
          if (distDiff < 0) {
            score++;
          }
          else if (distDiff > 0) {
            score--;
          }
        }
      }
    }
    return score;
  }

  negamax(safeCells, locP1, locP2, depth, a, b) {
    //console.log('starting negamax');
    if (depth === 0) {
      return [this.reward(safeCells, locP1, locP2), null];
    }
    console.log();
    let bestMove = null;
    let safeMoves = this.getSafeMoves(safeCells, locP1);
    let nextLocs = safeMoves.map(m => this.nextLocation(m, locP1));
    for (let moveIndex = 0; moveIndex < nextLocs.length; moveIndex++) {
      const nextLoc = nextLocs[moveIndex];
      let nextSafeCells = new Set(safeCells);
      nextSafeCells.delete(`${nextLoc.x}x${nextLoc.y}y`);
      let [score, _] = this.negamax(nextSafeCells, locP2, nextLoc, depth - 1, -b, -a);
      score = -score;
      if (score > a) {
        a = score;
        bestMove = safeMoves[moveIndex];
        if (a >= b) {
          break;
        }
      }
    }
    return [a, bestMove];
  }

}
