const fs = require('fs')
var lower = require('stream').lower
const filePath = './original.txt'

// read file strem.
const rs = fs.createReadStream(filePath)
// write file stream.
const ws = fs.createWriteStream('./copy.txt')
// Put read file stream into write file stream through pipe function.
rs.pipe(ws)
