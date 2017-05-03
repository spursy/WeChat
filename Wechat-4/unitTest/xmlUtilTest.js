var xmlUtil = require('../util/xmlUtil')
var xml1 = "<xml><ToUserName>Spursyy</ToUserName><FromUserName>WeiChat</FromUserName><CreateTime>123456789</CreateTime><MsgType>event</MsgType><Event>subscribe</Event></xml>"
var xml2 = "<xml><ToUserName><![CDATA[Spursy]]></ToUserName><FromUserName><![CDATA[WeiChat]]></FromUserName><CreateTime>123456789</CreateTime><MsgType><![CDATA[event]]></MsgType><Event><![CDATA[subscribe]]></Event></xml>"

// Promise + Async fucvntion
// xmlUtil.parseXMLAsync(xml2).then(function(data) {
//     (async function() {
//          console.log(data)
//          console.log(1)
//          var mes = await xmlUtil.formatMessage(data.xml)
//          console.log(2)
//          await console.log(mes);
//     })()
    
// }).catch(function(err) {
//     console.log(err)
// })

// Async + Async function
async function getValue() {
    var content = await xmlUtil.parseXMLAsync(xml2)
    console.log(content)
    var mes = await xmlUtil.formatMessage(content.xml)
    await console.log(mes);
}

getValue().catch(function(err) {
    console.log(err)
})


// validation formatMessage method.
var oj = {ToUsrName: ['123'], 
          FromUsr: ['234', "wetrt"],
        CreateTime: [22222]}
var oj2 = {FromUser: ['Spursyy', 'WeChat']}        
var result = xmlUtil.formatMessage(oj);
// console.log(result)

// validation instanceof function
// console.log( {'name': 'Spursy', 'age': 10} instanceof Array)







