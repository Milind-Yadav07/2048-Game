export default class Tile {
  #tileElement
  #x
  #y
  #value

  // Tile represents a single tile in the game with value and position
  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div")
    this.#tileElement.classList.add("tile")
    tileContainer.append(this.#tileElement)
    this.value = value // Set initial value (2 or 4)
  }

  // Get the tile's value
  get value() {
    return this.#value
  }

  // Set the tile's value and update its display and colors
  set value(v) {
    this.#value = v
    this.#tileElement.textContent = v

    // Define Google's colors for tiles
    const googleColors = {
      2: "#4285F4",    // Blue
      4: "#EA4335",    // Red
      8: "#FBBC05",    // Yellow
      16: "#34A853",   // Green
      32: "#4285F4",   // Blue
      64: "#EA4335",   // Red
      128: "#FBBC05",  // Yellow
      256: "#34A853",  // Green
      512: "#4285F4",  // Blue
      1024: "#EA4335", // Red
      2048: "#FBBC05"  // Yellow
    }

    // Get background color based on value or default to blue
    const backgroundColor = googleColors[v] || "#4285F4"

    // Function to determine if text should be white or black based on background color brightness
    function getTextColor(bgColor) {
      // Convert hex to RGB
      const r = parseInt(bgColor.substr(1,2),16)
      const g = parseInt(bgColor.substr(3,2),16)
      const b = parseInt(bgColor.substr(5,2),16)
      // Calculate brightness (YIQ formula)
      const yiq = ((r*299)+(g*587)+(b*114))/1000
      return (yiq >= 128) ? "black" : "white"
    }

    this.#tileElement.style.backgroundColor = backgroundColor
    this.#tileElement.style.color = getTextColor(backgroundColor)
  }

  // Set the tile's x position and update CSS variable
  set x(value) {
    this.#x = value
    this.#tileElement.style.setProperty("--x", value)
  }

  // Set the tile's y position and update CSS variable
  set y(value) {
    this.#y = value
    this.#tileElement.style.setProperty("--y", value)
  }

  // Remove the tile's DOM element from the board
  remove() {
    this.#tileElement.remove()
  }

  // Returns a promise that resolves when the tile's transition or animation ends
  waitForTransition(animation = false) {
    return new Promise(resolve => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      )
    })
  }
}
