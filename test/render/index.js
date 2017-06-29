var colors = require('./colors')
var manifest = require('../../piece/manifest')
var offset = [0, -2]

module.exports = function render(game, canvas) {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = game.matrix.size[0] + offset[0]
    canvas.height = game.matrix.size[1] + offset[1]
  }

  var context = canvas.getContext('2d')
  context.fillStyle = game.over ? 'red' : 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)

  var piece = game.piece
  if (piece) {
    var blocks = manifest(piece)
    for (var i = blocks.length; i--;) {
      var block = blocks[i]
      context.fillStyle = colors[piece.type]
      context.fillRect(block[0] + offset[0], block[1] + offset[1], 1, 1)
    }
  }

  var pieces = game.matrix.pieces
  for (var i = pieces.length; i--;) {
    var blocks = pieces[i]
    for (var j = blocks.length; j--;) {
      var block = blocks[j]
      context.fillStyle = 'white'
      context.fillRect(block[0] + offset[0], block[1] + offset[1], 1, 1)
    }
  }

  return canvas
}
