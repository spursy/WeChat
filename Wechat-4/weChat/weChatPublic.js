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
    },
    group: {
        create: prefix + 'groups/create?',
        fetch: prefix + 'groups/get?',
        check: prefix + 'groups/getid?',
        update: prefix + 'groups/update?',
        move: prefix + 'groups/members/update?',
        batchUpdate: prefix + 'groups/members/batchupdate?',
        del: prefix + 'groups/delete?',
    },
    user: {
        remark: prefix + 'user/info/updateremark?',
        fetch: prefix + 'user/info?',
        batchFetch: prefix + 'user/info/batchget?'
    },
    mass: {
        group: prefix + "message/mass/sendall?"
    },
    menu: {
        create: prefix + "menu/create?",
        get: prefix + "menu/get?",
        delete: prefix + "menu/delete?",
        current: prefix + "get_current_selfmenu_info?"
    }   
}

var WeChatPublic = function WeChatPublic(opts) {   
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.fetchAccessToken()
}

/** featch access token
 * if access token is outdated, then update access token.
 * return valid access token.
 */
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

/** varify access token
 * expire in date must bigger than now.
 */
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

/** update access token
 * request wechat serve to get new access token.
 */
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

/** upload material 
 * upload meterial to WeChat serve.
 */
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
                request(options).then(function (response) {                   
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

/** featch materials
 * 
 */
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
                var body = {
                    "media_id" : mediaId
                }
                request({"method": "POST", "url": url, 'body': body, json: true}).then(function (response) {                   
                        var _data = response.body;
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

/** delete materials
 * 
 */
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

/** update materials
 * 
 */
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

/** count materials
 * 
 */
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

/** batch materials
 * 
 */
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

/** create group
 * 
 */
WeChatPublic.prototype.createGroup = function(name) {
    var that = this;

    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.group.create + 'access_token=' + data.access_token
                var options = {
                    group: {
                        name: name
                    }
                }

                request({method: 'POST', url: url, body: options, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error("Create group failed.")
                        }
                    }).catch(function(err) {
                        resolve(err)
                    }) 
            })
    }) 
}

/** fetch groups
 * 
 */
WeChatPublic.prototype.fetchGroups = function() {
    var that = this;

    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.group.fetch + 'access_token=' + data.access_token

                request({url: url, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error("Fetch group failed.")
                        }
                    }).catch(function(err) {
                        resolve(err)
                    }) 
            })
    }) 
}

/** check group
 * 
 */
WeChatPublic.prototype.checkGroup = function(openID) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.group.check + 'access_token=' + data.access_token
                var options = {
                    openid: openID
                }

                request({method: 'POST', url: url, body: options, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error("Check group failed.")
                        }
                    }).catch(function(err) {
                        resolve(err)
                    }) 
            })
    }) 
}

/** update group
 * 
 */
WeChatPublic.prototype.updateGroup = function(openID, name) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.group.update + 'access_token=' + data.access_token
                var options = {
                    group: {
                        id: openID,
                        name: name
                    }
                }
                request({method: 'POST', url: url, body: options, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error("Update group failed.")
                        }
                    }).catch(function(err) {
                        resolve(err)
                    }) 
            })
    }) 
}

/** move the group
 * 
 */
WeChatPublic.prototype.moveGroup = function(openIDs, to) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.group.move + 'access_token=' + data.access_token
                var options = {
                    to_groupid: to 
                }
                if (_.isArray(openIDs)) {
                     url = api.group.batchMoveGroup + 'access_token=' + data.access_token;
                     options.openid_lists = openIDs;
                } else {
                    url = api.group.move + 'access_token=' + data.access_token;
                    options.openid = openIDs;
                }
                request({method: 'POST', url: url, body: options, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error("Move group failed.")
                        }
                    }).catch(function(err) {
                        resolve(err)
                    }) 
            })
    }) 
}

/** delete group
 * 
 */
WeChatPublic.prototype.deleteGroup = function(id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.group.deleteGroup + 'access_token=' + data.access_token
                var options = {
                    group: {
                        id: id
                    }
                }
                request({method: 'POST', url: url, body: options, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error("Delete group failed.")
                        }
                    }).catch(function(err) {
                        resolve(err)
                    }) 
            })
    }) 
}

/** remark users
 * 
 */
WeChatPublic.prototype.remarkUser = function(openID, remark) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.user.remark + 'access_token=' + data.access_token
                var options = {
                    openid: openID,
                    remark: remark
                }
                request({method: 'POST', url: url, body: options, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error("remark user failed.")
                        }
                    }).catch(function(err) {
                        reject(err)
                    }) 
            })
    }) 
}

/** fetch users 
 * 
 */
WeChatPublic.prototype.fetchUsers = function(openIDs, lang) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var lang = lang || "zh_CN"
                 var options = {
                    json: true
                }
                if(_.isArray(openIDs)) {
                     options.url = api.user.batchFetch + 'access_token=' + data.access_token
                     options.form = {
                        user_list: openIDs
                    }
                    options.method = 'POST'
                } else {
                     options.url = api.user.fetch + 'access_token=' + data.access_token + '&openid =' +openIDs+ '&lang=' + lang
                }
               
                request(options)
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            console.log(_data)
                            resolve(_data)
                        } else {
                            throw new Error("batch fetch failed.")
                        }
                    }).catch(function(err) {
                        reject(err)
                    }) 
            })
    }) 
}

/** send group
 * 
 */
WeChatPublic.prototype.sendByGroup = function(type, message, groupID) {
    var that = this;
    var msg = { 
        filter: {},
        msgtype: type
    }
    msg[type] = message

    if (!groupID) {
        msg.filter.is_to_all = true
    } else {
        msg.filter = {
            is_to_all: false,
            group_id: groupID
        }
    }
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
               var url = api.mass.group + 'access_token=' + data.access_token
                request({method: "POST", url: url, body: msg, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            console.log(_data)
                            resolve(_data)
                        } else {
                            throw new Error("send group failed.")
                        }
                    }).catch(function(err) {
                        reject(err)
                    }) 
            })
    }) 
}

/** create menu
 * 
 */
WeChatPulic.prototype.ceateMenu =  function(menu) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.menu.create + 'access_token' + data.access_token
                request({method: "POST", url: url, body: menu,json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            console.log(_data)
                            resolve(_data)
                        } else {
                            throw new Error("create menu failed.")
                        }
                    })
            })
    })
}

/** get menu
 * 
 */
WeChatPulic.prototype.getMenu = function() {
    var that = this;
    return new Promise(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.menu.get + 'access_token' + data.access_token
                request({url: url, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) {
                            console.log(_data)
                            resolve(_data)
                        } else {
                            throw new Error("get menu failed.")
                        }
                    })
            })
    }
})

/** delete menu
 * 
 */
WeChatPucluic.prototype.deleteMenu = function() {
    var that = this;
    return new Promise(resolve, reject) {
        that.fetchAccessToken()
            .then(function(data) {
                var url = api.menu.delete + 'access_token' + data.access_token
                request({url: url, json: true})
                    .then(function(response) {
                        var _data = response.body
                        if (_data) }{
                            console.log(_data)
                            resolve(_data)
                        } else {
                            throw new Error("delete menu failed.")
                        }
                    })
            })
    }
}


WeChatPublic.prototype.reply = async function (ctx, next) {
    var content = this.body
    var message = this.weixin
    // formate reply xml, then response to WeiChat serve.
    var xml = await xmlUtil.tpl(content, message)
    console.log('xmlDetail' + xml)
    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
    await next
}

module.exports = WeChatPublic