var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var xmlUtil = require('../util/xmlUtil')
var fs = require('fs')
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
	access_token: prefix + 'token?grant_type=client_credential',
    upload: prefix + 'media/upload?'
    // https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE
}

var WeChatPublic = function WeChatPublic(opts) {
    
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.fetchAccessToken()
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    
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

WeChatPublic.prototype.fetchAccessToken = function () {
    var that = this
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this)
        }
    }
    return that.getAccessToken() 
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
            return Promise.resolve(data)
        }) 
}

WeChatPublic.prototype.uploadMaterial = function (type, filepath) {
    var that = this
    var form = {
        media: fs.createReadStream(filepath)
    }
    return new Promise(function(resolve, reject) {
         that.fetchAccessToken()
            .then(function(data) {
                var url = api.upload + '&access_token=' +data.access_token+ '&type=' +type;
                request({method: 'POST', url: url, formData: form, JSON: true}).then(function (response) {                                  
                        var _data = response.body;
                        if (_data) {
                            resolve(_data)
                        } else {
                            var err = new Error('Upload materials failed')
                            reject(err)
                        }
                    })
            }).catch(function (err) {
                        retject(err)
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
    console.log('1234xml' + xml)
    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
    await next
}

module.exports = WeChatPublic