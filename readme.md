# tetrion
This module contains a fully-featured set of utility functions for designing [Tetris](https://en.wikipedia.org/wiki/Tetris) clones.

## usage
[![NPM](https://nodei.co/npm/tetrion.png?mini)](https://www.npmjs.com/package/tetrion)

### defining game state
Complex as it may seem, a game of Tetris can be represented as a single data structure.
```js
var game = {
  over: false,
  gravity: 1 / 8,
  steps: 0,
  piece: {
    type: 'J',
    position: [3, 0],
    rotation: 0
  },
  matrix: {
    size: [10, 22],
    pieces: [[[8, 20], [7, 21], [8, 21], [9, 21]]]
  }
}
```
- `over`: whether or not the player has ["topped out"](http://tetris.wikia.com/wiki/Top_out)
- `gravity`: the rate at which pieces fall; added to `game.steps` every `update`
- `steps`: the number of cells `game.piece` will move down on the next update; note that pieces can only move by whole cells
- `piece`: the current [tetromino](http://tetris.wikia.com/wiki/Tetromino) being dropped
  - `type`: a single character denoting the tetromino type; can be one of `['I', 'J', 'L', 'O', 'S', 'T', 'Z']`
  - `position`: a vector (`Array`) of the form `[x, y]` indicating the tetromino's position
  - `rotation`: a rotation index corresponding to a tetromino [rotation state](http://tetris.wikia.com/wiki/SRS)
- `matrix`: the [playfield](http://tetris.wikia.com/wiki/Playfield); the grid into which tetrominos fall
  - `size`: a vector of the form `[width, height]` indicating the boundaries of the matrix
  - `pieces`: a list of the pieces inside the matrix. Note that there is a clear distinction between pieces in this array and `game.piece` - these ones are just lists of `[x, y]` pairs denoting the location of each block of a piece.

### modifying game state
We can modify the game state using utility functions called "actions". Let's begin a tour of each action by first defining the structure of this module:
```js
> require('tetrion')
{
  game: {
    actions: {
      move: [Function: move],
      rotate: [Function: rotate],
      update: [Function: update]
    }
  },
  matrix: {
    actions: {
      clear: [Function: clear],
      collapse: [Function: collapse]
    },
    contains: [Function: contains],
    occupied: [Function: occupied]
  },
  piece: {
    actions: {
      move: [Function: move],
      rotate: [Function: rotate]
    },
    manifest: [Function: manifest],
    states: {
      I: [Array],
      J: [Array],
      L: [Array],
      O: [Array],
      S: [Array],
      T: [Array],
      Z: [Array]
    },
    types: ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
  }
}
```
Notice how closely this data structure matches the actual structure of its corresponding file tree. As a result, we can import certain parts of this tree individually as necessary:
```js
> require('tetrion/game/actions/update')
[Function: update]

> const { move, rotate } = require('tetrion/piece/actions')
```
With that in mind, let's go over each element of this tree in detail.

#### `game.actions.move(game, direction)`
Moves `game.piece` in `direction` (`'left'`, `'right'`, or `'down'`) and returns `true` if successful, otherwise `false`.

#### `game.actions.rotate(game, direction)`
Rotates `game.piece` in `direction` (`'left'` or `'right'`) and returns `true` if successful, otherwise `false`.

#### `game.actions.update(game)`
Updates the game state by handling gravity, line clearing, piece spawning, and top outs.

#### `matrix.actions.clear(matrix, line?)`
Clears all blocks at the `y`-position denoted by `line`, or the entirety of `matrix` if not provided.

#### `matrix.actions.collapse(matrix)`
Collapses all empty lines found inside `matrix` by moving down pieces to fill their places, i.e. [naive gravity](http://tetris.wikia.com/wiki/Line_clear#Naive).

#### `matrix.contains(matrix, cell)`
Determines whether or not the given `[x, y]` pair lies inside `matrix`.
```js
> matrix = {
    size: [10, 22],
    pieces: []
  }

> contains(matrix, [5, 11])
true

> contains(matrix, [10, 22])
false
```

#### `matrix.occupied(matrix, cell)`
Determines whether or not the given `[x, y]` pair is occupied by a piece.

#### `piece.actions.move(piece, direction, matrix)`
Moves the specified `piece` in `direction` (`'left'`, `'right'`, or `'down'`) and returns `true` if successful, otherwise `false`.

#### `piece.actions.rotate(piece, direction, matrix)`
Rotates the specified `piece` in `direction` (`'left'` or `'right'`) and returns `true` if successful, otherwise `false`.

#### `piece.manifest(piece)`
Finds all the cells occupied by `piece` and returns them as a list of `[x, y]` pairs.
```js
> var piece = {
    type: 'J',
    position: [7, 20],
    rotation: 0
  }

> manifest(piece)
[[8, 20], [7, 21], [8, 21], [9, 21]]
```

#### `piece.states[type][rotation]`
The locations of each cell of a tetromino with a given type and rotation, listed in compliance with the [SRS](http://tetris.wikia.com/wiki/SRS).
```js
> piece.states.J[0]
[[0, 1], [1, 1], [2, 1], [2, 0]]
```

#### `piece.types[7]`
The list of valid tetromino types. Especially useful for determining what kind of tetromino to spawn next.
```js
> types = require('tetrion/piece/types')
['I', 'J', 'L', 'O', 'S', 'T', 'Z']

> types[Math.floor(Math.random() * types.length)]
'S'
```

## see also
- [`semibran/tetromino`](https://github.com/semibran/tetromino) - `tetrion/piece` implemented minimally as a separate module

## license
[MIT](https://opensource.org/licenses/MIT) © [Brandon Semilla](https://git.io/semibran)
