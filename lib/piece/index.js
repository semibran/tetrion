const Grid = require('grid')
const Tetromino = require('tetromino')
const Directions = require('./directions')
const { LEFT, UP, RIGHT, DOWN } = Directions
const directions = [LEFT, UP, RIGHT, DOWN]

module.exports = Piece
Piece.types = Object.keys(Tetromino)
Piece.spawn = spawn
Piece.kill = kill
Piece.move = move
Piece.rotate = rotate

function Piece(type) {
	return { type, cells: [], matrix: null, x: null, y: null, rotation: 0, locking: false, locked: false }
}

function spawn(piece, matrix) {
	var x = matrix.cols / 2 - 2
	var y = 0
	var layout = Tetromino[piece.type][piece.rotation]
	for (let i = layout.length; i--;) {
		var cell = layout[i]
		var other = Grid.get(matrix, x + cell.x, y + cell.y)
		if (other.piece) {
			piece.cells.length = 0
			return false
		}
		piece.cells[i] = other
	}
	for (let cell of piece.cells)
		cell.piece = piece
	piece.x = x
	piece.y = y
	piece.matrix = matrix
	matrix.pieces.push(piece)
	return true
}

function kill(piece) {
	if (!piece.matrix)
		return false
	var index = piece.matrix.pieces.indexOf(piece)
	if (index === -1)
		return false
	for (let cell of piece.cells)
		cell.piece = null
	piece.cells.length = 0
	piece.matrix.pieces.splice(index, 1)
	piece.matrix = null
	piece.x = null
	piece.y = null
	return true
}

function move(piece, ...direction) {
	var dx = 0
	var dy = 1
	if (direction.length)
		[dx, dy] = direction
	var cells = piece.cells.map(cell => Grid.get(piece.matrix, cell.x + dx, cell.y + dy))
	if (!validate(piece, cells))
		return false
	piece.x += dx
	piece.y += dy
	for (let cell of piece.cells)
		cell.piece = null
	for (let i = cells.length; i--;) {
		let cell = cells[i]
		cell.piece = piece
		piece.cells[i] = cell
	}
	return true
}

function rotate(piece, direction) {
	if (!direction)
		direction = 1
	var rotation = piece.rotation
	var rotations = Tetromino[piece.type]
	var max = rotations.length - 1
	if (!max)
		return false
	rotation += direction
	if (rotation < 0)
		rotation = max
	if (rotation > max)
		rotation = 0
	let offset, cells
	for (let step = 0; step < 3 && !cells; step++) {
		for (let direction of directions) {
			offset = { x: step * direction.x, y: step * direction.y }
			cells = rotations[rotation].map(cell => Grid.get(piece.matrix, piece.x + offset.x + cell.x, piece.y + offset.y + cell.y))
			if (validate(piece, cells))
				break
			offset = cells = null
			if (!step)
				break
		}
	}
	if (!cells)
		return false
	piece.x += offset.x
	piece.y += offset.y
	piece.rotation = rotation
	for (let cell of piece.cells)
		cell.piece = null
	for (let i = cells.length; i--;) {
		let cell = cells[i]
		cell.piece = piece
		piece.cells[i] = cell
	}
	return true
}

function validate(piece, cells) {
	for (let cell of cells)
		if (!cell || cell.piece && cell.piece !== piece)
			return false
	return true
}
