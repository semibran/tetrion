var move = require('./move')
var types = require('../../piece/types')
var manifest = require('../../piece/manifest')
var contains = require('../../matrix/contains')
var occupant = require('../../matrix/occupant')
var clear = require('../../matrix/actions/clear')

module.exports = function update(game) {
  if (game.over) return false
  if (game.piece) {
    game.steps += game.gravity
    while (game.steps >= 1) {
      game.steps--
      if (!move(game, 'down')) {
        var blocks = manifest(game.piece)
        game.matrix.pieces.push(blocks)
        game.piece = null

        var lines = []
        for (var i = blocks.length; i--;) {
          var block = blocks[i]
          var y = block[1]
          if (lines.indexOf(y) === -1) {
            lines.unshift(y)
          }
        }

        for (var i = lines.length; i--;) {
          var y = lines[i]
          var cell = [0, y]
          for (var x = game.matrix.size[0]; x--;) {
            cell[0] = x
            if (!occupant(game.matrix, cell)) {
              lines.splice(i, 1)
              break
            }
          }
        }

        if (lines.length) {
          for (var y = lines[lines.length - 1] + 1; y--;) {
            if (lines.indexOf(y) !== -1) {
              clear(game.matrix, y)
            }
          }
          var pieces = game.matrix.pieces
          for (var i = pieces.length; i--;) {
            var blocks = pieces[i]
            for (var j = blocks.length; j--;) {
              var block = blocks[j]
              var distance = 0
              for (var k = lines.length; k--;) {
                var y = lines[k]
                if (block[1] < y) {
                  distance++
                }
              }
              block[1] += distance
            }
          }
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
      if (!contains(game.matrix, cell) || occupant(game.matrix, cell)) {
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
