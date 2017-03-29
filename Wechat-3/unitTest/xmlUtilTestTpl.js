 var xmlUtil = require('../util/xmlUtil')

var content = "Hello Word"
var message = {FromUserName: "WeChat", ToUserName: "Spursyy"}

// console.log(message)

var xml = xmlUtil.tpl(content, message)

console.log(xml)
