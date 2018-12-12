<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	pageContext.setAttribute("basePath", request.getContextPath());
	String gisPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
	request.setAttribute("gisPath", gisPath);
%>
<!-- 
   这里是通用的css、js-页面引用处,假如某个专题需要引用的文件,请放置到该专题文件夹下，避免冲突 2017-03-21 
 -->
<link href="${basePath }/css/indexCss/index.css" rel="stylesheet"
	type="text/css" />
<link href="${basePath }/mx/public/layui/css/layui.css" rel="stylesheet"
	title="" type="text/css" />
<link href="${basePath }/mx/public/css/wxl.css" rel="stylesheet"
	title="" type="text/css" />
<link href="${basePath }/mx/public/css/jquery.range.css"
	rel="stylesheet" title="" type="text/css" />
<script type="text/javascript"
	src="${basePath }/mx/public/js/jquery.scrollbar.min.js"></script>
<script type="text/javascript"
	src="${basePath }/mx/public/js/dateformate.js"></script>
<script type="text/javascript"
	src="${basePath }/mx/public/layui/layui.js"></script>


<!-- 引用echarts -->
<script type="text/javascript" src="${basePath }/mx/public/js/main.js" /></script>
<script type="text/javascript"
	src="${basePath }/mx/public/js/macarons.js" /></script>
<%-- 
<script type="text/javascript"
	src="${basePath }/mlight-js/ltck/jsrender.min.js"></script> --%>

<!-- 	引入d3 -->
<script type="text/javascript"
	src="${basePath }/mx/public/js/d3-v3.5.js"></script>

<script type="text/javascript"
	src="${basePath }/mx/public/js/face/face.js"></script>
<!-- 引入表情 -->
<script type="text/javascript"
	src="${basePath }/mx/public/js/face/jquery.qqFace.js"></script>
<!-- 添加表情-->
<script type="text/javascript"
	src="${basePath }/mx/public/js/face/jquery-browser.js"></script>
<!-- 添加表情-->
<script type="text/javascript"
	src="${basePath }/mx/map/wang/map-module.js"></script>
<script type="text/javascript"
	src="${basePath }/mx/public/js/common_effect.js"></script>
<script type="text/javascript"
	src="${basePath }/mx/public/js/switchPics.js"></script>

<script type="text/javascript"
	src="${basePath }/mx/public/jquery.range.js"></script>
<!-- 页面效果js -->
