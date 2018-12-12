<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.mlight.chat.service.config.ServiceConfig"%>
<%
	pageContext.setAttribute("basePath", request.getContextPath());
	String fillpath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ request.getContextPath() + "/";
	pageContext.setAttribute("fillpath", fillpath);
%>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>无标题文档</title>
<link href="${basePath }/mx/public/layui/css/layui.css" rel="stylesheet"
	title="" type="text/css" />
<link href="${basePath }/mx/public/css/selfLayout.css" rel="stylesheet"
	title="" type="text/css" />
<link href="${basePath }/mx/jjqy/css/jjqy.css" rel="stylesheet" title=""
	type="text/css" />
<!----css---->
<script src="${basePath }/mx/public/js/jquery-1.11.1.min.js"
	type="text/javascript"></script>
<script src="${basePath }/mx/public/layui/layui.js"
	type="text/javascript"></script>
<style type="text/css">
html, body {
	padding: 0px;
	margin: 0px;
}
</style>
</head>
<body>
	<script>
		layui.use('laydate', function() {
			var laydate = layui.laydate;
		});
	</script>
	<div class="xllx_add_cont">
		<div class="jjqy_search_box">
			<form class="layui-form" action="">
				<div class="layui-form-item">
					<div class="jjqy_time_input">
						<input class="layui-input jjqyName" placeholder="警戒区名称">
					</div>
					<div class="jjqy_input_label">警戒区名称：</div>
					<div class="jjqy_time_input">
						<!-- <input class="layui-input  inJjqy" placeholder="警戒范围(单位：米)"> -->
						<div class="layui-input-block" style='  margin-left: 0px; '>
							<select name="outJjqy" lay-verify="required">
								<option value=""></option>
								<option value="500">500米</option>
								<option value="800">800米</option>
								<option value="1000">1000米</option>
							</select>
						</div>
					</div>
					<div class="jjqy_input_label">外围警戒范围：</div>
					<div class="jjqy_time_input">
						<!-- 	<input class="layui-input outJjqy" placeholder="核心警戒范围(单位：米)"> -->
						<div class="layui-input-block" style='  margin-left: 0px; '>
							<select name="inJjqy" lay-verify="required">
								<option value=""></option>
								<option value="100">100米</option>
								<option value="200">200米</option>
								<option value="300">300米</option>
							</select>
						</div>
					</div>
					<div class="jjqy_input_label ">核心警戒范围：</div>

					<div class="jjqy_time_input">
						<input class="layui-input begin_date" placeholder="开始时间"
							onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})">
						<span class="timeImg"><img
							src="${basePath }/mx/lsgj/images/rltb.png" width="20" height="20"></span>
					</div>
					<div class="jjqy_input_label ">开始时间：</div>
					<!--     <div class="jjqy_time_jiantou"> <img src="${basePath }/mx/lsgj/images/lsxxjt1.png" width="18" height="4"></div>-->

					<div class="jjqy_time_input ">
						<input class="layui-input end_date"
							onclick="layui.laydate({elem: this, istime: true, format: 'YYYY-MM-DD hh:mm:ss'})"
							placeholder="结束时间"> <span class="timeImg"><img
							src="${basePath }/mx/lsgj/images/rltb.png" width="20" height="20"></span>
					</div>
					<div class="jjqy_input_label">结束时间：</div>
					<div class="jjqy_time_input gisDrawType">

						<input type="radio" name="sex" _drawType='POINT' value="警戒点"
							title="警戒点" checked> <input type="radio" name="sex"
							_drawType='POLYLINE' value="警戒线" title="警戒线"> <input
							type="radio" name="sex" _drawType='POLYGON' value="警戒面"
							title="警戒面">

					</div>
					<div class="jjqy_input_label">警戒区类型：</div>
							<div class="jjqy_time_input">
						<div class="xllx_pen_tool">
							<img src="${basePath }/mx/public/images/suotao.png" width="30"
								height="30">
						</div>
					</div>
					<div class="jjqy_input_label">绘制警戒区：</div>
					
					<div class="jjqy_time_input">
						<textarea placeholder="请输入内容" class="layui-textarea  jjqy_otherText"></textarea>
					</div>
					<div class="jjqy_input_label">备注信息：</div>
					
				</div>
			</form>
		</div>
	</div>

	<script>
		//Demo
		layui.use('form', function() {
			var form = layui.form();
			//监听提交
			form.on('submit(formDemo)', function(data) {
				layer.msg(JSON.stringify(data.field));
				return false;
			});
		var dom= new window.parent.MXZH.jjqyDOMManager();
		 dom.init();
		});
	</script>
</body>
</html>
