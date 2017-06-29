var move = require('../../piece/actions/move')

module.exports = function (game, direction)  {
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
  return move(game.piece, delta, game.matrix)
}
