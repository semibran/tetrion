const states = require('./states')

module.exports = function manifest(piece) {
  var position = piece.position
  var cells = states[piece.type][piece.rotation]
  var length = cells.length
  var blocks = new Array(length)
  for (var i = length; i--;) {
    var cell = cells[i]
    var dimensions = Math.max(position.length, cell.length)
    var block = new Array(dimensions)
    for (var j = dimensions; j--;) {
      block[j] = (cell[j] || 0) + (position[j] || 0)
    }
    blocks[i] = block
  }
  return blocks
}
