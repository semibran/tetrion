function remove(array, item) {
	var index = array.indexOf(item)
	if (index === -1)
		return false
	array.splice(index, 1)
	return true
}

module.exports = { remove }
