const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2

// Grid class manages the game grid and its cells
export default class Grid {
  #cells

  // Initialize grid with CSS variables and create cells
  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)

    // Create cell elements and map them to Cell instances with coordinates
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE, // x coordinate
        Math.floor(index / GRID_SIZE) // y coordinate
      )
    })
  }

  // Get all cells in a flat array
  get cells() {
    return this.#cells
  }

  // Get cells grouped by rows for easier row-wise operations
  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || []
      cellGrid[cell.y][cell.x] = cell
      return cellGrid
    }, [])
  }

  // Get cells grouped by columns for easier column-wise operations
  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || []
      cellGrid[cell.x][cell.y] = cell
      return cellGrid
    }, [])
  }

  // Private getter to find all empty cells (no tile)
  get #emptyCells() {
    return this.#cells.filter(cell => cell.tile == null)
  }

  // Return a random empty cell for placing new tiles
  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
    return this.#emptyCells[randomIndex]
  }
}

// Cell class represents each cell in the grid
class Cell {
  #cellElement
  #x
  #y
  #tile
  #mergeTile

  // Initialize cell with its DOM element and coordinates
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }

  // Getters for x and y coordinates
  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  // Get the tile currently in this cell
  get tile() {
    return this.#tile
  }

  // Set the tile in this cell and update tile's coordinates
  set tile(value) {
    this.#tile = value
    if (value == null) return
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }

  // Get the tile that is merging into this cell
  get mergeTile() {
    return this.#mergeTile
  }

  // Set the merge tile and update its coordinates
  set mergeTile(value) {
    this.#mergeTile = value
    if (value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }

  // Check if this cell can accept a given tile (empty or same value and no merge tile)
  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    )
  }

  // Merge the tile and mergeTile values, remove mergeTile, and clear mergeTile
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }
}

// Helper function to create cell div elements and append to grid
function createCellElements(gridElement) {
  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElement.append(cell)
  }
  return cells
}
