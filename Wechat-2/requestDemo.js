// var request = require('request');
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

request('http://localhost:3000/', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
