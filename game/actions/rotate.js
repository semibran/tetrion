var piece = require('../../piece')

module.exports = function rotate(game, direction) {
  if (!game.piece) return false
  if (direction === 'left') {
    delta = -1
  } else if (direction === 'right') {
    delta = 1
  } else {
    return false
  }
  return piece.actions.rotate(game.piece, delta, game.matrix)
}
