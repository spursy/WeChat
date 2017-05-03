var config = require('../config')
var util = require('../util/util')
var path = require('path')
var fpath = path.join(__dirname, './testConfig/test.txt')  


// console.log(config.config.weChat)

var image = {"type":"image","media_id":"M2D_1pj4mvQJp6KANDJfB-ygcgV2R6TRwlUkynDY1K9RnlJJEmhN2lK9bNofLRl7","created_at":1490877654}

// var media_id = image.media_id
// var type = image.type

// var buffer= JSON.stringify(image)
// //new Buffer(image); 
// util.writeFileAsync(fpath, buffer).then(function(data) {
//   cosnsole.log(data)
// })

// util.readFileAsync(fpath).then(function(data){
//   console.log('read File')
//   console.log(JSON.parse(data).type)
// })

var date = new Date();
console.log(date)

var data = date.getTime()
console.log(data)

