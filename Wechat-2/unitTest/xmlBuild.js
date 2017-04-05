var fs = require('fs'),
    xml2js = require('xml2js');
 
var obj = {name: {name1: "spursy", name2: "yy"}, Surname: "Man", age: 23};
 
var builder = new xml2js.Builder();
var xml = builder.buildObject(obj);
console.log(xml)