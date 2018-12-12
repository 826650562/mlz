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
    <link href="${basePath }/mx/dzwl/css/dzwl.css" rel="stylesheet" title="" type="text/css" />
    <!----巡逻路线css---->
    <script src="${basePath }/mx/public/js/jquery-1.11.1.min.js" type="text/javascript"></script>
    <script src="${basePath }/mx/public/layui/layui.js" type="text/javascript"></script>
    <style type="text/css">
    html,
    body {
        padding: 0px;
        margin: 0px;
    }
    </style>
</head>

<body>
    <form class="layui-form" action="">
        <div class="dzwl_new_cont">
            <ul>
                <li>
                    <div class="dzwlNewCont_txt"> 围栏名称：</div>
                    <div class="dzwlNewCont_input">
                        <input type="text" placeholder="请输入" class="layui-input">
                    </div>
                </li>
                <li>
                    <div class="dzwlNewCont_txt"> 绘制围栏：</div>
                    <div class="dzwlNewCont_input">
                        <div class="dzwl_pen_tool adddzwl"><img src="${basePath }/mx/xllx/images/suotao.png" width="30" height="30"></div>
                    </div>
                </li>
                <li>
                    <div class="dzwlNewCont_txt"> 围栏类型：</div>
                    <div class="dzwlNewCont_input" >
                        <input type="radio" name="sex" value="禁出" title="禁出" checked>
                        <input type="radio" name="sex" value="禁入" title="禁入" >
                    </div>
                </li>
            </ul>
        </div>
    </form>
    <script>
   	jQuery(document).ready(function() {
		layui.use(["form"], function() {
			layui.form();
		});
		var dzwl = new window.parent.MXZH.Dzwl();
		dzwl.init();
		dzwl.dealWithEventListner();
	})
    </script>
</body>

</html>
 