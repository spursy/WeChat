const fs = require('fs')
var lower = require('stream').lower
const filePath = './original.txt'

// // read file strem.
// const rs = fs.createReadStream(filePath)
// // write file stream.
// const ws = fs.createWriteStream('./copy.txt')
// // Put read file stream into write file stream through pipe function.
// rs.pipe(ws)

const rs = fs.createReadStream('./original.txt');
var chunkArr = [],
    chunkLen = 0;
rs.on('data',(chunk)=>{
    chunkArr.push(chunk);
    chunkLen+=chunk.length;
});
rs.on('end',(chunk)=>{
    console.log(chunkArr)
    console.log(chunkLen)
    console.log(Buffer.concat(chunkArr,chunkLen).toString());
});
