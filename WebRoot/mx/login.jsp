<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	pageContext.setAttribute("basePath", request.getContextPath());
%>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>跟控指挥调度系统</title>
<link rel="icon" href="mx/public/images/logo.ico" type="image/x-icon" />
<link href="${basePath }/mx/public/layui/css/layui.css" rel="stylesheet"
	title="" type="text/css" />
<link href="mx/public/css/selfLayout.css" rel="stylesheet" title=""
	type="text/css" />
<link href="mx/login/css/login.css" rel="stylesheet" title=""
	type="text/css" />

<script type="text/javascript"
	src="${basePath }/mx/public/js/jquery-1.11.1.min.js"></script>
<%-- <script src="${basePath }/mx/public/layui/layui.js"
	type="text/javascript"></script> --%>
<script type="text/javascript" src="${basePath }/mx/layer/layer.js"></script>
<script type="text/javascript">
	window.history.forward(-1);
</script>
<script type="text/javascript">
	function init() {
		var errorMsg = $("#errorMsg").val();
		if (errorMsg != "") {
			layer.msg('用户名密码不匹配！');
		}
	}
	function check() {
		var tmp = null;
		var username = $("#username").val();
		var password = $("#password").val();
		if (username == "" || password == "") {
			layer.msg('用户名密码不能为空！')
			return false;
		} else if (username != "admin") {
			layer.msg('请用管理员账号登录！')
			return false;
		} else if (password.length > 16) {
			layer.msg('用户名密码不能超过16位！')
			return false;
		}
		$.ajax({
			url : "${basePath}/login_now.action",
			type : "post",
			async : false,
			success : function(_tmp) {
				tmp = _tmp;
			}
		});
		var timestamp = Date.parse(new Date());
		var sjc = Math.abs(timestamp - tmp);
		if (sjc > 5000) {
			layer.msg('当前时间与服务器时间不统一，请先校验时间!')
			$("#uptime").show();
			return false;
		}
	}
</script>

</head>

<body onLoad="init();">
	<div class="loginbox">
		<div class="loginName">
			<img src="mx/login/images/loginLogo.png" width="400" height="65">
		</div>
		<div class="dengLuBox">
			<div class="dengLuBoxInner">
				<div class="dengluTitle">系统登录</div>
				<div style="display:none;">
					<input value="${ sessionScope.errorMsg}" id="errorMsg" />
				</div>
				<div class="dengluCont">
					<form class="layui-form" action="${basePath }/login_login.action"
						method="post" onsubmit="return check();">
						<div class="inputBox">
							<div class="inputBoxLeft">
								<img src="mx/login/images/yhm.png" width="16" height="16">
							</div>
							<div class="inputBoxRight">
								<input type="text" name="user.username" id="username"
									lay-verify="title" autocomplete="off" placeholder="用户名"
									class="layui-input">
							</div>
						</div>
						<div class="inputBox">
							<div class="inputBoxLeft">
								<img src="mx/login/images/pw.png" width="16" height="16">
							</div>
							<div class="inputBoxRight">
								<input type="password" name="user.password" id="password"
									lay-verify="title" autocomplete="off" placeholder="密码"
									class="layui-input">
							</div>
						</div>
						<div class="loginbtn">
							<button type="submit" class="layui-btn layui-btn-normal">登&nbsp;录</button>
							<div style="display:none" id="uptime">
								<a href="mx/time.htm" target="_blank" class="time">同步时间</a>
							</div>
						</div>
					</form>
				</div>
			</div>

			<div class="loginBottom">
				<%-- <div>
					<a href="/update/ie10_x64.exe">浏览器</a><span>|</span>
				</div> --%>
				<div>
					<a href="/update/chrome.exe">浏览器</a><span>|</span>
				</div>
				<%-- <div>
					<a href="/update/flash.exe">语音播放器</a><span>|</span>
				</div> --%>

				<%-- <div>
					<a href="/update/ocx.exe"> 增强工具包</a><span>|</span>
				</div> --%>
				<div>
					<a href="/update/app.png" target="_blank"> APP二维码</a>
				</div>
			</div>
			<style>
.loginBottom div {
	width: 25%;
	float: left;
	text-align: center;
}

.loginBottom span {
	float: right;
}

.loginBottom a {
	color: #fff;
}

.loginBottom a:hover {
	color: #ddd;
}

.loginBottom a:active {
	color: #fff;
}

.time {
	float: right;
	color: #417bdc;
	margin-top: 9px;
}
</style>

		</div>
	</div>


	<!--------登录界面文本框获取焦点和失去焦点-------->
	<script type="text/javascript">
		$(function() {
			$("input").focus(function() {
				$(this).parent().parent(".inputBox").css("border", "1px solid #417bdc");
			}).blur(function() {
				$(this).parent().parent(".inputBox").css("border", "1px solid #e6e6e6");
			});
		})
	</script>



</body>
</html>
