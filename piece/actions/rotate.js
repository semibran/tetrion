var states = require('../states')
var manifest = require('../manifest')
var contains = require('../../matrix/contains')
var occupied = require('../../matrix/occupied')

module.exports = function rotate(piece, direction, matrix) {
  var prev = piece.rotation
  var next
  if (direction === 'left') {
    next = prev - 1
    if (next < 0) {
      next = states[piece.type].length - 1
    }
  } else if (direction === 'right') {
    next = prev + 1
    if (next >= states[piece.type].length) {
      next = 0
    }
  } else {
    return false
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
