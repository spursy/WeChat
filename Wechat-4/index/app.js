'use strict'
const Koa = require('koa');
const app = new Koa();
var util = require('./util/util')
var path = require('path')
var weChat = require('./weChat/weChat')
var weXin = require('../wx/weiXin')
var fpath = path.join(__dirname, '../config/wechat.txt')  

var config = {
    weChat: {
        appID: 'wx5b71b0f7a4dac611',
        appSecret: 'e0eac8fcaca226c23d94ca379aab77aa',
        token: 'gufanyuanyingbikongjin',
        getAccessToken: function() {
            return util.readFileAsync(fpath);
        },
        saveAccessToken: function(fcontent) {
            return util.writeFileAsync(fpath, fcontent);
        }
    }
}

app.use(weChat(config.weChat, weXin.reply))

app.listen(1234)
console.log('listening: 1234')