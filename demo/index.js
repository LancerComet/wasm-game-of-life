import init, { Universe, Cell } from '/pkg/wasm_game_of_life.js'

main()

async function main () {
  const { memory } = await init()

  const UNIVERSE_WIDTH = 90
  const UNIVERSE_HEIGHT = 90
  const CELL_SIZE = 8
  const GRID_COLOR = '#ccc'
  const DEAD_COLOR = '#fff'
  const ALIVE_COLOR = '#000'

  const universe = Universe.new(UNIVERSE_WIDTH, UNIVERSE_HEIGHT)
  const width = universe.width()
  const height = universe.height()

  const stage = document.getElementById('game-of-life-canvas')
  const context = stage.getContext('2d')
  stage.height = (CELL_SIZE + 1) * height + 1
  stage.width = (CELL_SIZE + 1) * width + 1

  stage.addEventListener('click', event => {
    const boundingRect = stage.getBoundingClientRect()

    const scaleX = stage.width / boundingRect.width
    const scaleY = stage.height / boundingRect.height

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX
    const canvasTop = (event.clientY - boundingRect.top) * scaleY

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1)
    const column = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1)

    universe.toggle_cell(row, column);
  })

  const tick = () => {
    universe.tick()
    drawGrid()
    drawCells()
    requestAnimationFrame(tick)
  }

  tick()

  function drawGrid () {
    context.beginPath()
    context.strokeStyle = GRID_COLOR

    // Vertical lines.
    for (let x = 0; x <= width; x++) {
      context.moveTo(x * (CELL_SIZE + 1) + 1, 0)
      context.lineTo(x * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1)
    }

    // Horizontal lines.
    for (let y = 0; y <= height; y++) {
      context.moveTo(0, y * (CELL_SIZE + 1) + 1)
      context.lineTo((CELL_SIZE + 1) * width + 1, y * (CELL_SIZE + 1) + 1)
    }

    context.stroke()
  }

  function drawCells () {
    const cellsPtr = universe.get_cells_ptr()
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)
    context.beginPath()

    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        const index = row * width + column

        context.fillStyle = cells[index] === Cell.Dead
          ? DEAD_COLOR
          : ALIVE_COLOR;

        context.fillRect(
          column * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        )
      }
    }

    context.stroke()
  }
}
