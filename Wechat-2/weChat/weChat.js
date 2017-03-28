var sha1 = require('sha1')
var Promise = require('bluebird')
var getRawBody = require('raw-body')
var request = Promise.promisify(require('request'))
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var xmlUtil = require('../util/xmlUtil')
var api = {
	access_token: prefix + 'token?grant_type=client_credential'
}


function WeChat(opts) {
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    var that = this
    opts.getAccessToken()
        .then(function(data) {
            try {
                data = JSON.parse(data)
            }
            catch(e) {
                that.updateAccessToken()
            }
            if (that.isValidAccessToken(data))
                return Promise.resolve(data)
            else
                return that.updateAccessToken()
        })
        .then(function(data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in

            that.saveAccessToken(data)
        })
}

WeChat.prototype.updateAccessToken = function () {
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.access_token + '&appid=' +appID+ '&secret=' +appSecret;

    return new Promise(function(resolve, reject) {
        request({url: url, JSON: true}).then(function (response) {
          
            var data = response.body;
            var now = (new Date().getTime());
            var expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            resolve(data);
        }) ;
    });
}

WeChat.prototype.isValidAccessToken = function (data) {

    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }

    var expires_in = data.expires_in;
    var now = (new Date().getDate());

    if (now < expires_in) {
        return true;
    } else {
        return false;
    }
}

module.exports = function (params) {
        return async function(ctx, next) {
                //     console.log(3)
                    var weCHat = new WeChat(params)
                    var token = params.token
                    var signature = ctx.query.signature
                    var nonce = ctx.query.nonce
                    var timestamp = ctx.query.timestamp
                    var echostr = ctx.query.echostr
                    var str = [token, timestamp, nonce].sort().join('')
                    var sha = sha1(str)
                //     if (sha === signature){
                //             ctx.body = echostr + ''
                //         }
                //         else {
                //             ctx.body = 'wrong'
                //         }
                // await next();
                    console.log(ctx.method)
                    if (ctx.method === 'GET') {
                        if (sha === signature){
                            ctx.body = echostr + ''
                        }
                        else {
                            ctx.body = 'wrong'
                        }
                    } else if (ctx.method === 'POST') {
                        if (sha !== signature){
                            ctx.body = 'wrong'
                            return false
                        }
                        var data =  await getRawBody(ctx.req, {
                            length: this.length,
                            limit: '1mb',
                            encoding: this.charset
                        })

                        console.log("data ++ " + data )
                        var content = xmlUtil.parseXMLAsync(data)
                        console.log("content ++ " + content)

                        // var message = xmlUtil.formatMessage(content) 
                        // console.log("message ++ " + message);
                    }  
        }      
}


