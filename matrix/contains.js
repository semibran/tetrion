module.exports = function contains(matrix, cell) {
  var size = matrix.size
  for (var i = cell.length; i--;) {
    var number = cell[i]
    var length = size[i]
    if (!length || number < 0 || number >= length) {
      return false
    }
  }
  return true
}
