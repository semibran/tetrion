const Piece = require('./piece')
const Grid = require('grid')
const Bag = require('bag')
const utils = require('utils')

module.exports = Tetrion
Tetrion.start = start
Tetrion.reset = reset
Tetrion.update = update
Tetrion.send = send

function Tetrion(cols, rows, dispatch) {

	var area = cols * rows
	var data = Array(area)
	for (let i = area; i--;) {
		let x = i % cols
		let y = (i - x) / cols
		data[i] = { x, y }
	}

	var tetrion = { cols, rows, data, pieces: [], piece: null, bag: null, next: null, hold: null, held: false, score: 0, done: false, dispatch }

	return tetrion

}

function start(tetrion, seed) {
	reset(tetrion, seed)
	update(tetrion)
}

function reset(tetrion, seed) {
	tetrion.done = false
	tetrion.piece = null
	tetrion.pieces.length = 0
	for (let i = tetrion.cols * tetrion.rows; i--;)
		tetrion.data[i].piece = null
	tetrion.bag = Bag(Piece.types, seed)
	tetrion.next = tetrion.bag()
	tetrion.hold = null
	tetrion.held = false
	tetrion.score = 0
	emit(tetrion, 'reset')
}

function update(tetrion) {
	if (tetrion.done)
		return
	var piece = tetrion.piece
	if (!piece) {
		let type = tetrion.next
		let piece = Piece(type)
		let spawned = spawn(tetrion, piece)
		if (spawned)
			tetrion.next = tetrion.bag()
		return
	}
	var moved = Piece.move(piece)
	if (!moved) {
		if (!piece.locking) {
			piece.locking = true
			emit(tetrion, 'locking', piece)
		} else {
			piece.locking = false
			piece.locked = true
			emit(tetrion, 'lock', piece)
			var lines = getLines(tetrion)
			if (lines.length) {
				for (let y = lines[lines.length - 1], d = 0; y; y--) {
					if (lines.includes(y)) {
						for (let x = tetrion.cols; x--;) {
							let cell = Grid.get(tetrion, x, y)
							let piece = cell.piece
							let cells = piece.cells
							cell.piece = null
							utils.remove(cells, cell)
							if (!cells.length)
								utils.remove(tetrion.pieces, piece)
						}
						d++
						continue
					}
					for (let x = tetrion.cols; x--;) {
						let cell = Grid.get(tetrion, x, y)
						let next = Grid.get(tetrion, x, y + d)
						next.piece = cell.piece
						if (cell.piece) {
							let index = cell.piece.cells.indexOf(cell)
							cell.piece.cells[index] = next
							cell.piece = null
						}
					}
				}
				tetrion.score += score(lines.length)
				emit(tetrion, 'line', lines)
			}
			tetrion.piece = null
			tetrion.held = false
		}
	} else {
		piece.locking = false
		tetrion.score += 10
		emit(tetrion, 'drop', piece)
	}
}

function spawn(tetrion, piece) {
	let spawned = Piece.spawn(piece, tetrion)
	if (spawned) {
		tetrion.piece = piece
		emit(tetrion, 'spawn', piece)
	} else {
		tetrion.done = true
		emit(tetrion, 'done')
	}
	return spawned
}

function score(lines) {
	switch (lines) {
		case 1:
			return 1000
		case 2:
			return 3000
		case 3:
			return 5000
		case 4:
			return 10000
	}
}

function getLines(tetrion) {
	var lines = []
	for (let { y } of tetrion.piece.cells) {
		if (lines.includes(y))
			continue
		lines.push(y)
	}
	for (let i = lines.length; i--;) {
		let y = lines[i]
		for (let x = tetrion.cols; x--;) {
			let block = Grid.get(tetrion, x, y)
			if (!block.piece) {
				lines.splice(i, 1)
				break
			}
		}
	}
	return lines
}

function hold(tetrion, piece) {
	if (tetrion.held)
		return false
	tetrion.held = true
	Piece.kill(piece)
	if (piece === tetrion.piece) {
		tetrion.piece = null
		let type = tetrion.hold
		if (type) {
			let piece = Piece(type)
			spawn(tetrion, piece)
		}
	}
	tetrion.hold = piece.type
	emit(tetrion, 'hold', piece)
	return true
}

function emit(tetrion, ...event) {
	if (tetrion.dispatch)
		tetrion.dispatch(...event)
}

function send(tetrion, ...command) {
	var piece = tetrion.piece
	if (tetrion.done || !piece)
		return null
	var [type, ...data] = command
	var success = execute(tetrion, command)
	if (success) {
		if (piece.locking)
			piece.locking = false
		emit(tetrion, type, piece)
	}
	return success
}

function execute(tetrion, command) {
	var [type, ...data] = command
	var piece = tetrion.piece
	if (piece) {
		switch (type) {
			case 'move':
				return Piece.move(piece, ...data)
			case 'rotate':
				return Piece.rotate(piece, ...data)
			case 'hold':
				return hold(tetrion, piece)
		}
	}
	return null
}
