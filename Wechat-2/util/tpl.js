'use strict'
var ejs = require('ejs')
var heredoc = require('heredoc')

var tpl = heredoc(function() {/*
     <xml>
        <ToUserName><![CDATA[<%= toUserName%>]]></ToUserName>
        <FromUserName><![CDATA[<%= fromUserName%>]]></FromUserName> 
        <CreateTime><%= createTime%></CreateTime>
        <MsgType><![CDATA[<%= msgType%>]]></MsgType>
        <%if (msgType === 'text') {%>
            <Content><![CDATA[<%= content%>]]></Content>
        <%} else if (msgType === 'text') {%>
            <PicUrl><![CDATA[<%= content.url%>]></PicUrl>
            <MediaId><![CDATA[<%= content.media_id%>]]></MediaId>
         <%} else if (msgType === 'voice') {%>
            <MediaId><![CDATA[<%= content.media_id%>]]></MediaId>
            <Format><![CDATA[<%= content.format%>]]></Format>
         <%} else if (msgType === 'video') {%>   
             <MediaId><![CDATA[<%= content.media_id%>]]></MediaId>
            <ThumbMediaId><![CDATA[<%= content.thumb_media_id]%>]></ThumbMediaId>
        <%} else if (msgType === 'shortvideo') {%>  
            <MediaId><![CDATA[<%= content.media_id]%>]></MediaId>
            <ThumbMediaId><![CDATA[<%= content.thumb_media_id]%>]></ThumbMediaId> 
        <%} %>   
        <MsgId>1234567890123456</MsgId>
    </xml>
 */})

 var compiled = ejs.compile(tpl)

 exports = module.exports = {
     compiled: compiled
 }