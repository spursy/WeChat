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
            <MediaId><![CDATA[<%= content.mediaid%>]]></MediaId>
         <%} else if (msgType === 'image') {%>
            <Image>
                <MediaId><![CDATA[<%= content.mediaid%>]]></MediaId>
            </Image>
         <%} else if (msgType === 'voice') {%>
            <MediaId><![CDATA[<%= content.mediaid%>]]></MediaId>
            <Format><![CDATA[<%= content.format%>]]></Format>
          <%} else if (msgType === 'video') {%>
              <Video>
                    <MediaId><![CDATA[<%= content.mediaid%>]]></MediaId>
                    <Title><![CDATA[<%=content.title%>]]></Title>
                    <Description><![CDATA[<%=content.description%>]]></Description>
             </Video>
          <%} else if (msgType === 'shortvideo') {%>  
            <MediaId><![CDATA[<%= content.mediaid%>]]></MediaId>
            <ThumbMediaId><![CDATA[<%= content.thumbmediaid%>]]></ThumbMediaId>     
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
        <%} else if (msgType === 'music') {%> 
             <Music>
                    <Title><![CDATA[<%= content.title%>]]></Title>
                    <Description><![CDATA[<%= content.description%>]]></Description>
                    <MusicUrl><![CDATA[<%= content.musicUrl%>]]></MusicUrl>
                    <ThumbMediaId><![CDATA[<%= content.thumbMediaid%>]]></ThumbMediaId>
            </Music>
        <%} %>   
    </xml>
 */})



 var compiled = ejs.compile(tpl)

 exports = module.exports = {
     compiled: compiled
 }