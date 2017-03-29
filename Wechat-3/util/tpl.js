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
         <%} else if (msgType === 'image') {%>
            <Image>
                <MediaId><![CDATA[<%= content.mediaid%>]]></MediaId>
            </Image>
         <%} else if (msgType === 'voice') {%>
            <MediaId><![CDATA[<%= content.media_id%>]]></MediaId>
            <Format><![CDATA[<%= content.format%>]]></Format>
          <%} else if (msgType === 'video') {%>
              <MediaId><![CDATA[<%= content.media_id%>]]></MediaId>
            <ThumbMediaId><![CDATA[<%= content.thumb_media_id%>]]></ThumbMediaId>
          <%} else if (msgType === 'shortvideo') {%>  
            <MediaId><![CDATA[<%= content.media_id%>]]></MediaId>
            <ThumbMediaId><![CDATA[<%= content.thumb_media_id%>]]></ThumbMediaId>     
        <%} else if (msgType === 'news') {%> 
            <ArticleCount><%= content.length%></ArticleCount>
            <Articles>
                <% content.forEach(function(item) {%>
                        <item>
                                <Title><![CDATA[<%= item.title%>]]></Title> 
                                <Description><![CDATA[<%= item.description%>]]></Description>
                                <PicUrl><![CDATA[<%= item.picUrl%>]]></PicUrl>
                                <Url><![CDATA[<%= item.url%>]]></Url>
                        </item>
                <% })%>
            </Articles>
        <%} %>   
        <MsgId>1234567890123456</MsgId>
    </xml>
 */})

 var compiled = ejs.compile(tpl)

 exports = module.exports = {
     compiled: compiled
 }