<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
     String url = request.getParameter("url");
     request.setAttribute("url",url);
 %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>视频播放</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

  </head>
  
  <body style="padding:0px;margin:0px;">
     <div id="divVideo" ></div> 
     <script type="text/javascript"> 
		//mp4是ios、android普遍支持的格式 
		function playVideo(opt) { 
		if (typeof (opt) == "undefined") { 
		alert("请传入必要参数！"); 
		return; 
		} 
		if (typeof (opt.elemt) == "undefined") { 
		alert("请指定播放器要插入的对象！"); 
		return; 
		} 
		if (typeof (opt.src) == "undefined") { 
		alert("请指定要播放视频的路径！"); 
		return; 
		} 
		var _this = this; 
		_this.elemt = opt.elemt; //播放器要插入的对象 
		_this.src = opt.src; //视频的URL(必设) 
		_this.width = opt.width > 0 ? opt.width + "px" : "100%"; //宽度(默认100%) 
		_this.height = opt.height > 0 ? opt.height + "px" : "100%"; //高度(默认100%) 
		_this.autoplay = opt.autoplay == "true" ? "autoplay" : ""; //自动播放（true为自动播放） 
		_this.poster = opt.poster; //视频封面，播放时的封面图片 
		_this.preload = opt.preload == "true" ? "preload" : ""; //预加载(true时启动加载) 
		_this.loop = opt.loop == "true" ? "loop" : ""; //循环播放(true时循环播放) 
		var str = "<video id='playVideo' controls "; //根据设置的属性的值，拼写video控件 
		str += " width='" + _this.width + "' height='" + _this.height + "' " + _this.autoplay + " " + _this.preload + " " + _this.loop + " "; 
		if (typeof (_this.poster) != "undefined") { 
		str += " poster='" + _this.poster + "' >"; 
		} else { 
		str += " > "; 
		} 
		str += " <source src='" + _this.src + "' />"; 
		str += "</video>"; 
		this.elemt.innerHTML = str; //将str放到要插入的对象中 
		} 
		playVideo({ 
		//所有参数，elemt和src为必填其他看需求怎么要求 
		//elemt为播放控件要插入的容器，src为视频文件地址，preload为预加载，autoplay是否页面进入就自动播放 
		//poster为播放前的遮照图片，loop为是否循环播放，width和heigth默认100% 
		elemt: document.getElementById("divVideo"), 
		src: "${url}", 
		preload: "true", 
		autoplay: "true", 
		poster: "", 
		loop: "true", 
		width: "", 
		heigth:"" 
		}); 
   </script> 
  </body>
</html>
