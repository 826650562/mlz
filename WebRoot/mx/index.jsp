<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	pageContext.setAttribute("basePath", request.getContextPath());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<script src="${basePath }/mx/public/js/jquery-1.11.1.min.js"></script>
<script src="${basePath }/mx/record/recoder.js"></script>
<script src="${basePath }/mx/record/main.js"></script>
<link rel="stylesheet" href="${basePath }/mx/record/voice.css">
</head>

<body>
<div>
    <div class="messages">

      
    </div>

  <audio controls autoplay></audio>  
<div class="contrs">
          <input type="button" value="开始录音" onclick="startRecording()"/>  
			<input type="button" value="停止录音" onclick="stopRecord()"/>   
         <input type="button" value="获取录音" onclick="obtainRecord()"/>   
        <input type="button" value="发送" onclick="send()"/>  
        <!-- <input type="button" value="播放录音" onclick="playRecord()"/>   -->
</div>
        <div class="error">
            
        </div>
</div>
</body>
</html>