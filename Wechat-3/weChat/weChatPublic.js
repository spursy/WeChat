var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var xmlUtil = require('../util/xmlUtil')
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
	access_token: prefix + 'token?grant_type=client_credential'
}

function WeChatPublic(opts) {
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

WeChatPublic.prototype.updateAccessToken = function () {
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

WeChatPublic.prototype.isValidAccessToken = function (data) {

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

WeChatPublic.prototype.reply = async function (ctx, next) {
    var content = this.body
    var message = this.weixin
    var xml = await xmlUtil.tpl(content, message)

    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
    await next
}

module.exports = WeChatPublic