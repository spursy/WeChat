var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var xmlUtil = require('../util/xmlUtil')
var fs = require('fs')
var _ = require('lodash')
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
	accessToken: prefix + 'token?grant_type=client_credential',
    temporary: {
        upload: prefix + 'media/upload?',
        fetch: prefix + 'media/get?'
    },
    permanent: {
        upload:prefix + 'material/add_material?',
        fetch: prefix + 'material/get_material',
        uploadNews:prefix + 'material/add_news?',
        uploadNewsPic:prefix + 'media/uploadimg?',
        del: prefix + 'meia/del_material?',
        update: prefix + 'meia/update_news?',
        count: prefix + 'material/get_materialcount?',
        batch: prefix + 'material/batchget_material?'
    }    
}

var WeChatPublic = function WeChatPublic(opts) {   
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.fetchAccessToken()
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
            var objData
            try {
                objData = JSON.parse(data)
                console.log(objData)
            }
            catch(e) {
                console.log('Parse access token to JS object failed'+ e)
                that.updateAccessToken()
            }

            if (that.isValidAccessToken(objData)) {
                 console.log('access taken validation is true.')
                 return Promise.resolve(objData)
            }  
            else {
                console.log('access taken validation is false, then update access token.')
                 return that.updateAccessToken()
            }
        })
        .then(function(data) {
            console.log("save new access token in config.txt")
            that.access_token = data.access_token
            that.expires_in = data.expires_in
            var tokenData = JSON.stringify(data)
            that.saveAccessToken(tokenData)
            return Promise.resolve(data)
        }) 
}

WeChatPublic.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    var expires_in = data.expires_in;
    var now = (new Date().getTime());
    if (now < expires_in) {
        return true;
    } else {
        return false;
    }
}

WeChatPublic.prototype.updateAccessToken = function () {
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.accessToken + '&appid=' +appID+ '&secret=' +appSecret;

    return new Promise(function(resolve, reject) {
        request({url: url, JSON: true}).then(function (response) {
            var data = response.body;
            data = JSON.parse(data)
            var now = (new Date().getTime());
            console.log(data.expires_in - 20)
            var expires_in = now + (data.expires_in -20)* 1000;
           
            data.expires_in = expires_in;
            resolve(data);
        }) ;
    });
}

WeChatPublic.prototype.uploadMaterial = function (type, material, permanent) {
    var that = this
    var form = {}
    var uploadUrl = api.temporary.upload

    if (permanent) {
        uploadUrl = api.permanent.upload
        _.extend(form, permanent)
    }

    if (type === 'pic') {
        uploadUrl = api.permanent.uploadNewsPic
    }
    
    if (type === 'news') {
        uploadUrl = api.permanent.uploadNews,
        form = material
    } else {
        form.media = fs.createReadStream(material)
    }

    return new Promise(function(resolve, reject) {
         that.fetchAccessToken()
            .then(function(data) {
                var url = uploadUrl + 'access_token=' +data.access_token
                if (!permanent) {
                    url += '&type=' + type
                } else {
                    form.access_token = data.access_token.toString()
                }
                var options = {
                    method: "POST",
                    url: url,
                    JSON: true
                }
                if (type === 'news') {
                    options.body = form
                } else {
                    options.formData = form
                }
                // request({method: 'POST', url: url, formData: form, JSON: true})

                console.log("URL:::::::::::" + url)

                request(options).then(function (response) {                   
                        var _data = response.body;
                        console.log("responseData:"+ _data)
                        if (_data) {
                            resolve(_data)
                        } else {
                            var err = new Error('Upload materials failed')
                            reject(err)
                        }
                    })
            }).catch(function (err) {
                        console.log(err)
                        retject(err)
            }) ;
    });
}

WeChatPublic.prototype.fetchMaterial = function (mediaId, type, permanent) {
    var that = this
    var form = {}
    var fetchdUrl = api.temporary.fetch

    if (permanent) {
        fetchdUrl = api.permanent.fetch
    }
    return new Promise(function(resolve, reject) {
         that.fetchAccessToken()
            .then(function(data) {
                var url = fetchdUrl + 'access_token=' +data.access_token + '&media_id=' + mediaId
                if (!permanent && type === 'video') {
                    url = url.replace("https://", "http://")
                    url += '&type=' + type
                } 
                resolve(url)
            })    
    });
}

WeChatPublic.prototype.deleteMaterial = function (mediaId) {
    var that = this
    var form = {
        media_id: mediaId
    }
    return new Promise(function(resolve, reject) {
         that.fetchAccessToken()
            .then(function(data) {
                var url = api.permanent.del + 'access_token=' +data.access_token + '&media_id=' + mediaId
                var options = {
                    method: "POST",
                    url: url,
                    JSON: true,
                    body: form
                }
                request(options).then(function (response) {                   
                        var _data = response.body;
                        console.log("responseData:"+ _data)
                        if (_data) {
                            resolve(_data)
                        } else {
                            var err = new Error('Upload materials failed')
                            reject(err)
                        }
                    })
            })    
    });
}

WeChatPublic.prototype.updateMaterial = function (mediaId, news) {
    var that = this
    var form = {
        media_id: mediaId
    }
    _.extend(form, news)
    return new Promise(function(resolve, reject) {
         that.fetchAccessToken()
            .then(function(data) {
                var url = api.permanent.update + 'access_token=' +data.access_token + '&media_id=' + mediaId
                var options = {
                    method: "POST",
                    url: url,
                    JSON: true,
                    body: form
                }
                request(options).then(function (response) {                   
                        var _data = response.body;
                        console.log("responseData:"+ _data)
                        if (_data) {
                            resolve(_data)
                        } else {
                            var err = new Error('Upload materials failed')
                            reject(err)
                        }
                    })
            })    
    });
}

WeChatPublic.prototype.countMaterial = function () {
    var that = this

    return new Promise(function(resolve, reject) {
         that.fetchAccessToken()
            .then(function(data) {
                var url = api.permanent.count + 'access_token=' +data.access_token 
                var options = {
                    method: "GET",
                    url: url,
                    JSON: true
                }
                request(options).then(function (response) {                   
                        var _data = response.body;
                        console.log("responseData:"+ _data)
                        if (_data) {
                            resolve(_data)
                        } else {
                            var err = new Error('Upload materials failed')
                            reject(err)
                        }
                    })
            })    
    });
}

WeChatPublic.prototype.batchMaterial = function (paramOptions) {
    var that = this
    paramOptions.type = paramOptions.type || type
    paramOptions.offset = paramOptions.offset || 0
    paramOptions.count = paramOptions.count || 1
    return new Promise(function(resolve, reject) {
         that.fetchAccessToken()
            .then(function(data) {
                var url = api.permanent.count + 'access_token=' +data.access_token 
                var options = {
                    method: "POST",
                    url: url,
                    body: paramOptions,
                    JSON: true
                }
                request(options).then(function (response) {                   
                        var _data = response.body;
                        console.log("responseData:"+ _data)
                        if (_data) {
                            resolve(_data)
                        } else {
                            var err = new Error('Upload materials failed')
                            reject(err)
                        }
                    })
            })    
    });
}

WeChatPublic.prototype.reply = async function (ctx, next) {
    var content = this.body
    var message = this.weixin
    var xml = await xmlUtil.tpl(content, message)
    console.log('xmlDetail' + xml)
    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
    await next
}

module.exports = WeChatPublic