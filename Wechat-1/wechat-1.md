### 1. 域名、服务器和ngrok的配置
#### 1.1 应用服务器通过域名与微信服务器实现连接最终与微信实现连接
![图 1.1](http://upload-images.jianshu.io/upload_images/704770-3f9c747097a88782.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 1.2 本地测试阶段时可以通过ngrok 搭建本地服务器以充作应用服务器
![图 1.2](http://upload-images.jianshu.io/upload_images/704770-9cadc93efadff902.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

   `npm install -g loacltunnel` 安装localtunnel 映射工具
    `python -m SimpleHttpSever 3100` 通过python 开启一个本地服务

![图 1.3](http://upload-images.jianshu.io/upload_images/704770-ff6d4d42d73c7417.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 
   `lt --port 端口号` 通过localtunnel 工具把服务影射到外网

![图 1.4](http://upload-images.jianshu.io/upload_images/704770-789b3693acde6fb2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![图 1.5](http://upload-images.jianshu.io/upload_images/704770-217aab191dc4346f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 2. 配置、接入微信公众号
#### 2.1 配置微信公众号
>登陆微信开发者平台配置微信开发者接口信息

![图 2.1](http://upload-images.jianshu.io/upload_images/704770-35c2133d48392d3d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>微信公众号的验证逻辑


![图 2.1](http://upload-images.jianshu.io/upload_images/704770-3c422b810b072a1a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![图 2.2](http://upload-images.jianshu.io/upload_images/704770-864e547a02c835f1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 2.2 通过code 接入微信开发者平台
>先是创建app.js 文件

```
'use strict'

var Koa = require('koa')
var sha1 = require('sha1')
var config = {
    wechat: {
        appID: 'xxxxxx',
        appSecret: 'yyyyyy',
        token: 'zzzzzz'
    }
}

var app = new Koa()

app.use(function *(next) {
    var token = config.wechat.token
    var signature = this.query.signature
    var nonce = this.query.nonce
    var timestamp = this.query.timestamp
    var echostr = this.query.echostr
    var str = [token, timestamp, nonce].sort().join('')
    if (sha === signature){
        this.body = echostr + ''
    }
    else {
        this.body = 'wrong'
    }
})

app.listen(1234)
console.log('listening: 1234')
```
>然后运行app.js
>接着通过localtunnel 将本地的服务的IP地址影射到外网
>最后把影射的IP地址填写在Wechat 配置文件里进行验证