#### 1. 本地保存access_token 票据
>access_token是公众号的全局唯一票据，公众号调用各接口时都需使用access_token。access_token的存储至少要保留512个字符空间。access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。

**Noted 1** 为了保密appsecrect，第三方需要一个access_token获取和刷新的中控服务器。而其他业务逻辑服务器所使用的access_token均来自于该中控服务器，不应该各自去刷新，否则会造成access_token覆盖而影响业务；
**Noted 2** 目前access_token的有效期通过返回的expire_in来传达，目前是7200秒之内的值。中控服务器需要根据这个有效时间提前去刷新新access_token。在刷新过程中，中控服务器对外输出的依然是老access_token，此时公众平台后台会保证在刷新短时间内，新老access_token都可用，这保证了第三方业务的平滑过渡；

util.js 文件封装读取与存储access_token 的方法
```
exports.readFileAsync = function(fpath, encoding) {
    return new Promise(function(resolve, reject){
        fs.readFile(fpath, encoding, function(err, data) {
            if (err) reject (err);
            else resolve(data);
        })
    });
}
exports.writeFileAsync = function(fpath, content) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, content, function (err, content) {    
            if (err) reject(err)
            else resolve(content)
        }) 
    });
}
```
app.js 将读access_token 与存access_token 的方法保存在config里
```
wechat: {
        appID: 'xxxx',
        appSecret: 'xxxx',
        token: 'xxxx',
        getAccessToken: function() {
            return util.readFileAsync(fpath);
        },
        saveAccessToken: function(fcontent) {
            return util.writeFileAsync(fpath, fcontent);
        }
    }
}
```
weChat.js 最总实现access_token的验证与更新
```
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
```

![图 1 保存access_token](http://upload-images.jianshu.io/upload_images/704770-2a5db673f69b0a1e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### 2. 简述WeChat的接收消息与被动回复消息
>当普通微信用户向公众账号发消息时，微信服务器将POST消息的XML数据包到开发者填写的URL上。

开发者的的服务器可以接受[七种普通消息](http://mp.weixin.qq.com/wiki/17/f298879f8fb29ab98b2f2971d42552fd.html)，以文本消息为例：
```
<xml>
 <ToUserName><![CDATA[toUser]]></ToUserName>
 <FromUserName><![CDATA[fromUser]]></FromUserName> 
 <CreateTime>1348831860</CreateTime>
 <MsgType><![CDATA[text]]></MsgType>
 <Content><![CDATA[this is a test]]></Content>
 <MsgId>1234567890123456</MsgId>
 </xml>
```
当用户发送消息给公众号时（或某些特定的用户操作引发的事件推送时），会产生一个POST请求，开发者可以在响应包（Get）中返回特定XML结构，来对该消息进行响应（现支持回复文本、图片、图文、语音、视频、音乐）。严格来说，发送被动响应消息其实并不是一种接口，而是对微信服务器发过来消息的一次回复。详情参照官网[发送消息-被动回复消息](http://mp.weixin.qq.com/wiki/1/6239b44c206cab9145b1d52c67e6c551.html)

```
<xml>
<ToUserName><![CDATA[toUser]]></ToUserName>
<FromUserName><![CDATA[fromUser]]></FromUserName>
<CreateTime>12345678</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[你好]]></Content>
</xml>
```
#### 3.简单的被动回复文本消息

![图 3.1](http://upload-images.jianshu.io/upload_images/704770-c514fb4a49cb23f1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
**通过“[raw-body](https://www.npmjs.com/package/raw-body)” 模块获取微信服务器向开发者服务器请求的xml 数据**
```
var getRawBody = require('raw-body')
var data =  await getRawBody(ctx.req, {
         length: this.length,
         limit: '1mb',
         encoding: this.charset
 })
```
**通过“[xml2js](https://www.npmjs.com/package/xml2js)” 模块把xml 数据解析成为JavaScript object 数据**
```
var xml2js = require('xml2js')
var promise = require('bluebird')
exports.parseXMLAsync = function(xml) {
    return new Promise(function(resolve, reject) {
        xml2js.parseString(xml, {trim: true}, function(err, content) {
            if (err) reject(err)
            else resolve(content)
        })
    })
}
```
**去除JavaScript object 中的无关数据**
```
function formatMessage(result) {
    var message = {};
    if (typeof result === 'object') {
        var keys = Object.keys(result)
        for (var i = 0; i < keys.length; i++) {            
            var item = result[keys[i]]
            var key = keys[i];
            
            if ((!(item instanceof Array ) || item.length === 0) ) {
                continue;
            }
            if (item.length === 1) {
                var val = item[0]

                if (typeof val === 'object') {
                    message[key] = formatMessage(val)
                }
                else {
                    message[key] = (val || '')
                }
            } else {
                message[key] = []

                for (var j = 0, k = item.length; j < k; j++) {
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    } else {
        return result;        
    }
    return message
}
```
**把拼装后需要回复的信息返回给微信服务器**
```
if (mes.MsgType === 'event') {
                            if (mes.Event === 'subscribe') {
                                var now = new Date().getTime()

                                ctx.status = 200
                                ctx.type = 'application/xml'
                                ctx.body = '<xml><ToUserName><![CDATA['+mes.FromUserName+']]></ToUserName><FromUserName><![CDATA['+mes.ToUserName+']]></FromUserName><CreateTime>new Date().getDate()</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好 ' +'我的萌小点， 么么哒'+ ']]></Content></xml>'
                       }
 }
```
