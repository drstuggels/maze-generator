class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.borders = [true, true, true, true];
  }

  show() {
    // DISPLAY COLORS
    noStroke();
    if (showColors) {
      if (this.visited) {
        fill(100, 100, 255);
        rect(this.i * cellWidth, this.j * cellHeight, cellWidth, cellHeight);
      }
      if (start == this) {
        fill(0, 255, 255);
        rect(this.i * cellWidth, this.j * cellHeight, cellWidth, cellHeight);
      }
      if (grid[cols - 1][rows - 1] == this) {
        fill(255, 128, 0);
        rect(this.i * cellWidth, this.j * cellHeight, cellWidth, cellHeight);
      }
      if (current == this) {
        fill(0, 255, 0);
        rect(this.i * cellWidth, this.j * cellHeight, cellWidth, cellHeight);
        for (let n of this.neighbours) {
          if (n !== undefined && !n.visited && !previous.includes(n)) {
            fill(200, 200, 0);
            rect(n.i * cellHeight, n.j * cellHeight, cellWidth, cellHeight);
          }
        }
      }
    }

    // DISPLAY WALLS
    stroke(color(borderColor));
    if (this.borders[0]) {
      line(
        this.i * cellWidth,
        this.j * cellHeight,
        this.i * cellWidth + cellWidth,
        this.j * cellHeight
      );
    }
    if (this.borders[1]) {
      line(
        this.i * cellWidth + cellWidth,
        this.j * cellHeight,
        this.i * cellWidth + cellWidth,
        this.j * cellHeight + cellHeight
      );
    }
    if (this.borders[2]) {
      line(
        this.i * cellWidth,
        this.j * cellHeight + cellHeight,
        this.i * cellWidth + cellWidth,
        this.j * cellHeight + cellHeight
      );
    }
    if (this.borders[3]) {
      line(
        this.i * cellWidth,
        this.j * cellHeight,
        this.i * cellWidth,
        this.j * cellHeight + cellHeight
      );
    }
  }

  generateNeighbours() {
    // ADD NEIGHBOUR CELLS TO AN ARRAY
    this.neighbours = [];
    if (this.j > 0) {
      this.neighbours.push(grid[this.i][this.j - 1]);
    } else {
      this.neighbours.push(undefined);
    }

    if (this.i < cols - 1) {
      this.neighbours.push(grid[this.i + 1][this.j]);
    } else {
      this.neighbours.push(undefined);
    }

    if (this.j < rows - 1) {
      this.neighbours.push(grid[this.i][this.j + 1]);
    } else {
      this.neighbours.push(undefined);
    }
    if (this.i > 0) {
      this.neighbours.push(grid[this.i - 1][this.j]);
    } else {
      this.neighbours.push(undefined);
    }
  }
}
