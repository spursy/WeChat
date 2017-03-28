// var request = require('request');
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

request('http://localhost:3000/', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});

// var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid =wx5b71b0f7a4dac611&secret=e0eac8fcaca226c23d94ca379aab77aa'
// request({url: url, JSON: true}).then(function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// }) ;