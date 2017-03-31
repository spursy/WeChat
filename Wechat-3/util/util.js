/// <reference path="../../../../typings/index.d.ts" />
var fs = require('fs');
var Promise = require('bluebird');

exports.readFileAsync = function(fpath, encoding) {
    return new Promise(function(resolve, reject){
        fs.readFile(fpath, encoding, function(err, data) {
            if (err) reject (err);
            else resolve(data);
        })
    });
}

exports.writeFileAsync = function(fpath, content) {
    console.log('content:::::')
    console.log(content)
    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, content, function (err, content) {
            if (err) reject(err)
            else resolve(content)
        }) 
    });
}