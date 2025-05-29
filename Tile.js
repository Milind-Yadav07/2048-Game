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
    const power = Math.log2(v)
    const backgroundLightness = 100 - power * 9
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    )
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%`
    )
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
