'use strict'
const Koa = require('koa');
const app = new Koa();

var sha1 = require('sha1')
var config = {
    wechat: {
        appID: 'wx5b71b0f7a4dac611',
        appSecret: 'e0eac8fcaca226c23d94ca379aab77aa',
        token: 'gufanyuanyingbikongjin'
    
    }
}

app.use(async function (ctx, next) {
    // console.log(ctx)
    console.log(ctx.query)
    var token = config.wechat.token
    var signature = ctx.query.signature
    var nonce = ctx.query.nonce
    var timestamp = ctx.query.timestamp
    var echostr = ctx.query.echostr

    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    if (sha === signature){
        ctx.body = echostr + ''
    }
    else {
        ctx.body = 'wrong'
    }
});

app.listen(3721)
console.log('listening: 3721')