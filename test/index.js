var move = require('../game/actions/move')
var rotate = require('../game/actions/rotate')
var update = require('../game/actions/update')
var render = require('./render')
var paused = false
var piece = null
var keys = {}
var game = {
  over: false,
  steps: 0,
  gravity: 1 / 8,
  piece: null,
  matrix: {
    size: [10, 22],
    pieces: []
  }
}

var view = render(game)
var style = view.style
style.width = view.width * 8 + 'px'
style.height = view.height * 8 + 'px'
style.imageRendering = 'pixelated'
style.position = 'absolute'
style.left = '50%'
style.top = '50%'
style.transform = 'translate(-50%, -50%)'
document.body.appendChild(view)
requestAnimationFrame(loop)

function loop() {
  input(keys)
  if (!paused) {
    update(game)
    render(game, view)
  }
  requestAnimationFrame(loop)
  for (var name in keys) {
    if (keys[name]) {
      keys[name]++
    }
  }
}

function input(keys) {
  if (keys.p === 1) {
    paused = !paused
  }
  if (!paused) {
    if (buffered(keys.ArrowLeft) && !keys.ArrowRight) {
      move(game, 'left')
    } else if (buffered(keys.ArrowRight) && !keys.ArrowLeft) {
      move(game, 'right')
    }
    if (keys.ArrowDown % 2 === 1 && piece === game.piece) {
      move(game, 'down')
    } else if (!keys.ArrowDown) {
      piece = game.piece
    }
    if (keys.ArrowUp === 1) {
      rotate(game, 'right')
    }
  }
}

function buffered(value) {
  return value === 1 || value >= 15 && value % 2 === 1
}

window.addEventListener('keydown', function (event) {
  keys[event.key] = 1
})

window.addEventListener('keyup', function (event) {
  keys[event.key] = 0
})
