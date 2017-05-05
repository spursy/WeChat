var config = require('./config');
var weChatPublic = require('./weChat/weChatPublic');
var weChatApi = new weChatPublic(config.config.weChat);
var menu = require('./menu');
var path = require('path');
const materialPath = path.join(__dirname + '../materials');

/**
 * Add menu reference.
 */
weChatApi.deleteMenu()
    .then(function() {
        weChatApi.ceateMenu(menu)
            .then(function(data) {
                console.log(data);
            })
    })


/**
 * 
 */
exports.reply = async function (next) {
    var message = this.weixin
 
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('Scan code:')  
            }
            console.log('1' + message.MsgId)
            this.body = '哈哈哈， 你订阅了\r\n' + '消息ID：'
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关')
            this.body = ''
        } else if (message.Event === 'LOCATION') {
            this.body = "您上报的磁力位置是：" + message.Latitude + '/' +message.Longitude+ "-" + message.Precision
        } else if (message.Event === 'CLICK') {
            this.body = '您点击了菜单：' + message.EventKey
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫描二维码' +message.EventKey+ ' ' + message.Ticket)
            this.body = '看到我扫一下哦！'
        } else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中的链接： ' +message.EventKey
        }  
    } else if (message.MsgType === 'text') {
         var content = message.Content
         var reply = '额，你说的 ' +message.Content+ '太复杂了'

         if(content === '1') {
            reply = '我是 1'
         } else if (content === '2') {
            reply = '我是 2'
         } else if (content === '3') {
            reply = '我是 3'
         } else if (content === '4') {
            reply = [{
                title: "技术改变世界",
                description: "这只是描述而已",
                picUrl: "http://upload-images.jianshu.io/upload_images/704770-b1bcc834295b02c9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"
           }]
         } else if (content === '5') {
            var data = await weChatApi.uploadMaterial('image', materialPath + '/2.png')
            data = JSON.parse(data)
            reply = await  {
                "type": 'image',
                "mediaid": data.media_id
            }
         } else if (content === '6') {
              var data = await weChatApi.uploadMaterial('video', materialPath + '/lake.mp4')
              data = JSON.parse(data)
              console.log('AfterUploadMaterial'+ data.media_id)
            reply = await  {
                "type": 'video',
                "mediaid": data.media_id,
                "title": "Du shu lake",
                "description": "I like du shu lake"
            }
         } else if (content === '7') {
              var data = await weChatApi.uploadMaterial('image', materialPath + '/2.png')
              data = JSON.parse(data)
              console.log('AfterUploadMaterial'+ data.media_id)
            reply = await  {
                "type": 'music',
                "description": "I love music",
                "title": "一起摇摆",
                "musicUrl": "http://bd.kuwo.cn/yinyue/6820326?from=baidu",
                "thumbMediaid": data.media_id
            }
         }else if (content === '8') {
              var data = await weChatApi.uploadMaterial('image', __dirname + '/2.png', {type: 'image'})
              data = JSON.parse(data)
              console.log('AfterUploadMaterial::::::'+ data.media_id)
            reply = await  {
                "type": 'image',
                "mediaid": data.media_id
            }
         }else if (content === '9') {
              var data = await weChatApi.uploadMaterial('video', __dirname + '/lake.mp4', {type: "video", description: '{"title": "Really a nice place.", "introduction": "Never think it so easy."}'})
              data = JSON.parse(data)
              console.log('AfterUploadMaterial::::::'+ data.media_id)
            reply = await  {
                "type": 'video',
                "title": "一起摇摆",
                "description": "我是谁",
                "mediaid": data.media_id
            }
         } else if (content === '10') {
            var picData = await weChatApi.uploadMaterial('image', __dirname + '/2.png', {})
            picData = JSON.parse(picData)
              var media = {
                  articles: [{
                      title: "Spursy",
                      thumb_media_id: picData.media_id,
                      author: "Spursyy",
                      digest: "没有摘要",
                      show_cover_pic: 1,
                      content: "没有内容",
                      cotent_source_url: "https://github.com/spursy/WeChat"
                  }]
              }
              console.log(JSON.stringify(media))
              data = await weChatApi.uploadMaterial("news", JSON.stringify(media), {})
            //   data = await weChatApi.fetchMaterial(data.media_id)
              console.log("111111111111" + JSON.stringify(data))
              
            //   var items = data.news_item
            //   var news = []
            //   items.forEach(function(item) {
            //         news.push({
            //             title: item.title,
            //             description: item.digest,
            //             picUrl: picData.url,
            //             url: item.url
            //         })
            //   })
            //   reply = mews
         } else  if (content === '12'){
            // var group = await weChatApi.createGroup('weChat')
            // console.log('新分组 weChat')
            // console.log(group)
            // var fetchGroups = await weChatApi.fetchGroups()
            // console.log('加了分组列表')
            // console.log(fetchGroups)

            var groupID = await weChatApi.checkGroup(message.FromUserName)
            console.log('查看自己的分组')
            console.log(groupID)   

            // var result = await weChatApi.moveGroup(message.FromUserName, 100)
            // console.log('移动后的分组')
            // console.log(result)

            // var groupMoved = await weChatApi.checkGroup(message.FromUserName)
            // console.log('移动后我的当前分组')
            // console.log(groupMoved)

            reply = 'Group done'
         } else if (content === '13') {
             console.log('From from from' + message.FromUserName)
            var user = await weChatApi.fetchUsers(message.FromUserName, 'en')
            console.log(user + '123456789')
            var openIds = [
                {
                    openid: message.FromUserName,
                    lang: 'en'
                }
            ]
            var users = await weChatApi.fetchUsers(openIds)
            console.log(users)
         } else if (content ===  '15') { 
            var mpnews = {
                media_id: 'cEn1jwnodDYTi0fFJEOMIC4ATOPrxuc7_UHts0Qih-8'
            }
            var msgData = await weChatApi.sendByGroup('mpnews', mpnews, 0)
            console.log(msgData)
            reply = 'Yeah!'
         } else if (content === '16') {

         }

         this.body = reply
    } 
    await next
}