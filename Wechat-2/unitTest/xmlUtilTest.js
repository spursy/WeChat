var xmlUtil = require('../util/xmlUtil')
var xml1 = "<xml><ToUserName>Spursyy</ToUserName><FromUserName>WeiChat</FromUserName><CreateTime>123456789</CreateTime><MsgType>event</MsgType><Event>subscribe</Event></xml>"
var xml2 = "<xml><ToUserName><name1>Spursyy</name1> <name2>YY</name2></ToUserName><FromUserName><![CDATA[WeiChat]]></FromUserName><CreateTime>123456789</CreateTime><MsgType><![CDATA[event]]></MsgType><Event><![CDATA[subscribe]]></Event></xml>"

// Promise + Async fucvntion
xmlUtil.parseXMLAsync(xml2).then(function(data) {
    (async function() {
        console.log(data)
         var mes = await xmlUtil.formatMessage(data.xml)
         console.log(mes)
         var mes1 = mes.ToUserName
         console.log(mes1)
         console.log("length " + mes1.length)
         await console.log(typeof mes1 === 'object')
         console.log(mes1)
         var name = mes1.name1
         console.log(name)
        //  console.log(typeof name === 'object')
    })()
}).catch(function(err) {
    console.log(err)
})


// console.log("3")
// console.log(typeof ["Spursy, YY, Spursyy"] === 'object')
// console.log(["Spursy, YY, Spursyy"].length)

// console.log("4")
// var mycars=new Array("Saab","Volvo","BMW")
// console.log(mycars)

// // Async + Async function
// async function getValue() {
//     var content = await xmlUtil.parseXMLAsync(xml2)
//     console.log(content)
//     var mes = await xmlUtil.formatMessage(content.xml)
//     await console.log(mes);
// }

// getValue().catch(function(err) {
//     console.log(err)
// })

// // validation formatMessage method.
// var oj = {ToUsrName: ['123'], 
//           FromUsr: ['234', "wetrt"],
//         CreateTime: [22222]}
// var oj2 = {FromUser: ['Spursyy', 'WeChat']}        
// var result = xmlUtil.formatMessage(oj);
// // console.log(result)

// // validation instanceof function
// // console.log( {'name': 'Spursy', 'age': 10} instanceof Array)







