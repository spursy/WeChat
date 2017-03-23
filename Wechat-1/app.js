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
     console.log(this.query)
    var token = config.wechat.token
    var signature = this.query.signature
    var nonce = this.query.nonce
    var timestamp = this.query.timestamp
    var echostr = this.query.echostr

    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    if (sha === signature){
        ctx.body = echostr + ''
    }
    else {
        ctx.body = 'wrong'
    }
});

app.listen(1234)
console.log('listening: 1234')