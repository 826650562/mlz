<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.mlight.chat.service.config.ServiceConfig" %>
<%
    pageContext.setAttribute("basePath", request.getContextPath());
    String fillpath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+ request.getContextPath() +"/";
    pageContext.setAttribute("fillpath", fillpath);
 %>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>无标题文档</title>
<link href="${basePath }/mx/public/layui/css/layui.css" rel="stylesheet" title="" type="text/css" />
<link href="${basePath }/mx/public/css/selfLayout.css" rel="stylesheet" title="" type="text/css" />
<link href="${basePath }/mx/xllx/css/xllx.css" rel="stylesheet" title="" type="text/css" /><!----巡逻路线css---->
<style type="text/css">
html,body{padding:0px;margin:0px;}
</style>
</head>

<body>

<div class="xllx_add_cont">
<ul>
  <li>
      <div class="xllxAddCont_txt"> 路线名称：</div>
      <div class="xllxAddCont_input"><input type="text" class="layui-input"></div>
  </li>
  <li>
      <div class="xllxAddCont_txt"> 绘制路线：</div>
      <div class="xllxAddCont_input">
        <div class="xllx_pen_tool addxllx"><img src="${basePath }/mx/xllx/images/suotao.png" width="30" height="30"></div>
      </div>
  </li>
  <li>
      <div class="xllxAddCont_txt"> 备注：</div>
      <div class="xllxAddCont_input"><textarea placeholder="请输入内容" class="layui-textarea" style="resize:none;"></textarea></div>
  </li>

</ul>
</div>
<script type="text/javascript">  
window.onload = function(){
 	var xllx = new window.parent.MXZH.Xllx();
	xllx.init();
	xllx.dealWithEventListner(); 
}
</script>
</body>
</html>
