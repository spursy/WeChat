exports.reply = function* (next) {
    var message = this.weixin

    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('Scan code:')
            }
            this.body = '哈哈哈， 你订阅了\r\n' + '消息ID：' + message.MsgId
        } else if (message.Event === 'unsubcribe') {
            console.log('武清区感')
            this.body = ''
        }

    } else {

    }
    yield next
}