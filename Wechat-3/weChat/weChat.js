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

WeChat.prototype.reply = function () {
    var content = this.body
    var message = this.weixin
    var xml = xmlUtil.tpl =(content, message)

    this.status = 200
    this.type = 'application/xml'
    this.body = xml
}

module.exports = function (params， handler) {
        return async function(ctx, next) {
                    var weCHat = new WeChat(params)
                    var token = params.token
                    var signature = ctx.query.signature
                    var nonce = ctx.query.nonce
                    var timestamp = ctx.query.timestamp
                    var echostr = ctx.query.echostr
                    var str = [token, timestamp, nonce].sort().join('')
                    var sha = sha1(str)

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
                        var content = await xmlUtil.parseXMLAsync(data)
                        console.log(content.xml)
                         var mes = await xmlUtil.formatMessage(content.xml)
                         console.log("message ++ " + mes);
                        // if (mes.MsgType === 'event') {
                        //     if (mes.Event === 'subscribe') {
                        //         var now = new Date().getTime()

                        //         ctx.status = 200
                        //         ctx.type = 'application/xml'
                        //         ctx.body = '<xml><ToUserName><![CDATA['+mes.FromUserName+']]></ToUserName><FromUserName><![CDATA['+mes.ToUserName+']]></FromUserName><CreateTime>new Date().getDate()</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好 ' +'我的萌小点， 么么哒'+ ']]></Content></xml>'
                        //     }
                        // }
                        this.weixin = mes
                        await handler.call(this, next)
                        wechat.reply.call(this)
                    }  
        }      
}


