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
         }
         this.body = reply
    }
    await next
}