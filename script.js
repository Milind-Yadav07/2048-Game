import Grid from "./Grid.js"
import Tile from "./Tile.js"

// Get the game board element from the DOM
const gameBoard = document.getElementById("game-board")

// Initialize the grid and add two initial tiles
let grid = new Grid(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

// Setup the keyboard input listener
setupInput()

// Function to restart the game by clearing the board and resetting the grid and tiles
function restartGame() {
  // Remove all child elements (tiles) from the game board
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild)
  }
  // Create a new grid instance
  grid = new Grid(gameBoard)
  // Add two new tiles to start the game fresh
  grid.randomEmptyCell().tile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = new Tile(gameBoard)
  // Setup input listener again for new game
  setupInput()
}

// Setup keyboard input listener for arrow keys, only once per key press
function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true })
}

// Handle keyboard input for moving tiles
async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput()
        return
      }
      await moveUp()
      break
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput()
        return
      }
      await moveDown()
      break
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput()
        return
      }
      await moveLeft()
      break
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput()
        return
      }
      await moveRight()
      break
    default:
      // If other keys pressed, just setup input again
      setupInput()
      return
  }

  // After moving, merge tiles where applicable
  grid.cells.forEach(cell => cell.mergeTiles())

  // Add a new tile to a random empty cell
  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile

  // Check if no moves are possible in any direction (game over)
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    // Wait for the new tile's animation to finish, then alert and restart
    newTile.waitForTransition(true).then(() => {
      alert("You lose")
      restartGame()
    })
    return
  }

  // Setup input listener again for next move
  setupInput()
}

// Move tiles up by sliding tiles in each column
function moveUp() {
  return slideTiles(grid.cellsByColumn)
}

// Move tiles down by sliding tiles in each column reversed
function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

// Move tiles left by sliding tiles in each row
function moveLeft() {
  return slideTiles(grid.cellsByRow)
}

// Move tiles right by sliding tiles in each row reversed
function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

// Slide tiles in the given groups (rows or columns)
function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        // Find the farthest cell the tile can move to
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          // Wait for tile transition animation
          promises.push(cell.tile.waitForTransition())
          if (lastValidCell.tile != null) {
            // Mark tile for merging if target cell already has a tile
            lastValidCell.mergeTile = cell.tile
          } else {
            // Move tile to empty cell
            lastValidCell.tile = cell.tile
          }
          // Remove tile from original cell
          cell.tile = null
        }
      }
      return promises
    })
  )
}

// Check if tiles can move up
function canMoveUp() {
  return canMove(grid.cellsByColumn)
}

// Check if tiles can move down
function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

// Check if tiles can move left
function canMoveLeft() {
  return canMove(grid.cellsByRow)
}

// Check if tiles can move right
function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

// Check if any moves are possible in the given groups (rows or columns)
function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}
