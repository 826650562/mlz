
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
<link href="${basePath }/mx/public/layui/css/layui.css" rel="stylesheet" title="" type="text/css" />
<link href="${basePath }/mx/public/css/selfLayout.css" rel="stylesheet" title="" type="text/css" />
<script src="${basePath }/mx/public/js/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="${basePath }/mx/public/layui/layui.js" type="text/javascript"></script>
<script src="${basePath }/mx/public/js/mqttws31.js" type="text/javascript"></script>
<script src="${basePath }/mx/jsxx/js/bytebuffer.js" type="text/javascript"></script>
<script src="${basePath }/mx/jsxx/js/IMClient.js" type="text/javascript"></script>
<script src="${basePath }/mx/jsxx/js/IMCodec.js" type="text/javascript"></script>
<script src="${basePath }/mx/jsxx/js/IMClientPortal.js" type="text/javascript"></script>
<script src="${basePath }/mx/jsxx/js/protobuf.js" type="text/javascript"></script>
<script src="${basePath }/mx/jsxx/js/protobuf.min.js" type="text/javascript"></script>
<link href="css/yyhj.css" rel="stylesheet" title="" type="text/css" />
<link href="css/list-style.css" rel="stylesheet" title="" type="text/css" />
<script src="jquery-ui.min.js" type="text/javascript"></script>
<script src="example.js" type="text/javascript"></script>
<script src="common.js" type="text/javascript"></script>
<script src="shim.min.js" type="text/javascript"></script>
<script src="json2.js" type="text/javascript"></script>
<script src="yydj_list.js" type="text/javascript"></script>
<script src="yydj_func.js" type="text/javascript"></script>
<script src="yydj_clock.js" type="text/javascript"></script>
<script src="yydj_status.js" type="text/javascript"></script>
<script src="yydj.js" type="text/javascript"></script>
<script src="FC.js" type="text/javascript"></script>
<style type="text/css">
/* html, body {
	padding: 0px;
	margin: 0px;
} */
</style>
</head>

<body data-width="148" data-height="110" data-name="media_stream_audio" data-tools="pnacl glibc clang-newlib win" data-configs="Debug Release" data-path="{tc}/{config}">
	<div id = 'log' style='display: none'></div>
	
	<div id="new_content">
		<div class='yyhj'>
			<div class='yyhj_title'>
				<div id = "yydj_title_left" class='yyhj_title_left'></div>
				<div id = "yydj_title_mid" class='yyhj_title_mid'>
					<div id= "add_more" class='addMore' flag='true'><img src='images/xiala.png' width='14' height='13'></div>
				</div>
				<div id = "yydj_title_right" class='yyhj_title_right'></div>
			</div>
			<div class='yyhj_cont'>
				<div class='yyhj_sliddown'>
					<iframe id='iframei' src="about:blank"  frameborder="no" border="0" style="position:absolute; visibility:inherit; top:0px; left:0px;  height: 730px; width: 840px; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';/">
					</iframe>
					<div id='selectTitle' class='list-select'>
						<div class='list-body'>
							<div class='item-box left-box'></div>
							<div class='center-box'>
								<button class='add-one' title='添加选中项'>></button>
								<button class='add-all' title='添加全部'>>></button>
								<button class='remove-one' title='移除选中项'><</button>
								<button class='remove-all' title='移除全部'><<</button>
								<button id="confirm">确定</button>
							</div>
							<div class='item-box right-box'></div>
						</div>
					</div>
				</div>
				<div id="yydj_box" class='yyhjBox'>
					<ul id='test'></ul>
				</div>
				<div class='timebg' id='jsq'>00:00:00</div>
			</div>
			<div id="yydj_bottom" class='yyhj_bottom'>
				<ul>
					<li id="mute">
						<div id="mute" class='bottomanniu'>
							<div class='anniutb'>
							</div>
						</div>
						<div class='bottomline' style="z-index:100">
							<img src='images/yyfhline.png' width='2' height='50'>
						</div>
					</li>
					<li id='ptt'>
						<div class='bottomanniu'>
							<div id="anniutb" class='anniutb'>
								<img src='images/qiangmai.png' width='50' height='50'>
							</div>
							<div id="" class='anniutxt'>抢麦</div>  
						</div>
						<div class='bottomline'>
							<img src='images/yyfhline.png' width='2' height='50'>
						</div> 
						<audio id="caller_press">
							<source src="voice/caller-press.mp3" type="audio/mp3">
						</audio> 
						<audio id="caller_release">
							<source src="voice/caller-release.mp3" type="audio/mp3">
						</audio> 
						<audio id="caller_freed">
							<source src="voice/caller-freed.mp3" type="audio/mp3">
						</audio> 
						<audio id="listen_freed">
							<source src="voice/listen-freed.mp3" type="audio/mp3">
						</audio> 
						<audio id="busy">
							<source src="voice/call_error.mp3" type="audio/mp3">
						</audio> 
						<audio id="called_answer">
							<source src="voice/called-answer.mp3" type="audio/mp3">
						</audio>
					</li>
					<li>
						<div id="hangup" class='bottomanniu'>
							<div class='anniutb'>
							</div>
						</div>
						<div class='bottomline' style="display:none">
							<img src='images/yyfhline.png' width='2' height='50'>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div id = 'listener'></div>
	<script>
		var MXZH = window.parent.MXZH;
	
		layui.use('layer', function() {
			window.layer = layui.layer;
		});
		
		MXZH.log(window.parent.BoxCall);
		if (window.parent.BoxCall) {   //框选呼叫
			for (var i = 0; i < window.parent.BoxCallUids.length; i++) {
				var id = window.parent.BoxCallIds[i];
				var username = window.parent.BoxCallNames[i];
				var uid = window.parent.BoxCallUids[i];
				if (uid != window.parent.IM.userId) {
					$(".left-box").append("<span class='item' uid='" + uid + "' id='" + id + "' username='" + username + "' >" + username + "</span>");	
				}
			}
		} else {   //群组呼叫和点对点对讲
			var _members = window.parent.jsxx._members;
			if(_members){
				userimg = JSON.parse(_members);
				delete window.parent.jsxx._members;
			}else{
				userimg = {members:[]};
			}
			var uimg = userimg.members;
			for (var i = 0; i < uimg.length; i++) {
				var id = uimg[i].id;
				var avatar = uimg[i].avatar;
				var username = uimg[i].username;
				var uid = uimg[i].uid;
				if (uid != window.parent.IM.userId) {
					$(".left-box").append("<span class='item' uid='" + uid + "' id='" + id + "' avatar='" + avatar + "' username='" + username + "' >" + username + "</span>");	
				}
			}
		}
	
		//会话状态维护map
		var conferenceMap = "";
	
		var AddCount = 0;
		var bfcpClient = "";
		
		AddCountCreator = 0;
		
		TimerFlag = false;  //添加计时器标志，避免重复添加
		TimerStart = false;   //启动计时器标志
	
		//全局的会话id
		var RoomId = "";
	
		//全局的创建者id
		var CreatorId = "";
		
		//抢麦状态
		var BfcpStates = "";
		
		//抢麦占线标志位
		var busy = false;
	
		//全局的members
		var Members = "";
	
		//抢麦相关
		var host = "localhost";
		var port = 61614;
		var topicJsToCpp = "confJsToCpp";
		var topicCppToJs = "confCppToJs";
		
		window.userMap = new Map();
		window.myClock = new myClock();
		
		var server = window.parent.av_server;
		var port_video = window.parent.v_port;
		var port_audio = window.parent.a_port;
		var bfcp_server = window.parent.bfcp_server;
		var bfcp_port = window.parent.bfcp_port;
		var curRoomId = window.parent.RoomId;
		var moduleStatus = "";
	</script>
</body>

</html>
