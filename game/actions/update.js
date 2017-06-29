var move = require('../../piece/actions/move')
var types = require('../../piece/types')
var manifest = require('../../piece/manifest')
var contains = require('../../matrix/contains')
var occupied = require('../../matrix/occupied')
var collapse = require('../../matrix/actions/collapse')
var clear = require('../../matrix/actions/clear')

module.exports = function update(game) {
  if (game.over) return false
  if (game.piece) {
    game.steps += game.gravity
    while (game.steps >= 1) {
      game.steps--
      if (!move(game.piece, 'down', game.matrix)) {
        var blocks = manifest(game.piece)
        game.matrix.pieces.push(blocks)
        game.piece = null

        var lines = []
        for (var i = blocks.length; i--;) {
          var block = blocks[i]
          var y = block[1]
          if (lines.indexOf(y) === -1) {
            lines.push(y)
          }
        }

        for (var i = lines.length; i--;) {
          var y = lines[i]
          var cell = [0, y]
          for (var x = game.matrix.size[0]; x--;) {
            cell[0] = x
            if (!occupied(game.matrix, cell)) {
              lines.splice(i, 1)
              break
            }
          }
        }

        if (lines.length) {
          for (var i = lines.length; i--;) {
            var y = lines[i]
            clear(game.matrix, y)
          }
          collapse(game.matrix)
        }
      }
    }
  } else {
    var piece = {
      type: types[Math.floor(Math.random() * types.length)],
      position: [game.matrix.size[0] / 2 - 2, 0],
      rotation: 0
    }
    var cells = manifest(piece)
    for (var i = cells.length; i--;) {
      var cell = cells[i]
      if (!contains(game.matrix, cell) || occupied(game.matrix, cell)) {
        break
      }
    }
    if (i === -1) {
      game.piece = piece
    } else {
      game.over = true
    }
  }
  return true
}
