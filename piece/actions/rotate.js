var states = require('../states')
var manifest = require('../manifest')
var contains = require('../../matrix/contains')
var occupied = require('../../matrix/occupied')

module.exports = function rotate(piece, delta, matrix) {
  var prev = piece.rotation
  var next = piece.rotation + delta
  var max = states[piece.type].length
  if (next >= max) {
    next %= max
  } else {
    while (next < 0) {
      next += max
    }
  }
  piece.rotation = next
  var cells = manifest(piece)
  for (var i = cells.length; i--;) {
    var cell = cells[i]
    if (!contains(matrix, cell) || occupied(matrix, cell)) {
      piece.rotation = prev
      return false
    }
  }
  return true
}
