var rotate = require('../../piece/actions/rotate')

module.exports = function (game, direction) {
  if (game.piece) {
    return rotate(game.piece, direction, game.matrix)
  } else {
    return false
  }
}
