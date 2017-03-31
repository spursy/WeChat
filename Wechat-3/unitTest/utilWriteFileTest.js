var util = require('../util/util')
var path = require('path')
var fpath = path.join(__dirname, './testConfig/test.txt')  

var accessToken = {access_token: 'JzG6cZCgTDMOy4_dVDceqvNZrHOg6JVcvAbIANePVLuwmT5c-OWi-zoKMqaT7Pw7Srg4AJctF_0vcG2V4-H2R_0jwa665EXFyPruWxGVwshk70_jvRhfKMv2zNXTHRsROZXjADAGRP',
 "expires_in": 1490926901174 }

accessToken = JSON.stringify(accessToken)

util.writeFileAsync(fpath, accessToken).then(function(data) {
  cosnsole.log(data)
})

util.readFileAsync(fpath).then(function(data){
  console.log('read File')
  console.log(JSON.parse(data).expires_in)
})

