const grid_size = 50;
const grid_offset_X = 0;
const grid_offset_Y = 0;
var sumToWin = 0;

const positions = JSON.parse(
  document.getElementById("enemyPositions").innerHTML
);


const playerPositions = JSON.parse(
  document.getElementById("playerPositions").innerHTML
);
//document.getElementById("playerPositions").style.display == "none";

// const enemyCoords = JSON.parse(
//   document.getElementById("enemyCoords").innerHTML
// );
// document.getElementById("enemyCoords").style.display == "none";

// const playerCoords = JSON.parse(
//   document.getElementById("playerCoords").innerHTML
// );
// document.getElementById("playerCoords").style.display == "none";


const ShipType = [
  // Carrier
  {
    size: 5,
    top: 0,
    left: 0,
    name: "Carrier",
  },
  // Battleship
  {
    size: 4,
    top: 1,
    left: 1,
    name: "BattleShip",
  },
  // Submarine
  {
    size: 3,
    top: 1,
    left: 2,
    name: "Submarine",
  },
  // Destroyer
  {
    size: 3,
    top: 2,
    left: 3,
    name: "Destroyer",
  },
  // Patrol Boat
  {
    size: 2,
    top: 0,
    left: 3,
    name: "Patrol Boat",
  },
];

// const water_image = document.createElement("img");
// water_image.src = "../assets/images/waterCropped.png";
const water_image = document.createElement("img");
water_image.src = "../assets/images/space.png";
const ship_image = document.createElement("img");
ship_image.src = "../assets/images/newShips.png";
const hit_image = document.createElement("img");
hit_image.src = "../assets/images/hit.png";
const miss_image = document.createElement("img");
miss_image.src = "../assets/images/miss_image.png";

//shadow_image.src = "/assets/images/ships-silhouette.png";

class Ship {
  constructor(type, _x, _y, _horizontal) {
    this.type = type;
    this._x = _x;
    this._y = _y;
    this._horizontal = _horizontal;
    this.far_x = 0;
    this.far_y = 0;

    if (_horizontal) {
      this.far_x = ShipType[this.type].size * grid_size + this._x;
      this.far_y = grid_size + this._y;
    } else {
      this.far_x = grid_size + this.x;
      this.far_y = ShipType[this.type].size * grid_size + this._y;
    }
  }
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
    this.far_x =
      (this._horizontal ? ShipType[this.type].size : 1) * grid_size + this._x;
  }
  get y() {
    return this._y;
  }
  set y(y) {
    this._y = y;
    this.far_y =
      (this._horizontal ? 1 : ShipType[this.type].size) * grid_size + this._y;
  }
  get horizontal() {
    return this._horizontal;
  }
  set horizontal(horizontal) {
    this._horizontal = horizontal;
    // recalculate far_*
    this.x = this._x;
    this.y = this._y;
  }
  draw(ctx) {
    ctx.save();
    if (this._horizontal) {
      ctx.translate(this.x, this.y);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-this.x, -this.y);
      ctx.translate(-grid_size, 0);
    }
    const s_type = ShipType[this.type];
    ctx.drawImage(
      ship_image,
      s_type.left * grid_size,
      s_type.top * grid_size,
      grid_size,
      s_type.size * grid_size,
      this.x,
      this.y,
      grid_size,
      s_type.size * grid_size
    );
    ctx.restore();
  }

  describe() {
    const x = (this.x - grid_offset_X) / grid_size;
    const y = (this.y - grid_offset_Y) / grid_size;
    const positions = new Array(ShipType[this.type].size)
      .fill(0)
      .map((_, index) => (this.horizontal ? [x + index, y] : [x, index + y]));
    return {
      positions,
    };
  }
}

// console.log(positions);

var coordArray = [];
var directionArray = [];

function extractInitCoord(i) {
  coordArray.push(positions[i]["positions"][0]);
}

for (var x = 0; x < 5; x++) {
  extractInitCoord(x);
}

function extractDirection(i) {
  directionArray.push(positions[i]["direction"]);
}

for (var x = 0; x < 5; x++) {
  extractDirection(x);
}

for (var x = 0; x < 5; x++) {
  if (directionArray[x] === "vertical") {
    directionArray[x] = false;
  } else directionArray[x] = true;
}

//////////////////////////////////////////////////////////////////////////////////

var playerCoordArray = [];
var playerDirectionArray = [];

function extractPlayerInitCoord(i) {
  playerCoordArray.push(playerPositions[i]["positions"][0]);
}

for (var x = 0; x < 5; x++) {
  extractPlayerInitCoord(x);
}

function extractPlayerDirection(i) {
  playerDirectionArray.push(playerPositions[i]["direction"]);
}

for (var x = 0; x < 5; x++) {
  extractPlayerDirection(x);
}

for (var x = 0; x < 5; x++) {
  if (playerDirectionArray[x] === "vertical") {
    playerDirectionArray[x] = false;
  } else playerDirectionArray[x] = true;
}

const ships = [
  new Ship(
    0,
    coordArray[0][0] * grid_size + grid_offset_X,
    coordArray[0][1] * grid_size,
    directionArray[0]
  ),
  new Ship(
    1,
    coordArray[1][0] * grid_size + grid_offset_X,
    coordArray[1][1] * grid_size,
    directionArray[1]
  ),
  new Ship(
    2,
    coordArray[2][0] * grid_size + grid_offset_X,
    coordArray[2][1] * grid_size,
    directionArray[2]
  ),
  new Ship(
    3,
    coordArray[3][0] * grid_size + grid_offset_X,
    coordArray[3][1] * grid_size,
    directionArray[3]
  ),
  new Ship(
    4,
    coordArray[4][0] * grid_size + grid_offset_X,
    coordArray[4][1] * grid_size,
    directionArray[4]
  ),
];


const playerShips = [
  new Ship(
    0,
    playerCoordArray[0][0] * grid_size + grid_offset_X,
    playerCoordArray[0][1] * grid_size,
    playerDirectionArray[0]
  ),
  new Ship(
    1,
    playerCoordArray[1][0] * grid_size + grid_offset_X,
    playerCoordArray[1][1] * grid_size,
    playerDirectionArray[1]
  ),
  new Ship(
    2,
    playerCoordArray[2][0] * grid_size + grid_offset_X,
    playerCoordArray[2][1] * grid_size,
    playerDirectionArray[2]
  ),
  new Ship(
    3,
    playerCoordArray[3][0] * grid_size + grid_offset_X,
    playerCoordArray[3][1] * grid_size,
    playerDirectionArray[3]
  ),
  new Ship(
    4,
    playerCoordArray[4][0] * grid_size + grid_offset_X,
    playerCoordArray[4][1] * grid_size,
    playerDirectionArray[4]
  ),
];


function draw_enemy_board() {
  // if images are not done loading
  // try again in a bit
  if (!water_image.complete) {
    window.requestAnimationFrame(draw_enemy_board);
    return;
  }
  const board = document.getElementById("enemy_board_canvas");
  const context = board.getContext("2d");
  const pattern = context.createPattern(water_image, "repeat");
  context.fillStyle = pattern;
  context.fillRect(0, 0, 500, 500);
  context.drawImage(water_image, 0, 0, 500, 500);
  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      let top = row * grid_size;
      let left = col * grid_size;
      context.fillStyle = "white";
      context.fillRect(left - 2, top - 2, grid_size, 4);
      context.fillRect(left - 2, top - 2, 4, grid_size);
      context.fillRect(left - 2, top - 2 + grid_size, grid_size, 4);
      context.fillRect(left - 2 + grid_size, top - 2, 4, grid_size);
      // context.fillRect(left, top, grid_size, grid_size);
      // context.fillRect(left + 1, top + 1, grid_size - 2, grid_size - 2);
    }
  }
}

function draw_player_board() {
  // if images are not done loading
  // try again in a bit
  if (!water_image.complete) {
    window.requestAnimationFrame(draw_player_board);
    return;
  }
  const board = document.getElementById("player_board_canvas");
  const context = board.getContext("2d");
  const pattern = context.createPattern(water_image, "repeat");
  context.fillStyle = pattern;
  context.fillRect(0, 0, 500, 500);
  context.drawImage(water_image, 0, 0, 500, 500);
  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      let top = row * grid_size;
      let left = col * grid_size;
      context.fillStyle = "white";
      context.fillRect(left - 2, top - 2, grid_size, 4);
      context.fillRect(left - 2, top - 2, 4, grid_size);
      context.fillRect(left - 2, top - 2 + grid_size, grid_size, 4);
      context.fillRect(left - 2 + grid_size, top - 2, 4, grid_size);
    }
  }
}

function draw_enemy_ships() {
  // if images are not done loading
  // try again in a bit
  if (!ship_image.complete) {
    window.requestAnimationFrame(draw_enemy_ships);
    return;
  }
  const game = document.getElementById("enemy_game_canvas");
  const context = game.getContext("2d");
  context.globalAlpha = 0.0;
  context.clearRect(0, 0, 500, 500);
  if (selected_ship !== undefined) {
    const left = 50 * Math.round(ships[selected_ship].x / 50);
    const top = 50 * Math.round(ships[selected_ship].y / 50);
  }
  ships.forEach((s) => s.draw(context));
}

function draw_player_ships() {
  // if images are not done loading
  // try again in a bit
  if (!ship_image.complete) {
    window.requestAnimationFrame(draw_player_ships);
    return;
  }
  const game = document.getElementById("player_game_canvas");
  const context = game.getContext("2d");
  context.globalAlpha = 1.0;
  context.clearRect(0, 0, 500, 500);
  if (selected_ship !== undefined) {
    const left = 50 * Math.round(playerShips[selected_ship].x / 50);
    const top = 50 * Math.round(playerShips[selected_ship].y / 50);
  }
  playerShips.forEach((s) => s.draw(context));
}

function draw_hit(x, y) {
  if (!hit_image.complete) {
    window.requestAnimationFrame(draw_hit);
    return;
  }

  const board = document.getElementById("enemy_board_canvas");
  const context = board.getContext("2d");
  context.drawImage(hit_image, x, y);
}


function draw_miss(x, y) {
  if (!miss_image.complete) {
    window.requestAnimationFrame(draw_miss);
    return;
  }

  const board = document.getElementById("enemy_board_canvas");
  const context = board.getContext("2d");
  context.drawImage(miss_image, x, y);
}

function isArrayInArray(arr, item) {
  var item_as_string = JSON.stringify(item);

  var contains = arr.some(function (ele) {
    return JSON.stringify(ele) === item_as_string;
  });
  return contains;
}

function find_ship(x, y) {
  let ss = undefined;
  ships.forEach((ship, index) => {
    if (ship.x <= x && ship.y <= y && ship.far_x >= x && ship.far_y >= y) {
      ss = index;
    }
  });
  return ss;
}

function find_ship2(x, y) {
  let ss = undefined;


  ships.every((ship) => {
    if (!(ship.x <= x && ship.y <= y && ship.far_x >= x && ship.far_y >= y)) {
      // draw_miss(
      //   Math.floor(x / grid_size) * grid_size,
      //   Math.floor(y / grid_size) * grid_size
      // );
    }
  });

  ships.forEach((ship) => {
    if (ship.x <= x && ship.y <= y && ship.far_x >= x && ship.far_y >= y) {
      ss = "HIT!";
      alert(ss);
      sumToWin += 1;
      // draw_hit(
      //   Math.floor(x / grid_size) * grid_size,
      //   Math.floor(y / grid_size) * grid_size
      // );
    }
  });

  return ss;
}

// draw_miss(
//     Math.floor(x / grid_size) * grid_size,
//     Math.floor(y / grid_size) * grid_size
//   );

let selected_ship = undefined;
let mouse_X_offset = 0;
let mouse_Y_offset = 0;

function setup_enemy_event_handlers() {
  const game = document.getElementById("enemy_game_canvas");
  game.onmousemove = function (e) {
    game.style.cursor = "default";

    const x = e.offsetX;
    const y = e.offsetY;
  };

  // function to send coords:
  // 
  // 
  function sendCoords(x,y) {
    //to do fix duplicates
    $.ajax({
      type: "GET",
      url: "coordHandler.php",
      success: function () {
      window.location = "coordHandler.php?x=" + Math.floor(x / grid_size) * grid_size +"&y="+ Math.floor(y / grid_size) * grid_size;
      },
    });
  }

  game.onclick = function (e) {
    const x = e.offsetX;
    const y = e.offsetY;
    find_ship2(x, y);
    sendCoords(x,y);
    if (sumToWin == 17) {
      alert("YOU WON!");
      sumToWin = 0;
    }
  };
  game.oncontextmenu = function (e) {
    const x = e.offsetX;
    const y = e.offsetY;
    if (selected_ship !== undefined) {
      e.preventDefault();
      ships[selected_ship].horizontal = !ships[selected_ship].horizontal;
      [mouse_X_offset, mouse_Y_offset] = [mouse_Y_offset, mouse_X_offset];
      ships[selected_ship].x = x - mouse_X_offset;
      ships[selected_ship].y = y - mouse_Y_offset;

      draw_ships();
    }
  };
}

