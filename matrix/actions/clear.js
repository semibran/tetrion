module.exports = function clear(matrix, line) {
  var pieces = matrix.pieces
  if (line === undefined) {
    pieces.length = 0
    return true
  } else if (line >= 0 && line < matrix.size[1]) {
    for (var i = pieces.length; i--;) {
      var blocks = pieces[i]
      for (var j = blocks.length; j--;) {
        var block = blocks[j]
        if (block[1] === line) {
          blocks.splice(j, 1)
        }
      }
      if (!blocks.length) {
        pieces.splice(i, 1)
      }
    }
    return true
  } else {
    return false
  }
}
