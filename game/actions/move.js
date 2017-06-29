var piece = require('../../piece')

module.exports = function move(game, direction)  {
  if (!game.piece) return false
  var delta = null
  if (direction === 'left') {
    delta = [-1, 0]
  } else if (direction === 'right') {
    delta = [1, 0]
  } else if (direction === 'down') {
    delta = [0, 1]
  } else {
    return false
  }
  return piece.actions.move(game.piece, delta, game.matrix)
}
