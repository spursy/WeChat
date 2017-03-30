'use strict'
const Koa = require('koa');
const app = new Koa();
var config = require('../config')
var weChatPublic = require('../weChat/weChatPublic')
var weChatApi = new weChatPublic(config.config.weChat)
var value = weChatApi.uploadMaterial('image', __dirname + '/2.png')
console.log(value)

// app.use(async function(ctx, next) {
//       var weChatApi = new weChatPublic(config.config.weChat)
//       var value = await weChatApi.uploadMaterial('image', __dirname + '/2.png')
//       console.log(value)
// }); 

// app.listen(1234)
// console.log('listening: 1234')