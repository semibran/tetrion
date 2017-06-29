var manifest = require('../manifest')
var contains = require('../../matrix/contains')
var occupant = require('../../matrix/occupant')

module.exports = function move(piece, delta, matrix) {
  var position = piece.position
  for (var i = position.length; i--;) {
    position[i] += (delta[i] || 0)
  }
  var cells = manifest(piece)
  for (var i = cells.length; i--;) {
    var cell = cells[i]
    if (!contains(matrix, cell) || occupant(matrix, cell)) {
      for (var j = position.length; j--;) {
        position[j] -= (delta[j] || 0)
      }
      return false
    }
  }
  return true
}
