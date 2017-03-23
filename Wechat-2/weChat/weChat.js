var sha1 = require('sha1')

module.exports = async function (ctx, next, params) {
    console.log(ctx.query)
    var token = params.wechat.token
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
}
