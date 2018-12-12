
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
pageContext.setAttribute("basePath", request.getContextPath()) ;
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'test.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	  <script src="${basePath }/common-js/indexJs/jquery-2.1.1.js"></script>

  </head>
  <body >

<iframe id="ifr" src="http://127.0.0.1:18080/jeeplus/a/counts/IndustrySafe"></iframe>

<div width="200" height="50"> <span style="font-size: 20;text-align: center;">语音播放器测试</span>	<br>

<a href="quicktime/QuickTime_Alternative_322.exe"> quicktime(点击下载)</a>，下载直接默认下一步安装，直到最后完成。
</div>
<br>
<div class='historyAudio'   > 测试一：
<embed class="palers" src="quicktime/11.amr" autostart="false"  width="150" height="25" controller="true" align="middle" bgcolor="black" target="myself" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/index.html"></embed>
</div>
<br>
<br>
<script language="JavaScript" type="text/javascript">
   
	function emb_play(playstr,pltime){	    
		var amrid = document.getElementById("amrid"+playstr);
	    amrid.Play(); 
	    document.getElementById("imga"+playstr).style.display="none";
	    document.getElementById("imgb"+playstr).style.display="";
	    setTimeout("emb_stop('"+playstr+"')",pltime*1000);
	}

	function emb_stop(stopstr){
		var amrid = document.getElementById("amrid"+stopstr);
	    amrid.Stop(); 
	    document.getElementById("imga"+stopstr).style.display="";
	    document.getElementById("imgb"+stopstr).style.display="none";
	}










</script>
<div class='historyAudio'   >
   测试二：<img id="imga_1" src="images/historyAudio.png" width="39" height="33" onclick="emb_play('_1','5');" /><img id="imgb_1" style="display:none" src="images/yuYin.gif" width="39" height="33" onclick="emb_stop('_1');" />
	<embed id="amrid_1" class="palers" src="quicktime/11.amr" autostart="false"  width="0" height="0" controller="true" align="middle" bgcolor="black" target="myself" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/index.html"></embed>
</div>





  </body>
</html>

