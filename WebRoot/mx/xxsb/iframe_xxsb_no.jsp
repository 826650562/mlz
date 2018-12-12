<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String url = request.getParameter("url");
	request.setAttribute("url", url);
%>
<!doctype html>
<html>
<head>
<link href="../public/layui/css/layui.css" rel="stylesheet" title=""
	type="text/css" />
<link href="../public/css/selfLayout.css" rel="stylesheet" title=""
	type="text/css" />
<link href="css/xxsb.css" rel="stylesheet" title="" type="text/css" />
<!----信息上报css---->
<script src="../public/js/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="../public/layui/layui.js" type="text/javascript"></script>
<style type="text/css">
html, body {
	padding: 0px;
	margin: 0px;
}
</style>
</head>

<body>

	<div class="xllx_add_cont">

		<form class="layui-form" action="">
			<div class="layui-form-item" style="margin-bottom:0px;">
				<div class="biaoqianbox" id="xxsb_test">
				
				</div>
			</div>

			<div class="layui-form-item layui-form-text">
				<div class="biaoqianArea">
					<textarea placeholder="备注信息" class="layui-textarea" ></textarea>
				</div>
			</div>
		</form>

	</div>
	<script type="text/javascript">
		layui.use([ 'form', 'element' ], function() {
			var element = layui.element(); //导航的hover效果、二级菜单等功能，需要依赖element模块
			var form = layui.form();
		});
	</script> 
</body>
</html>
