var manifest = require('../piece/manifest')

module.exports = function occupant(matrix, cell) {
  var pieces = matrix.pieces
  for (var i = pieces.length; i--;) {
    var piece = pieces[i]
    for (var j = piece.length; j--;) {
      var block = piece[j]
      for (var k = Math.max(block.length, cell.length); k--;) {
        if (block[k] !== cell[k]) {
          break
        }
      }
      if (k === -1) {
        return piece
      }
    }
  }
}
