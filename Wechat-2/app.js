'use strict'
const Koa = require('koa');
const app = new Koa();
var weChat = require('./weChat/wechat')

var config = {
    wechat: {
        appID: 'wx5b71b0f7a4dac611',
        appSecret: 'e0eac8fcaca226c23d94ca379aab77aa',
        token: 'gufanyuanyingbikongjin'
    
    }
}

app.use(async function (ctx, next) {

    await next(weChat(config.wechat));

});

app.listen(1234)
console.log('listening: 1234')