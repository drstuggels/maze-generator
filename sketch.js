/* START OF SETTINGS */

const backgroundColor = "rgb(255, 255, 255)";
const showColors = false;

const maxSize = false;
const isSquare = false;
const mazeWidth = 1000;
const mazeHeight = 1000;

const cols = 30;
const rows = 30;

const framesPerSecond = 60;
const iterationsPerFrame = 20;

const startX = 0;
const startY = 0;

const borderColor = 0;
const borderWidth = 3;

const penSize = 10;
const penColor = "rgb(0,0,0)";

/* END OF SETTINGS */

let cellWidth, cellHeight, start, current, previous, grid;

function setup() {
  // STYLE
  if (maxSize) {
    if (isSquare) {
      let smaller = windowWidth < windowHeight ? windowWidth : windowHeight;
      createCanvas(smaller, smaller);
    } else {
      createCanvas(windowWidth, windowHeight);
    }
  } else {
    createCanvas(mazeWidth, mazeHeight);
  }
  frameRate(framesPerSecond);
  strokeWeight(borderWidth);

  // DECLARE CELLSIZE
  cellWidth = width / cols;
  cellHeight = height / rows;

  // MAKE 2D ARRAY AND FILL WITH CELLS
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }
  // GENERATE NEIGHBOURS
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].generateNeighbours();
    }
  }

  // DECLARE STARTING CELL
  start = grid[startX][startY];
  current = start;
  previous = [current];
  end = false;
}

function draw() {
  background(color(backgroundColor));
  for (let i = 0; i < iterationsPerFrame; i++) {
    let randomIndex, randomIndexArray, randomNeighbour;
    let backtrackingcount = 0;
    let foundGoodOne = false;

    // LOOP WHILE AN UNVISITED CELL HAS BEEN FOUND
    while (!foundGoodOne) {
      // WE NEED TO SHUFFLE THE ORDER OF AN ARRAY OF THE NEIGHBOUR INDECES TO PICK A RANDOM NEIGHBOUR
      // (can't just pick random number 0-3 because then it is not guaranteed that it will try each one of them)
      randomIndexArray = shuffle([0, 1, 2, 3]);
      // LOOP THROUGH EVERY POSSIBLE NEIGHBOUR IN RANDOM ORDER
      for (let i = 0; i < 4; i++) {
        randomIndex = randomIndexArray[i];
        randomNeighbour = current.neighbours[randomIndex];
        // CHECK IF NEIGHBOUR IS COMPATIBLE
        if (
          randomNeighbour !== undefined &&
          !randomNeighbour.visited &&
          !previous.includes(randomNeighbour)
        ) {
          // IF COMPATIBLE, PUSH NEIGHBOUR TO BACKTRACKING ARRAY AND EXIT OUT OF LOOP
          previous.push(current);
          foundGoodOne = true;
          break;
        }
        // CHECK IF NONE OF THE NEIGHBOURS WERE COMPATIBLE
        if (i == 3) {
          // BACKTRACK TO FIND ONE THAT IS COMPATIBLE
          current.visited = true;
          current = previous[previous.length - 1 - backtrackingcount];
          backtrackingcount++;
          break;
        }
      }
    }

    // FIND WHAT WALLS TO REMOVE AND REMOVE THEM
    let opposite;
    switch (randomIndex) {
      case 0:
        opposite = 2;
        break;
      case 1:
        opposite = 3;
        break;
      case 2:
        opposite = 0;
        break;
      case 3:
        opposite = 1;
        break;
    }
    randomNeighbour.borders[opposite] = false;
    current.borders[randomIndex] = false;

    // MARK AS VISITED AND MAKE NEIGHBOUT THE CURRENT CELL
    current.visited = true;
    current = randomNeighbour;

    // END IT
    if (previous.length == cols * rows) {
      itsover();
      noLoop();
      break;
    }
  }

  // DRAW GRID
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}

let over = false;
// MAKE BUTTON TO DOWNLOAD IMAGE WHEN MAZE IS DONE
function itsover() {
  let b = createButton("Save as PNG!");
  b.mousePressed(() => {
    saveCanvas("maze", "png");
  });
  over = true;
}

// PAINTING AFTER MAZE READY
function mouseDragged() {
  if (over) {
    fill(color(penColor));
    circle(mouseX, mouseY, penSize);
    return false;
  }
}

// ERASE PAINTING WITH BACKSPACE
function keyPressed() {
  if (over) {
    if (keyCode == BACKSPACE) {
      background(color(backgroundColor));
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j].show();
        }
      }
    }
    return false;
  }
}
