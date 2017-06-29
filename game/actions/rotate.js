var rotate = require('../../piece/actions/rotate')

module.exports = function (game, direction) {
  if (!game.piece) return false
  if (direction === 'left') {
    delta = -1
  } else if (direction === 'right') {
    delta = 1
  } else {
    return false
  }
  return rotate(game.piece, delta, game.matrix)
}
