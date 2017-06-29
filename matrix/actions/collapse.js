var contains = require('../contains')
var occupied = require('../occupied')

module.exports = function collapse(matrix) {
  var lines = []
  var cell = [0, 0]
  for (var y = matrix.size[1]; y--;) {
    cell[1] = y
    for (var x = matrix.size[0]; x--;) {
      cell[0] = x
      if (occupied(matrix, cell)) {
        break
      }
    }
    if (x === -1) {
      lines.push(y)
    }
  }
  for (var i = lines.length; i--;) {
    var y = lines[i]
    var pieces = matrix.pieces
    for (var j = pieces.length; j--;) {
      var blocks = pieces[j]
      for (var k = blocks.length; k--;) {
        var block = blocks[k]
        if (block[1] < y) {
          block[1]++
        }
      }
    }
  }
}
