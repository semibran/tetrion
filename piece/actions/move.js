var manifest = require('../manifest')
var contains = require('../../matrix/contains')
var occupied = require('../../matrix/occupied')

module.exports = function move(piece, direction, matrix) {
  var prev = piece.position
  var next = prev.slice()
  if (direction === 'left') {
    next[0] -= 1
  } else if (direction === 'right') {
    next[0] += 1
  } else if (direction === 'down') {
    next[1] += 1
  } else {
    return false
  }
  piece.position = next
  var cells = manifest(piece)
  for (var i = cells.length; i--;) {
    var cell = cells[i]
    if (!contains(matrix, cell) || occupied(matrix, cell)) {
      piece.position = prev
      return false
    }
  }
  return true
}
