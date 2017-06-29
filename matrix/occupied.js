var manifest = require('../piece/manifest')

module.exports = function occupied(matrix, cell) {
  var pieces = matrix.pieces
  for (var i = pieces.length; i--;) {
    var blocks = pieces[i]
    for (var j = blocks.length; j--;) {
      var block = blocks[j]
      for (var k = Math.max(block.length, cell.length); k--;) {
        if (block[k] !== cell[k]) {
          break
        }
      }
      if (k === -1) {
        return true
      }
    }
  }
  return false
}
