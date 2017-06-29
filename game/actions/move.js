var move = require('../../piece/actions/move')

module.exports = function (game, direction) {
  if (game.piece) {
    if (move(game.piece, direction, game.matrix)) {
      if (direction === 'down') {
        game.steps = 0
      }
      return true
    }
  }
  return false
}
